<?php

use App\Http\Controllers\AdminApprovalController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WalletController;
use App\Models\KycDocument;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/kyc/documents', [KycController::class, 'store']);
Route::get('/analytics', [AnalyticsController::class, 'index']);
Route::get('/map/sellers', [MapController::class, 'sellers']);
Route::get('/products', [ProductController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function (): void {
    Route::get('/wallet', [WalletController::class, 'show']);
    Route::post('/wallet/topup', [WalletController::class, 'topup']);
    Route::post('/orders/{order}/assign', [DeliveryController::class, 'assignCourier']);
    Route::post('/orders/{order}/start', [DeliveryController::class, 'startDelivery']);
    Route::post('/orders/{order}/complete', [DeliveryController::class, 'completeDelivery']);
    Route::post('/orders/{order}/cancel', [DeliveryController::class, 'cancel']);
    Route::post('/orders/{order}/checkout', [OrderController::class, 'checkout']);
    Route::post('/orders/{order}/feedback', [FeedbackController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/products', [ProductController::class, 'store']);
});

Route::middleware(['auth:sanctum'])
    ->prefix('admin')
    ->group(function (): void {
        Route::post('/users/{user}/approve', [AdminApprovalController::class, 'approve']);
        Route::post('/users/{user}/reject', [AdminApprovalController::class, 'reject']);
    });

Route::get('/test/users', function () {
    return User::all();
});

Route::get('/test/kyc', function () {
    return KycDocument::all();
});

Route::get('/test/products', function () {
    return Product::all();
});
