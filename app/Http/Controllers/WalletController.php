<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function topup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1000'],
        ]);

        $wallet = DB::transaction(function () use ($request, $validated): Wallet {
            Wallet::query()->firstOrCreate(
                ['user_id' => $request->user()->id],
                ['balance' => 0]
            );

            $wallet = Wallet::query()
                ->lockForUpdate()
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $wallet->increment('balance', $validated['amount']);

            return $wallet->refresh();
        });

        return response()->json([
            'message' => 'Wallet topped up successfully',
            'data' => [
                'balance' => $wallet->balance,
            ],
        ]);
    }
}
