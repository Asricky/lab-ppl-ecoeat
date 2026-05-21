<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'category_id',
        'lks_id',
        'name',
        'description',
        'discount_price',
        'type',
        'portion',
        'image_url',
        'expiry_date',
        'status',
    ];

    protected $casts = [
        'discount_price' => 'decimal:2',
        'expiry_date' => 'date',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function lks(): BelongsTo
    {
        return $this->belongsTo(Lks::class);
    }
}