<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminDashboardAnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_active_users' => (int) ($this['total_active_users'] ?? 0),
            'platform_revenue' => (float) ($this['platform_revenue'] ?? 0.0),
            'total_meals_saved' => (int) ($this['total_meals_saved'] ?? 0),
            'pending_verifications' => (int) ($this['pending_verifications'] ?? 0),
        ];
    }
}
