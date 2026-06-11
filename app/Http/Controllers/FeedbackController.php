<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Order;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    public function store(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($request, $order, $validated): void {
            $lockedOrder = Order::query()
                ->with('feedback')
                ->lockForUpdate()
                ->findOrFail($order->id);

            if ($lockedOrder->buyer_id !== $request->user()->id) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Only the buyer of this order can submit feedback',
                ], 403));
            }

            if ($lockedOrder->status !== Order::STATUS_COMPLETED) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Feedback can only be submitted for completed orders',
                ], 422));
            }

            if ($lockedOrder->feedback()->exists()) {
                throw new HttpResponseException(response()->json([
                    'message' => 'Feedback has already been submitted for this order',
                ], 422));
            }

            Feedback::create([
                'order_id' => $lockedOrder->id,
                'buyer_id' => $request->user()->id,
                'seller_id' => $lockedOrder->seller_id,
                'rating' => $validated['rating'],
                'review' => $validated['comment'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Feedback submitted',
        ]);
    }
}
