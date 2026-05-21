<?php

use App\Http\Controllers\AdminApprovalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\ProductController;
use App\Models\KycDocument;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/kyc/documents', [KycController::class, 'store']);

Route::middleware(['auth:sanctum'])
    ->prefix('admin')
    ->group(function (): void {
        Route::post('/users/{user}/approve', [AdminApprovalController::class, 'approve']);
        Route::post('/users/{user}/reject', [AdminApprovalController::class, 'reject']);
        
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

Route::middleware(['auth:sanctum'])
    ->prefix('products')
    ->group(function (): void {
        Route::get('/', [ProductController::class, 'index']);
        Route::post('/', [ProductController::class, 'store']);
        Route::get('/{product}', [ProductController::class, 'show']);
    });

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/test/users', function () {
    return User::all();
});

Route::get('/test/kyc', function () {
    return KycDocument::all();
});
