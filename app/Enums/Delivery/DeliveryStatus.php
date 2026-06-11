<?php

namespace App\Enums\Delivery;

enum DeliveryStatus: string
{
    case WAITING_LKS_CONFIRMATION = 'waiting_lks_confirmation';
    case ACCEPTED_BY_LKS = 'accepted_by_lks';
    case REJECTED_BY_LKS = 'rejected_by_lks';
    case AVAILABLE_FOR_COURIER = 'available_for_courier';
    case COURIER_ASSIGNED = 'courier_assigned';
    case PICKED_UP = 'picked_up';
    case ON_DELIVERY = 'on_delivery';
    case DELIVERED = 'delivered';
    case FAILED = 'failed';

    public static function activeCourierValues(): array
    {
        return [
            self::COURIER_ASSIGNED->value,
            self::PICKED_UP->value,
            self::ON_DELIVERY->value,
        ];
    }

    public static function courierProgressValues(): array
    {
        return [
            self::PICKED_UP->value,
            self::ON_DELIVERY->value,
            self::DELIVERED->value,
            self::FAILED->value,
        ];
    }
}
