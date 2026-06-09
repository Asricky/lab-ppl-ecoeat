<?php

namespace App\Http\Resources\Delivery;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourierDeliveryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'delivery_id' => $this->id,
            'order_code' => $this->order?->order_code,
            'order_type' => $this->order?->order_type,
            'pickup' => [
                'address' => $this->pickup_address,
            ],
            'destination' => [
                'address' => $this->destination_address,
            ],
            'distance_km' => $this->distance_km,
            'delivery_status' => $this->delivery_status,
            'tracking_logs' => DeliveryTrackingResource::collection($this->whenLoaded('trackingLogs')),
        ];
    }
}
