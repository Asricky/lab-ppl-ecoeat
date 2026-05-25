<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    /**
     * Update user profile fields (name, email, phone, avatar).
     *
     * @param  User  $user
     * @param  array<string, mixed>  $data
     * @param  \Illuminate\Http\UploadedFile|null  $avatar
     * @return User
     */
    public function updateProfile(User $user, array $data, $avatar = null): User
    {
        $updateData = [];

        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }

        if (isset($data['email'])) {
            $updateData['email'] = $data['email'];
        }

        if (array_key_exists('phone', $data)) {
            $updateData['phone'] = $data['phone'];
        }

        // Handle avatar upload to Cloudinary
        if ($avatar) {
            $uploadedFileUrl = Cloudinary::upload($avatar->getRealPath(), [
                'folder' => 'ecoeat/avatars',
            ])->getSecurePath();

            $updateData['avatar_url'] = $uploadedFileUrl;
        }

        if (! empty($updateData)) {
            $user->update($updateData);
            $user->refresh();
        }

        return $user;
    }
}
