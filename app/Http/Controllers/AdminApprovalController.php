<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminApprovalController extends Controller
{
    use ApiResponse;

    /**
     * List all pending users with their KYC documents for admin review.
     */
    public function pendingUsers(Request $request): JsonResponse
    {
        $users = User::with('kycDocuments')
            ->where('status', 'pending')
            ->latest()
            ->get();

        return $this->successResponse(
            $users,
            'Pending users retrieved successfully.'
        );
    }

    /**
     * Approve a user account and their KYC documents.
     *
     * @param  User  $user
     * @return JsonResponse
     */
    public function approve(User $user): JsonResponse
    {
        $user->update([
            'status' => 'approved',
            'rejection_note' => null,
        ]);
        $user->kycDocuments()->update(['status' => 'approved']);

        return $this->successResponse(
            ['user' => $user->fresh()->load('kycDocuments')],
            'User approved successfully.'
        );
    }

    /**
     * Reject a user account and their KYC documents.
     *
     * @param  Request  $request
     * @param  User  $user
     * @return JsonResponse
     */
    public function reject(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $user->update([
            'status' => 'rejected',
            'rejection_note' => $validated['note'] ?? null,
        ]);
        $user->kycDocuments()->update(['status' => 'rejected']);

        return $this->successResponse(
            ['user' => $user->fresh()->load('kycDocuments')],
            'User rejected successfully.'
        );
    }
}
