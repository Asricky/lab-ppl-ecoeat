<?php

namespace App\Services\Delivery;

use App\Enums\Delivery\DeliveryStatus;
use App\Enums\Delivery\OrderStatus;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Throwable;

class DeliveryAssignmentService extends BaseDeliveryService
{
    public function assign(object $courier, string $orderId): array
    {
        try {
            return DB::transaction(function () use ($courier, $orderId) {
                $lockedCourier = User::query()
                    ->with('courierProfile')
                    ->whereKey($courier->id)
                    ->lockForUpdate()
                    ->first();

                if (! $lockedCourier) {
                    $this->fail('Courier not found', 404);
                }

                $this->assertCourierCanWork($lockedCourier);
                $this->assertCourierHasNoActiveDelivery($lockedCourier);

                $order = Order::query()
                    ->whereKey($orderId)
                    ->lockForUpdate()
                    ->first();

                if (! $order) {
                    $this->fail('Order not found', 404);
                }

                if ($order->courier_id !== null) {
                    $this->fail('Order already has a courier', 409);
                }

                if ($order->order_status !== OrderStatus::READY_FOR_DELIVERY->value) {
                    $this->fail('Order is not ready for delivery', 422);
                }

                $delivery = Delivery::query()
                    ->where('order_id', $order->id)
                    ->lockForUpdate()
                    ->first();

                if (! $delivery) {
                    $this->fail('Delivery record not found', 404);
                }

                $order->forceFill([
                    'courier_id' => $lockedCourier->id,
                    'order_status' => OrderStatus::IN_DELIVERY->value,
                ])->save();
                $delivery->forceFill([
                    'courier_id' => $lockedCourier->id,
                    'delivery_status' => DeliveryStatus::COURIER_ASSIGNED->value,
                ])->save();

                $this->createTrackingLog($delivery, DeliveryStatus::COURIER_ASSIGNED->value);

                return [
                    'order_id' => $order->id,
                    'delivery_status' => $delivery->delivery_status,
                ];
            });
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to assign delivery', 500);
        }
    }
}
