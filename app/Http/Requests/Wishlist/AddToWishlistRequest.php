<?php

namespace App\Http\Requests\Wishlist;

use Illuminate\Foundation\Http\FormRequest;

class AddToWishlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'uuid', 'exists:products,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'ID produk wajib diisi.',
            'product_id.uuid'     => 'ID produk harus berformat UUID.',
            'product_id.exists'   => 'Produk tidak ditemukan.',
        ];
    }
}
