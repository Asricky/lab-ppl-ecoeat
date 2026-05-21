<?php

namespace App\Enums\Delivery;

enum OrderStatus: string
{
    case WAITING_PAYMENT = 'waiting_payment';
    case PAID = 'paid';
    case PROCESSING = 'processing';
    case READY_FOR_DELIVERY = 'ready_for_delivery';
    case IN_DELIVERY = 'in_delivery';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';
}
