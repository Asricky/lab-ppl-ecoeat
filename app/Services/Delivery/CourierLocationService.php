<?php

namespace App\Services\Delivery;

use App\Models\Delivery;
use Illuminate\Http\Exceptions\HttpResponseException;
use Throwable;

class CourierLocationService extends BaseDeliveryService
{
    public function updateLocation(object $courier, string $deliveryId, array $data): void
    {
        try {
            $this->assertCourierCanWork($courier);

            $delivery = Delivery::query()->whereKey($deliveryId)->first();

            if (! $delivery) {
                $this->fail('Delivery not found', 404);
            }

            $this->assertOwnsDelivery($delivery, $courier);

            $this->createTrackingLog(
                $delivery,
                $data['status'],
                $data['notes'] ?? null,
                $data['latitude'],
                $data['longitude'],
            );
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to update location', 500);
        }
    }
}
