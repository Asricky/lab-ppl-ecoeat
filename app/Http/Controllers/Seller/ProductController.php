<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Services\ProductService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ProductService $productService)
    {
    }

    /**
     * GET /api/seller/products
     * List all products belonging to the authenticated seller.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage  = (int) $request->query('per_page', 15);
        $products = $this->productService->index($request->user()->id, $perPage);

        return $this->success($products, 'Daftar produk berhasil diambil.');
    }

    /**
     * POST /api/seller/products
     * Create a new product.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->store($request->user()->id, $request->validated());

        return $this->success($product, 'Produk berhasil dibuat.', 201);
    }

    /**
     * GET /api/seller/products/{id}
     * Show a single product (seller must own it).
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $product = $this->productService->show($request->user()->id, $id);

        return $this->success($product, 'Detail produk berhasil diambil.');
    }

    /**
     * PUT/PATCH /api/seller/products/{id}
     * Update a product.
     */
    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        $product = $this->productService->update($request->user()->id, $id, $request->validated());

        return $this->success($product, 'Produk berhasil diperbarui.');
    }

    /**
     * DELETE /api/seller/products/{id}
     * Delete a product.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->productService->destroy($request->user()->id, $id);

        return $this->success(null, 'Produk berhasil dihapus.');
    }
}
