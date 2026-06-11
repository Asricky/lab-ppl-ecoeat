<?php

namespace App\Services\Delivery;

use App\Enums\Delivery\DeliveryStatus;
use App\Enums\Delivery\OrderStatus;
use App\Models\Delivery;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Throwable;

class DeliveryTrackingService extends BaseDeliveryService
{
    public function updateStatus(object $courier, string $deliveryId, array $data): array
    {
        try {
            $this->assertCourierCanWork($courier);

            return DB::transaction(function () use ($courier, $deliveryId, $data) {
                $delivery = Delivery::query()
                    ->with('order')
                    ->whereKey($deliveryId)
                    ->lockForUpdate()
                    ->first();

                if (! $delivery) {
                    $this->fail('Delivery not found', 404);
                }

                $this->assertOwnsDelivery($delivery, $courier);
                $this->assertValidProgression($delivery->delivery_status, $data['delivery_status']);

                $updates = ['delivery_status' => $data['delivery_status']];

                if ($data['delivery_status'] === DeliveryStatus::PICKED_UP->value) {
                    $updates['picked_up_at'] = now();
                }

                if ($data['delivery_status'] === DeliveryStatus::DELIVERED->value) {
                    $updates['delivered_at'] = now();
                }

                $delivery->forceFill($updates)->save();

                if ($delivery->order && $data['delivery_status'] === DeliveryStatus::DELIVERED->value) {
                    $delivery->order->forceFill([
                        'order_status' => OrderStatus::COMPLETED->value,
                        'completed_at' => now(),
                    ])->save();
                }

                if ($delivery->order && $data['delivery_status'] === DeliveryStatus::FAILED->value) {
                    $delivery->order->forceFill(['order_status' => OrderStatus::CANCELLED->value])->save();
                }

                $this->createTrackingLog($delivery, $data['delivery_status'], $data['notes'] ?? null);

                return [
                    'delivery_id' => $delivery->id,
                    'delivery_status' => $delivery->delivery_status,
                ];
            });
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to update delivery status', 500);
        }
    }
}
