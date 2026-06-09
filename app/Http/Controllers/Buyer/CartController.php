<?php

namespace App\Http\Controllers\Buyer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Services\CartService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CartService $cartService)
    {
    }

    /**
     * GET /api/buyer/cart
     * Tampilkan semua item di keranjang buyer yang sedang login.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->index($request->user()->id);

        return $this->success($cart, 'Keranjang berhasil diambil.');
    }

    /**
     * POST /api/buyer/cart
     * Tambah produk ke keranjang.
     * Jika produk sudah ada, kuantitasnya akan ditambah.
     */
    public function store(AddToCartRequest $request): JsonResponse
    {
        $item = $this->cartService->addItem(
            $request->user()->id,
            $request->validated()
        );

        return $this->success($item, 'Produk berhasil ditambahkan ke keranjang.', 201);
    }

    /**
     * PATCH /api/buyer/cart/{cartItemId}
     * Update kuantitas item di keranjang.
     */
    public function update(UpdateCartItemRequest $request, string $cartItemId): JsonResponse
    {
        $item = $this->cartService->updateItem(
            $request->user()->id,
            $cartItemId,
            $request->validated('quantity')
        );

        return $this->success($item, 'Jumlah item berhasil diperbarui.');
    }

    /**
     * DELETE /api/buyer/cart/{cartItemId}
     * Hapus satu item dari keranjang.
     */
    public function destroy(Request $request, string $cartItemId): JsonResponse
    {
        $this->cartService->removeItem($request->user()->id, $cartItemId);

        return $this->success(null, 'Item berhasil dihapus dari keranjang.');
    }

    /**
     * DELETE /api/buyer/cart
     * Kosongkan seluruh keranjang.
     */
    public function clear(Request $request): JsonResponse
    {
        $deleted = $this->cartService->clearCart($request->user()->id);

        return $this->success(
            ['deleted_count' => $deleted],
            'Keranjang berhasil dikosongkan.'
        );
    }
}
