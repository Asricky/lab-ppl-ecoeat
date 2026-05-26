<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerTopProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'total_orders' => (int) $this->total_orders,
            'total_quantity' => (int) $this->total_quantity,
            'total_revenue' => (float) $this->total_revenue,
        ];
    }
}
