<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = null;
        if ($this->relationLoaded('wallet') && $this->wallet && $this->wallet->relationLoaded('user') && $this->wallet->user) {
            $user = [
                'id' => $this->wallet->user->id,
                'full_name' => $this->wallet->user->full_name,
                'email' => $this->wallet->user->email,
                'role' => $this->wallet->user->role,
            ];
        }

        return [
            'id' => $this->id,
            'wallet_id' => $this->wallet_id,
            'order_id' => $this->order_id,
            'transaction_type' => $this->transaction_type,
            'transaction_status' => $this->transaction_status,
            'amount' => (float) $this->amount,
            'description' => $this->description,
            'created_at' => $this->created_at ? $this->created_at->toIso8601String() : null,
            'user' => $user,
        ];
    }
}
