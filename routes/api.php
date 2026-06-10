<?php

use App\Http\Controllers\AdminApprovalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserSettingController;
use Illuminate\Support\Facades\Route;

// ──────────────────────────────────────────────
// Public Auth Routes (no authentication required)
// ──────────────────────────────────────────────
Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

// ──────────────────────────────────────────────
// Authenticated Auth Routes
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum'])
    ->prefix('auth')
    ->group(function (): void {
        Route::post('/logout', [AuthController::class, 'logout']);
    });

// ──────────────────────────────────────────────
// User Profile & KYC Routes (authenticated)
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum'])
    ->prefix('user')
    ->group(function (): void {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::post('/profile', [UserController::class, 'updateProfile']);
        Route::get('/settings', [UserSettingController::class, 'show']);
        Route::put('/settings', [UserSettingController::class, 'update']);
        Route::get('/kyc', [KycController::class, 'index']);
    });

// ──────────────────────────────────────────────
// KYC Routes (public or authenticated)
// ──────────────────────────────────────────────
Route::post('/kyc/documents', [KycController::class, 'store']);

// ──────────────────────────────────────────────
// Admin Routes (admin role only)
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function (): void {
        Route::get('/users/pending', [AdminApprovalController::class, 'pendingUsers']);
        Route::post('/users/{user}/approve', [AdminApprovalController::class, 'approve']);
        Route::post('/users/{user}/reject', [AdminApprovalController::class, 'reject']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

// ──────────────────────────────────────────────
// Product Routes (seller creates, all authenticated can view)
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum'])
    ->prefix('products')
    ->group(function (): void {
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store'])->middleware('role:seller');
        Route::get('/{product}', [ProductController::class, 'show']);
    });

// ──────────────────────────────────────────────
// Public Routes
// ──────────────────────────────────────────────
Route::get('/categories', [CategoryController::class, 'index']);

// ──────────────────────────────────────────────
// Notification Routes (authenticated)
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum'])
    ->prefix('notifications')
    ->group(function (): void {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
    });
