<?php

namespace App\Services\Delivery;

use App\Models\Delivery;
use Illuminate\Http\Exceptions\HttpResponseException;
use Throwable;

class DeliveryDetailService extends BaseDeliveryService
{
    public function detail(object $courier, string $deliveryId): Delivery
    {
        try {
            $this->assertCourierCanWork($courier);

            $delivery = Delivery::query()
                ->with(['order.buyer', 'order.seller', 'trackingLogs'])
                ->whereKey($deliveryId)
                ->first();

            if (! $delivery) {
                $this->fail('Delivery not found', 404);
            }

            $this->assertOwnsDelivery($delivery, $courier);

            return $delivery;
        } catch (HttpResponseException $exception) {
            throw $exception;
        } catch (Throwable) {
            $this->fail('Failed to fetch delivery detail', 500);
        }
    }
}
