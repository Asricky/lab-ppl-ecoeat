<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class KycController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'document_type' => ['required', 'string', Rule::in(['ktp', 'nib', 'sim'])],
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ]);

        $file = $request->file('file');

        try {
            $uploadedFile = Cloudinary::uploadApi()->upload(
                $file->getRealPath(),
                [
                    'folder' => 'ecoeat/kyc/'.$validated['user_id'],
                    'resource_type' => 'auto',
                ]
            );

            $fileUrl = $uploadedFile['secure_url'] ?? $uploadedFile['url'] ?? null;

            if (! is_string($fileUrl) || $fileUrl === '') {
                throw new RuntimeException('Cloudinary upload did not return a valid file URL.');
            }
        } catch (Throwable $exception) {
            Log::error('KYC upload to Cloudinary failed.', [
                'user_id' => $validated['user_id'],
                'document_type' => $validated['document_type'],
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'KYC upload failed. Please verify Cloudinary configuration and try again.',
            ], 500);
        }

        $kyc = KycDocument::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'document_type' => $validated['document_type'],
            ],
            [
                'file_url' => $fileUrl,
                'status' => 'pending',
            ]
        );

        return response()->json([
            'message' => 'KYC uploaded successfully',
            'data' => $kyc,
        ], 201);
    }
}
