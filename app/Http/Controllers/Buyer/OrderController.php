<?php

namespace App\Http\Controllers\Buyer;

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

    public function index(Request $request)
    {
        $orders = Order::where('buyer_id', $request->user()->id)
            ->with(['seller', 'delivery', 'orderItems.product'])
            ->orderBy('ordered_at', 'desc')
            ->paginate(15);

        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['seller', 'delivery', 'orderItems.product'])
            ->where('buyer_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }

    public function cancel(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $order = Order::where('buyer_id', $request->user()->id)->findOrFail($id);

        try {
            $cancelledOrder = $this->orderService->cancelOrder($request->user(), $order, $request->reason);

            return response()->json([
                'message' => 'Order cancelled successfully',
                'order' => $cancelledOrder
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Cancellation failed: ' . $e->getMessage()
            ], 400);
        }
    }

    public function pickup(Request $request, $id)
    {
        $order = Order::where('buyer_id', $request->user()->id)->findOrFail($id);

        if ($order->delivery_address_id !== null) {
            return response()->json(['message' => 'This order is not for pickup'], 400);
        }

        if ($order->order_status !== 'ready_for_delivery') {
            return response()->json(['message' => 'Order is not ready for pickup yet'], 400);
        }

        $order->update([
            'order_status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Order picked up successfully',
            'order' => $order
        ]);
    }
}
