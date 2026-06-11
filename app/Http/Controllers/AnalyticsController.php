<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function index(): JsonResponse
    {
        $totalUsers = User::count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalCompletedOrders = Order::where('status', Order::STATUS_COMPLETED)->count();

        $totalMealsSaved = OrderItem::whereHas('order', function ($query): void {
            $query->where('status', Order::STATUS_COMPLETED);
        })->sum('quantity');

        $totalDonations = Product::where('type', 'donation')->count();

        return response()->json([
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'completed_orders' => $totalCompletedOrders,
            'meals_saved' => $totalMealsSaved,
            'donations' => $totalDonations,
        ]);
    }
}
