<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'uuid', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'ID produk wajib diisi.',
            'product_id.uuid'     => 'ID produk harus berformat UUID.',
            'product_id.exists'   => 'Produk tidak ditemukan.',
            'quantity.required'   => 'Jumlah item wajib diisi.',
            'quantity.integer'    => 'Jumlah item harus berupa angka bulat.',
            'quantity.min'        => 'Jumlah item minimal 1.',
        ];
    }
}
