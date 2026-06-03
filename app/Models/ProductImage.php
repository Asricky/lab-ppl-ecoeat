<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    protected $table = 'product_images';

    protected $keyType = 'string';
    public $incrementing = false;

    // No timestamps columns in the table
    public $timestamps = false;

    protected $fillable = [
        'id',
        'product_id',
        'image_url',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Auto-generate UUID on creating.
     */
    protected static function booted(): void
    {
        static::creating(function (self $image): void {
            if (empty($image->id)) {
                $image->id = (string) Str::uuid();
            }
        });
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
