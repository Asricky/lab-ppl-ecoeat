<?php

namespace App\Http\Requests\Delivery;

use App\Enums\Delivery\FailureReason;
use Illuminate\Validation\Rule;

class FailedDeliveryRequest extends BaseCourierRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('notes')) {
            $this->merge(['notes' => trim((string) $this->input('notes'))]);
        }
    }

    public function rules(): array
    {
        return [
            'failure_reason' => ['required', 'string', Rule::in(FailureReason::values())],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
