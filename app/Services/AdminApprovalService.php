<?php

namespace App\Services;

use App\Models\KycDocument;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminApprovalService
{
    public function approve(User $user): User
    {
        return DB::transaction(function () use ($user): User {
            $user->forceFill([
                'status' => 'approved',
            ])->save();

            KycDocument::where('user_id', $user->id)->update([
                'status' => 'approved',
            ]);

            return $user->refresh();
        });
    }

    public function reject(User $user): User
    {
        return DB::transaction(function () use ($user): User {
            $user->forceFill([
                'status' => 'rejected',
            ])->save();

            KycDocument::where('user_id', $user->id)->update([
                'status' => 'rejected',
            ]);

            return $user->refresh();
        });
    }
}
