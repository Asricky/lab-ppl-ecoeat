<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\WalletTransaction;
use App\Models\Order;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AdminExportService
{
    /**
     * Build streamed CSV response for users.
     */
    public function exportUsers(array $filters): StreamedResponse
    {
        $query = User::query();

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['verification_status'])) {
            $query->where('verification_status', $filters['verification_status']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', (bool)$filters['is_active']);
        }

        $query->orderBy('created_at', 'desc');

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            
            // Add BOM for Excel compatibility (UTF-8)
            fwrite($handle, "\xEF\xBB\xBF");

            // CSV Headers
            fputcsv($handle, [
                'ID',
                'Full Name',
                'Email',
                'Role',
                'Phone Number',
                'Is Verified',
                'Verification Status',
                'Is Active',
                'Created At'
            ]);

            // Stream using cursor
            foreach ($query->cursor() as $user) {
                fputcsv($handle, [
                    $user->id,
                    $user->full_name,
                    $user->email,
                    $user->role,
                    $user->phone_number,
                    $user->is_verified ? 'Yes' : 'No',
                    $user->verification_status,
                    $user->is_active ? 'Yes' : 'No',
                    $user->created_at ? $user->created_at->toIso8601String() : ''
                ]);
            }

            fclose($handle);
        }, 'users_export_' . now()->format('Ymd_His') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Build streamed CSV response for wallet transactions.
     */
    public function exportTransactions(array $filters): StreamedResponse
    {
        $query = DB::table('wallet_transactions')
            ->join('wallets', 'wallet_transactions.wallet_id', '=', 'wallets.id')
            ->leftJoin('users', 'wallets.user_id', '=', 'users.id')
            ->select([
                'wallet_transactions.id',
                'wallet_transactions.wallet_id',
                'users.id as user_id',
                'users.full_name as user_full_name',
                'users.email as user_email',
                'users.role as user_role',
                'wallet_transactions.order_id',
                'wallet_transactions.transaction_type',
                'wallet_transactions.transaction_status',
                'wallet_transactions.amount',
                'wallet_transactions.description',
                'wallet_transactions.created_at'
            ]);

        if (!empty($filters['type'])) {
            $query->where('wallet_transactions.transaction_type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('wallet_transactions.transaction_status', $filters['status']);
        }

        if (!empty($filters['from'])) {
            $query->where('wallet_transactions.created_at', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->where('wallet_transactions.created_at', '<=', $filters['to']);
        }

        $query->orderBy('wallet_transactions.created_at', 'desc');

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            
            // Add BOM for Excel compatibility (UTF-8)
            fwrite($handle, "\xEF\xBB\xBF");

            // CSV Headers
            fputcsv($handle, [
                'Transaction ID',
                'Wallet ID',
                'User ID',
                'User Name',
                'User Email',
                'User Role',
                'Order ID',
                'Transaction Type',
                'Transaction Status',
                'Amount',
                'Description',
                'Created At'
            ]);

            // Stream using cursor
            foreach ($query->cursor() as $tx) {
                fputcsv($handle, [
                    $tx->id,
                    $tx->wallet_id,
                    $tx->user_id ?? '',
                    $tx->user_full_name ?? '',
                    $tx->user_email ?? '',
                    $tx->user_role ?? '',
                    $tx->order_id ?? '',
                    $tx->transaction_type,
                    $tx->transaction_status,
                    (float)$tx->amount,
                    $tx->description,
                    $tx->created_at ? Carbon::parse($tx->created_at)->toIso8601String() : ''
                ]);
            }

            fclose($handle);
        }, 'transactions_export_' . now()->format('Ymd_His') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Build streamed CSV response for reports (orders list).
     */
    public function exportReports(array $filters): StreamedResponse
    {
        $query = DB::table('orders')
            ->leftJoin('users as buyers', 'orders.buyer_id', '=', 'buyers.id')
            ->leftJoin('users as sellers', 'orders.seller_id', '=', 'sellers.id')
            ->leftJoin('seller_profiles', 'sellers.id', '=', 'seller_profiles.user_id')
            ->leftJoin('users as couriers', 'orders.courier_id', '=', 'couriers.id')
            ->leftJoin('lks_profiles', 'orders.lks_id', '=', 'lks_profiles.id')
            ->select([
                'orders.id as order_id',
                'orders.order_code',
                'buyers.full_name as buyer_name',
                'buyers.email as buyer_email',
                'seller_profiles.business_name as seller_business_name',
                'sellers.full_name as seller_name',
                'couriers.full_name as courier_name',
                'lks_profiles.foundation_name as lks_foundation_name',
                'orders.order_type',
                'orders.order_status',
                'orders.subtotal',
                'orders.delivery_fee',
                'orders.platform_fee',
                'orders.total_amount',
                'orders.total_portions',
                'orders.ordered_at',
                'orders.completed_at'
            ]);

        if (!empty($filters['status'])) {
            $query->where('orders.order_status', $filters['status']);
        }

        if (!empty($filters['from'])) {
            $query->where('orders.ordered_at', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->where('orders.ordered_at', '<=', $filters['to']);
        }

        $query->orderBy('orders.ordered_at', 'desc');

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            
            // Add BOM for Excel compatibility (UTF-8)
            fwrite($handle, "\xEF\xBB\xBF");

            // CSV Headers
            fputcsv($handle, [
                'Order ID',
                'Order Code',
                'Buyer Name',
                'Buyer Email',
                'Seller Business Name',
                'Courier Name',
                'LKS Foundation Name',
                'Order Type',
                'Order Status',
                'Subtotal',
                'Delivery Fee',
                'Platform Fee',
                'Total Amount',
                'Total Portions',
                'Ordered At',
                'Completed At'
            ]);

            // Stream using cursor
            foreach ($query->cursor() as $order) {
                $sellerBusinessName = $order->seller_business_name ?? $order->seller_name ?? '';
                fputcsv($handle, [
                    $order->order_id,
                    $order->order_code,
                    $order->buyer_name ?? '',
                    $order->buyer_email ?? '',
                    $sellerBusinessName,
                    $order->courier_name ?? '',
                    $order->lks_foundation_name ?? '',
                    $order->order_type,
                    $order->order_status,
                    (float)$order->subtotal,
                    (float)$order->delivery_fee,
                    (float)$order->platform_fee,
                    (float)$order->total_amount,
                    $order->total_portions,
                    $order->ordered_at ? Carbon::parse($order->ordered_at)->toIso8601String() : '',
                    $order->completed_at ? Carbon::parse($order->completed_at)->toIso8601String() : ''
                ]);
            }

            fclose($handle);
        }, 'reports_export_' . now()->format('Ymd_His') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Cache-Control' => 'no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
