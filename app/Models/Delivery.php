<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Delivery extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    public const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'courier_id',
        'pickup_address',
        'destination_address',
        'distance_km',
        'delivery_status',
        'estimated_arrival_time',
        'picked_up_at',
        'delivered_at',
        'lks_confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'distance_km' => 'decimal:2',
            'estimated_arrival_time' => 'datetime',
            'picked_up_at' => 'datetime',
            'delivered_at' => 'datetime',
            'lks_confirmed_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function courier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'courier_id');
    }

    public function trackingLogs(): HasMany
    {
        return $this->hasMany(DeliveryTrackingLog::class, 'delivery_id')->orderBy('created_at');
    }
}
