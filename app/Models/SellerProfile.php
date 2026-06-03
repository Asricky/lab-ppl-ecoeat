<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerProfile extends Model
{
    protected $table = 'seller_profiles';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        // add other seller_profiles columns as needed
    ];

    /**
     * Products owned by this seller.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_profile_id', 'id');
    }
}
