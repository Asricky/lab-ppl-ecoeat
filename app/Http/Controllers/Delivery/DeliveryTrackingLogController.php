<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Resources\Delivery\DeliveryTrackingResource;
use App\Services\Delivery\DeliveryTrackingLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryTrackingLogController extends Controller
{
    public function __invoke(Request $request, DeliveryTrackingLogService $service, string $deliveryId): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => DeliveryTrackingResource::collection($service->history($request->user(), $deliveryId)),
        ]);
    }
}
