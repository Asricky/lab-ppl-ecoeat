<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Public product endpoints — accessible by any user (no auth required).
 */
class ProductController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/products
     * List all active products (all sellers, paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);

        $products = Product::where('status', 'active')
            ->with('sellerProfile')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return $this->success($products, 'Daftar produk berhasil diambil.');
    }

    /**
     * GET /api/products/{id}
     * Show a single active product detail.
     */
    public function show(string $id): JsonResponse
    {
        $product = Product::where('id', $id)
            ->where('status', 'active')
            ->with('sellerProfile')
            ->first();

        if (!$product) {
            return $this->error('Produk tidak ditemukan.', 404);
        }

        return $this->success($product, 'Detail produk berhasil diambil.');
    }
}
