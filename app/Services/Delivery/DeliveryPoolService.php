<?php

namespace App\Services\Delivery;

use App\Enums\Delivery\OrderStatus;
use App\Models\Order;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Collection;
use Throwable;

class DeliveryPoolService extends BaseDeliveryService
{
    public function available(object $courier, ?string $filter = null, int $perPage = 15)
    {
        try {
            $this->assertCourierCanWork($courier);

            $query = Order::query()
                ->with(['seller', 'delivery'])
                ->whereNull('orders.courier_id')
                ->where('orders.order_status', OrderStatus::READY_FOR_DELIVERY->value)
                ->whereHas('delivery', function ($q) {
                    $q->where('delivery_status', \App\Enums\Delivery\DeliveryStatus::AVAILABLE_FOR_COURIER->value);
                });

            if ($filter === 'nearest') {
                $query->join('deliveries', 'deliveries.order_id', '=', 'orders.id')
                    ->orderBy('deliveries.distance_km')
                    ->select('orders.*');
            }

            if ($filter === 'furthest') {
                $query->join('deliveries', 'deliveries.order_id', '=', 'orders.id')
                    ->orderByDesc('deliveries.distance_km')
                    ->select('orders.*');
            }

            return $query->orderBy('orders.ordered_at')->paginate($perPage);
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to fetch available deliveries', 500);
        }
    }
}
