<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $profile = null;
        if ($this->role === 'seller') {
            $profile = $this->sellerProfile;
        } elseif ($this->role === 'courier') {
            $profile = $this->courierProfile;
        } elseif ($this->role === 'lks') {
            $profile = $this->lksProfile;
        }

        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'role' => $this->role,
            'is_verified' => $this->is_verified,
            'verification_status' => $this->verification_status,
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at,
            'profile' => $profile ? [
                'id' => $profile->id,
                'verification_status' => $profile->verification_status,
                'reviewed_by' => $profile->reviewed_by,
                'reviewed_at' => $profile->reviewed_at ? \Illuminate\Support\Carbon::parse($profile->reviewed_at)->toIso8601String() : null,
                // Seller profile fields
                'business_name' => $profile->business_name ?? null,
                'business_type' => $profile->business_type ?? null,
                'legal_document_url' => $profile->legal_document_url ?? null,
                // Courier profile fields
                'vehicle_type' => $profile->vehicle_type ?? null,
                'vehicle_plate_number' => $profile->vehicle_plate_number ?? null,
                'driver_license_url' => $profile->driver_license_url ?? null,
                'vehicle_registration_url' => $profile->vehicle_registration_url ?? null,
                // LKS profile fields
                'foundation_name' => $profile->foundation_name ?? null,
                'lks_category' => $profile->lks_category ?? null,
                'legal_permit_number' => $profile->legal_permit_number ?? null,
            ] : null,
        ];
    }
}
