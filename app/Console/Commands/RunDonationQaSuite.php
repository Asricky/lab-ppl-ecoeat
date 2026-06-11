<?php

namespace App\Console\Commands;

use App\Models\LksProfile;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RunDonationQaSuite extends Command
{
    protected $signature = 'ecoeat:donation-qa';
    protected $description = 'Run Donation Ecosystem QA Suite';

    private string $reportPath = 'C:/Users/MP2C6/.gemini/antigravity/brain/79fd23cf-dd05-497f-9f7f-2634468cf5e1/donation_qa_report.md';
    private array $reportContent = [];
    private array $tempData = [];

    public function handle(): int
    {
        $this->info("Starting EcoEat Donation QA Suite...");
        $this->reportContent[] = "# EcoEat Donation Ecosystem QA Report\n";
        
        $this->setupTestData();
        $this->runTestScenarios();
        $this->cleanupTestData();

        file_put_contents($this->reportPath, implode("\n", $this->reportContent));
        $this->info("QA Report written to {$this->reportPath}");

        return self::SUCCESS;
    }

    private function generateUuid(): string
    {
        return (string) Str::uuid();
    }

    private function setupTestData()
    {
        // Clean up previously failed runs to ensure idempotency
        User::whereIn('email', ['qadon_seller@e.com', 'qadon_lks@e.com', 'qadon_lks2@e.com', 'qadon_courier@e.com'])->delete();

        // Create Seller
        $seller = User::create([
            'full_name' => 'QA Donator', 'email' => 'qadon_seller@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'seller', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['seller_id'] = $seller->id;
        $sellerProfileId = $this->generateUuid();
        SellerProfile::create([
            'id' => $sellerProfileId, 'user_id' => $this->tempData['seller_id'],
            'business_name' => 'QA Business', 'business_type' => 'Restaurant', 'legal_document_url' => 'x', 'verification_status' => 'approved'
        ]);

        // Create LKS 1 (Approved)
        $lks = User::create([
            'full_name' => 'QA LKS', 'email' => 'qadon_lks@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'lks', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['lks_id'] = $lks->id;
        LksProfile::create([
            'id' => $this->generateUuid(), 'user_id' => $this->tempData['lks_id'],
            'foundation_name' => 'QA LKS Foundation', 'lks_category' => 'Orphanage', 'legal_permit_number' => '1', 'legal_document_url' => 'x', 'storage_type' => 'Fridge', 'storage_capacity' => 10, 'beneficiaries_count' => 10, 'verification_status' => 'approved'
        ]);

        // Create LKS 2 (Unapproved)
        $lks2 = User::create([
            'full_name' => 'QA LKS Unapproved', 'email' => 'qadon_lks2@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'lks', 'is_verified' => false, 'verification_status' => 'pending', 'is_active' => true
        ]);
        $this->tempData['lks2_id'] = $lks2->id;
        LksProfile::create([
            'id' => $this->generateUuid(), 'user_id' => $this->tempData['lks2_id'],
            'foundation_name' => 'QA LKS Unapp Foundation', 'lks_category' => 'Orphanage', 'legal_permit_number' => '2', 'legal_document_url' => 'x', 'storage_type' => 'Fridge', 'storage_capacity' => 10, 'beneficiaries_count' => 10, 'verification_status' => 'pending'
        ]);

        // Create Courier
        $courier = User::create([
            'full_name' => 'QA Courier', 'email' => 'qadon_courier@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'courier', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['courier_id'] = $courier->id;
        DB::table('courier_profiles')->insert(['id' => $this->generateUuid(), 'user_id' => $this->tempData['courier_id'], 'vehicle_type' => 'Motor', 'vehicle_plate_number' => '1', 'driver_license_url' => 'x', 'vehicle_registration_url' => 'x', 'verification_status' => 'approved', 'created_at' => now()]);

        // Products
        $this->tempData['valid_product_id'] = $this->generateUuid();
        Product::create(['id' => $this->tempData['valid_product_id'], 'seller_profile_id' => $sellerProfileId, 'title' => 'T1', 'description' => 'D1', 'price' => 1, 'original_price' => 2, 'stock_quantity' => 1, 'is_donation' => true, 'status' => 'active', 'expiry_date' => now()->addDays(5)]);
        
        $this->tempData['non_donation_product_id'] = $this->generateUuid();
        Product::create(['id' => $this->tempData['non_donation_product_id'], 'seller_profile_id' => $sellerProfileId, 'title' => 'T2', 'description' => 'D2', 'price' => 1, 'original_price' => 2, 'stock_quantity' => 1, 'is_donation' => false, 'status' => 'active', 'expiry_date' => now()->addDays(5)]);
        
        $this->tempData['expired_product_id'] = $this->generateUuid();
        Product::create(['id' => $this->tempData['expired_product_id'], 'seller_profile_id' => $sellerProfileId, 'title' => 'T3', 'description' => 'D3', 'price' => 1, 'original_price' => 2, 'stock_quantity' => 1, 'is_donation' => true, 'status' => 'active', 'expiry_date' => now()->subDays(1)]);
    }

    private function dispatchInternalRequest(string $method, string $uri, array $payload = [], ?User $user = null): array
    {
        // Force a fresh database connection to prevent transaction bleed-over from previous failed requests
        DB::disconnect();
        DB::reconnect();

        $request = Request::create($uri, $method, $payload);
        $request->headers->set('Accept', 'application/json');
        
        if ($user) {
            $request->setUserResolver(fn() => $user);
            Auth::guard('sanctum')->setUser($user);
        }

        $response = app()->handle($request);
        return [
            'status' => $response->getStatusCode(),
            'json' => json_decode($response->getContent(), true)
        ];
    }

    private function reportStep($title, $expected, $actualStatus, $isPass)
    {
        $mark = $isPass ? '✅ PASS' : '❌ FAIL';
        $this->reportContent[] = "### {$title}";
        $this->reportContent[] = "- **Expected**: {$expected}";
        $this->reportContent[] = "- **Actual HTTP Status**: {$actualStatus}";
        $this->reportContent[] = "- **Result**: {$mark}\n";
    }

    private function runTestScenarios()
    {
        $seller = User::find($this->tempData['seller_id']);
        $lks = User::find($this->tempData['lks_id']);
        $courier = User::find($this->tempData['courier_id']);

        // 1. Unauthenticated access
        $res = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $this->tempData['lks_id']]);
        $this->reportStep('1. Unauthenticated access', '401', $res['status'], $res['status'] === 401);

        // 2. Unauthorized ownership (LKS tries to create donation)
        $res = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $this->tempData['lks_id']], $lks);
        $this->reportStep('2. Unauthorized ownership (role)', '403', $res['status'], $res['status'] === 403);

        // 3. Invalid product (non-donation)
        $res = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['non_donation_product_id'], 'lks_id' => $this->tempData['lks_id']], $seller);
        $this->reportStep('3. Invalid product (not donation)', '422', $res['status'], $res['status'] === 422);

        // 4. Expired product
        $res = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['expired_product_id'], 'lks_id' => $this->tempData['lks_id']], $seller);
        $this->reportStep('4. Expired product', '422', $res['status'], $res['status'] === 422);

        // 5. Invalid LKS (Unapproved)
        $res = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $this->tempData['lks2_id']], $seller);
        $this->reportStep('5. Target LKS Unverified', '422', $res['status'], $res['status'] === 422);

        // 6. Valid Seller Create Donation
        $res = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $this->tempData['lks_id']], $seller);
        if ($res['status'] !== 201) {
            $this->error("Donation creation failed: " . json_encode($res));
        }
        $this->reportStep('6. Seller create donation successfully', '201', $res['status'], $res['status'] === 201);
        $orderId = $res['json']['data']['order_id'] ?? null;
        $order = DB::table('orders')->where('id', $orderId)->first();
        $delivery = DB::table('deliveries')->where('order_id', $orderId)->first();

        // 7. LKS incoming offers
        $res = $this->dispatchInternalRequest('GET', '/api/lks/donations/incoming', [], $lks);
        $this->reportStep('7. LKS incoming offers', '200 (Has 1 item)', $res['status'], $res['status'] === 200 && count($res['json']['data']) >= 1);

        // 8. Courier visibility before accept (Must not see)
        $res = $this->dispatchInternalRequest('GET', '/api/courier/deliveries/available', [], $courier);
        $found = false;
        foreach ($res['json']['data'] ?? [] as $d) if ($d['order_id'] === $orderId) $found = true;
        $this->reportStep('8. Courier visibility before accept (Hidden)', '200 (Not found)', $res['status'], $res['status'] === 200 && !$found);

        // 9. LKS Accept Donation
        $res = $this->dispatchInternalRequest('PATCH', "/api/lks/donations/{$delivery->id}/accept", [], $lks);
        $this->reportStep('9. LKS accept donation', '200', $res['status'], $res['status'] === 200);

        // 10. Double accept
        $res = $this->dispatchInternalRequest('PATCH', "/api/lks/donations/{$delivery->id}/accept", [], $lks);
        $this->reportStep('10. Double accept prevention', '422', $res['status'], $res['status'] === 422);

        // 11. Courier visibility after accept (Must see)
        $res = $this->dispatchInternalRequest('GET', '/api/courier/deliveries/available', [], $courier);
        $found = false;
        foreach ($res['json']['data'] ?? [] as $d) if ($d['order_id'] === $orderId) $found = true;
        $this->reportStep('11. Courier visibility after accept (Visible)', '200 (Found)', $res['status'], $res['status'] === 200 && $found);

        // 12. Delivery Lifecycle (Courier takes delivery)
        $res = $this->dispatchInternalRequest('POST', "/api/courier/deliveries/{$orderId}/take", [], $courier);
        $this->reportStep('12. Courier takes delivery', '200', $res['status'], $res['status'] === 200);

        // Create a second donation for reject scenario
        $res2 = $this->dispatchInternalRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $this->tempData['lks_id']], $seller);
        $orderId2 = $res2['json']['data']['order_id'];
        $delivery2 = DB::table('deliveries')->where('order_id', $orderId2)->first();

        // 13. LKS Reject Donation
        $res = $this->dispatchInternalRequest('PATCH', "/api/lks/donations/{$delivery2->id}/reject", [], $lks);
        $this->reportStep('13. LKS reject donation', '200', $res['status'], $res['status'] === 200);

        // 14. Reject after accepted (using first delivery which is already accepted)
        $res = $this->dispatchInternalRequest('PATCH', "/api/lks/donations/{$delivery->id}/reject", [], $lks);
        $this->reportStep('14. Reject after already accepted prevention', '422', $res['status'], $res['status'] === 422);

        // 15. Delivered completion (Courier finishes first delivery)
        $this->dispatchInternalRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['delivery_status' => 'picked_up'], $courier);
        $this->dispatchInternalRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['delivery_status' => 'on_delivery'], $courier);
        $res = $this->dispatchInternalRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['delivery_status' => 'delivered'], $courier);
        $this->reportStep('15. Delivered completion', '200', $res['status'], $res['status'] === 200);

        // 16. Tracking log creation check
        $logCount = DB::table('delivery_tracking_logs')->where('delivery_id', $delivery->id)->count();
        // Waiting(1) -> Accepted(1) -> Assigned(1) -> Picked(1) -> OnDel(1) -> Delivered(1) = 6
        $this->reportStep('16. Tracking log auto creation', 'Log count >= 6', "Count {$logCount}", $logCount >= 6);

        // 17. LKS Dashboard check
        $res = $this->dispatchInternalRequest('GET', '/api/lks/dashboard', [], $lks);
        $this->reportStep('17. LKS Dashboard statistics', '200 (Has data)', $res['status'], $res['status'] === 200 && $res['json']['data']['total_donation_received'] >= 1);
    }

    private function cleanupTestData()
    {
        $sellerId = $this->tempData['seller_id'];
        
        $sellerProfile = SellerProfile::where('user_id', $sellerId)->first();
        
        DB::table('delivery_tracking_logs')->whereIn('delivery_id', function($q) use ($sellerId) {
            $q->select('id')->from('deliveries')->whereIn('order_id', function($q2) use ($sellerId) {
                $q2->select('id')->from('orders')->where('seller_id', $sellerId);
            });
        })->delete();

        DB::table('deliveries')->whereIn('order_id', function($q) use ($sellerId) {
            $q->select('id')->from('orders')->where('seller_id', $sellerId);
        })->delete();

        DB::table('orders')->where('seller_id', $sellerId)->delete();

        if ($sellerProfile) {
            Product::where('seller_profile_id', $sellerProfile->id)->delete();
            $sellerProfile->delete();
        }

        LksProfile::whereIn('user_id', [$this->tempData['lks_id'], $this->tempData['lks2_id']])->delete();
        DB::table('courier_profiles')->where('user_id', $this->tempData['courier_id'])->delete();

        User::whereIn('id', [
            $this->tempData['seller_id'],
            $this->tempData['lks_id'],
            $this->tempData['lks2_id'],
            $this->tempData['courier_id']
        ])->delete();
    }
}
