<?php

namespace App\Http\Resources\Donation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_donation_received' => $this['total_received'] ?? 0,
            'donation_in_delivery' => $this['in_delivery'] ?? 0,
            'social_impact' => $this['social_impact'] ?? 0,
        ];
    }
}
