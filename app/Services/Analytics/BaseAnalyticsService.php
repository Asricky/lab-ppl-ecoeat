<?php

namespace App\Services\Analytics;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseAnalyticsService
{
    /**
     * Parse date range string.
     *
     * @param string|null $range
     * @return array
     */
    protected function parseRange(?string $range): array
    {
        return AnalyticsRangeParser::parse($range);
    }

    /**
     * Apply date range filter to a builder.
     *
     * @param Builder|\Illuminate\Database\Query\Builder $query
     * @param string $column
     * @param string|null $range
     * @return void
     */
    protected function applyDateFilter($query, string $column, ?string $range): void
    {
        $dates = $this->parseRange($range);
        $query->whereBetween($column, [$dates['start_date'], $dates['end_date']]);
    }
}
