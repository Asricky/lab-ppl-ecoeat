<?php

namespace App\Services\Delivery;

use App\Enums\Delivery\CourierVerificationStatus;
use App\Enums\Delivery\DeliveryStatus;
use App\Enums\Delivery\UserRole;
use App\Models\Delivery;
use App\Models\DeliveryTrackingLog;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseDeliveryService
{
    protected function assertCourierCanWork(User $user): void
    {
        if ($user->role !== UserRole::COURIER->value) {
            $this->fail('Only courier can access this resource', 403);
        }

        if (! $user->is_active) {
            $this->fail('Courier account is inactive', 403);
        }

        if ($user->courierProfile?->verification_status !== CourierVerificationStatus::APPROVED->value) {
            $this->fail('Courier is not approved', 403);
        }
    }

    protected function assertCourierHasNoActiveDelivery(User $courier): void
    {
        $hasActiveDelivery = Delivery::query()
            ->where('courier_id', $courier->id)
            ->whereIn('delivery_status', DeliveryStatus::activeCourierValues())
            ->exists();

        if ($hasActiveDelivery) {
            $this->fail('Courier currently has an active delivery', 422);
        }
    }

    protected function assertOwnsDelivery(Delivery $delivery, User $courier): void
    {
        if ($delivery->courier_id !== $courier->id) {
            $this->fail('Delivery not found or not owned by courier', 403);
        }
    }

    protected function createTrackingLog(
        Delivery $delivery,
        string $status,
        ?string $notes = null,
        mixed $latitude = null,
        mixed $longitude = null
    ): DeliveryTrackingLog {
        return DeliveryTrackingLog::create([
            'delivery_id' => $delivery->id,
            'status' => $status,
            'notes' => $notes,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'created_at' => now(),
        ]);
    }

    protected function assertValidProgression(string $currentStatus, string $nextStatus): void
    {
        if (in_array($currentStatus, [DeliveryStatus::DELIVERED->value, DeliveryStatus::FAILED->value], true)) {
            $this->fail('Delivery has already been finalized', 422);
        }

        $allowed = [
            DeliveryStatus::COURIER_ASSIGNED->value => [
                DeliveryStatus::PICKED_UP->value,
                DeliveryStatus::FAILED->value,
            ],
            DeliveryStatus::PICKED_UP->value => [
                DeliveryStatus::ON_DELIVERY->value,
                DeliveryStatus::FAILED->value,
            ],
            DeliveryStatus::ON_DELIVERY->value => [
                DeliveryStatus::DELIVERED->value,
                DeliveryStatus::FAILED->value,
            ],
        ];

        if (! in_array($nextStatus, $allowed[$currentStatus] ?? [], true)) {
            $this->fail('Invalid delivery status progression', 422);
        }
    }

    protected function fail(string $message, int $status = 400): never
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => $message,
        ], $status));
    }
}
