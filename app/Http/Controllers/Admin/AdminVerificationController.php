<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VerificationFilterRequest;
use App\Http\Resources\Admin\VerificationResource;
use App\Services\Admin\AdminVerificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminVerificationController extends Controller
{
    public function __construct(private readonly AdminVerificationService $service)
    {
    }

    /**
     * Get paginated verification moderation list.
     */
    public function index(VerificationFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();
        $users = $this->service->list($filters);

        return response()->json([
            'success' => true,
            'data' => VerificationResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Approve verification for a seller/courier/LKS user.
     */
    public function approve(Request $request, string $userId): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $adminId = $request->user()->id;
        $notes = $request->input('notes');

        $user = $this->service->approve($userId, $adminId, $notes);

        return response()->json([
            'success' => true,
            'message' => 'Verification approved successfully',
            'data' => new VerificationResource($user),
        ]);
    }

    /**
     * Reject verification for a seller/courier/LKS user.
     */
    public function reject(Request $request, string $userId): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $adminId = $request->user()->id;
        $notes = $request->input('notes');

        $user = $this->service->reject($userId, $adminId, $notes);

        return response()->json([
            'success' => true,
            'message' => 'Verification rejected successfully',
            'data' => new VerificationResource($user),
        ]);
    }

    /**
     * Undo verification back to pending status.
     */
    public function undo(Request $request, string $userId): JsonResponse
    {
        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        $adminId = $request->user()->id;
        $notes = $request->input('notes');

        $user = $this->service->undo($userId, $adminId, $notes);

        return response()->json([
            'success' => true,
            'message' => 'Verification undone successfully',
            'data' => new VerificationResource($user),
        ]);
    }
}
