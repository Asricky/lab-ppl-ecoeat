<?php

namespace App\Services\Analytics;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsService extends BaseAnalyticsService
{
    /**
     * Get dashboard metrics for Admin.
     */
    public function getDashboard(?string $range): array
    {
        $dates = $this->parseRange($range);

        // TODO: Cache::remember("admin_dashboard_{$range}", 3600, function() ...)
        $activeUsers = User::where('is_active', true)->count();

        $stats = Order::where('order_type', 'purchase')
            ->where('order_status', 'completed')
            ->whereBetween('ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                COALESCE(SUM(0.05 * subtotal + 5000), 0) as platform_revenue
            ")
            ->first();

        $mealsSaved = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.order_status', 'completed')
            ->where('orders.order_type', 'purchase')
            ->whereBetween('orders.ordered_at', [$dates['start_date'], $dates['end_date']])
            ->sum('order_items.quantity');

        $sellerPending = DB::table('seller_profiles')->where('verification_status', 'pending')->count();
        $courierPending = DB::table('courier_profiles')->where('verification_status', 'pending')->count();
        $lksPending = DB::table('lks_profiles')->where('verification_status', 'pending')->count();
        $pendingVerifications = $sellerPending + $courierPending + $lksPending;

        return [
            'total_active_users' => (int) $activeUsers,
            'platform_revenue' => (float) ($stats->platform_revenue ?? 0.0),
            'total_meals_saved' => (int) $mealsSaved,
            'pending_verifications' => (int) $pendingVerifications,
        ];
    }

    /**
     * Get aggregated profile verifications statistics.
     */
    public function getVerifications(?string $range): array
    {
        // TODO: Cache::remember("admin_verifications_{$range}", 3600, function() ...)
        $sellerStats = DB::table('seller_profiles')
            ->selectRaw("
                COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN verification_status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN verification_status = 'resubmitted' THEN 1 END) as resubmitted
            ")
            ->first();

        $courierStats = DB::table('courier_profiles')
            ->selectRaw("
                COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN verification_status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN verification_status = 'resubmitted' THEN 1 END) as resubmitted
            ")
            ->first();

        $lksStats = DB::table('lks_profiles')
            ->selectRaw("
                COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN verification_status = 'approved' THEN 1 END) as approved,
                COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected,
                COUNT(CASE WHEN verification_status = 'resubmitted' THEN 1 END) as resubmitted
            ")
            ->first();

        return [
            'pending' => (int) (($sellerStats->pending ?? 0) + ($courierStats->pending ?? 0) + ($lksStats->pending ?? 0)),
            'approved' => (int) (($sellerStats->approved ?? 0) + ($courierStats->approved ?? 0) + ($lksStats->approved ?? 0)),
            'rejected' => (int) (($sellerStats->rejected ?? 0) + ($courierStats->rejected ?? 0) + ($lksStats->rejected ?? 0)),
            'resubmitted' => (int) (($sellerStats->resubmitted ?? 0) + ($courierStats->resubmitted ?? 0) + ($lksStats->resubmitted ?? 0)),
        ];
    }

    /**
     * Get transaction statistics for admin.
     */
    public function getTransactions(?string $range): array
    {
        $dates = $this->parseRange($range);

        // TODO: Cache::remember("admin_transactions_{$range}", 3600, function() ...)
        $orderStats = Order::where('order_type', 'purchase')
            ->whereBetween('ordered_at', [$dates['start_date'], $dates['end_date']])
            ->selectRaw("
                COALESCE(SUM(CASE WHEN order_status = 'completed' THEN total_amount ELSE 0 END), 0) as gross_transaction_volume,
                COUNT(CASE WHEN order_status = 'completed' THEN 1 END) as completed_transactions,
                COUNT(CASE WHEN order_status = 'refunded' THEN 1 END) as refunds
            ")
            ->first();

        $withdrawals = DB::table('withdrawal_requests')
            ->where('status', 'completed')
            ->whereBetween('created_at', [$dates['start_date'], $dates['end_date']])
            ->count();

        return [
            'gross_transaction_volume' => (float) ($orderStats->gross_transaction_volume ?? 0.0),
            'completed_transactions' => (int) ($orderStats->completed_transactions ?? 0),
            'refunds' => (int) ($orderStats->refunds ?? 0),
            'withdrawals' => (int) $withdrawals,
        ];
    }
}
