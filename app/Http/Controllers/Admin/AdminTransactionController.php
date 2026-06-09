<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TransactionFilterRequest;
use App\Http\Resources\Admin\TransactionResource;
use App\Services\Admin\AdminTransactionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminTransactionController extends Controller
{
    public function __construct(private readonly AdminTransactionService $service)
    {
    }

    /**
     * Get paginated wallet transactions.
     */
    public function index(TransactionFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $transactions = $this->service->listTransactions($filters);

        return response()->json([
            'success' => true,
            'data' => TransactionResource::collection($transactions),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    /**
     * Get specific transaction details.
     */
    public function show(string $id): JsonResponse
    {
        $transaction = $this->service->getTransactionDetails($id);

        return response()->json([
            'success' => true,
            'data' => new TransactionResource($transaction),
        ]);
    }

    /**
     * Get paginated withdrawal requests.
     */
    public function indexWithdrawals(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => 'nullable|string|in:pending,completed,failed',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'page' => 'nullable|integer|min:1',
        ]);

        $requests = $this->service->listWithdrawalRequests($filters);

        $formatted = collect($requests->items())->map(function ($item) {
            return [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'wallet_id' => $item->wallet_id,
                'amount' => (float)$item->amount,
                'bank_name' => $item->bank_name,
                'account_name' => $item->account_name,
                'account_number' => $item->account_number,
                'status' => $item->status,
                'created_at' => $item->created_at ? $item->created_at->toIso8601String() : null,
                'completed_at' => $item->completed_at ? $item->completed_at->toIso8601String() : null,
                'user' => $item->user ? [
                    'id' => $item->user->id,
                    'full_name' => $item->user->full_name,
                    'email' => $item->user->email,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted,
            'meta' => [
                'current_page' => $requests->currentPage(),
                'last_page' => $requests->lastPage(),
                'per_page' => $requests->perPage(),
                'total' => $requests->total(),
            ],
        ]);
    }

    /**
     * Get specific withdrawal request details.
     */
    public function showWithdrawal(string $id): JsonResponse
    {
        $item = $this->service->getWithdrawalRequestDetails($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'wallet_id' => $item->wallet_id,
                'amount' => (float)$item->amount,
                'bank_name' => $item->bank_name,
                'account_name' => $item->account_name,
                'account_number' => $item->account_number,
                'status' => $item->status,
                'created_at' => $item->created_at ? $item->created_at->toIso8601String() : null,
                'completed_at' => $item->completed_at ? $item->completed_at->toIso8601String() : null,
                'user' => $item->user ? [
                    'id' => $item->user->id,
                    'full_name' => $item->user->full_name,
                    'email' => $item->user->email,
                ] : null,
            ],
        ]);
    }
}
