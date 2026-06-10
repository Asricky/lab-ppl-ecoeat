<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_profile()
    {
        $user = User::factory()->create([
            'name' => 'Profile User',
            'phone' => '081234567890',
            'status' => 'approved',
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user/profile');

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'user' => [
                             'name' => 'Profile User',
                             'phone' => '081234567890',
                         ],
                     ],
                 ]);
    }

    public function test_user_can_update_profile()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'status' => 'approved',
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/user/profile', [
            'name' => 'New Name',
            'phone' => '08999999999',
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         'user' => [
                             'name' => 'New Name',
                             'phone' => '08999999999',
                         ],
                     ],
                 ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'phone' => '08999999999',
        ]);
    }

    public function test_unauthenticated_user_cannot_access_profile()
    {
        $response = $this->getJson('/api/user/profile');

        $response->assertStatus(401);
    }
}
