<?php

namespace App\Http\Controllers;

use App\Http\Requests\Product\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['seller', 'category'])
            ->where('status', 'active')
            ->get();

        return response()->json($products);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
                $data['image_url'] = $uploadedFileUrl;
            }

            $data['seller_id'] = auth()->id();

            $product = Product::create($data);

            DB::commit();

            return response()->json([
                'message' => 'Product created successfully.',
                'data' => $product->load(['seller', 'category']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load(['seller', 'category']));
    }


}