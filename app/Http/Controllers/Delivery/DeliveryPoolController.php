<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\GetAvailableDeliveryRequest;
use App\Http\Resources\Delivery\AvailableDeliveryResource;
use App\Services\Delivery\DeliveryPoolService;
use Illuminate\Http\JsonResponse;

class DeliveryPoolController extends Controller
{
    public function __invoke(GetAvailableDeliveryRequest $request, DeliveryPoolService $service): JsonResponse
    {
        $paginator = $service->available($request->user(), $request->validated('filter'));
        
        return response()->json([
            'success' => true,
            'data' => AvailableDeliveryResource::collection($paginator)->response()->getData(true),
        ]);
    }
}
