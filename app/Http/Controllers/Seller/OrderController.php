<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Exception;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:processing,ready_for_delivery',
        ]);

        try {
            $order = Order::findOrFail($id);
            $updatedOrder = $this->orderService->updateOrderStatus($request->user(), $order, $request->status);

            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => $updatedOrder
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 400);
        }
    }

    public function refund(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        try {
            $order = Order::findOrFail($id);
            $refundedOrder = $this->orderService->refundOrder($request->user(), $order, $request->reason);

            return response()->json([
                'message' => 'Order refunded successfully',
                'order' => $refundedOrder
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to refund order: ' . $e->getMessage()
            ], 400);
        }
    }
}
