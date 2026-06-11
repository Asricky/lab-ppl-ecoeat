<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LksDashboardAnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_donations_received' => (int) ($this['total_donations_received'] ?? 0),
            'total_meals_received' => (int) ($this['total_meals_received'] ?? 0),
            'completed_donations' => (int) ($this['completed_donations'] ?? 0),
            'rejected_donations' => (int) ($this['rejected_donations'] ?? 0),
        ];
    }
}
