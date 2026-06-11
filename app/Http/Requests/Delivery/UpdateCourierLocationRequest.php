<?php

namespace App\Http\Requests\Delivery;

class UpdateCourierLocationRequest extends BaseCourierRequest
{
    protected function prepareForValidation(): void
    {
        if (!$this->has('status')) {
            $deliveryId = $this->route('deliveryId');
            if ($deliveryId) {
                $status = \App\Models\Delivery::where('id', $deliveryId)->value('delivery_status');
                if ($status) {
                    $this->merge(['status' => $status]);
                }
            }
        }
        if ($this->has('notes')) {
            $this->merge(['notes' => trim((string) $this->input('notes'))]);
        }
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'status' => ['required', 'string', 'max:100'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
