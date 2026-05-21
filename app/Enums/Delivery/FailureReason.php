<?php

namespace App\Enums\Delivery;

enum FailureReason: string
{
    case RECIPIENT_NOT_FOUND = 'recipient_not_found';
    case ADDRESS_INVALID = 'address_invalid';
    case FOOD_DAMAGED = 'food_damaged';
    case RECIPIENT_REJECTED = 'recipient_rejected';
    case OTHER = 'other';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
