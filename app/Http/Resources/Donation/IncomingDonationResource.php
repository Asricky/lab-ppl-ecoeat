<?php

namespace App\Http\Resources\Donation;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncomingDonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'delivery_id' => $this->delivery->id,
            'order_id' => $this->id,
            'order_code' => $this->order_code,
            'product_name' => $this->product_name ?? 'Donation Package', // Adjust if product logic expands
            'quantity' => $this->total_portions,
            'unit' => 'portions',
            'seller_name' => $this->seller->full_name ?? 'Unknown Seller',
            'notes' => $this->notes,
            'created_at' => $this->ordered_at,
        ];
    }
}
