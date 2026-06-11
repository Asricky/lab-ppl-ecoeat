<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Requests\Analytics\AnalyticsRequest;
use App\Http\Resources\Analytics\CourierDashboardResource;
use App\Http\Resources\Analytics\CourierHistoryResource;
use App\Services\Analytics\CourierAnalyticsService;
use Illuminate\Http\JsonResponse;

class CourierAnalyticsController extends Controller
{
    public function __construct(private readonly CourierAnalyticsService $service)
    {
    }

    /**
     * Get Courier dashboard analytics.
     */
    public function dashboard(AnalyticsRequest $request): JsonResponse
    {
        $courierId = $request->user()->id;
        $range = $request->input('range', '7d');

        $data = $this->service->getDashboard($courierId, $range);

        return response()->json([
            'success' => true,
            'data' => new CourierDashboardResource($data),
        ]);
    }

    /**
     * Get Courier delivery history.
     */
    public function history(AnalyticsRequest $request): JsonResponse
    {
        $courierId = $request->user()->id;
        $range = $request->input('range', '7d');
        $perPage = (int) $request->input('per_page', 15);

        $paginated = $this->service->getHistory($courierId, $range, $perPage);

        return response()->json([
            'success' => true,
            'data' => CourierHistoryResource::collection($paginated)->response()->getData(true),
        ]);
    }
}
