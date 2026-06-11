<?php

namespace App\Http\Controllers;

use App\Models\Product;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['seller', 'category'])
            ->where('status', 'active')
            ->where('stock', '>', 0);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $products = $query->latest()->get();

        return response()->json([
            'data' => $products,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()?->role !== 'seller') {
            return response()->json([
                'message' => 'Only seller can create product',
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['sale', 'donation'])],
            'price' => ['required_if:type,sale', 'nullable', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:1'],
            'expiry_date' => ['required', 'date', 'after:today'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $uploadedFileUrl = null;

        if ($request->hasFile('image')) {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'ecoeat/products',
                ]
            );

            $uploadedFileUrl = $uploadedFile['secure_url'];
        }

        $product = Product::create([
            'seller_id' => $request->user()->id,
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['type'] === 'donation' ? 0 : $validated['price'],
            'type' => $validated['type'],
            'stock' => $validated['stock'],
            'image_url' => $uploadedFileUrl,
            'expiry_date' => $validated['expiry_date'],
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }
}
