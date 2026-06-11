<?php

namespace App\Http\Requests\Delivery;

use App\Enums\Delivery\DeliveryStatus;
use Illuminate\Validation\Rule;

class UpdateDeliveryStatusRequest extends BaseCourierRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('status') && !$this->has('delivery_status')) {
            $this->merge(['delivery_status' => $this->input('status')]);
        }
        if ($this->has('notes')) {
            $this->merge(['notes' => trim((string) $this->input('notes'))]);
        }
    }

    public function rules(): array
    {
        return [
            'delivery_status' => ['required', 'string', Rule::in(DeliveryStatus::courierProgressValues())],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
