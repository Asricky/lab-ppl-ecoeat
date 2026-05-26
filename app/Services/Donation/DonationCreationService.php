<?php

namespace App\Services\Donation;

use App\Enums\Delivery\DeliveryStatus;
use App\Enums\Delivery\OrderStatus;
use App\Models\Delivery;
use App\Models\DeliveryTrackingLog;
use App\Models\LksProfile;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class DonationCreationService
{
    public function createDonation(object $seller, array $data): array
    {
        if ($seller->verification_status !== 'approved') {
            $this->fail('Seller is not verified', 403);
        }

        $product = Product::with('sellerProfile')->find($data['product_id']);
        if (!$product) {
            $this->fail('Product not found', 422);
        }

        if ($product->sellerProfile->user_id !== $seller->id) {
            $this->fail('Product does not belong to you', 403);
        }

        if (!$product->is_donation) {
            $this->fail('Product is not marked as donation', 422);
        }

        if ($product->status !== 'active') {
            $this->fail('Product is not active', 422);
        }

        if ($product->expiry_date && $product->expiry_date->isPast()) {
            $this->fail('Product is expired', 422);
        }

        $lks = LksProfile::with('user')->where('user_id', $data['lks_id'])->first();
        if (!$lks) {
            $this->fail('LKS not found', 422);
        }

        if ($lks->user->verification_status !== 'approved') {
            $this->fail('Target LKS is not verified', 422);
        }

        try {
            return DB::transaction(function () use ($seller, $data, $product, $lks) {
                $orderCode = 'DON-' . strtoupper(Str::random(6));
                
                $order = Order::create([
                    'order_code' => $orderCode,
                    'buyer_id' => null,
                    'seller_id' => $seller->id,
                    'courier_id' => null,
                    'lks_id' => $lks->id,
                    'order_type' => 'donation',
                    'order_status' => OrderStatus::PROCESSING->value,
                    'subtotal' => 0,
                    'delivery_fee' => 0,
                    'platform_fee' => 0,
                    'total_amount' => 0,
                    'total_portions' => $product->portion_quantity ?? 1,
                    'delivery_address_id' => null, // Typically LKS address might be used here if needed, but keeping null for pure donation flow unless specified
                    'notes' => $data['notes'] ?? null,
                    'ordered_at' => now(),
                ]);

                $delivery = Delivery::create([
                    'order_id' => $order->id,
                    'courier_id' => null,
                    'pickup_address' => 'Seller Address', // Simplified for assignment requirements
                    'destination_address' => 'LKS Address', // Simplified
                    'distance_km' => 0,
                    'delivery_status' => DeliveryStatus::WAITING_LKS_CONFIRMATION->value,
                ]);

                DeliveryTrackingLog::create([
                    'delivery_id' => $delivery->id,
                    'status' => DeliveryStatus::WAITING_LKS_CONFIRMATION->value,
                    'notes' => 'Donation offered to LKS',
                ]);

                return [
                    'order_id' => $order->id,
                    'order_code' => $orderCode,
                    'delivery_status' => DeliveryStatus::WAITING_LKS_CONFIRMATION->value,
                ];
            });
        } catch (Throwable $e) {
            $this->fail('Failed to create donation: ' . $e->getMessage(), 500);
        }
    }

    private function fail(string $message, int $code): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $message
        ], $code));
    }
}
