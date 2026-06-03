<?php

use App\Http\Controllers\Api\ProductController as PublicProductController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\ProductImageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Prefix  : /api  (auto-applied by Laravel)
| Auth    : Bearer token via Laravel Sanctum
|
*/

// ──────────────────────────────────────────────────────────────────────────
// PUBLIC — No authentication required
// ──────────────────────────────────────────────────────────────────────────

Route::prefix('products')->name('products.')->group(function (): void {
    Route::get('/', [PublicProductController::class, 'index'])->name('index');
    Route::get('/{id}', [PublicProductController::class, 'show'])->name('show');
});

// ──────────────────────────────────────────────────────────────────────────
// SELLER — Requires Sanctum Bearer token
// ──────────────────────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->prefix('seller')->name('seller.')->group(function (): void {
    /*
    |------------------------------------------------------------------
    | Seller Product CRUD
    | GET    /api/seller/products
    | POST   /api/seller/products
    | PUT    /api/seller/products/{id}
    | DELETE /api/seller/products/{id}
    |------------------------------------------------------------------
    */
    Route::get('products', [SellerProductController::class, 'index'])->name('products.index');
    Route::post('products', [SellerProductController::class, 'store'])->name('products.store');
    Route::get('products/{id}', [SellerProductController::class, 'show'])->name('products.show');
    Route::put('products/{id}', [SellerProductController::class, 'update'])->name('products.update');
    Route::delete('products/{id}', [SellerProductController::class, 'destroy'])->name('products.destroy');

    /*
    |------------------------------------------------------------------
    | Seller Product Images
    | GET    /api/seller/products/{productId}/images
    | POST   /api/seller/products/{productId}/images
    | PATCH  /api/seller/products/{productId}/images/{imageId}/primary
    | DELETE /api/seller/products/{productId}/images/{imageId}
    |------------------------------------------------------------------
    */
    Route::prefix('products/{productId}/images')->name('products.images.')->group(function (): void {
        Route::get('/', [ProductImageController::class, 'index'])->name('index');
        Route::post('/', [ProductImageController::class, 'store'])->name('store');
        Route::patch('/{imageId}/primary', [ProductImageController::class, 'setPrimary'])->name('set-primary');
        Route::delete('/{imageId}', [ProductImageController::class, 'destroy'])->name('destroy');
    });
});
