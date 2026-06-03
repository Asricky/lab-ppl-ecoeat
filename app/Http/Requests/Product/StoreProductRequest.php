<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Only authenticated sellers may create products.
     */
    public function authorize(): bool
    {
        return true; // Gate/Policy checked at controller level
    }

    public function rules(): array
    {
        return [
            'title'            => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'price'            => ['required', 'numeric', 'min:0'],
            'original_price'   => ['nullable', 'numeric', 'min:0'],
            'stock_quantity'   => ['required', 'integer', 'min:0'],
            'portion_quantity' => ['required', 'integer', 'min:1'],
            'expiry_date'      => ['required', 'date', 'after:now'],
            'is_donation'      => ['sometimes', 'boolean'],
            'target_lks_id'    => ['nullable', 'uuid', 'exists:lks_profiles,id'],
            'status'           => ['sometimes', 'string', 'in:active,inactive,sold_out'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'            => 'Judul produk wajib diisi.',
            'description.required'      => 'Deskripsi produk wajib diisi.',
            'price.required'            => 'Harga produk wajib diisi.',
            'price.numeric'             => 'Harga harus berupa angka.',
            'stock_quantity.required'   => 'Jumlah stok wajib diisi.',
            'stock_quantity.integer'    => 'Jumlah stok harus berupa bilangan bulat.',
            'portion_quantity.required' => 'Jumlah porsi wajib diisi.',
            'expiry_date.required'      => 'Tanggal kadaluarsa wajib diisi.',
            'expiry_date.after'         => 'Tanggal kadaluarsa harus lebih dari sekarang.',
            'target_lks_id.uuid'        => 'Target LKS ID harus berformat UUID.',
            'target_lks_id.exists'      => 'Target LKS tidak ditemukan.',
            'status.in'                 => 'Status harus salah satu: active, inactive, sold_out.',
        ];
    }
}
