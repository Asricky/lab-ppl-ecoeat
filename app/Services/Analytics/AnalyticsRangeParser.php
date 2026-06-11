<?php

namespace App\Services\Analytics;

use Carbon\Carbon;

class AnalyticsRangeParser
{
    /**
     * Parse date range string into Carbon start and end dates.
     *
     * @param string|null $range
     * @return array{start_date: Carbon, end_date: Carbon}
     */
    public static function parse(?string $range): array
    {
        $now = Carbon::now();
        $range = $range ?? '7d';

        switch ($range) {
            case '30d':
                $startDate = $now->copy()->subDays(29)->startOfDay();
                $endDate = $now->copy()->endOfDay();
                break;
            case 'this_month':
                $startDate = $now->copy()->startOfMonth();
                $endDate = $now->copy()->endOfDay();
                break;
            case 'last_month':
                $startDate = $now->copy()->subMonth()->startOfMonth();
                $endDate = $now->copy()->subMonth()->endOfMonth();
                break;
            case 'ytd':
                $startDate = $now->copy()->startOfYear();
                $endDate = $now->copy()->endOfDay();
                break;
            case '7d':
            default:
                $startDate = $now->copy()->subDays(6)->startOfDay();
                $endDate = $now->copy()->endOfDay();
                break;
        }

        return [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}
