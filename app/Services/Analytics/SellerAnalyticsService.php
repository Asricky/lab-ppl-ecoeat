<?php

namespace App\Services\Analytics;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class SellerAnalyticsService extends BaseAnalyticsService
{
    /**
     * Get dashboard metrics for a seller.
     */
    public function getDashboard(string $sellerId, ?string $range): array
    {
        $dates = $this->parseRange($range);

        // TODO: Cache::remember("seller_dashboard_{$sellerId}_{$range}", 3600, function() ...)
        $stats = Order::where('seller_id', $sellerId)
            ->whereBetween('ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                COUNT(id) as total_orders,
                COALESCE(SUM(CASE WHEN order_status = 'completed' AND order_type = 'purchase' THEN total_amount ELSE 0 END), 0) as total_revenue,
                COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed_orders,
                COUNT(CASE WHEN order_status = 'cancelled' THEN 1 END) as cancelled_orders,
                COUNT(CASE WHEN order_type = 'donation' THEN 1 END) as donation_count,
                COALESCE(SUM(CASE WHEN order_type = 'donation' THEN total_portions ELSE 0 END), 0) as donation_portions
            ")
            ->first();

        $mealsSaved = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.seller_id', $sellerId)
            ->where('orders.order_status', 'completed')
            ->where('orders.order_type', 'purchase')
            ->whereBetween('orders.ordered_at', [$dates['start_date'], $dates['end_date']])
            ->sum('order_items.quantity');

        return [
            'total_revenue' => (float) ($stats->total_revenue ?? 0.0),
            'total_orders' => (int) ($stats->total_orders ?? 0),
            'completed_orders' => (int) ($stats->completed_orders ?? 0),
            'cancelled_orders' => (int) ($stats->cancelled_orders ?? 0),
            'meals_saved' => (int) $mealsSaved,
            'donation_count' => (int) ($stats->donation_count ?? 0),
            'donation_portions' => (int) ($stats->donation_portions ?? 0),
        ];
    }

    /**
     * Get paginated top products for a seller.
     */
    public function getTopProducts(string $sellerId, ?string $range, int $perPage = 15): LengthAwarePaginator
    {
        $dates = $this->parseRange($range);

        $query = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.seller_id', $sellerId)
            ->where('orders.order_status', 'completed')
            ->where('orders.order_type', 'purchase')
            ->whereBetween('orders.ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                order_items.product_id,
                products.title as product_name,
                COUNT(DISTINCT orders.id) as total_orders,
                SUM(order_items.quantity) as total_quantity,
                SUM(order_items.total_price) as total_revenue
            ")
            ->groupBy('order_items.product_id', 'products.title')
            ->orderByDesc('total_quantity');

        // Cast elements correctly after pagination
        $paginated = $query->paginate($perPage);

        return $paginated;
    }

    /**
     * Get daily revenue chart data for a seller.
     */
    public function getRevenueChart(string $sellerId, ?string $range): array
    {
        $dates = $this->parseRange($range);

        // TODO: Cache::remember("seller_revenue_chart_{$sellerId}_{$range}", 3600, function() ...)
        $revenueData = Order::where('seller_id', $sellerId)
            ->where('order_status', 'completed')
            ->where('order_type', 'purchase')
            ->whereBetween('ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                DATE(ordered_at) as date,
                SUM(total_amount) as revenue
            ")
            ->groupBy(DB::raw("DATE(ordered_at)"))
            ->orderBy('date', 'asc')
            ->get()
            ->pluck('revenue', 'date')
            ->toArray();

        // Fill date gaps for a continuous chart
        $chartData = [];
        $current = $dates['start_date']->copy();
        $end = $dates['end_date'];

        while ($current->lte($end)) {
            $dateStr = $current->toDateString();
            $chartData[] = [
                'date' => $dateStr,
                'revenue' => isset($revenueData[$dateStr]) ? (float) $revenueData[$dateStr] : 0.0,
            ];
            $current->addDay();
        }

        return $chartData;
    }
}
