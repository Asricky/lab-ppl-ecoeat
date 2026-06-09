<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LksTopSellerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'seller_id' => $this->seller_id,
            'seller_name' => $this->seller_name,
            'total_donations' => (int) $this->total_donations,
            'total_portions' => (int) $this->total_portions,
        ];
    }
}
