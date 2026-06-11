<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\UpdateDeliveryStatusRequest;
use App\Services\Delivery\DeliveryTrackingService;
use Illuminate\Http\JsonResponse;

class DeliveryTrackingController extends Controller
{
    public function __invoke(
        UpdateDeliveryStatusRequest $request,
        DeliveryTrackingService $service,
        string $deliveryId
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => 'Delivery status updated',
            'data' => $service->updateStatus($request->user(), $deliveryId, $request->validated()),
        ]);
    }
}
