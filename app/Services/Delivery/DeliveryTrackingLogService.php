<?php

namespace App\Services\Delivery;

use App\Models\Delivery;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Collection;
use Throwable;

class DeliveryTrackingLogService extends BaseDeliveryService
{
    public function history(object $courier, string $deliveryId): Collection
    {
        try {
            $this->assertCourierCanWork($courier);

            $delivery = Delivery::query()
                ->with('trackingLogs')
                ->whereKey($deliveryId)
                ->first();

            if (! $delivery) {
                $this->fail('Delivery not found', 404);
            }

            $this->assertOwnsDelivery($delivery, $courier);

            return $delivery->trackingLogs;
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to fetch tracking history', 500);
        }
    }
}
