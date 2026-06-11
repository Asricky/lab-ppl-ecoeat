<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

class CreateDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'seller';
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'uuid', 'exists:products,id'],
            'lks_id' => ['required', 'uuid', 'exists:lks_profiles,user_id'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
