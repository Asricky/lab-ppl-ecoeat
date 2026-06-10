<?php

namespace App\Http\Controllers;

use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\LoginDTO;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Services\ActivityLogger;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuthService $authService)
    {
    }

    /**
     * Register a new user account (buyer/seller/courier/lks/admin).
     *
     * @param  RegisterRequest  $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $dto = RegisterDTO::fromRequest($request);
        $result = $this->authService->register($dto);

        return $this->successResponse(
            $result,
            'Registration successful. Please upload KYC documents and wait for admin approval.',
            201
        );
    }

    /**
     * Authenticate and login a user account.
     *
     * @param  LoginRequest  $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $dto = LoginDTO::fromRequest($request);

        try {
            $result = $this->authService->login($dto);
        } catch (AuthorizationException $exception) {
            return $this->errorResponse(
                $exception->getMessage(),
                403
            );
        }

        return $this->successResponse(
            $result,
            'Login successful.'
        );
    }

    /**
     * Revoke the current authenticated user's token (logout).
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke the current token
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(
            null,
            'Successfully logged out. Access token has been revoked.'
        );
    }
}
