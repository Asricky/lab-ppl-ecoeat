<?php

namespace App\Http\Controllers\Donation;

use App\Http\Controllers\Controller;
use App\Http\Resources\Donation\DashboardResource;
use App\Services\Donation\LksDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LksDashboardController extends Controller
{
    public function __construct(private readonly LksDashboardService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'lks') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $stats = $this->service->getStatistics($request->user());

        return response()->json([
            'success' => true,
            'message' => 'LKS Dashboard statistics retrieved successfully',
            'data' => new DashboardResource($stats)
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'lks') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $history = $this->service->getHistory($request->user());

        return response()->json([
            'success' => true,
            'message' => 'LKS Donation history retrieved successfully',
            'data' => $history // Simplification for testability, format optimally as needed
        ]);
    }
}
