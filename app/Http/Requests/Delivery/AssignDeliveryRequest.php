<?php

namespace App\Http\Requests\Delivery;

class AssignDeliveryRequest extends BaseCourierRequest
{
    public function authorize(): bool
    {
        return parent::authorize();
    }

    public function rules(): array
    {
        return [];
    }
}
