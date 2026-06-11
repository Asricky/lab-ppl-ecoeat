<?php

namespace App\Services\Admin;

use App\Models\WalletTransaction;
use App\Models\WithdrawalRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AdminTransactionService
{
    /**
     * List and filter wallet transactions.
     */
    public function listTransactions(array $filters): LengthAwarePaginator
    {
        $query = WalletTransaction::query()
            ->with(['wallet.user', 'order']);

        if (!empty($filters['type'])) {
            $query->where('transaction_type', $filters['type']);
        }

        if (!empty($filters['status'])) {
            $query->where('transaction_status', $filters['status']);
        }

        if (!empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Get details of a specific transaction.
     */
    public function getTransactionDetails(string $transactionId): WalletTransaction
    {
        $transaction = WalletTransaction::with(['wallet.user', 'order'])
            ->find($transactionId);

        if (!$transaction) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Wallet transaction not found',
            ], 404));
        }

        return $transaction;
    }

    /**
     * List and filter withdrawal requests.
     */
    public function listWithdrawalRequests(array $filters): LengthAwarePaginator
    {
        $query = WithdrawalRequest::query()
            ->with(['user', 'wallet']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['from'])) {
            $query->where('created_at', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->where('created_at', '<=', $filters['to']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Get details of a specific withdrawal request.
     */
    public function getWithdrawalRequestDetails(string $requestId): WithdrawalRequest
    {
        $request = WithdrawalRequest::with(['user', 'wallet'])
            ->find($requestId);

        if (!$request) {
            throw new HttpResponseException(response()->json([
                'success' => false,
                'message' => 'Withdrawal request not found',
            ], 404));
        }

        return $request;
    }
}
