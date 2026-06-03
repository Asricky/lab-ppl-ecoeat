<?php

namespace App\Services;

use App\Models\Product;
use App\Models\SellerProfile;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductService
{
    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    /**
     * Resolve the SellerProfile that belongs to the authenticated user.
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    private function resolveSellerProfile(int|string $userId): SellerProfile
    {
        $profile = SellerProfile::where('user_id', $userId)->first();

        if (!$profile) {
            abort(403, 'Akun Anda tidak terdaftar sebagai seller.');
        }

        return $profile;
    }

    /**
     * Find a product and verify ownership by the given seller_profile_id.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    private function findOwnedProduct(string $productId, string $sellerProfileId): Product
    {
        $product = Product::findOrFail($productId);

        if ($product->seller_profile_id !== $sellerProfileId) {
            abort(403, 'Anda tidak memiliki akses ke produk ini.');
        }

        return $product;
    }

    // ──────────────────────────────────────────────
    // CRUD Operations
    // ──────────────────────────────────────────────

    /**
     * List all products owned by the authenticated seller (paginated).
     */
    public function index(int|string $userId, int $perPage = 15): LengthAwarePaginator
    {
        $profile = $this->resolveSellerProfile($userId);

        return Product::where('seller_profile_id', $profile->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * Create a new product for the authenticated seller.
     */
    public function store(int|string $userId, array $data): Product
    {
        $profile = $this->resolveSellerProfile($userId);

        return DB::transaction(function () use ($profile, $data): Product {
            return Product::create([
                'seller_profile_id' => $profile->id,
                'title'             => $data['title'],
                'description'       => $data['description'],
                'price'             => $data['price'],
                'original_price'    => $data['original_price'] ?? null,
                'stock_quantity'    => $data['stock_quantity'],
                'portion_quantity'  => $data['portion_quantity'],
                'expiry_date'       => $data['expiry_date'],
                'is_donation'       => $data['is_donation'] ?? false,
                'target_lks_id'     => $data['target_lks_id'] ?? null,
                'status'            => $data['status'] ?? 'active',
            ]);
        });
    }

    /**
     * Show a single product (only if owned by the seller).
     */
    public function show(int|string $userId, string $productId): Product
    {
        $profile = $this->resolveSellerProfile($userId);

        return $this->findOwnedProduct($productId, $profile->id);
    }

    /**
     * Update an existing product.
     */
    public function update(int|string $userId, string $productId, array $data): Product
    {
        $profile = $this->resolveSellerProfile($userId);
        $product = $this->findOwnedProduct($productId, $profile->id);

        return DB::transaction(function () use ($product, $data): Product {
            $product->fill(array_filter($data, fn ($v) => !is_null($v)));
            $product->save();

            return $product->fresh();
        });
    }

    /**
     * Delete a product.
     */
    public function destroy(int|string $userId, string $productId): void
    {
        $profile = $this->resolveSellerProfile($userId);
        $product = $this->findOwnedProduct($productId, $profile->id);

        DB::transaction(fn () => $product->delete());
    }
}
