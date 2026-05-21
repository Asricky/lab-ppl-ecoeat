<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Resources\Delivery\CourierDeliveryResource;
use App\Services\Delivery\DeliveryDetailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeliveryDetailController extends Controller
{
    public function __invoke(Request $request, DeliveryDetailService $service, string $deliveryId): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new CourierDeliveryResource($service->detail($request->user(), $deliveryId)),
        ]);
    }
}
