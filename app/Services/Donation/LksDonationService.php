<?php

namespace App\Services\Donation;

use App\Enums\Delivery\DeliveryStatus;
use App\Enums\Delivery\OrderStatus;
use App\Models\Delivery;
use App\Models\DeliveryTrackingLog;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Throwable;

class LksDonationService
{
    public function accept(object $lksUser, string $deliveryId): array
    {
        return $this->processAction($lksUser, $deliveryId, 'accept');
    }

    public function reject(object $lksUser, string $deliveryId): void
    {
        $this->processAction($lksUser, $deliveryId, 'reject');
    }

    private function processAction(object $lksUser, string $deliveryId, string $action): array
    {
        try {
            return DB::transaction(function () use ($lksUser, $deliveryId, $action) {
                $delivery = Delivery::with('order')->lockForUpdate()->find($deliveryId);

                if (!$delivery) {
                    $this->fail('Delivery not found', 404);
                }

                $lksProfileId = \App\Models\LksProfile::where('user_id', $lksUser->id)->value('id');

                if ($delivery->order->lks_id !== $lksProfileId) {
                    $this->fail('Unauthorized ownership. This donation is not for you.', 403);
                }

                if ($delivery->delivery_status !== DeliveryStatus::WAITING_LKS_CONFIRMATION->value) {
                    if ($action === 'accept' && $delivery->delivery_status === DeliveryStatus::AVAILABLE_FOR_COURIER->value) {
                         $this->fail('Already accepted', 422);
                    }
                    if ($action === 'reject' && $delivery->delivery_status === DeliveryStatus::REJECTED_BY_LKS->value) {
                         $this->fail('Already rejected', 422);
                    }
                    $this->fail('Invalid progression state. Expected waiting_lks_confirmation.', 422);
                }

                if ($action === 'accept') {
                    $delivery->delivery_status = DeliveryStatus::AVAILABLE_FOR_COURIER->value;
                    $delivery->lks_confirmed_at = now();
                    $delivery->save();

                    $delivery->order->order_status = OrderStatus::READY_FOR_DELIVERY->value;
                    $delivery->order->save();

                    DeliveryTrackingLog::create([
                        'delivery_id' => $delivery->id,
                        'status' => DeliveryStatus::AVAILABLE_FOR_COURIER->value,
                        'notes' => 'Donation accepted by LKS, waiting for courier',
                    ]);

                    return [
                        'delivery_id' => $delivery->id,
                        'delivery_status' => DeliveryStatus::AVAILABLE_FOR_COURIER->value,
                    ];
                } else {
                    $delivery->delivery_status = DeliveryStatus::REJECTED_BY_LKS->value;
                    $delivery->lks_confirmed_at = now();
                    $delivery->save();

                    $delivery->order->order_status = OrderStatus::CANCELLED->value;
                    $delivery->order->cancelled_at = now();
                    $delivery->order->save();

                    DeliveryTrackingLog::create([
                        'delivery_id' => $delivery->id,
                        'status' => DeliveryStatus::REJECTED_BY_LKS->value,
                        'notes' => 'Donation rejected by LKS',
                    ]);

                    return [];
                }
            });
        } catch (HttpResponseException $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->fail('Failed to process donation action: ' . $e->getMessage(), 500);
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
