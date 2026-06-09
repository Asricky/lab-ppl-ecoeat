<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, $orderId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'nullable|string',
        ]);

        $order = Order::where('buyer_id', $request->user()->id)
            ->where('order_status', 'completed')
            ->findOrFail($orderId);

        // Check if already reviewed
        $existingReview = Review::where('order_id', $order->id)
            ->where('reviewer_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'Order already reviewed'], 400);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'reviewer_id' => $request->user()->id,
            'seller_id' => $order->seller_id,
            'rating' => $request->rating,
            'review_text' => $request->review_text,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
            'review' => $review
        ], 201);
    }
}
