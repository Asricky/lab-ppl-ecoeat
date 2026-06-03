<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Ownership is validated in the service layer.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'            => ['sometimes', 'string', 'max:255'],
            'description'      => ['sometimes', 'string'],
            'price'            => ['sometimes', 'numeric', 'min:0'],
            'original_price'   => ['nullable', 'numeric', 'min:0'],
            'stock_quantity'   => ['sometimes', 'integer', 'min:0'],
            'portion_quantity' => ['sometimes', 'integer', 'min:1'],
            'expiry_date'      => ['sometimes', 'date', 'after:now'],
            'is_donation'      => ['sometimes', 'boolean'],
            'target_lks_id'    => ['nullable', 'uuid', 'exists:lks_profiles,id'],
            'status'           => ['sometimes', 'string', 'in:active,inactive,sold_out'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.numeric'             => 'Harga harus berupa angka.',
            'stock_quantity.integer'    => 'Jumlah stok harus berupa bilangan bulat.',
            'portion_quantity.integer'  => 'Jumlah porsi harus berupa bilangan bulat.',
            'expiry_date.after'         => 'Tanggal kadaluarsa harus lebih dari sekarang.',
            'target_lks_id.uuid'        => 'Target LKS ID harus berformat UUID.',
            'target_lks_id.exists'      => 'Target LKS tidak ditemukan.',
            'status.in'                 => 'Status harus salah satu: active, inactive, sold_out.',
        ];
    }
}
