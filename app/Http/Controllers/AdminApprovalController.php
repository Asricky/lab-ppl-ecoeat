<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminApprovalController extends Controller
{
    public function approve(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin access required.',
            ], 403);
        }

        $user->update(['status' => 'approved']);
        $user->kycDocuments()->update(['status' => 'approved']);

        return response()->json([
            'message' => 'User approved successfully',
        ]);
    }

    public function reject(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden. Admin access required.',
            ], 403);
        }

        $user->update(['status' => 'rejected']);
        $user->kycDocuments()->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'User rejected',
        ]);
    }
}
