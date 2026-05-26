<?php

namespace App\Services\Donation;

use App\Enums\Delivery\OrderStatus;
use App\Models\Order;

class LksDashboardService
{
    public function getHistory(object $lksUser, int $perPage = 15)
    {
        $lksProfile = $lksUser->lksProfile;
        if (!$lksProfile) {
            return new \Illuminate\Pagination\LengthAwarePaginator([], 0, $perPage);
        }
        return Order::with(['seller', 'delivery', 'delivery.courier'])
            ->where('lks_id', $lksProfile->id)
            ->where('order_type', 'donation')
            ->where('order_status', OrderStatus::COMPLETED->value)
            ->orderByDesc('completed_at')
            ->paginate($perPage);
    }

    public function getStatistics(object $lksUser): array
    {
        $lksProfile = $lksUser->lksProfile;
        if (!$lksProfile) {
            return [
                'total_received' => 0,
                'in_delivery' => 0,
                'social_impact' => 0,
            ];
        }

        $stats = Order::where('lks_id', $lksProfile->id)
            ->where('order_type', 'donation')
            ->selectRaw("
                COUNT(CASE WHEN order_status = ? THEN 1 END) as total_received,
                COUNT(CASE WHEN order_status = ? THEN 1 END) as in_delivery,
                SUM(CASE WHEN order_status = ? THEN total_portions ELSE 0 END) as social_impact
            ", [
                OrderStatus::COMPLETED->value,
                OrderStatus::IN_DELIVERY->value,
                OrderStatus::COMPLETED->value
            ])
            ->first();

        return [
            'total_received' => (int) ($stats->total_received ?? 0),
            'in_delivery' => (int) ($stats->in_delivery ?? 0),
            'social_impact' => (int) ($stats->social_impact ?? 0),
        ];
    }
}
