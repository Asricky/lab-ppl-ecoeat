<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class MapController extends Controller
{
    public function sellers(): JsonResponse
    {
        $sellers = User::where('role', 'seller')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->with(['products' => function ($query): void {
                $query->where('status', 'active')
                    ->where('stock', '>', 0);
            }])
            ->get();

        return response()->json([
            'data' => $sellers,
        ]);
    }
}
