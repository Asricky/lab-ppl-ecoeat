<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\SellerProfile;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ProductImageService
{
    // ──────────────────────────────────────────────
    // Private Helpers
    // ──────────────────────────────────────────────

    /**
     * Resolve SellerProfile from authenticated user ID.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
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
     * Find a product and verify it belongs to the given seller_profile_id.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    private function findOwnedProduct(string $productId, string $sellerProfileId): Product
    {
        $product = Product::findOrFail($productId);

        if ($product->seller_profile_id !== $sellerProfileId) {
            abort(403, 'Anda tidak memiliki akses ke produk ini.');
        }

        return $product;
    }

    /**
     * Upload a single file to Cloudinary and return the secure URL.
     *
     * @throws \RuntimeException
     */
    private function uploadToCloudinary(UploadedFile $file, string $productId): string
    {
        $result = Cloudinary::upload($file->getRealPath(), [
            'folder'         => 'ecoeat/products/' . $productId,
            'transformation' => [
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ],
        ]);

        $url = $result->getSecurePath();

        if (empty($url)) {
            throw new \RuntimeException('Gagal mendapatkan URL dari Cloudinary.');
        }

        return $url;
    }

    // ──────────────────────────────────────────────
    // Public Service Methods
    // ──────────────────────────────────────────────

    /**
     * Upload one or more images for a product.
     *
     * @param  int|string    $userId        Authenticated user ID
     * @param  string        $productId     Product UUID
     * @param  UploadedFile[] $files        Array of uploaded image files
     * @param  int|null      $primaryIndex  Index in $files array to mark as primary
     * @return ProductImage[]
     */
    public function uploadImages(
        int|string $userId,
        string $productId,
        array $files,
        ?int $primaryIndex = null
    ): array {
        $profile = $this->resolveSellerProfile($userId);
        $product = $this->findOwnedProduct($productId, $profile->id);

        // Determine if this product already has a primary image
        $hasPrimary = $product->images()->where('is_primary', true)->exists();

        $saved = [];

        DB::transaction(function () use ($files, $product, $primaryIndex, $hasPrimary, &$saved): void {
            foreach ($files as $index => $file) {
                $imageUrl = $this->uploadToCloudinary($file, $product->id);

                // First image is primary if: explicit index matches, or product has no primary yet and this is index 0
                $isPrimary = ($primaryIndex !== null)
                    ? ($index === $primaryIndex)
                    : (!$hasPrimary && $index === 0);

                // If setting a new primary, unset old primaries
                if ($isPrimary) {
                    $product->images()->where('is_primary', true)->update(['is_primary' => false]);
                }

                $saved[] = ProductImage::create([
                    'product_id' => $product->id,
                    'image_url'  => $imageUrl,
                    'is_primary' => $isPrimary,
                ]);
            }
        });

        return $saved;
    }

    /**
     * List all images for a product (seller must own the product).
     */
    public function listImages(int|string $userId, string $productId): \Illuminate\Database\Eloquent\Collection
    {
        $profile = $this->resolveSellerProfile($userId);
        $product = $this->findOwnedProduct($productId, $profile->id);

        return $product->images()->get();
    }

    /**
     * Set a specific image as primary (and unset others).
     */
    public function setPrimary(int|string $userId, string $productId, string $imageId): ProductImage
    {
        $profile = $this->resolveSellerProfile($userId);
        $product = $this->findOwnedProduct($productId, $profile->id);

        $image = $product->images()->where('id', $imageId)->first();

        if (!$image) {
            abort(404, 'Gambar tidak ditemukan pada produk ini.');
        }

        return DB::transaction(function () use ($product, $image): ProductImage {
            $product->images()->where('is_primary', true)->update(['is_primary' => false]);
            $image->update(['is_primary' => true]);

            return $image->fresh();
        });
    }

    /**
     * Delete a product image (also removes from Cloudinary).
     */
    public function deleteImage(int|string $userId, string $productId, string $imageId): void
    {
        $profile = $this->resolveSellerProfile($userId);
        $product = $this->findOwnedProduct($productId, $profile->id);

        $image = $product->images()->where('id', $imageId)->first();

        if (!$image) {
            abort(404, 'Gambar tidak ditemukan pada produk ini.');
        }

        DB::transaction(function () use ($image, $product): void {
            $image->delete();

            // If deleted image was primary, auto-promote the next image
            if ($image->is_primary) {
                $next = $product->images()->first();
                $next?->update(['is_primary' => true]);
            }
        });
    }
}
