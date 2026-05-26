<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourierHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'delivery_id' => $this->id,
            'order_id' => $this->order_id,
            'status' => $this->delivery_status,
            'distance_km' => (float) $this->distance_km,
            'completed_at' => $this->delivered_at ? $this->delivered_at->toDateTimeString() : null,
        ];
    }
}
