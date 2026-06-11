<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Requests\Analytics\AnalyticsRequest;
use App\Http\Resources\Analytics\LksDashboardAnalyticsResource;
use App\Http\Resources\Analytics\LksTopSellerResource;
use App\Services\Analytics\LksAnalyticsService;
use Illuminate\Http\JsonResponse;

class LksAnalyticsController extends Controller
{
    public function __construct(private readonly LksAnalyticsService $service)
    {
    }

    /**
     * Get LKS dashboard analytics.
     */
    public function dashboard(AnalyticsRequest $request): JsonResponse
    {
        $lksUserId = $request->user()->id;
        $range = $request->input('range', '7d');

        $data = $this->service->getDashboard($lksUserId, $range);

        return response()->json([
            'success' => true,
            'data' => new LksDashboardAnalyticsResource($data),
        ]);
    }

    /**
     * Get LKS top donating sellers.
     */
    public function topSellers(AnalyticsRequest $request): JsonResponse
    {
        $lksUserId = $request->user()->id;
        $range = $request->input('range', '7d');
        $perPage = (int) $request->input('per_page', 15);

        $paginated = $this->service->getTopSellers($lksUserId, $range, $perPage);

        return response()->json([
            'success' => true,
            'data' => LksTopSellerResource::collection($paginated)->response()->getData(true),
        ]);
    }
}
