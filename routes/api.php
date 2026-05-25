<?php

use App\Http\Controllers\AdminApprovalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
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
// User Profile Routes (authenticated)
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum'])
    ->prefix('user')
    ->group(function (): void {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::post('/profile', [UserController::class, 'updateProfile']);
    });

// ──────────────────────────────────────────────
// KYC Routes
// ──────────────────────────────────────────────
Route::post('/kyc/documents', [KycController::class, 'store']);

// ──────────────────────────────────────────────
// Admin Routes (admin role only)
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function (): void {
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
