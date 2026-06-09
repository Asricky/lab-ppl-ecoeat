<?php

namespace App\Services;

use App\Models\Product;
use App\Models\WishlistItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class WishlistService
{
    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    /**
     * Cari WishlistItem milik buyer, lempar 404 jika tidak ada.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    private function findOwnedItem(string $buyerId, string $wishlistItemId): WishlistItem
    {
        return WishlistItem::where('id', $wishlistItemId)
            ->where('buyer_id', $buyerId)
            ->firstOrFail();
    }

    // ──────────────────────────────────────────────
    // Wishlist Operations
    // ──────────────────────────────────────────────

    /**
     * GET /api/buyer/wishlist
     * Ambil semua item wishlist buyer beserta detail produk & gambar utama.
     */
    public function index(string $buyerId, int $perPage = 15): LengthAwarePaginator
    {
        return WishlistItem::where('buyer_id', $buyerId)
            ->with([
                'product' => fn ($q) => $q->with([
                    'sellerProfile',
                    'images' => fn ($qi) => $qi->where('is_primary', true)->limit(1),
                ]),
            ])
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * POST /api/buyer/wishlist
     * Tambah produk ke wishlist.
     * Jika produk sudah ada di wishlist → kembalikan error 422 (bukan duplikat).
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function addItem(string $buyerId, string $productId): WishlistItem
    {
        // Pastikan produk ada
        $product = Product::findOrFail($productId);

        // Cek duplikat
        $existing = WishlistItem::where('buyer_id', $buyerId)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            abort(422, 'Produk sudah ada di wishlist Anda.');
        }

        return DB::transaction(function () use ($buyerId, $product): WishlistItem {
            $item = WishlistItem::create([
                'buyer_id'   => $buyerId,
                'product_id' => $product->id,
            ]);

            return $item->load('product.sellerProfile', 'product.images');
        });
    }

    /**
     * DELETE /api/buyer/wishlist/{wishlistItemId}
     * Hapus satu item dari wishlist.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function removeItem(string $buyerId, string $wishlistItemId): void
    {
        $item = $this->findOwnedItem($buyerId, $wishlistItemId);
        $item->delete();
    }

    /**
     * DELETE /api/buyer/wishlist
     * Kosongkan seluruh wishlist buyer.
     */
    public function clearWishlist(string $buyerId): int
    {
        return WishlistItem::where('buyer_id', $buyerId)->delete();
    }

    /**
     * Cek apakah sebuah produk sudah ada di wishlist buyer.
     * Berguna untuk toggle indicator di frontend.
     */
    public function isWishlisted(string $buyerId, string $productId): bool
    {
        return WishlistItem::where('buyer_id', $buyerId)
            ->where('product_id', $productId)
            ->exists();
    }
}
