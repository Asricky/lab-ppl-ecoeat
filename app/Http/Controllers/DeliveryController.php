<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeliveryController extends Controller
{
    public function assignCourier(Order $order): JsonResponse
    {
        $assignedOrder = DB::transaction(function () use ($order): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->status !== Order::STATUS_PENDING) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Only pending orders can be assigned',
                ], 422));
            }

            $escrowTransaction = Transaction::query()
                ->lockForUpdate()
                ->where('order_id', $lockedOrder->id)
                ->where('type', Transaction::TYPE_PAYMENT)
                ->where('status', Transaction::STATUS_PENDING)
                ->first();

            if (! $escrowTransaction) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Order must be checked out before courier assignment',
                ], 422));
            }

            $courier = User::query()
                ->where('role', 'courier')
                ->orderBy('id')
                ->first();

            if (! $courier) {
                throw new HttpResponseException(response()->json([
                    'message' => 'No courier available',
                ], 404));
            }

            $lockedOrder->update([
                'courier_id' => $courier->id,
                'status' => Order::STATUS_ASSIGNED,
            ]);

            return $lockedOrder->refresh();
        });

        return response()->json([
            'message' => 'Courier assigned successfully',
            'data' => $assignedOrder,
        ]);
    }

    public function startDelivery(Request $request, Order $order): JsonResponse
    {
        if ($request->user()->role !== 'courier') {
            return response()->json([
                'message' => 'Only courier can start delivery',
            ], 403);
        }

        $startedOrder = DB::transaction(function () use ($order, $request): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->courier_id !== $request->user()->id) {
                throw new HttpResponseException(response()->json([
                    'message' => 'This order is not assigned to you',
                ], 403));
            }

            if ($lockedOrder->status !== Order::STATUS_ASSIGNED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Order is not ready for delivery',
                ], 422));
            }

            $lockedOrder->update([
                'status' => Order::STATUS_DELIVERING,
            ]);

            return $lockedOrder->refresh();
        });

        return response()->json([
            'message' => 'Delivery started successfully',
            'data' => $startedOrder,
        ]);
    }

    public function completeDelivery(Request $request, Order $order): JsonResponse
    {
        if ($request->user()->role !== 'courier') {
            return response()->json([
                'message' => 'Only courier can complete delivery',
            ], 403);
        }

        $request->validate([
            'proof_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $completedOrder = DB::transaction(function () use ($order, $request): Order {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if ($lockedOrder->courier_id !== $request->user()->id) {
                throw new HttpResponseException(response()->json([
                    'message' => 'This order is not assigned to you',
                ], 403));
            }

            if ($lockedOrder->status !== Order::STATUS_DELIVERING) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Order is not currently being delivered',
                ], 422));
            }

            $escrowTransaction = Transaction::query()
                ->lockForUpdate()
                ->where('order_id', $lockedOrder->id)
                ->where('type', Transaction::TYPE_PAYMENT)
                ->where('status', Transaction::STATUS_PENDING)
                ->first();

            if (! $escrowTransaction) {
                throw new HttpResponseException(response()->json([
                    'message' => 'No held escrow found for this order',
                ], 422));
            }

            $lockedOrder->update([
                'status' => Order::STATUS_COMPLETED,
            ]);

            Wallet::query()->firstOrCreate(
                ['user_id' => $lockedOrder->seller_id],
                ['balance' => 0]
            );

            $sellerWallet = Wallet::query()
                ->lockForUpdate()
                ->where('user_id', $lockedOrder->seller_id)
                ->firstOrFail();

            $sellerWallet->increment('balance', $escrowTransaction->amount);

            $escrowTransaction->update([
                'status' => Transaction::STATUS_COMPLETED,
            ]);

            Transaction::create([
                'order_id' => $lockedOrder->id,
                'buyer_id' => $lockedOrder->buyer_id,
                'seller_id' => $lockedOrder->seller_id,
                'amount' => $escrowTransaction->amount,
                'type' => Transaction::TYPE_ESCROW_RELEASE,
                'status' => Transaction::STATUS_COMPLETED,
            ]);

            return $lockedOrder->refresh();
        });

        return response()->json([
            'message' => 'Delivery completed successfully',
            'data' => $completedOrder,
        ]);
    }

    public function cancel(Request $request, Order $order): JsonResponse
    {
        if ($request->user()->role !== 'buyer') {
            return response()->json([
                'message' => 'Only buyer can cancel order',
            ], 403);
        }

        if ($order->buyer_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only cancel your own order',
            ], 403);
        }

        $cancelledOrder = DB::transaction(function () use ($order): Order {
            $lockedOrder = Order::query()
                ->with('items')
                ->lockForUpdate()
                ->findOrFail($order->id);

            if ($lockedOrder->status === Order::STATUS_COMPLETED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Completed orders cannot be cancelled',
                ], 422));
            }

            if ($lockedOrder->status === Order::STATUS_CANCELLED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Order has already been cancelled',
                ], 422));
            }

            $escrowTransaction = Transaction::query()
                ->lockForUpdate()
                ->where('order_id', $lockedOrder->id)
                ->where('type', Transaction::TYPE_PAYMENT)
                ->where('status', Transaction::STATUS_PENDING)
                ->first();

            if ($escrowTransaction) {
                Wallet::query()->firstOrCreate(
                    ['user_id' => $lockedOrder->buyer_id],
                    ['balance' => 0]
                );

                $buyerWallet = Wallet::query()
                    ->lockForUpdate()
                    ->where('user_id', $lockedOrder->buyer_id)
                    ->firstOrFail();

                $buyerWallet->increment('balance', $escrowTransaction->amount);

                Transaction::create([
                    'order_id' => $lockedOrder->id,
                    'buyer_id' => $lockedOrder->buyer_id,
                    'seller_id' => $lockedOrder->seller_id,
                    'amount' => $escrowTransaction->amount,
                    'type' => Transaction::TYPE_REFUND,
                    'status' => Transaction::STATUS_COMPLETED,
                ]);

                $escrowTransaction->update([
                    'status' => Transaction::STATUS_FAILED,
                ]);
            }

            foreach ($lockedOrder->items as $item) {
                Product::query()
                    ->lockForUpdate()
                    ->find($item->product_id)
                    ?->increment('stock', $item->quantity);
            }

            $lockedOrder->update([
                'status' => Order::STATUS_CANCELLED,
            ]);

            return $lockedOrder->refresh();
        });

        return response()->json([
            'message' => 'Order cancelled successfully',
            'data' => $cancelledOrder,
        ]);
    }
}
