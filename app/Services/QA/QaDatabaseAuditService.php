<?php

namespace App\Services\QA;

use Illuminate\Support\Facades\DB;

class QaDatabaseAuditService
{
    private string $startTime;

    public function startSession(): void
    {
        $this->startTime = now()->toDateTimeString();
    }

    public function getSnapshot(): array
    {
        $ordersCount = DB::table('orders')->count();
        $deliveriesCount = DB::table('deliveries')->count();
        $logsCount = DB::table('delivery_tracking_logs')->count();
        $transactionsCount = DB::table('wallet_transactions')->count();

        return [
            'orders_count' => $ordersCount,
            'deliveries_count' => $deliveriesCount,
            'delivery_tracking_logs_count' => $logsCount,
            'wallet_transactions_count' => $transactionsCount,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    public function getInsertedCount(): array
    {
        // Query records created during the test run
        $orders = DB::table('orders')->where('ordered_at', '>=', $this->startTime)->get();
        $deliveries = DB::table('deliveries')->where('created_at', '>=', $this->startTime)->get();
        
        $deliveryIds = $deliveries->pluck('id')->toArray();
        $trackingLogs = DB::table('delivery_tracking_logs')
            ->whereIn('delivery_id', $deliveryIds)
            ->orWhere('created_at', '>=', $this->startTime)
            ->get();
            
        $transactions = DB::table('wallet_transactions')->where('created_at', '>=', $this->startTime)->get();

        return [
            'orders' => $orders->count(),
            'deliveries' => $deliveries->count(),
            'delivery_tracking_logs' => $trackingLogs->count(),
            'wallet_transactions' => $transactions->count(),
            'details' => [
                'orders' => $orders->map(fn($o) => [
                    'id' => $o->id,
                    'order_code' => $o->order_code,
                    'order_status' => $o->order_status,
                    'order_type' => $o->order_type,
                    'seller_id' => $o->seller_id,
                    'lks_id' => $o->lks_id,
                ])->toArray(),
                'deliveries' => $deliveries->map(fn($d) => [
                    'id' => $d->id,
                    'order_id' => $d->order_id,
                    'delivery_status' => $d->delivery_status,
                    'courier_id' => $d->courier_id,
                ])->toArray(),
            ]
        ];
    }

    public function validateConsistency(): array
    {
        $issues = [];
        $validatedCount = 0;

        // Fetch all orders created during session
        $orders = DB::table('orders')->where('ordered_at', '>=', $this->startTime)->get();

        foreach ($orders as $order) {
            $delivery = DB::table('deliveries')->where('order_id', $order->id)->first();
            
            if (!$delivery) {
                if ($order->order_type === 'donation') {
                    $issues[] = "Order {$order->order_code} has no associated delivery record.";
                }
                continue;
            }

            $validatedCount++;

            // Lifecycle rule 1: order_status completed <-> delivery_status delivered
            if ($order->order_status === 'completed' && $delivery->delivery_status !== 'delivered') {
                $issues[] = "Inconsistent completed state: Order {$order->order_code} is completed, but Delivery {$delivery->id} status is '{$delivery->delivery_status}' (expected 'delivered').";
            }
            if ($delivery->delivery_status === 'delivered' && $order->order_status !== 'completed') {
                $issues[] = "Inconsistent delivered state: Delivery {$delivery->id} is delivered, but Order {$order->order_code} status is '{$order->order_status}' (expected 'completed').";
            }

            // Lifecycle rule 2: rejected_by_lks -> order cancelled
            if ($delivery->delivery_status === 'rejected_by_lks' && $order->order_status !== 'cancelled') {
                $issues[] = "Inconsistent reject state: Delivery {$delivery->id} is rejected, but Order {$order->order_code} status is '{$order->order_status}' (expected 'cancelled').";
            }

            // Lifecycle rule 3: failed -> order cancelled
            if ($delivery->delivery_status === 'failed' && $order->order_status !== 'cancelled') {
                $issues[] = "Inconsistent failed state: Delivery {$delivery->id} is failed, but Order {$order->order_code} status is '{$order->order_status}' (expected 'cancelled').";
            }

            // Lifecycle rule 4: courier_assigned -> order in_delivery (or ready_for_delivery / in_delivery depending on pickup state)
            if ($delivery->delivery_status === 'courier_assigned' && !in_array($order->order_status, ['ready_for_delivery', 'in_delivery'])) {
                $issues[] = "Inconsistent courier assigned state: Delivery {$delivery->id} is courier_assigned, but Order {$order->order_code} status is '{$order->order_status}'.";
            }
            
            // Log progression count check
            $logsCount = DB::table('delivery_tracking_logs')->where('delivery_id', $delivery->id)->count();
            if ($logsCount === 0) {
                $issues[] = "Delivery {$delivery->id} has zero tracking logs.";
            }
        }

        return [
            'valid' => empty($issues),
            'validated_count' => $validatedCount,
            'issues' => $issues,
        ];
    }
}
