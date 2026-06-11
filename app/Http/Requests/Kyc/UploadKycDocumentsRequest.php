<?php

namespace App\Http\Requests\Kyc;

use Illuminate\Foundation\Http\FormRequest;

class UploadKycDocumentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user !== null
            && in_array($user->role, ['buyer', 'seller', 'courier'], true)
            && in_array($user->status, ['pending', 'rejected'], true);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $role = $this->user()?->role;
        $fileRules = ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'];

        $rules = [
            'documents' => ['required', 'array'],
            'documents.ktp' => array_merge(['required'], $fileRules),
            'documents.nib' => ['prohibited'],
            'documents.sim' => ['prohibited'],
        ];

        if ($role === 'seller') {
            $rules['documents.nib'] = array_merge(['required'], $fileRules);
        }

        if ($role === 'courier') {
            $rules['documents.sim'] = array_merge(['required'], $fileRules);
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'documents.ktp.required' => 'KTP document is required.',
            'documents.nib.required' => 'NIB document is required for sellers.',
            'documents.sim.required' => 'SIM document is required for couriers.',
        ];
    }
}

