<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Models\VerificationLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Pagination\LengthAwarePaginator;

class AdminVerificationService
{
    /**
     * List user verification profiles with filters and eager loading.
     */
    public function list(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->whereIn('role', ['seller', 'courier', 'lks'])
            ->with(['sellerProfile', 'courierProfile', 'lksProfile']);

        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['verification_status'])) {
            $query->where('verification_status', $filters['verification_status']);
        }

        // Return pagination
        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Approve user profile verification.
     */
    public function approve(string $userId, string $adminId, ?string $notes = null): User
    {
        return DB::transaction(function () use ($userId, $adminId, $notes) {
            $user = User::where('id', $userId)
                ->lockForUpdate()
                ->first();

            if (!$user) {
                $this->fail('User not found', 404);
            }

            if (!in_array($user->role, ['seller', 'courier', 'lks'])) {
                $this->fail('User does not have a profile requiring verification', 422);
            }

            $oldStatus = $user->verification_status;

            // Direct transition from approved/rejected to approved is blocked
            if (in_array($oldStatus, ['approved', 'rejected'])) {
                $this->fail("Cannot transition verification status directly from {$oldStatus} to approved. Please use undo first.", 422);
            }

            // Update user
            $user->update([
                'verification_status' => 'approved',
                'is_verified' => true,
            ]);

            // Update respective profile
            $profile = $this->getProfileForUser($user);
            if (!$profile) {
                $this->fail('User profile not found', 404);
            }

            $profile->update([
                'verification_status' => 'approved',
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Log transition
            VerificationLog::create([
                'user_id' => $user->id,
                'reviewed_by' => $adminId,
                'old_status' => $oldStatus,
                'new_status' => 'approved',
                'notes' => $notes,
            ]);

            return $user->load(['sellerProfile', 'courierProfile', 'lksProfile']);
        });
    }

    /**
     * Reject user profile verification.
     */
    public function reject(string $userId, string $adminId, ?string $notes = null): User
    {
        return DB::transaction(function () use ($userId, $adminId, $notes) {
            $user = User::where('id', $userId)
                ->lockForUpdate()
                ->first();

            if (!$user) {
                $this->fail('User not found', 404);
            }

            if (!in_array($user->role, ['seller', 'courier', 'lks'])) {
                $this->fail('User does not have a profile requiring verification', 422);
            }

            $oldStatus = $user->verification_status;

            // Direct transition from approved/rejected to rejected is blocked
            if (in_array($oldStatus, ['approved', 'rejected'])) {
                $this->fail("Cannot transition verification status directly from {$oldStatus} to rejected. Please use undo first.", 422);
            }

            // Update user
            $user->update([
                'verification_status' => 'rejected',
                'is_verified' => false,
            ]);

            // Update respective profile
            $profile = $this->getProfileForUser($user);
            if (!$profile) {
                $this->fail('User profile not found', 404);
            }

            $profile->update([
                'verification_status' => 'rejected',
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Log transition
            VerificationLog::create([
                'user_id' => $user->id,
                'reviewed_by' => $adminId,
                'old_status' => $oldStatus,
                'new_status' => 'rejected',
                'notes' => $notes,
            ]);

            return $user->load(['sellerProfile', 'courierProfile', 'lksProfile']);
        });
    }

    /**
     * Undo verification back to pending.
     */
    public function undo(string $userId, string $adminId, ?string $notes = null): User
    {
        return DB::transaction(function () use ($userId, $adminId, $notes) {
            $user = User::where('id', $userId)
                ->lockForUpdate()
                ->first();

            if (!$user) {
                $this->fail('User not found', 404);
            }

            if (!in_array($user->role, ['seller', 'courier', 'lks'])) {
                $this->fail('User does not have a profile requiring verification', 422);
            }

            $oldStatus = $user->verification_status;

            // Undo is only valid if status is approved or rejected
            if (!in_array($oldStatus, ['approved', 'rejected'])) {
                $this->fail("Cannot undo verification status. Current status is {$oldStatus}, which is not approved or rejected.", 422);
            }

            // Update user
            $user->update([
                'verification_status' => 'pending',
                'is_verified' => false,
            ]);

            // Update respective profile
            $profile = $this->getProfileForUser($user);
            if (!$profile) {
                $this->fail('User profile not found', 404);
            }

            $profile->update([
                'verification_status' => 'pending',
                'reviewed_by' => $adminId,
                'reviewed_at' => now(),
            ]);

            // Log transition
            VerificationLog::create([
                'user_id' => $user->id,
                'reviewed_by' => $adminId,
                'old_status' => $oldStatus,
                'new_status' => 'pending',
                'notes' => $notes,
            ]);

            return $user->load(['sellerProfile', 'courierProfile', 'lksProfile']);
        });
    }

    /**
     * Get the matching profile model for the user based on their role.
     */
    protected function getProfileForUser(User $user)
    {
        if ($user->role === 'seller') {
            return $user->sellerProfile;
        } elseif ($user->role === 'courier') {
            return $user->courierProfile;
        } elseif ($user->role === 'lks') {
            return $user->lksProfile;
        }
        return null;
    }

    /**
     * Helper to fail with standard JSON response.
     */
    protected function fail(string $message, int $status): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $message,
        ], $status));
    }
}
