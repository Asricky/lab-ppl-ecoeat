<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'buyer',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user' => [
                             'id',
                             'name',
                             'email',
                             'role',
                             'status',
                         ],
                         'token',
                     ],
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'role' => 'buyer',
            'status' => 'pending',
        ]);
    }

    public function test_approved_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
            'status' => 'approved',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'success',
                     'message',
                     'data' => [
                         'user' => [
                             'id',
                             'email',
                         ],
                         'token',
                     ],
                 ]);
    }

    public function test_pending_user_cannot_login()
    {
        $user = User::factory()->create([
            'email' => 'pending@example.com',
            'password' => Hash::make('password123'),
            'status' => 'pending',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'pending@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
                 ->assertJsonFragment([
                     'success' => false,
                 ]);
    }

    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create([
            'status' => 'approved',
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'success' => true,
                     'message' => 'Successfully logged out. Access token has been revoked.',
                 ]);
                 
        $this->assertCount(0, $user->tokens);
    }
}
