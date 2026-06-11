<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\AssignDeliveryRequest;
use App\Services\Delivery\DeliveryAssignmentService;
use Illuminate\Http\JsonResponse;

class DeliveryAssignmentController extends Controller
{
    public function __invoke(
        AssignDeliveryRequest $request,
        DeliveryAssignmentService $service,
        string $orderId
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => 'Delivery assigned successfully',
            'data' => $service->assign($request->user(), $orderId),
        ]);
    }
}
