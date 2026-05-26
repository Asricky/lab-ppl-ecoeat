<?php

namespace App\Services\Analytics;

use App\Models\Order;
use App\Models\LksProfile;
use Illuminate\Pagination\LengthAwarePaginator;

class LksAnalyticsService extends BaseAnalyticsService
{
    /**
     * Get dashboard metrics for an LKS.
     */
    public function getDashboard(string $lksUserId, ?string $range): array
    {
        $dates = $this->parseRange($range);

        $lksProfileId = LksProfile::where('user_id', $lksUserId)->value('id');

        if (!$lksProfileId) {
            return [
                'total_donations_received' => 0,
                'total_meals_received' => 0,
                'completed_donations' => 0,
                'rejected_donations' => 0,
            ];
        }

        // TODO: Cache::remember("lks_dashboard_{$lksProfileId}_{$range}", 3600, function() ...)
        $stats = Order::leftJoin('deliveries', 'deliveries.order_id', '=', 'orders.id')
            ->where('orders.lks_id', $lksProfileId)
            ->where('orders.order_type', 'donation')
            ->whereBetween('orders.ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                COUNT(orders.id) as total_donations_received,
                COUNT(CASE WHEN orders.order_status = 'completed' THEN 1 END) as completed_donations,
                COUNT(CASE WHEN deliveries.delivery_status = 'rejected_by_lks' THEN 1 END) as rejected_donations,
                COALESCE(SUM(CASE WHEN orders.order_status = 'completed' THEN orders.total_portions ELSE 0 END), 0) as total_meals_received
            ")
            ->first();

        return [
            'total_donations_received' => (int) ($stats->total_donations_received ?? 0),
            'total_meals_received' => (int) ($stats->total_meals_received ?? 0),
            'completed_donations' => (int) ($stats->completed_donations ?? 0),
            'rejected_donations' => (int) ($stats->rejected_donations ?? 0),
        ];
    }

    /**
     * Get paginated top sellers donating to this LKS.
     */
    public function getTopSellers(string $lksUserId, ?string $range, int $perPage = 15): LengthAwarePaginator
    {
        $dates = $this->parseRange($range);

        $lksProfileId = LksProfile::where('user_id', $lksUserId)->value('id');

        if (!$lksProfileId) {
            return new LengthAwarePaginator([], 0, $perPage);
        }

        // JOIN orders to seller_profiles (business name) or users (if business name is missing)
        return Order::join('seller_profiles', 'orders.seller_id', '=', 'seller_profiles.user_id')
            ->where('orders.lks_id', $lksProfileId)
            ->where('orders.order_type', 'donation')
            ->where('orders.order_status', 'completed')
            ->whereBetween('orders.ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                orders.seller_id,
                seller_profiles.business_name as seller_name,
                COUNT(orders.id) as total_donations,
                SUM(orders.total_portions) as total_portions
            ")
            ->groupBy('orders.seller_id', 'seller_profiles.business_name')
            ->orderByDesc('total_portions')
            ->orderByDesc('total_donations')
            ->paginate($perPage);
    }
}
