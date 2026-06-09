<?php

namespace App\Http\Resources\Delivery;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AvailableDeliveryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_id' => $this->id,
            'order_code' => $this->order_code,
            'seller_name' => $this->seller?->full_name,
            'order_type' => $this->order_type,
            'pickup_address' => $this->delivery?->pickup_address,
            'destination_address' => $this->delivery?->destination_address,
            'distance_km' => $this->delivery?->distance_km,
            'estimated_arrival_time' => $this->delivery?->estimated_arrival_time?->format('Y-m-d H:i:s'),
            'ordered_at' => $this->ordered_at?->format('Y-m-d H:i:s'),
        ];
    }
}
