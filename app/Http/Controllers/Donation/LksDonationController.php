<?php

namespace App\Http\Controllers\Donation;

use App\Enums\Delivery\DeliveryStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Donation\IncomingDonationResource;
use App\Models\Order;
use App\Services\Donation\LksDonationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LksDonationController extends Controller
{
    public function __construct(private readonly LksDonationService $service)
    {
    }

    public function incoming(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'lks' || $user->verification_status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized or unverified LKS.'
            ], 403);
        }

        $lksProfileId = \App\Models\LksProfile::where('user_id', $user->id)->value('id');

        $orders = Order::with(['delivery', 'seller'])
            ->where('lks_id', $lksProfileId)
            ->where('order_type', 'donation')
            ->whereHas('delivery', function ($q) {
                $q->where('delivery_status', DeliveryStatus::WAITING_LKS_CONFIRMATION->value);
            })
            ->latest('ordered_at')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Incoming donations retrieved successfully',
            'data' => IncomingDonationResource::collection($orders)->response()->getData(true)
        ]);
    }

    public function accept(Request $request, string $deliveryId): JsonResponse
    {
        if ($request->user()->role !== 'lks') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $result = $this->service->accept($request->user(), $deliveryId);

        return response()->json([
            'success' => true,
            'message' => 'Donation accepted successfully',
            'data' => $result
        ]);
    }

    public function reject(Request $request, string $deliveryId): JsonResponse
    {
        if ($request->user()->role !== 'lks') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $this->service->reject($request->user(), $deliveryId);

        return response()->json([
            'success' => true,
            'message' => 'Donation rejected successfully',
        ]);
    }
}
