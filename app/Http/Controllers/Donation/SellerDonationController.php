<?php

namespace App\Http\Controllers\Donation;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\CreateDonationRequest;
use App\Services\Donation\DonationCreationService;
use Illuminate\Http\JsonResponse;

class SellerDonationController extends Controller
{
    public function __construct(private readonly DonationCreationService $service)
    {
    }

    public function store(CreateDonationRequest $request): JsonResponse
    {
        $user = $request->user();

        $result = $this->service->createDonation($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Donation created successfully',
            'data' => $result
        ], 201);
    }
}
