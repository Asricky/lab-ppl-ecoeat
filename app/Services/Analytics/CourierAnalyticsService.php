<?php

namespace App\Services\Analytics;

use App\Models\Delivery;
use Illuminate\Pagination\LengthAwarePaginator;

class CourierAnalyticsService extends BaseAnalyticsService
{
    /**
     * Get dashboard metrics for a courier.
     */
    public function getDashboard(string $courierId, ?string $range): array
    {
        $dates = $this->parseRange($range);

        // TODO: Cache::remember("courier_dashboard_{$courierId}_{$range}", 3600, function() ...)
        $stats = Delivery::where('courier_id', $courierId)
            ->whereBetween('created_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                COUNT(id) as total_deliveries,
                COUNT(CASE WHEN delivery_status = 'delivered' THEN 1 END) as completed_deliveries,
                COUNT(CASE WHEN delivery_status = 'failed' THEN 1 END) as failed_deliveries,
                COALESCE(SUM(distance_km), 0) as total_distance_km
            ")
            ->first();

        $total = $stats->completed_deliveries + $stats->failed_deliveries;
        $successRate = $total > 0 ? ($stats->completed_deliveries / $total) * 100 : 0.0;

        return [
            'completed_deliveries' => (int) $stats->completed_deliveries,
            'failed_deliveries' => (int) $stats->failed_deliveries,
            'success_rate' => round((float) $successRate, 2),
            'total_distance_km' => round((float) $stats->total_distance_km, 2),
        ];
    }

    /**
     * Get paginated delivery history for a courier.
     */
    public function getHistory(string $courierId, ?string $range, int $perPage = 15): LengthAwarePaginator
    {
        $dates = $this->parseRange($range);

        return Delivery::where('courier_id', $courierId)
            ->whereBetween('created_at', [$dates['start_date'], $dates['end_date']])
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
