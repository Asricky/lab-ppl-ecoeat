<?php

namespace App\Http\Resources\Analytics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminTransactionAnalyticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'gross_transaction_volume' => (float) ($this['gross_transaction_volume'] ?? 0.0),
            'completed_transactions' => (int) ($this['completed_transactions'] ?? 0),
            'refunds' => (int) ($this['refunds'] ?? 0),
            'withdrawals' => (int) ($this['withdrawals'] ?? 0),
        ];
    }
}
