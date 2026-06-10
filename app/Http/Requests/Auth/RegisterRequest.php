<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('role')) {
            $this->merge([
                'role' => strtolower(trim((string) $this->input('role'))),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(['buyer', 'seller', 'courier', 'lks', 'admin'])],
            
            // LKS registration fields (required if role is lks)
            'address' => ['required_if:role,lks', 'string', 'max:1000'],
            'latitude' => ['required_if:role,lks', 'numeric', 'between:-90,90'],
            'longitude' => ['required_if:role,lks', 'numeric', 'between:-180,180'],
        ];
    }
}
