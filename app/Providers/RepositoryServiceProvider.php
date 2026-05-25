<?php

namespace App\Providers;

use App\Repositories\Eloquent\LksRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Interfaces\LksRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(LksRepositoryInterface::class, LksRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
