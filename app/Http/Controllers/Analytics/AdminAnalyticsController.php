<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Requests\Analytics\AnalyticsRequest;
use App\Http\Resources\Analytics\AdminDashboardAnalyticsResource;
use App\Http\Resources\Analytics\AdminVerificationAnalyticsResource;
use App\Http\Resources\Analytics\AdminTransactionAnalyticsResource;
use App\Services\Analytics\AdminAnalyticsService;
use Illuminate\Http\JsonResponse;

class AdminAnalyticsController extends Controller
{
    public function __construct(private readonly AdminAnalyticsService $service)
    {
    }

    /**
     * Get Admin dashboard analytics.
     */
    public function dashboard(AnalyticsRequest $request): JsonResponse
    {
        $range = $request->input('range', '7d');

        $data = $this->service->getDashboard($range);

        return response()->json([
            'success' => true,
            'data' => new AdminDashboardAnalyticsResource($data),
        ]);
    }

    /**
     * Get Admin verification stats.
     */
    public function verifications(AnalyticsRequest $request): JsonResponse
    {
        $range = $request->input('range', '7d');

        $data = $this->service->getVerifications($range);

        return response()->json([
            'success' => true,
            'data' => new AdminVerificationAnalyticsResource($data),
        ]);
    }

    /**
     * Get Admin transaction stats.
     */
    public function transactions(AnalyticsRequest $request): JsonResponse
    {
        $range = $request->input('range', '7d');

        $data = $this->service->getTransactions($range);

        return response()->json([
            'success' => true,
            'data' => new AdminTransactionAnalyticsResource($data),
        ]);
    }
}
