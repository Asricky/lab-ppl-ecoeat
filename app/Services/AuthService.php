<?php

namespace App\Services;

use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\LoginDTO;
use App\Models\User;
use App\Repositories\Interfaces\LksRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\ActivityLogger;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly LksRepositoryInterface $lksRepository
    ) {}

    /**
     * Register a new user and generate a Sanctum token.
     *
     * @param  RegisterDTO  $dto
     * @return array{user: User, token: string}
     */
    public function register(RegisterDTO $dto): array
    {
        $user = $this->userRepository->create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => Hash::make($dto->password),
            'role' => $dto->role,
            'status' => 'pending', // Default status is pending approval
        ]);

        // If the registered role is an LKS (Charity), create the Lks profile entry
        if ($dto->role === 'lks') {
            $this->lksRepository->create([
                'name' => $dto->name,
                'address' => $dto->address,
                'latitude' => $dto->latitude,
                'longitude' => $dto->longitude,
                'verified' => false, // Default is unverified
            ]);
        }

        ActivityLogger::log('register', 'User registered new account', ['role' => $user->role], $user->id);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Authenticate a user and generate a Sanctum token.
     *
     * @param  LoginDTO  $dto
     * @return array{user: User, token: string}
     *
     * @throws AuthorizationException
     * @throws ValidationException
     */
    public function login(LoginDTO $dto): array
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (! $user || ! Hash::check($dto->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Verification validation: account must be approved to login
        if ($user->status === 'pending') {
            throw new AuthorizationException('User account is pending admin approval.');
        }

        // Suspended account validation: rejected accounts are blocked from login
        if ($user->status === 'rejected') {
            throw new AuthorizationException('User account has been suspended by the administrator.');
        }

        ActivityLogger::log('login', 'User logged in', [], $user->id);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
