<?php

use App\Http\Controllers\Delivery\CourierLocationController;
use App\Http\Controllers\Delivery\DeliveryAssignmentController;
use App\Http\Controllers\Delivery\DeliveryDetailController;
use App\Http\Controllers\Delivery\DeliveryPoolController;
use App\Http\Controllers\Delivery\DeliveryTrackingController;
use App\Http\Controllers\Delivery\DeliveryTrackingLogController;
use App\Http\Controllers\Delivery\FailedDeliveryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('courier')->group(function (): void {
    Route::get('deliveries/available', DeliveryPoolController::class);
    Route::post('deliveries/{orderId}/take', DeliveryAssignmentController::class);
    Route::get('deliveries/{deliveryId}', DeliveryDetailController::class);
    Route::patch('deliveries/{deliveryId}/status', DeliveryTrackingController::class);
    Route::patch('deliveries/{deliveryId}/failed', FailedDeliveryController::class);
    Route::get('deliveries/{deliveryId}/tracking', DeliveryTrackingLogController::class);
    Route::post('deliveries/{deliveryId}/location', CourierLocationController::class);
});
