<?php

namespace App\Repositories\Interfaces;

use App\Models\Lks;

interface LksRepositoryInterface
{
    /**
     * Create a new LKS profile.
     *
     * @param  array<string, mixed>  $data
     * @return Lks
     */
    public function create(array $data): Lks;

    /**
     * Find an LKS by ID.
     *
     * @param  int  $id
     * @return Lks|null
     */
    public function findById(int $id): ?Lks;

    /**
     * Find an LKS profile by name.
     *
     * @param  string  $name
     * @return Lks|null
     */
    public function findByName(string $name): ?Lks;
}
