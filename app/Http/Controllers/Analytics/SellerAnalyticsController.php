<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Http\Requests\Analytics\AnalyticsRequest;
use App\Http\Resources\Analytics\SellerDashboardAnalyticsResource;
use App\Http\Resources\Analytics\SellerTopProductResource;
use App\Services\Analytics\SellerAnalyticsService;
use Illuminate\Http\JsonResponse;

class SellerAnalyticsController extends Controller
{
    public function __construct(private readonly SellerAnalyticsService $service)
    {
    }

    /**
     * Get Seller dashboard analytics.
     */
    public function dashboard(AnalyticsRequest $request): JsonResponse
    {
        $sellerId = $request->user()->id;
        $range = $request->input('range', '7d');

        $data = $this->service->getDashboard($sellerId, $range);

        return response()->json([
            'success' => true,
            'data' => new SellerDashboardAnalyticsResource($data),
        ]);
    }

    /**
     * Get Seller top products.
     */
    public function topProducts(AnalyticsRequest $request): JsonResponse
    {
        $sellerId = $request->user()->id;
        $range = $request->input('range', '7d');
        $perPage = (int) $request->input('per_page', 15);

        $paginated = $this->service->getTopProducts($sellerId, $range, $perPage);

        return response()->json([
            'success' => true,
            'data' => SellerTopProductResource::collection($paginated)->response()->getData(true),
        ]);
    }

    /**
     * Get Seller revenue chart data.
     */
    public function revenueChart(AnalyticsRequest $request): JsonResponse
    {
        $sellerId = $request->user()->id;
        $range = $request->input('range', '7d');

        $data = $this->service->getRevenueChart($sellerId, $range);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
