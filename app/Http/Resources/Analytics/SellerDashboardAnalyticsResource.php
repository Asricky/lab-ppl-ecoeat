<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerDashboardAnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_revenue' => (float) ($this['total_revenue'] ?? 0.0),
            'total_orders' => (int) ($this['total_orders'] ?? 0),
            'completed_orders' => (int) ($this['completed_orders'] ?? 0),
            'cancelled_orders' => (int) ($this['cancelled_orders'] ?? 0),
            'meals_saved' => (int) ($this['meals_saved'] ?? 0),
            'donation_count' => (int) ($this['donation_count'] ?? 0),
            'donation_portions' => (int) ($this['donation_portions'] ?? 0),
        ];
    }
}
