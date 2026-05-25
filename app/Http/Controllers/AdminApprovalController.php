<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AdminApprovalController extends Controller
{
    use ApiResponse;

    /**
     * Approve a user account and their KYC documents.
     *
     * @param  User  $user
     * @return JsonResponse
     */
    public function approve(User $user): JsonResponse
    {
        $user->update(['status' => 'approved']);
        $user->kycDocuments()->update(['status' => 'approved']);

        return $this->successResponse(
            ['user' => $user->fresh()],
            'User approved successfully.'
        );
    }

    /**
     * Reject a user account and their KYC documents.
     *
     * @param  User  $user
     * @return JsonResponse
     */
    public function reject(User $user): JsonResponse
    {
        $user->update(['status' => 'rejected']);
        $user->kycDocuments()->update(['status' => 'rejected']);

        return $this->successResponse(
            ['user' => $user->fresh()],
            'User rejected.'
        );
    }
}
