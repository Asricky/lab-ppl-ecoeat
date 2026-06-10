<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'timezone',
        'language',
        'notification_preferences',
    ];

    protected $casts = [
        'notification_preferences' => 'array',
    ];

    /**
     * Get the user that owns the setting.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
