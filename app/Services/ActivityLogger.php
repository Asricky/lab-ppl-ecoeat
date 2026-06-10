<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    /**
     * Log a new activity.
     */
    public static function log(
        string $action,
        ?string $description = null,
        array $properties = [],
        ?int $userId = null
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'description' => $description,
            'properties' => $properties,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
