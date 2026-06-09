<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'quantity.required' => 'Jumlah item wajib diisi.',
            'quantity.integer'  => 'Jumlah item harus berupa angka bulat.',
            'quantity.min'      => 'Jumlah item minimal 1.',
        ];
    }
}
