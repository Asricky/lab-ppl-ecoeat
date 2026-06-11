<?php

namespace App\Enums\Delivery;

enum CourierVerificationStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case RESUBMITTED = 'resubmitted';
}
