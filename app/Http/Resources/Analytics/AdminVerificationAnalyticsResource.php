<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminVerificationAnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'pending' => (int) ($this['pending'] ?? 0),
            'approved' => (int) ($this['approved'] ?? 0),
            'rejected' => (int) ($this['rejected'] ?? 0),
            'resubmitted' => (int) ($this['resubmitted'] ?? 0),
        ];
    }
}
