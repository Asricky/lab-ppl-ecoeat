<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@ecoeat.com'],
            [
                'name' => 'Admin EcoEat',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'approved',
            ]
        );

        $this->command->info('Admin user ready: ' . $admin->email);
    }
}
