<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\FailedDeliveryRequest;
use App\Services\Delivery\FailedDeliveryService;
use Illuminate\Http\JsonResponse;

class FailedDeliveryController extends Controller
{
    public function __invoke(
        FailedDeliveryRequest $request,
        FailedDeliveryService $service,
        string $deliveryId
    ): JsonResponse {
        $service->markFailed($request->user(), $deliveryId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Delivery marked as failed',
        ]);
    }
}
