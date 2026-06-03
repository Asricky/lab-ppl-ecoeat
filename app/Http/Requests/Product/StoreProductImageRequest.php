<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Ownership validated in service layer
    }

    public function rules(): array
    {
        return [
            'images'             => ['required', 'array', 'min:1', 'max:5'],
            'images.*'           => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120', // 5 MB per file
            ],
            'primary_index'      => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'images.required'       => 'Minimal upload 1 gambar produk.',
            'images.array'          => 'Format gambar tidak valid.',
            'images.min'            => 'Minimal upload 1 gambar produk.',
            'images.max'            => 'Maksimal 5 gambar per upload.',
            'images.*.required'     => 'File gambar tidak boleh kosong.',
            'images.*.image'        => 'File harus berupa gambar.',
            'images.*.mimes'        => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'images.*.max'          => 'Ukuran gambar maksimal 5 MB.',
            'primary_index.integer' => 'Index gambar utama harus berupa angka.',
            'primary_index.min'     => 'Index gambar utama tidak valid.',
        ];
    }
}
