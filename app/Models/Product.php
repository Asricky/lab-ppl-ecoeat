<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $table = 'products';

    protected $keyType = 'string';
    public $incrementing = false;

    // The DB already has created_at; no updated_at assumed unless confirmed
    public $timestamps = false;

    protected $fillable = [
        'id',
        'seller_profile_id',
        'title',
        'description',
        'price',
        'original_price',
        'stock_quantity',
        'portion_quantity',
        'expiry_date',
        'is_donation',
        'target_lks_id',
        'status',
        'created_at',
    ];

    protected $casts = [
        'price'           => 'decimal:2',
        'original_price'  => 'decimal:2',
        'stock_quantity'  => 'integer',
        'portion_quantity'=> 'integer',
        'expiry_date'     => 'datetime',
        'is_donation'     => 'boolean',
        'created_at'      => 'datetime',
    ];

    /**
     * Auto-generate UUID on creating.
     */
    protected static function booted(): void
    {
        static::creating(function (self $product): void {
            if (empty($product->id)) {
                $product->id = (string) Str::uuid();
            }
            if (empty($product->created_at)) {
                $product->created_at = now();
            }
        });
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function sellerProfile(): BelongsTo
    {
        return $this->belongsTo(SellerProfile::class, 'seller_profile_id', 'id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id')
            ->orderByDesc('is_primary');
    }
}
