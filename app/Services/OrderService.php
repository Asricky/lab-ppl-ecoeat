<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class OrderService
{
    /**
     * Direct checkout for a single product
     */
    public function checkoutDirect(User $buyer, Product $product, int $quantity, array $data)
    {
        return DB::transaction(function () use ($buyer, $product, $quantity, $data) {
            $subtotal = $product->price * $quantity;
            $deliveryFee = $data['delivery_fee'] ?? 0;
            $platformFee = 1000; // Flat platform fee
            $totalAmount = $subtotal + $deliveryFee + $platformFee;

            $wallet = $buyer->wallet;
            if (!$wallet || $wallet->balance < $totalAmount) {
                throw new Exception('Insufficient wallet balance');
            }

            if ($product->stock_quantity < $quantity) {
                throw new Exception('Product out of stock');
            }

            // Deduct product stock
            $product->stock_quantity -= $quantity;
            if ($product->portion_quantity > 0) {
                $portions = max(1, floor($product->portion_quantity / $product->stock_quantity)) * $quantity;
                $product->portion_quantity -= $portions;
            }
            $product->save();

            // Create Order
            $order = Order::create([
                'order_code' => 'ORD-' . strtoupper(Str::random(10)),
                'buyer_id' => $buyer->id,
                'seller_id' => $product->sellerProfile->user_id ?? $product->seller_profile_id, // Ensure seller_id is mapped correctly, might need to get user_id from sellerProfile
                'order_type' => $data['order_type'] ?? 'delivery',
                'order_status' => 'processing',
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'platform_fee' => $platformFee,
                'total_amount' => $totalAmount,
                'total_portions' => $quantity,
                'delivery_address_id' => $data['delivery_address_id'] ?? null,
                'notes' => $data['notes'] ?? null,
                'ordered_at' => now(),
            ]);

            // Create Order Item
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price,
                'total_price' => $subtotal,
                'portion_quantity' => $quantity,
            ]);

            // Deduct Wallet
            $wallet->balance -= $totalAmount;
            $wallet->save();

            WalletTransaction::create([
                'wallet_id' => $wallet->id,
                'order_id' => $order->id,
                'transaction_type' => 'purchase',
                'transaction_status' => 'completed',
                'amount' => $totalAmount,
                'description' => 'Payment for order ' . $order->order_code,
            ]);

            return $order;
        });
    }

    /**
     * Checkout from Cart
     */
    public function checkoutCart(User $buyer, array $cartItemIds, array $data)
    {
        return DB::transaction(function () use ($buyer, $cartItemIds, $data) {
            $cartItems = CartItem::whereIn('id', $cartItemIds)
                ->where('buyer_id', $buyer->id)
                ->with('product.sellerProfile')
                ->get();

            if ($cartItems->isEmpty()) {
                throw new Exception('Cart items not found');
            }

            // Group by seller
            $groupedItems = $cartItems->groupBy(function ($item) {
                return $item->product->sellerProfile->user_id ?? $item->product->seller_profile_id;
            });

            $orders = [];
            $totalGrand = 0;

            foreach ($groupedItems as $sellerId => $items) {
                $subtotal = 0;
                $totalPortions = 0;

                foreach ($items as $item) {
                    if ($item->product->stock_quantity < $item->quantity) {
                        throw new Exception("Product {$item->product->title} is out of stock");
                    }
                    $subtotal += $item->product->price * $item->quantity;
                    $totalPortions += $item->quantity;
                }

                $deliveryFee = $data['delivery_fee'] ?? 0; // Ideally calculated per seller
                $platformFee = 1000;
                $totalAmount = $subtotal + $deliveryFee + $platformFee;
                $totalGrand += $totalAmount;

                // Create Order
                $order = Order::create([
                    'order_code' => 'ORD-' . strtoupper(Str::random(10)),
                    'buyer_id' => $buyer->id,
                    'seller_id' => $sellerId,
                    'order_type' => $data['order_type'] ?? 'delivery',
                    'order_status' => 'processing',
                    'subtotal' => $subtotal,
                    'delivery_fee' => $deliveryFee,
                    'platform_fee' => $platformFee,
                    'total_amount' => $totalAmount,
                    'total_portions' => $totalPortions,
                    'delivery_address_id' => $data['delivery_address_id'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'ordered_at' => now(),
                ]);

                foreach ($items as $item) {
                    // Deduct stock
                    $item->product->stock_quantity -= $item->quantity;
                    $item->product->save();

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->product->price,
                        'total_price' => $item->product->price * $item->quantity,
                        'portion_quantity' => $item->quantity,
                    ]);
                }

                // Delete cart items
                CartItem::whereIn('id', $items->pluck('id'))->delete();

                $orders[] = $order;
            }

            $wallet = $buyer->wallet;
            if (!$wallet || $wallet->balance < $totalGrand) {
                throw new Exception('Insufficient wallet balance');
            }

            // Deduct Wallet
            $wallet->balance -= $totalGrand;
            $wallet->save();

            foreach ($orders as $order) {
                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'transaction_type' => 'purchase',
                    'transaction_status' => 'completed',
                    'amount' => $order->total_amount,
                    'description' => 'Payment for order ' . $order->order_code,
                ]);
            }

            return $orders;
        });
    }

    public function cancelOrder(User $user, Order $order, string $reason)
    {
        return DB::transaction(function () use ($user, $order, $reason) {
            if ($order->order_status !== 'processing' && $order->order_status !== 'waiting_payment') {
                throw new Exception('Order cannot be cancelled at this stage');
            }

            $order->update([
                'order_status' => 'cancelled',
                'cancellation_reason' => $reason,
                'cancelled_by' => $user->id,
                'cancelled_at' => now(),
            ]);

            // Restore product stock
            $items = OrderItem::where('order_id', $order->id)->get();
            foreach ($items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->stock_quantity += $item->quantity;
                    $product->save();
                }
            }

            // Refund to wallet
            $wallet = $order->buyer->wallet;
            if ($wallet) {
                $wallet->balance += $order->total_amount;
                $wallet->save();

                WalletTransaction::create([
                    'wallet_id' => $wallet->id,
                    'order_id' => $order->id,
                    'transaction_type' => 'refund',
                    'transaction_status' => 'completed',
                    'amount' => $order->total_amount,
                    'description' => 'Refund for cancelled order ' . $order->order_code,
                ]);
            }

            return $order;
        });
    }
}
