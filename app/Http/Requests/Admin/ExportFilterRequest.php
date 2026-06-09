<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ExportFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // User filters
            'role' => 'nullable|string|in:buyer,seller,courier,lks,admin',
            'verification_status' => 'nullable|string|in:pending,approved,rejected,resubmitted',
            'is_active' => 'nullable|boolean',

            // Transaction filters
            'type' => 'nullable|string|in:purchase,payout,refund,topup,withdrawal,commission,delivery_fee',
            'status' => 'nullable|string|in:pending,completed,failed,refunded',
            'from' => 'nullable|date',
            'to' => 'nullable|date',

            // General range
            'range' => 'nullable|string|in:7d,30d,this_month,last_month,ytd',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
