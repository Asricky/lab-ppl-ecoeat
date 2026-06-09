<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WishlistItem extends Model
{
    use HasUuids;

    protected $table = 'wishlist_items';

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * wishlist_items tidak memiliki kolom updated_at di schema.
     */
    public const UPDATED_AT = null;

    protected $guarded = [];

    // ── Relationships ──────────────────────────────────────

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
