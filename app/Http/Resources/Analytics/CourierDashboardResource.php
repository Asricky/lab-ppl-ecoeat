<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourierDashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'completed_deliveries' => (int) ($this['completed_deliveries'] ?? 0),
            'failed_deliveries' => (int) ($this['failed_deliveries'] ?? 0),
            'success_rate' => (float) ($this['success_rate'] ?? 0.0),
            'total_distance_km' => (float) ($this['total_distance_km'] ?? 0.0),
        ];
    }
}
