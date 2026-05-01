<?php

namespace App\Http\Controllers;

use App\Models\KycDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KycController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'document_type' => ['required', 'string', Rule::in(['ktp', 'nib', 'sim'])],
            'file' => ['required', 'file'],
        ]);

        $kyc = KycDocument::create([
            'user_id' => $validated['user_id'],
            'document_type' => $validated['document_type'],
            'file_url' => 'dummy-path',
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'KYC uploaded successfully',
            'data' => $kyc,
        ], 201);
    }
}
