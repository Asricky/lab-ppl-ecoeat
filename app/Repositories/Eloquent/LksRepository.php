<?php

namespace App\Repositories\Eloquent;

use App\Models\Lks;
use App\Repositories\Interfaces\LksRepositoryInterface;

class LksRepository implements LksRepositoryInterface
{
    /**
     * Create a new LKS profile.
     *
     * @param  array<string, mixed>  $data
     * @return Lks
     */
    public function create(array $data): Lks
    {
        return Lks::create($data);
    }

    /**
     * Find an LKS by ID.
     *
     * @param  int  $id
     * @return Lks|null
     */
    public function findById(int $id): ?Lks
    {
        return Lks::find($id);
    }

    /**
     * Find an LKS profile by name.
     *
     * @param  string  $name
     * @return Lks|null
     */
    public function findByName(string $name): ?Lks
    {
        return Lks::where('name', $name)->first();
    }
}
