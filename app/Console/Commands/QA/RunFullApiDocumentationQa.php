<?php

namespace App\Console\Commands\QA;

use App\Models\User;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\LksProfile;
use App\Models\CourierProfile;
use App\Models\Order;
use App\Models\Delivery;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\WithdrawalRequest;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Route;

class RunFullApiDocumentationQa extends Command
{
    protected $signature = 'ecoeat:api-doc-qa';
    protected $description = 'Execute full endpoint testing suite for EcoEat APIs to generate documentation database';

    private string $qaSessionId;
    private array $testCases = [];
    private array $tempData = [];

    public function handle(): int
    {
        $this->qaSessionId = (string) Str::uuid();
        $this->info("=====================================================================");
        $this->info("             ECOEAT ENDPOINT TESTING & DOCUMENTATION RUN              ");
        $this->info("             SESSION: {$this->qaSessionId}                           ");
        $this->info("=====================================================================");

        try {
            $this->info("Setting up test data...");
            $this->setupTestData();

            $this->info("Running test scenarios...");
            $this->runAuthScenarios();
            $this->runDeliveryScenarios();
            $this->runDonationScenarios();
            $this->runAnalyticsScenarios();
            $this->runAdminScenarios();
            $this->runSecurityScenarios();

            $this->info("Exporting results to storage...");
            $this->exportResults();

        } catch (\Throwable $e) {
            $this->error("QA execution failed: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return self::FAILURE;
        }

        $passed = collect($this->testCases)->where('Status (Pass/Fail)', 'Pass')->count();
        $failed = collect($this->testCases)->where('Status (Pass/Fail)', 'Fail')->count();
        $this->info("Test Run Completed. Total: " . count($this->testCases) . " | Passed: {$passed} | Failed: {$failed}");

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function generateUuid(): string
    {
        return (string) Str::uuid();
    }

    private function setupTestData(): void
    {
        $sessionShort = substr($this->qaSessionId, 0, 8);
        $tagNote = "QA_SESSION:{$this->qaSessionId}|QA_TAG:endpoint_documentation";

        // Create Users
        $admin = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Doc Admin {$sessionShort}",
            'email' => "admin_doc_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'admin',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['admin'] = $admin;

        $buyer = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Doc Buyer {$sessionShort}",
            'email' => "buyer_doc_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'buyer',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['buyer'] = $buyer;

        $seller = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Doc Seller {$sessionShort}",
            'email' => "seller_doc_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'seller',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['seller'] = $seller;

        $sellerProfile = SellerProfile::create([
            'id' => $this->generateUuid(),
            'user_id' => $seller->id,
            'business_name' => "QA Doc Biz {$sessionShort}",
            'business_type' => 'Bakery',
            'legal_document_url' => 'https://ecoeat-qa.com/legal_seller.pdf',
            'verification_status' => 'approved',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);
        $this->tempData['seller_profile'] = $sellerProfile;

        $courier = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Doc Courier {$sessionShort}",
            'email' => "courier_doc_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'courier',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['courier'] = $courier;

        $courierProfile = CourierProfile::create([
            'id' => $this->generateUuid(),
            'user_id' => $courier->id,
            'vehicle_type' => 'Motorcycle',
            'vehicle_plate_number' => "QA-{$sessionShort}",
            'driver_license_url' => 'https://ecoeat-qa.com/license.pdf',
            'vehicle_registration_url' => 'https://ecoeat-qa.com/stnk.pdf',
            'verification_status' => 'approved',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);
        $this->tempData['courier_profile'] = $courierProfile;

        $lks = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Doc LKS {$sessionShort}",
            'email' => "lks_doc_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'lks',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['lks'] = $lks;

        $lksProfile = LksProfile::create([
            'id' => $this->generateUuid(),
            'user_id' => $lks->id,
            'foundation_name' => "QA Doc LKS Foundation {$sessionShort}",
            'lks_category' => 'Orphanage',
            'legal_permit_number' => "PERMIT-{$sessionShort}",
            'legal_document_url' => 'https://ecoeat-qa.com/permit.pdf',
            'verification_status' => 'approved',
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
        ]);
        $this->tempData['lks_profile'] = $lksProfile;

        // Wallets
        $buyerWallet = Wallet::create([
            'user_id' => $buyer->id,
            'balance' => 100000.00,
        ]);
        $this->tempData['buyer_wallet'] = $buyerWallet;

        $sellerWallet = Wallet::create([
            'user_id' => $seller->id,
            'balance' => 200000.00,
        ]);
        $this->tempData['seller_wallet'] = $sellerWallet;

        // Products
        $product = Product::create([
            'id' => $this->generateUuid(),
            'seller_profile_id' => $sellerProfile->id,
            'title' => "QA Donated Bread {$sessionShort}",
            'description' => "Doc bread",
            'price' => 15000.00,
            'stock_quantity' => 10,
            'is_donation' => true,
            'expiry_date' => now()->addDays(2),
            'status' => 'active',
        ]);
        $this->tempData['product'] = $product;

        // Orders
        $order = Order::create([
            'id' => $this->generateUuid(),
            'order_code' => 'ORD-DOC-' . strtoupper(Str::random(5)),
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'order_type' => 'purchase',
            'order_status' => 'completed',
            'subtotal' => 30000.00,
            'delivery_fee' => 5000.00,
            'platform_fee' => 2000.00,
            'total_amount' => 37000.00,
            'total_portions' => 2,
            'notes' => $tagNote,
            'ordered_at' => now(),
            'completed_at' => now()
        ]);
        $this->tempData['order'] = $order;

        $donationOrder = Order::create([
            'id' => $this->generateUuid(),
            'order_code' => 'DON-DOC-' . strtoupper(Str::random(5)),
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'lks_id' => $lksProfile->id,
            'order_type' => 'donation',
            'order_status' => 'completed',
            'subtotal' => 15000.00,
            'delivery_fee' => 0.00,
            'platform_fee' => 0.00,
            'total_amount' => 15000.00,
            'total_portions' => 1,
            'notes' => $tagNote,
            'ordered_at' => now(),
            'completed_at' => now()
        ]);
        $this->tempData['donation_order'] = $donationOrder;

        // Deliveries
        $delivery = Delivery::create([
            'id' => $this->generateUuid(),
            'order_id' => $order->id,
            'courier_id' => $courier->id,
            'delivery_status' => 'delivered',
            'pickup_address' => 'QA Seller Pickup Point',
            'destination_address' => 'Doc Address',
            'distance_km' => 2.50,
            'picked_up_at' => now(),
            'delivered_at' => now(),
        ]);
        $this->tempData['delivery'] = $delivery;

        $donationDelivery = Delivery::create([
            'id' => $this->generateUuid(),
            'order_id' => $donationOrder->id,
            'courier_id' => $courier->id,
            'delivery_status' => 'delivered',
            'pickup_address' => 'QA Seller Pickup Point',
            'destination_address' => 'LKS Orphanage Address',
            'distance_km' => 3.10,
            'picked_up_at' => now(),
            'delivered_at' => now(),
        ]);
        $this->tempData['donation_delivery'] = $donationDelivery;

        // Transactions
        $tx = WalletTransaction::create([
            'wallet_id' => $buyerWallet->id,
            'order_id' => $order->id,
            'transaction_type' => 'purchase',
            'transaction_status' => 'completed',
            'amount' => -37000.00,
            'description' => $tagNote,
        ]);
        $this->tempData['transaction'] = $tx;

        // Withdrawals
        $withdrawal = WithdrawalRequest::create([
            'id' => $this->generateUuid(),
            'user_id' => $buyer->id,
            'wallet_id' => $buyerWallet->id,
            'amount' => 50000.00,
            'bank_name' => 'Bank Mandiri',
            'account_name' => 'Buyer Account',
            'account_number' => '123123123',
            'status' => 'pending',
            'created_at' => now(),
        ]);
        $this->tempData['withdrawal'] = $withdrawal;
    }

    private function dispatchRequest(string $method, string $uri, array $payload = [], ?User $user = null): array
    {
        DB::disconnect();
        DB::reconnect();

        $startTime = microtime(true);

        $request = Request::create($uri, $method, $payload);
        $request->headers->set('Accept', 'application/json');

        // Reset guards to prevent singleton bleeding
        $auth = app('auth');
        $auth->forgetUser();
        
        $reflector = new \ReflectionClass($auth);
        $property = $reflector->getProperty('guards');
        $property->setAccessible(true);
        $property->setValue($auth, []);

        if ($user) {
            $request->setUserResolver(fn() => $user);
            Auth::guard('sanctum')->setUser($user);
        } else {
            $request->setUserResolver(fn() => null);
        }

        try {
            $response = app()->handle($request);
            $statusCode = $response->getStatusCode();
            
            // Check if it's a streamed response
            if ($response instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
                ob_start();
                $response->sendContent();
                $content = ob_get_clean();
                $responseJson = $content;
            } else {
                $content = $response->getContent();
                $responseJson = json_decode($content, true) ?: $content;
            }
        } catch (\Throwable $e) {
            $statusCode = 500;
            $responseJson = ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()];
        }

        $endTime = microtime(true);
        $executionTimeMs = round(($endTime - $startTime) * 1000, 2);

        return [
            'status' => $statusCode,
            'response' => $responseJson,
            'time_ms' => $executionTimeMs,
        ];
    }

    private function recordTestCase(
        string $id,
        string $module,
        string $endpoint,
        string $method,
        string $scenario,
        string $precondition,
        array $headers,
        array $body,
        int $expectedStatus,
        array $actualResult
    ): void {
        $actualStatus = $actualResult['status'];
        $actualResponse = $actualResult['response'];

        $pass = ($actualStatus === $expectedStatus);

        $this->testCases[] = [
            'Test Case ID' => $id,
            'Modul/Fitur' => $module,
            'Endpoint' => $endpoint,
            'Method' => $method,
            'Skenario Pengujian' => $scenario,
            'Pre-condition' => $precondition,
            'Headers' => json_encode($headers),
            'Request Body' => json_encode($body),
            'Expected Status Code' => $expectedStatus,
            'Expected Response' => $expectedStatus === 200 || $expectedStatus === 201 ? 'Success Payload JSON' : 'Error Response / Validation Message',
            'Actual Status Code' => $actualStatus,
            'Actual Response' => is_array($actualResponse) ? json_encode($actualResponse) : substr($actualResponse, 0, 500),
            'Status (Pass/Fail)' => $pass ? 'Pass' : 'Fail',
            'execution_time_ms' => $actualResult['time_ms']
        ];

        $statusMark = $pass ? "✅ Pass" : "❌ Fail";
        $this->line("  [{$id}] {$scenario} -> {$actualStatus} ({$statusMark})");
    }

    private function runAuthScenarios(): void
    {
        $this->info("\nRunning Authentication & Security Scenarios...");
        $courier = $this->tempData['courier'];
        $buyer = $this->tempData['buyer'];
        $seller = $this->tempData['seller'];
        $lks = $this->tempData['lks'];

        // 18. Authentication login flow (Sanctum protected check)
        $this->recordTestCase(
            'TC_AUTH_01', 'Auth', '/api/admin/verifications', 'GET',
            'Authentication login flow - Guest block', 'No Authentication Header',
            ['Accept' => 'application/json'], [], 401,
            $this->dispatchRequest('GET', '/api/admin/verifications')
        );

        // 19. Sanctum protected routes
        $this->recordTestCase(
            'TC_AUTH_02', 'Auth', '/api/courier/deliveries/available', 'GET',
            'Sanctum protected route - Guest courier pool check', 'No Authentication Header',
            ['Accept' => 'application/json'], [], 401,
            $this->dispatchRequest('GET', '/api/courier/deliveries/available')
        );

        // 20. Role middleware access validation
        $this->recordTestCase(
            'TC_AUTH_03', 'Auth', '/api/admin/verifications', 'GET',
            'Role middleware - Courier accesses admin panel', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 403,
            $this->dispatchRequest('GET', '/api/admin/verifications', [], $courier)
        );

        // 21. Unauthorized access handling
        $this->recordTestCase(
            'TC_AUTH_04', 'Auth', '/api/seller/analytics/dashboard', 'GET',
            'Unauthorized access handling - Guest analytics dashboard', 'No Authentication Header',
            ['Accept' => 'application/json'], [], 401,
            $this->dispatchRequest('GET', '/api/seller/analytics/dashboard')
        );

        // 22. Forbidden access handling
        $this->recordTestCase(
            'TC_AUTH_05', 'Auth', '/api/lks/analytics/dashboard', 'GET',
            'Forbidden access handling - Buyer accesses LKS analytics', 'Authenticated as Buyer',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 403,
            $this->dispatchRequest('GET', '/api/lks/analytics/dashboard', [], $buyer)
        );
    }

    private function runDeliveryScenarios(): void
    {
        $this->info("\nRunning Delivery Ecosystem Scenarios...");
        $courier = $this->tempData['courier'];
        $buyer = $this->tempData['buyer'];
        $order = $this->tempData['order'];
        $delivery = $this->tempData['delivery'];

        // 1. Courier pool system (GET available pool)
        $this->recordTestCase(
            'TC_DELIVERY_01', 'Delivery', '/api/courier/deliveries/available', 'GET',
            'Courier pool system - Retrieve available pool', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/courier/deliveries/available', [], $courier)
        );

        // 2. Delivery assignment flow (POST take order)
        // Set order back to ready_for_delivery to allow taking assignment
        DB::table('orders')->where('id', $order->id)->update(['order_status' => 'ready_for_delivery']);
        DB::table('deliveries')->where('id', $delivery->id)->update(['delivery_status' => 'available_for_courier', 'courier_id' => null]);

        $this->recordTestCase(
            'TC_DELIVERY_02', 'Delivery', "/api/courier/deliveries/{$order->id}/take", 'POST',
            'Delivery assignment flow - Assign order to courier', 'Authenticated as Courier, Order is ready_for_delivery',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('POST', "/api/courier/deliveries/{$order->id}/take", [], $courier)
        );

        // Restore assignment to courier
        DB::table('orders')->where('id', $order->id)->update(['order_status' => 'in_delivery']);
        DB::table('deliveries')->where('id', $delivery->id)->update(['delivery_status' => 'on_delivery', 'courier_id' => $courier->id]);

        // 3. Delivery assignment flow - Invalid UUID
        $this->recordTestCase(
            'TC_DELIVERY_03', 'Delivery', '/api/courier/deliveries/invalid-uuid/take', 'POST',
            'Delivery assignment flow - Invalid UUID parameter', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 422,
            $this->dispatchRequest('POST', '/api/courier/deliveries/invalid-uuid/take', [], $courier)
        );

        // 4. Delivery tracking API (GET delivery detail)
        $this->recordTestCase(
            'TC_DELIVERY_04', 'Delivery', "/api/courier/deliveries/{$delivery->id}", 'GET',
            'Delivery tracking API - Retrieve details', 'Authenticated as Courier assigned to delivery',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', "/api/courier/deliveries/{$delivery->id}", [], $courier)
        );

        // 5. Delivery tracking API (PATCH status update)
        $this->recordTestCase(
            'TC_DELIVERY_05', 'Delivery', "/api/courier/deliveries/{$delivery->id}/status", 'PATCH',
            'Delivery tracking API - Update delivery status to delivered', 'Authenticated as Courier, status is on_delivery',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['status' => 'delivered'], 200,
            $this->dispatchRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['status' => 'delivered'], $courier)
        );

        // 6. Delivery tracking API - Invalid State Transition (already delivered)
        $this->recordTestCase(
            'TC_DELIVERY_06', 'Delivery', "/api/courier/deliveries/{$delivery->id}/status", 'PATCH',
            'Delivery tracking API - Blocked transition once delivered', 'Authenticated as Courier, status is delivered',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['status' => 'picked_up'], 422,
            $this->dispatchRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['status' => 'picked_up'], $courier)
        );

        // 7. Courier failed delivery report
        DB::table('orders')->where('id', $order->id)->update(['order_status' => 'in_delivery']);
        DB::table('deliveries')->where('id', $delivery->id)->update(['delivery_status' => 'on_delivery']);

        $this->recordTestCase(
            'TC_DELIVERY_07', 'Delivery', "/api/courier/deliveries/{$delivery->id}/failed", 'PATCH',
            'Delivery tracking API - Mark delivery as failed', 'Authenticated as Courier, status is on_delivery',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['failure_reason' => 'recipient_not_found', 'notes' => 'Recipient unreachable'], 200,
            $this->dispatchRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/failed", ['failure_reason' => 'recipient_not_found', 'notes' => 'Recipient unreachable'], $courier)
        );

        // Restore to completed state for reports/analytics
        DB::table('orders')->where('id', $order->id)->update(['order_status' => 'completed']);
        DB::table('deliveries')->where('id', $delivery->id)->update(['delivery_status' => 'delivered']);

        // 8. Tracking logs
        $this->recordTestCase(
            'TC_DELIVERY_08', 'Delivery', "/api/courier/deliveries/{$delivery->id}/tracking", 'GET',
            'Tracking logs - Retrieve tracking logs history', 'Authenticated as Courier assigned to delivery',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', "/api/courier/deliveries/{$delivery->id}/tracking", [], $courier)
        );

        // 9. Live location update API
        $this->recordTestCase(
            'TC_DELIVERY_09', 'Delivery', "/api/courier/deliveries/{$delivery->id}/location", 'POST',
            'Live location update API - Broadcast coordinates', 'Authenticated as Courier, delivery active',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['latitude' => -6.9745, 'longitude' => 107.632], 200,
            $this->dispatchRequest('POST', "/api/courier/deliveries/{$delivery->id}/location", ['latitude' => -6.9745, 'longitude' => 107.632], $courier)
        );

        // 10. Live location update - Validation error
        $this->recordTestCase(
            'TC_DELIVERY_10', 'Delivery', "/api/courier/deliveries/{$delivery->id}/location", 'POST',
            'Live location update API - Missing latitude field', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['longitude' => 107.632], 422,
            $this->dispatchRequest('POST', "/api/courier/deliveries/{$delivery->id}/location", ['longitude' => 107.632], $courier)
        );
    }

    private function runDonationScenarios(): void
    {
        $this->info("\nRunning Donation Ecosystem Scenarios...");
        $seller = $this->tempData['seller'];
        $lks = $this->tempData['lks'];
        $product = $this->tempData['product'];
        $lksProfile = $this->tempData['lks_profile'];
        $donationDelivery = $this->tempData['donation_delivery'];

        // 1. Donation product flow (POST store donation)
        $this->recordTestCase(
            'TC_DONATION_01', 'Donation', '/api/seller/donations', 'POST',
            'Donation product flow - Seller offers donation', 'Authenticated as Seller',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'],
            [
                'product_id' => $product->id,
                'lks_id' => $lks->id,
                'notes' => 'Donation test'
            ], 201,
            $this->dispatchRequest('POST', '/api/seller/donations', [
                'product_id' => $product->id,
                'lks_id' => $lks->id,
                'notes' => 'Donation test'
            ], $seller)
        );

        // 2. Donation product flow - Missing Field
        $this->recordTestCase(
            'TC_DONATION_02', 'Donation', '/api/seller/donations', 'POST',
            'Donation product flow - Missing product_id parameter', 'Authenticated as Seller',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'],
            [
                'lks_id' => $lks->id,
                'notes' => 'Donation test'
            ], 422,
            $this->dispatchRequest('POST', '/api/seller/donations', [
                'lks_id' => $lks->id,
                'notes' => 'Donation test'
            ], $seller)
        );

        // 3. LKS offer flow (incoming queue)
        $this->recordTestCase(
            'TC_DONATION_03', 'Donation', '/api/lks/donations/incoming', 'GET',
            'LKS offer flow - List incoming queue', 'Authenticated as LKS Foundation user',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/lks/donations/incoming', [], $lks)
        );

        // 4. LKS accept flow
        DB::table('deliveries')->where('id', $donationDelivery->id)->update(['delivery_status' => 'waiting_lks_confirmation']);

        $this->recordTestCase(
            'TC_DONATION_04', 'Donation', "/api/lks/donations/{$donationDelivery->id}/accept", 'PATCH',
            'LKS accept flow - Accept incoming donation offer', 'Authenticated as LKS, status is waiting_lks_confirmation',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('PATCH', "/api/lks/donations/{$donationDelivery->id}/accept", [], $lks)
        );

        // 5. LKS reject flow
        DB::table('deliveries')->where('id', $donationDelivery->id)->update(['delivery_status' => 'waiting_lks_confirmation']);

        $this->recordTestCase(
            'TC_DONATION_05', 'Donation', "/api/lks/donations/{$donationDelivery->id}/reject", 'PATCH',
            'LKS reject flow - Reject incoming donation offer', 'Authenticated as LKS, status is waiting_lks_confirmation',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('PATCH', "/api/lks/donations/{$donationDelivery->id}/reject", [], $lks)
        );

        // Restore to delivered state
        DB::table('deliveries')->where('id', $donationDelivery->id)->update(['delivery_status' => 'delivered']);

        // 6. LKS history queue
        $this->recordTestCase(
            'TC_DONATION_06', 'Donation', '/api/lks/donations/history', 'GET',
            'LKS history queue - List donation records history', 'Authenticated as LKS',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/lks/donations/history', [], $lks)
        );

        // 7. LKS dashboard queue
        $this->recordTestCase(
            'TC_DONATION_07', 'Donation', '/api/lks/dashboard', 'GET',
            'LKS dashboard queue - Retrieve donation statistics', 'Authenticated as LKS',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/lks/dashboard', [], $lks)
        );
    }

    private function runAnalyticsScenarios(): void
    {
        $this->info("\nRunning Analytics Ecosystem Scenarios...");
        $seller = $this->tempData['seller'];
        $courier = $this->tempData['courier'];
        $lks = $this->tempData['lks'];
        $admin = $this->tempData['admin'];

        // 1. Seller analytics - dashboard
        $this->recordTestCase(
            'TC_ANALYTICS_01', 'Analytics', '/api/seller/analytics/dashboard', 'GET',
            'Seller analytics - Retrieve dashboard total metrics', 'Authenticated as Seller',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/seller/analytics/dashboard', [], $seller)
        );

        // 2. Seller analytics - revenue chart
        $this->recordTestCase(
            'TC_ANALYTICS_02', 'Analytics', '/api/seller/analytics/revenue-chart', 'GET',
            'Seller analytics - Retrieve daily revenue aggregations', 'Authenticated as Seller',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/seller/analytics/revenue-chart', [], $seller)
        );

        // 3. Seller analytics - top products
        $this->recordTestCase(
            'TC_ANALYTICS_03', 'Analytics', '/api/seller/analytics/top-products', 'GET',
            'Seller analytics - Retrieve top selling items', 'Authenticated as Seller',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/seller/analytics/top-products', [], $seller)
        );

        // 4. Courier analytics - dashboard
        $this->recordTestCase(
            'TC_ANALYTICS_04', 'Analytics', '/api/courier/analytics/dashboard', 'GET',
            'Courier analytics - Retrieve dashboard delivery statistics', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/courier/analytics/dashboard', [], $courier)
        );

        // 5. Courier analytics - history
        $this->recordTestCase(
            'TC_ANALYTICS_05', 'Analytics', '/api/courier/analytics/history', 'GET',
            'Courier analytics - List completed deliveries history', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/courier/analytics/history', [], $courier)
        );

        // 6. LKS analytics - dashboard
        $this->recordTestCase(
            'TC_ANALYTICS_06', 'Analytics', '/api/lks/analytics/dashboard', 'GET',
            'LKS analytics - Retrieve dashboard total analytics', 'Authenticated as LKS',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/lks/analytics/dashboard', [], $lks)
        );

        // 7. LKS analytics - top sellers
        $this->recordTestCase(
            'TC_ANALYTICS_07', 'Analytics', '/api/lks/analytics/top-sellers', 'GET',
            'LKS analytics - Retrieve top donating sellers', 'Authenticated as LKS',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/lks/analytics/top-sellers', [], $lks)
        );

        // 8. Admin dashboard analytics
        $this->recordTestCase(
            'TC_ANALYTICS_08', 'Analytics', '/api/admin/analytics/dashboard', 'GET',
            'Admin dashboard - Retrieve platform statistics', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/analytics/dashboard', [], $admin)
        );

        // 9. Admin verifications analytics
        $this->recordTestCase(
            'TC_ANALYTICS_09', 'Analytics', '/api/admin/analytics/verifications', 'GET',
            'Admin dashboard - Retrieve registration verifications chart', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/analytics/verifications', [], $admin)
        );

        // 10. Admin transactions analytics
        $this->recordTestCase(
            'TC_ANALYTICS_10', 'Analytics', '/api/admin/analytics/transactions', 'GET',
            'Admin dashboard - Retrieve platform financial analytics', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/analytics/transactions', [], $admin)
        );
    }

    private function runAdminScenarios(): void
    {
        $this->info("\nRunning Admin Ecosystem Scenarios...");
        $admin = $this->tempData['admin'];
        $seller = $this->tempData['seller'];
        $tx = $this->tempData['transaction'];
        $withdrawal = $this->tempData['withdrawal'];

        // 1. Verification moderation (GET moderation list)
        $this->recordTestCase(
            'TC_ADMIN_01', 'Admin', '/api/admin/verifications', 'GET',
            'Verification moderation - List pending verifications', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['role' => 'seller', 'verification_status' => 'pending'], 200,
            $this->dispatchRequest('GET', '/api/admin/verifications', ['role' => 'seller', 'verification_status' => 'pending'], $admin)
        );

        // 2. Verification moderation - Validation error
        $this->recordTestCase(
            'TC_ADMIN_02', 'Admin', '/api/admin/verifications', 'GET',
            'Verification moderation - Invalid role filter', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['role' => 'invalid_role_name'], 422,
            $this->dispatchRequest('GET', '/api/admin/verifications', ['role' => 'invalid_role_name'], $admin)
        );

        // Set status to pending
        DB::table('users')->where('id', $seller->id)->update(['verification_status' => 'pending', 'is_verified' => false]);
        DB::table('seller_profiles')->where('user_id', $seller->id)->update(['verification_status' => 'pending']);

        // 3. Verification moderation (PATCH approve)
        $this->recordTestCase(
            'TC_ADMIN_03', 'Admin', "/api/admin/verifications/{$seller->id}/approve", 'PATCH',
            'Verification moderation - Approve seller verification', 'Authenticated as Admin, status is pending',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['notes' => 'Valid document approved'], 200,
            $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/approve", ['notes' => 'Valid document approved'], $admin)
        );

        // 4. Verification moderation (PATCH undo)
        $this->recordTestCase(
            'TC_ADMIN_04', 'Admin', "/api/admin/verifications/{$seller->id}/undo", 'PATCH',
            'Verification moderation - Revert verification status to pending', 'Authenticated as Admin, status is approved',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['notes' => 'Undo approval to review'], 200,
            $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/undo", ['notes' => 'Undo approval to review'], $admin)
        );

        // 5. Verification moderation (PATCH reject)
        $this->recordTestCase(
            'TC_ADMIN_05', 'Admin', "/api/admin/verifications/{$seller->id}/reject", 'PATCH',
            'Verification moderation - Reject seller verification', 'Authenticated as Admin, status is pending',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], ['notes' => 'Incomplete paperwork'], 200,
            $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/reject", ['notes' => 'Incomplete paperwork'], $admin)
        );

        // Revert to approved to keep clean
        DB::table('users')->where('id', $seller->id)->update(['verification_status' => 'approved', 'is_verified' => true]);
        DB::table('seller_profiles')->where('user_id', $seller->id)->update(['verification_status' => 'approved']);

        // 6. Admin transaction monitoring (GET list)
        $this->recordTestCase(
            'TC_ADMIN_06', 'Admin', '/api/admin/transactions', 'GET',
            'Admin transaction monitoring - Retrieve all transactions', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/transactions', [], $admin)
        );

        // 7. Admin transaction monitoring (GET detail)
        $this->recordTestCase(
            'TC_ADMIN_07', 'Admin', "/api/admin/transactions/{$tx->id}", 'GET',
            'Admin transaction monitoring - Retrieve specific detail', 'Authenticated as Admin, transaction exists',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', "/api/admin/transactions/{$tx->id}", [], $admin)
        );

        // 8. Admin transaction monitoring - Invalid UUID
        $this->recordTestCase(
            'TC_ADMIN_08', 'Admin', '/api/admin/transactions/invalid-uuid', 'GET',
            'Admin transaction monitoring - Invalid UUID format', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 404,
            $this->dispatchRequest('GET', '/api/admin/transactions/invalid-uuid', [], $admin)
        );

        // 9. Admin withdrawal requests (GET withdrawals)
        $this->recordTestCase(
            'TC_ADMIN_09', 'Admin', '/api/admin/withdrawals', 'GET',
            'Admin transaction monitoring - List withdrawal requests', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/withdrawals', [], $admin)
        );

        // 10. Admin withdrawal detail (GET detail)
        $this->recordTestCase(
            'TC_ADMIN_10', 'Admin', "/api/admin/withdrawals/{$withdrawal->id}", 'GET',
            'Admin transaction monitoring - Retrieve withdrawal detail', 'Authenticated as Admin, request exists',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', "/api/admin/withdrawals/{$withdrawal->id}", [], $admin)
        );
    }

    private function runSecurityScenarios(): void
    {
        $this->info("\nRunning Authorization & Ownership Security Scenarios...");
        $buyer = $this->tempData['buyer'];
        $seller = $this->tempData['seller'];
        $courier = $this->tempData['courier'];
        $lks = $this->tempData['lks'];
        $delivery = $this->tempData['delivery'];
        $admin = $this->tempData['admin'];

        // 11. Export CSV - Users
        $this->recordTestCase(
            'TC_EXPORTS_01', 'Exports', '/api/admin/export/users', 'GET',
            'Export CSV - Stream download users list', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/export/users', [], $admin)
        );

        // 12. Export CSV - Transactions
        $this->recordTestCase(
            'TC_EXPORTS_02', 'Exports', '/api/admin/export/transactions', 'GET',
            'Export CSV - Stream download transactions list', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/export/transactions', [], $admin)
        );

        // 13. Export CSV - Reports
        $this->recordTestCase(
            'TC_EXPORTS_03', 'Exports', '/api/admin/export/reports', 'GET',
            'Export CSV - Stream download orders report', 'Authenticated as Admin',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 200,
            $this->dispatchRequest('GET', '/api/admin/export/reports', [], $admin)
        );

        // Buyer cannot access courier endpoints
        $this->recordTestCase(
            'TC_SECURITY_01', 'Security', '/api/courier/deliveries/available', 'GET',
            'Authorization - Buyer forbidden from courier pool', 'Authenticated as Buyer',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 403,
            $this->dispatchRequest('GET', '/api/courier/deliveries/available', [], $buyer)
        );

        // Courier cannot access admin endpoints
        $this->recordTestCase(
            'TC_SECURITY_02', 'Security', '/api/admin/verifications', 'GET',
            'Authorization - Courier forbidden from admin verifications', 'Authenticated as Courier',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 403,
            $this->dispatchRequest('GET', '/api/admin/verifications', [], $courier)
        );

        // Seller cannot access courier-only endpoints
        $this->recordTestCase(
            'TC_SECURITY_03', 'Security', "/api/courier/deliveries/{$delivery->id}", 'GET',
            'Authorization - Seller forbidden from delivery detail', 'Authenticated as Seller',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 403,
            $this->dispatchRequest('GET', "/api/courier/deliveries/{$delivery->id}", [], $seller)
        );

        // LKS cannot access admin-only endpoints
        $this->recordTestCase(
            'TC_SECURITY_04', 'Security', '/api/admin/transactions', 'GET',
            'Authorization - LKS forbidden from admin transaction monitoring', 'Authenticated as LKS',
            ['Accept' => 'application/json', 'Authorization' => 'Bearer ***'], [], 403,
            $this->dispatchRequest('GET', '/api/admin/transactions', [], $lks)
        );
    }

    private function exportResults(): void
    {
        $reportDir = storage_path('app/qa-reports');
        if (!is_dir($reportDir)) {
            mkdir($reportDir, 0755, true);
        }

        $routesList = [];
        foreach (Route::getRoutes() as $route) {
            $uri = $route->uri();
            if (str_starts_with($uri, 'api/')) {
                $routesList[] = [
                    'uri' => '/' . $uri,
                    'method' => implode('|', $route->methods()),
                    'controller' => $route->getActionName(),
                    'middleware' => $route->gatherMiddleware(),
                ];
            }
        }

        $jsonFile = "{$reportDir}/api_raw_results.json";
        file_put_contents($jsonFile, json_encode([
            'session_id' => $this->qaSessionId,
            'timestamp' => now()->toDateTimeString(),
            'total_cases' => count($this->testCases),
            'test_cases' => $this->testCases,
            'routes' => $routesList,
        ], JSON_PRETTY_PRINT));

        $this->info("Raw test results written to: {$jsonFile}");
    }
}
