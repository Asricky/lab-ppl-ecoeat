<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\LksRepositoryInterface;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly LksRepositoryInterface $lksRepository
    ) {}

    /**
     * Get the authenticated user's profile details.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = [
            'user' => $user,
        ];

        // If the authenticated user is LKS, attach their Lks organization profile details
        if ($user->role === 'lks') {
            $lksProfile = $this->lksRepository->findByName($user->name);
            $data['lks_profile'] = $lksProfile;
        }

        return $this->successResponse(
            $data,
            'User profile retrieved successfully.'
        );
    }
}
