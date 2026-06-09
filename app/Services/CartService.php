<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CartService
{
    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    /**
     * Pastikan produk aktif dan stok cukup.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    private function validateProduct(string $productId, int $quantity): Product
    {
        $product = Product::findOrFail($productId);

        if ($product->status !== 'active') {
            abort(422, 'Produk tidak tersedia atau sudah tidak aktif.');
        }

        if ($product->stock_quantity < $quantity) {
            abort(422, "Stok produk tidak mencukupi. Stok tersedia: {$product->stock_quantity}.");
        }

        return $product;
    }

    /**
     * Ambil CartItem milik buyer, lempar 404 jika tidak ditemukan.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    private function findOwnedItem(string $buyerId, string $cartItemId): CartItem
    {
        return CartItem::where('id', $cartItemId)
            ->where('buyer_id', $buyerId)
            ->firstOrFail();
    }

    // ──────────────────────────────────────────────
    // Cart Operations
    // ──────────────────────────────────────────────

    /**
     * GET /api/buyer/cart
     * Ambil semua item keranjang milik buyer beserta detail produk & gambar.
     */
    public function index(string $buyerId): array
    {
        $items = CartItem::where('buyer_id', $buyerId)
            ->with([
                'product' => fn ($q) => $q->with([
                    'sellerProfile',
                    'images' => fn ($qi) => $qi->where('is_primary', true)->limit(1),
                ]),
            ])
            ->orderByDesc('created_at')
            ->get();

        $subtotal = $items->sum(fn ($item) => $item->product
            ? $item->product->price * $item->quantity
            : 0
        );

        return [
            'items'    => $items,
            'total_items' => $items->count(),
            'subtotal' => $subtotal,
        ];
    }

    /**
     * POST /api/buyer/cart
     * Tambah produk ke keranjang.
     * Jika produk sudah ada di cart, tambahkan kuantitasnya.
     */
    public function addItem(string $buyerId, array $data): CartItem
    {
        $productId = $data['product_id'];
        $qty       = (int) $data['quantity'];

        return DB::transaction(function () use ($buyerId, $productId, $qty): CartItem {
            // Cek apakah sudah ada di cart
            $existing = CartItem::where('buyer_id', $buyerId)
                ->where('product_id', $productId)
                ->first();

            $newQty = $existing ? $existing->quantity + $qty : $qty;

            // Validasi produk & stok
            $this->validateProduct($productId, $newQty);

            if ($existing) {
                $existing->update(['quantity' => $newQty]);
                return $existing->fresh()->load('product.sellerProfile', 'product.images');
            }

            $item = CartItem::create([
                'buyer_id'   => $buyerId,
                'product_id' => $productId,
                'quantity'   => $qty,
            ]);

            return $item->load('product.sellerProfile', 'product.images');
        });
    }

    /**
     * PATCH /api/buyer/cart/{cartItemId}
     * Update kuantitas item di keranjang.
     */
    public function updateItem(string $buyerId, string $cartItemId, int $quantity): CartItem
    {
        return DB::transaction(function () use ($buyerId, $cartItemId, $quantity): CartItem {
            $item = $this->findOwnedItem($buyerId, $cartItemId);

            // Validasi stok
            $this->validateProduct($item->product_id, $quantity);

            $item->update(['quantity' => $quantity]);

            return $item->fresh()->load('product.sellerProfile', 'product.images');
        });
    }

    /**
     * DELETE /api/buyer/cart/{cartItemId}
     * Hapus satu item dari keranjang.
     */
    public function removeItem(string $buyerId, string $cartItemId): void
    {
        $item = $this->findOwnedItem($buyerId, $cartItemId);
        $item->delete();
    }

    /**
     * DELETE /api/buyer/cart
     * Kosongkan seluruh keranjang buyer.
     */
    public function clearCart(string $buyerId): int
    {
        return CartItem::where('buyer_id', $buyerId)->delete();
    }
}
