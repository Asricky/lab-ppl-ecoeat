<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductImageRequest;
use App\Services\ProductImageService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ProductImageService $imageService)
    {
    }

    /**
     * GET /api/seller/products/{productId}/images
     * List all images for a product.
     */
    public function index(Request $request, string $productId): JsonResponse
    {
        $images = $this->imageService->listImages($request->user()->id, $productId);

        return $this->success($images, 'Daftar gambar produk berhasil diambil.');
    }

    /**
     * POST /api/seller/products/{productId}/images
     * Upload one or more images to a product.
     */
    public function store(StoreProductImageRequest $request, string $productId): JsonResponse
    {
        $files        = $request->file('images');
        $primaryIndex = $request->input('primary_index');

        $images = $this->imageService->uploadImages(
            $request->user()->id,
            $productId,
            $files,
            $primaryIndex !== null ? (int) $primaryIndex : null,
        );

        return $this->success($images, 'Gambar produk berhasil diupload.', 201);
    }

    /**
     * PATCH /api/seller/products/{productId}/images/{imageId}/primary
     * Set a specific image as the primary image.
     */
    public function setPrimary(Request $request, string $productId, string $imageId): JsonResponse
    {
        $image = $this->imageService->setPrimary($request->user()->id, $productId, $imageId);

        return $this->success($image, 'Gambar utama berhasil diperbarui.');
    }

    /**
     * DELETE /api/seller/products/{productId}/images/{imageId}
     * Delete a specific image.
     */
    public function destroy(Request $request, string $productId, string $imageId): JsonResponse
    {
        $this->imageService->deleteImage($request->user()->id, $productId, $imageId);

        return $this->success(null, 'Gambar berhasil dihapus.');
    }
}
