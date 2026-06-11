<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'buyer') {
            return response()->json([
                'message' => 'Only buyer can create order',
            ], 403);
        }

        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $order = DB::transaction(function () use ($request, $validated): Order {
            $product = Product::query()
                ->lockForUpdate()
                ->find($validated['product_id']);

            if (! $product || $product->status !== 'active') {
                throw new HttpResponseException(response()->json([
                    'message' => 'Product is not available',
                ], 422));
            }

            if ($product->stock < $validated['quantity']) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Insufficient product stock',
                ], 422));
            }

            $order = Order::create([
                'buyer_id' => $request->user()->id,
                'seller_id' => $product->seller_id,
                'total_price' => $product->price * $validated['quantity'],
                'status' => Order::STATUS_PENDING,
                'delivery_type' => 'courier',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $validated['quantity'],
                'price' => $product->price,
            ]);

            $product->decrement('stock', $validated['quantity']);

            return $order->refresh();
        });

        return response()->json([
            'message' => 'Order created successfully',
            'data' => $order,
        ], 201);
    }

    public function checkout(Request $request, Order $order): JsonResponse
    {
        if ($request->user()->role !== 'buyer') {
            return response()->json([
                'message' => 'Only buyer can checkout order',
            ], 403);
        }

        $checkedOutOrder = DB::transaction(function () use ($request, $order): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->buyer_id !== $request->user()->id) {
                throw new HttpResponseException(response()->json([
                    'message' => 'You can only checkout your own order',
                ], 403));
            }

            if ($lockedOrder->status === Order::STATUS_CANCELLED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Cancelled orders cannot be checked out',
                ], 422));
            }

            if ($lockedOrder->status === Order::STATUS_COMPLETED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Completed orders cannot be checked out',
                ], 422));
            }

            if ($lockedOrder->status !== Order::STATUS_PENDING) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Only pending orders can be checked out',
                ], 422));
            }

            $existingPayment = Transaction::query()
                ->lockForUpdate()
                ->where('order_id', $lockedOrder->id)
                ->where('type', Transaction::TYPE_PAYMENT)
                ->whereIn('status', [
                    Transaction::STATUS_PENDING,
                    Transaction::STATUS_COMPLETED,
                ])
                ->first();

            if ($existingPayment) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Order has already been checked out',
                ], 422));
            }

            Wallet::query()->firstOrCreate(
                ['user_id' => $request->user()->id],
                ['balance' => 0]
            );

            $wallet = Wallet::query()
                ->lockForUpdate()
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            if ((float) $wallet->balance < (float) $lockedOrder->total_price) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Insufficient wallet balance',
                ], 422));
            }

            $wallet->decrement('balance', $lockedOrder->total_price);

            Transaction::create([
                'order_id' => $lockedOrder->id,
                'buyer_id' => $lockedOrder->buyer_id,
                'seller_id' => $lockedOrder->seller_id,
                'amount' => $lockedOrder->total_price,
                'type' => Transaction::TYPE_PAYMENT,
                'status' => Transaction::STATUS_PENDING,
            ]);

            return $lockedOrder->refresh();
        });

        return response()->json([
            'message' => 'Checkout successful',
            'data' => $checkedOutOrder,
        ]);
    }
}
