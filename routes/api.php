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

Route::middleware('auth:sanctum')->group(function (): void {
    Route::prefix('seller')->group(function (): void {
        Route::post('donations', [\App\Http\Controllers\Donation\SellerDonationController::class, 'store']);
    });
    
    Route::prefix('lks')->group(function (): void {
        Route::get('donations/incoming', [\App\Http\Controllers\Donation\LksDonationController::class, 'incoming']);
        Route::patch('donations/{deliveryId}/accept', [\App\Http\Controllers\Donation\LksDonationController::class, 'accept']);
        Route::patch('donations/{deliveryId}/reject', [\App\Http\Controllers\Donation\LksDonationController::class, 'reject']);
        Route::get('donations/history', [\App\Http\Controllers\Donation\LksDashboardController::class, 'history']);
        Route::get('dashboard', [\App\Http\Controllers\Donation\LksDashboardController::class, 'index']);
    });
});

// Analytics Route Groups
use App\Http\Controllers\Analytics\SellerAnalyticsController;
use App\Http\Controllers\Analytics\CourierAnalyticsController;
use App\Http\Controllers\Analytics\LksAnalyticsController;
use App\Http\Controllers\Analytics\AdminAnalyticsController;

Route::middleware(['auth:sanctum', 'role:seller'])->prefix('seller/analytics')->group(function (): void {
    Route::get('dashboard', [SellerAnalyticsController::class, 'dashboard']);
    Route::get('top-products', [SellerAnalyticsController::class, 'topProducts']);
    Route::get('revenue-chart', [SellerAnalyticsController::class, 'revenueChart']);
});

Route::middleware(['auth:sanctum', 'role:courier'])->prefix('courier/analytics')->group(function (): void {
    Route::get('dashboard', [CourierAnalyticsController::class, 'dashboard']);
    Route::get('history', [CourierAnalyticsController::class, 'history']);
});

Route::middleware(['auth:sanctum', 'role:lks'])->prefix('lks/analytics')->group(function (): void {
    Route::get('dashboard', [LksAnalyticsController::class, 'dashboard']);
    Route::get('top-sellers', [LksAnalyticsController::class, 'topSellers']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin/analytics')->group(function (): void {
    Route::get('dashboard', [AdminAnalyticsController::class, 'dashboard']);
    Route::get('verifications', [AdminAnalyticsController::class, 'verifications']);
    Route::get('transactions', [AdminAnalyticsController::class, 'transactions']);
});

use App\Http\Controllers\Admin\AdminVerificationController;
use App\Http\Controllers\Admin\AdminTransactionController;
use App\Http\Controllers\Admin\AdminExportController;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function (): void {
    // Verification Moderation
    Route::get('verifications', [AdminVerificationController::class, 'index']);
    Route::patch('verifications/{userId}/approve', [AdminVerificationController::class, 'approve']);
    Route::patch('verifications/{userId}/reject', [AdminVerificationController::class, 'reject']);
    Route::patch('verifications/{userId}/undo', [AdminVerificationController::class, 'undo']);

    // Transaction Monitoring
    Route::get('transactions', [AdminTransactionController::class, 'index']);
    Route::get('transactions/{id}', [AdminTransactionController::class, 'show']);
    Route::get('withdrawals', [AdminTransactionController::class, 'indexWithdrawals']);
    Route::get('withdrawals/{id}', [AdminTransactionController::class, 'showWithdrawal']);

    // Streamed CSV Exports
    Route::get('export/users', [AdminExportController::class, 'exportUsers']);
    Route::get('export/transactions', [AdminExportController::class, 'exportTransactions']);
    Route::get('export/reports', [AdminExportController::class, 'exportReports']);
});


