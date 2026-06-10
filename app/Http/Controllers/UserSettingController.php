<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserSettingController extends Controller
{
    /**
     * Get the authenticated user's settings.
     */
    public function show(Request $request): JsonResponse
    {
        $settings = UserSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'timezone' => 'UTC',
                'language' => 'id',
                'notification_preferences' => [
                    'email' => true,
                    'push' => true,
                    'sms' => false,
                ],
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'User settings retrieved successfully.',
            'data' => $settings,
        ]);
    }

    /**
     * Update the authenticated user's settings.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'timezone' => ['sometimes', 'string', 'max:50'],
            'language' => ['sometimes', 'string', 'max:10'],
            'notification_preferences' => ['sometimes', 'array'],
        ]);

        $settings = UserSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'timezone' => 'UTC',
                'language' => 'id',
                'notification_preferences' => [
                    'email' => true,
                    'push' => true,
                    'sms' => false,
                ],
            ]
        );

        $settings->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User settings updated successfully.',
            'data' => $settings,
        ]);
    }
}
