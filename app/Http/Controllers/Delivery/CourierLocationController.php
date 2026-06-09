<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\UpdateCourierLocationRequest;
use App\Services\Delivery\CourierLocationService;
use Illuminate\Http\JsonResponse;

class CourierLocationController extends Controller
{
    public function __invoke(
        UpdateCourierLocationRequest $request,
        CourierLocationService $service,
        string $deliveryId
    ): JsonResponse {
        $service->updateLocation($request->user(), $deliveryId, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Location updated',
        ]);
    }
}
