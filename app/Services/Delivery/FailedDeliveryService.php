<?php

namespace App\Services\Delivery;

use App\Enums\Delivery\DeliveryStatus;
use App\Enums\Delivery\OrderStatus;
use App\Models\Delivery;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Throwable;

class FailedDeliveryService extends BaseDeliveryService
{
    public function markFailed(object $courier, string $deliveryId, array $data): void
    {
        try {
            $this->assertCourierCanWork($courier);

            DB::transaction(function () use ($courier, $deliveryId, $data) {
                $delivery = Delivery::query()
                    ->with('order')
                    ->whereKey($deliveryId)
                    ->lockForUpdate()
                    ->first();

                if (! $delivery) {
                    $this->fail('Delivery not found', 404);
                }

                $this->assertOwnsDelivery($delivery, $courier);

                if ($delivery->delivery_status === DeliveryStatus::DELIVERED->value) {
                    $this->fail('Delivered delivery cannot be marked as failed', 422);
                }

                if ($delivery->delivery_status === DeliveryStatus::FAILED->value) {
                    $this->fail('Delivery has already been marked as failed', 422);
                }

                $delivery->forceFill(['delivery_status' => DeliveryStatus::FAILED->value])->save();

                if ($delivery->order) {
                    $delivery->order->forceFill(['order_status' => OrderStatus::CANCELLED->value])->save();
                }

                $notes = trim($data['failure_reason'].' '.($data['notes'] ?? ''));
                $this->createTrackingLog($delivery, DeliveryStatus::FAILED->value, $notes);
            });
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to mark delivery as failed', 500);
        }
    }
}
