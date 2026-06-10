<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use App\Models\User;
use App\Services\KycService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KycController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly KycService $kycService
    ) {}

    /**
     * Get the authenticated user's KYC documents and verification status.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $documents = $user->kycDocuments;

        return $this->successResponse([
            'status' => $user->status,
            'rejection_note' => $user->rejection_note,
            'documents' => $documents,
        ], 'KYC status retrieved successfully.');
    }

    /**
     * Upload a single KYC document to Cloudinary and database.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'document_type' => ['required', 'string', Rule::in(['ktp', 'nib', 'sim', 'stnk', 'legal_permit'])],
            'document_number' => ['nullable', 'string', 'max:255'],
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'], // Max 5MB
        ]);

        $userId = $validated['user_id'] ?? auth()->id();

        if (! $userId) {
            return $this->errorResponse('Unauthenticated or user_id not provided.', 401);
        }

        $user = User::findOrFail($userId);

        $kyc = $this->kycService->uploadSingleDocument(
            $user,
            $validated['document_type'],
            $request->file('file'),
            $validated['document_number'] ?? null
        );

        return $this->successResponse(
            $kyc,
            'KYC uploaded successfully',
            201
        );
    }
}
