<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Validation\Rule;

class GetAvailableDeliveryRequest extends BaseCourierRequest
{
    public function rules(): array
    {
        return [
            'filter' => ['nullable', Rule::in(['nearest', 'furthest'])],
        ];
    }
}
