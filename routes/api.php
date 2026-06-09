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
<<<<<<< Updated upstream
=======

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

use App\Http\Controllers\Api\ProductController as PublicProductController;
use App\Http\Controllers\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Seller\ProductImageController;


Route::prefix('products')->name('products.')->group(function (): void {
    Route::get('/', [PublicProductController::class, 'index'])->name('index');
    Route::get('/{id}', [PublicProductController::class, 'show'])->name('show');
});


<<<<<<< Updated upstream
Route::middleware('auth:sanctum')->prefix('seller')->name('seller.')->group(function (): void {
=======
Route::middleware(['auth:sanctum', 'role:seller'])->prefix('seller')->name('seller.')->group(function (): void {
>>>>>>> Stashed changes

    Route::get('products', [SellerProductController::class, 'index'])->name('products.index');
    Route::post('products', [SellerProductController::class, 'store'])->name('products.store');
    Route::get('products/{id}', [SellerProductController::class, 'show'])->name('products.show');
    Route::put('products/{id}', [SellerProductController::class, 'update'])->name('products.update');
    Route::delete('products/{id}', [SellerProductController::class, 'destroy'])->name('products.destroy');

    Route::prefix('products/{productId}/images')->name('products.images.')->group(function (): void {
        Route::get('/', [ProductImageController::class, 'index'])->name('index');
        Route::post('/', [ProductImageController::class, 'store'])->name('store');
        Route::patch('/{imageId}/primary', [ProductImageController::class, 'setPrimary'])->name('set-primary');
        Route::delete('/{imageId}', [ProductImageController::class, 'destroy'])->name('destroy');
    });
});

use App\Http\Controllers\Buyer\CartController;
use App\Http\Controllers\Buyer\WishlistController;

// Buyer Cart & Wishlist Routes
<<<<<<< Updated upstream
Route::middleware('auth:sanctum')->prefix('buyer')->name('buyer.')->group(function (): void {
=======
Route::middleware(['auth:sanctum', 'role:buyer'])->prefix('buyer')->name('buyer.')->group(function (): void {
>>>>>>> Stashed changes
    // ── Cart ─────────────────────────────────────────────────────────
    // GET    /api/buyer/cart               → tampilkan isi keranjang + subtotal
    // POST   /api/buyer/cart               → tambah item (auto-merge jika duplikat)
    // PATCH  /api/buyer/cart/{cartItemId}  → update kuantitas item
    // DELETE /api/buyer/cart/{cartItemId}  → hapus satu item
    // DELETE /api/buyer/cart               → kosongkan semua keranjang
    Route::get('cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('cart/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('cart/{cartItemId}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::delete('cart', [CartController::class, 'clear'])->name('cart.clear');

    // ── Wishlist ──────────────────────────────────────────────────────
    // GET    /api/buyer/wishlist                    → daftar produk favorit (paginated)
    // GET    /api/buyer/wishlist/check?product_id=  → cek status wishlist sebuah produk
    // POST   /api/buyer/wishlist                    → tambah produk ke wishlist
    // DELETE /api/buyer/wishlist/{wishlistItemId}   → hapus satu item
    // DELETE /api/buyer/wishlist                    → kosongkan semua wishlist
    Route::get('wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::get('wishlist/check', [WishlistController::class, 'check'])->name('wishlist.check');
    Route::post('wishlist', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('wishlist/{wishlistItemId}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::delete('wishlist', [WishlistController::class, 'clear'])->name('wishlist.clear');
<<<<<<< Updated upstream
});
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======

    // ── Checkout ──────────────────────────────────────────────────────
    Route::post('checkout/direct', [\App\Http\Controllers\Buyer\CheckoutController::class, 'storeDirect'])->name('checkout.direct');
    Route::post('checkout/cart', [\App\Http\Controllers\Buyer\CheckoutController::class, 'storeCart'])->name('checkout.cart');

    // ── Orders ────────────────────────────────────────────────────────
    Route::get('orders', [\App\Http\Controllers\Buyer\OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{id}', [\App\Http\Controllers\Buyer\OrderController::class, 'show'])->name('orders.show');
    Route::patch('orders/{id}/cancel', [\App\Http\Controllers\Buyer\OrderController::class, 'cancel'])->name('orders.cancel');

    // ── Reviews ───────────────────────────────────────────────────────
    Route::post('orders/{orderId}/reviews', [\App\Http\Controllers\Buyer\ReviewController::class, 'store'])->name('reviews.store');
});
>>>>>>> Stashed changes
