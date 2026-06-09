<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Exception;

class ReviewController extends Controller
{
    public function reply(Request $request, $id)
    {
        $request->validate([
            'seller_reply' => 'required|string|max:1000',
        ]);

        try {
            $review = Review::findOrFail($id);

            if ($review->seller_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized to reply to this review'], 403);
            }

            if ($review->seller_reply !== null) {
                return response()->json(['message' => 'Seller has already replied to this review'], 400);
            }

            $review->update([
                'seller_reply' => $request->seller_reply,
            ]);

            return response()->json([
                'message' => 'Reply submitted successfully',
                'review' => $review
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to submit reply: ' . $e->getMessage()
            ], 400);
        }
    }
}
