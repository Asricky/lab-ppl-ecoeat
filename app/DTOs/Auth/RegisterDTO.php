<?php

namespace App\DTOs\Auth;

use App\Http\Requests\Auth\RegisterRequest;

class RegisterDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly string $role,
        public readonly ?string $address = null,
        public readonly ?float $latitude = null,
        public readonly ?float $longitude = null
    ) {}

    /**
     * Create a DTO from the Form Request.
     *
     * @param  RegisterRequest  $request
     * @return self
     */
    public static function fromRequest(RegisterRequest $request): self
    {
        return new self(
            name: $request->input('name'),
            email: $request->input('email'),
            password: $request->input('password'),
            role: $request->input('role'),
            address: $request->input('address'),
            latitude: $request->has('latitude') ? (float) $request->input('latitude') : null,
            longitude: $request->has('longitude') ? (float) $request->input('longitude') : null
        );
    }

    /**
     * Convert DTO to array for saving.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'role' => $this->role,
            'address' => $this->address,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ], fn($value) => !is_null($value));
    }
}
