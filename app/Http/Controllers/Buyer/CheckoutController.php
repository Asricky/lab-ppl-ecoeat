<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Exception;

class CheckoutController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function storeDirect(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'order_type' => 'required|string',
            'delivery_address_id' => 'nullable|exists:user_addresses,id',
            'notes' => 'nullable|string',
        ]);

        try {
            $product = Product::with('sellerProfile')->findOrFail($request->product_id);
            $order = $this->orderService->checkoutDirect($request->user(), $product, $request->quantity, $request->all());

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Checkout failed: ' . $e->getMessage()
            ], 400);
        }
    }

    public function storeCart(Request $request)
    {
        $request->validate([
            'cart_item_ids' => 'required|array|min:1',
            'cart_item_ids.*' => 'required|exists:cart_items,id',
            'order_type' => 'required|string',
            'delivery_address_id' => 'nullable|exists:user_addresses,id',
            'notes' => 'nullable|string',
        ]);

        try {
            $orders = $this->orderService->checkoutCart($request->user(), $request->cart_item_ids, $request->all());

            return response()->json([
                'message' => 'Orders created successfully',
                'orders' => $orders
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Checkout failed: ' . $e->getMessage()
            ], 400);
        }
    }
}
