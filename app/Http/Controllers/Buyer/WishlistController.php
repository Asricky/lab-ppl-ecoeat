<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Wishlist\AddToWishlistRequest;
use App\Services\WishlistService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly WishlistService $wishlistService)
    {
    }

    /**
     * GET /api/buyer/wishlist
     * Tampilkan semua produk di wishlist buyer (paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage  = (int) $request->query('per_page', 15);
        $wishlist = $this->wishlistService->index($request->user()->id, $perPage);

        return $this->success($wishlist, 'Wishlist berhasil diambil.');
    }

    /**
     * POST /api/buyer/wishlist
     * Tambah produk ke wishlist.
     * Mengembalikan 422 jika produk sudah ada di wishlist.
     */
    public function store(AddToWishlistRequest $request): JsonResponse
    {
        $item = $this->wishlistService->addItem(
            $request->user()->id,
            $request->validated('product_id')
        );

        return $this->success($item, 'Produk berhasil ditambahkan ke wishlist.', 201);
    }

    /**
     * DELETE /api/buyer/wishlist/{wishlistItemId}
     * Hapus satu item dari wishlist.
     */
    public function destroy(Request $request, string $wishlistItemId): JsonResponse
    {
        $this->wishlistService->removeItem($request->user()->id, $wishlistItemId);

        return $this->success(null, 'Produk berhasil dihapus dari wishlist.');
    }

    /**
     * DELETE /api/buyer/wishlist
     * Kosongkan seluruh wishlist.
     */
    public function clear(Request $request): JsonResponse
    {
        $deleted = $this->wishlistService->clearWishlist($request->user()->id);

        return $this->success(
            ['deleted_count' => $deleted],
            'Wishlist berhasil dikosongkan.'
        );
    }

    /**
     * GET /api/buyer/wishlist/check?product_id={uuid}
     * Cek apakah sebuah produk sudah ada di wishlist buyer.
     * Berguna untuk update status ikon hati di frontend.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => ['required', 'uuid'],
        ]);

        $wishlisted = $this->wishlistService->isWishlisted(
            $request->user()->id,
            $request->query('product_id')
        );

        return $this->success(
            ['is_wishlisted' => $wishlisted],
            'Status wishlist berhasil dicek.'
        );
    }
}
