<?php

namespace App\Console\Commands\QA;

use App\Models\User;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\LksProfile;
use App\Models\Order;
use App\Models\Delivery;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RunAnalyticsQa extends Command
{
    protected $signature = 'ecoeat:analytics-qa';
    protected $description = 'Run EcoEat Flow-Based Analytics QA & Performance Audit';

    private string $qaSessionId;
    private array $report = [];
    private array $results = [];
    private array $tempData = [];
    private array $queryLog = [];
    private array $currentRequestQueries = [];
    private bool $profileRequests = false;

    public function handle(): int
    {
        $this->qaSessionId = (string) Str::uuid();
        $this->info("Starting EcoEat Analytics QA Session: {$this->qaSessionId}");

        // Enable query listening for N+1 and execution time profiling
        DB::listen(function ($query) {
            $this->queryLog[] = [
                'sql' => $query->sql,
                'time' => $query->time
            ];

            if ($this->profileRequests) {
                $this->currentRequestQueries[] = [
                    'sql' => $query->sql,
                    'time' => $query->time
                ];
            }
        });

        // 1. Seed Transient QA Data (with QA tagging metadata, no cleanup)
        $this->setupTestData();

        // 2. Run Flow-Based Scenarios
        $this->runSellerFlowQa();
        $this->runCourierFlowQa();
        $this->runLksFlowQa();
        $this->runAdminFlowQa();
        $this->runSecurityQa();

        // 3. Performance Audit Summary
        $perfSummary = $this->compilePerformanceAudit();

        // 4. Generate Reports
        $this->generateReports($perfSummary);

        $this->info("QA Execution Completed. Report written to storage/app/qa-reports/analytics/");
        return self::SUCCESS;
    }

    private function generateUuid(): string
    {
        return (string) Str::uuid();
    }

    private function setupTestData(): void
    {
        $sessionShort = substr($this->qaSessionId, 0, 8);

        // A. Users & Profiles
        // 1. Seller
        $seller = User::create([
            'full_name' => "QA Seller {$sessionShort}",
            'email' => "seller_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'),
            'role' => 'seller',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['seller'] = $seller;
        
        $sellerProfile = SellerProfile::create([
            'id' => $this->generateUuid(),
            'user_id' => $seller->id,
            'business_name' => "QA Business {$sessionShort}",
            'business_type' => 'Restaurant',
            'legal_document_url' => 'https://ecoeat-qa.com/legal.pdf',
            'verification_status' => 'approved',
        ]);
        $this->tempData['seller_profile'] = $sellerProfile;

        // 2. Courier
        $courier = User::create([
            'full_name' => "QA Courier {$sessionShort}",
            'email' => "courier_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'),
            'role' => 'courier',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['courier'] = $courier;

        DB::table('courier_profiles')->insert([
            'id' => $this->generateUuid(),
            'user_id' => $courier->id,
            'vehicle_type' => 'Motorcycle',
            'vehicle_plate_number' => "QA-{$sessionShort}",
            'driver_license_url' => 'https://ecoeat-qa.com/license.pdf',
            'vehicle_registration_url' => 'https://ecoeat-qa.com/stnk.pdf',
            'verification_status' => 'approved',
            'created_at' => now(),
        ]);

        // 3. LKS
        $lks = User::create([
            'full_name' => "QA LKS {$sessionShort}",
            'email' => "lks_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'),
            'role' => 'lks',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['lks'] = $lks;

        $lksProfile = LksProfile::create([
            'id' => $this->generateUuid(),
            'user_id' => $lks->id,
            'foundation_name' => "QA LKS Foundation {$sessionShort}",
            'lks_category' => 'Orphanage',
            'legal_permit_number' => "PERMIT-{$sessionShort}",
            'legal_document_url' => 'https://ecoeat-qa.com/permit.pdf',
            'storage_type' => 'Cold Storage',
            'storage_capacity' => 150,
            'beneficiaries_count' => 50,
            'verification_status' => 'approved',
        ]);
        $this->tempData['lks_profile'] = $lksProfile;

        // 4. Admin
        $admin = User::create([
            'full_name' => "QA Admin {$sessionShort}",
            'email' => "admin_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'),
            'role' => 'admin',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['admin'] = $admin;

        // 5. Buyer (Generic test customer)
        $buyer = User::create([
            'full_name' => "QA Buyer {$sessionShort}",
            'email' => "buyer_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'),
            'role' => 'buyer',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['buyer'] = $buyer;

        // Create Wallet for Buyer (for withdrawal tests)
        $walletId = $this->generateUuid();
        DB::table('wallets')->insert([
            'id' => $walletId,
            'user_id' => $buyer->id,
            'balance' => 500000.00,
            'created_at' => now(),
        ]);
        $this->tempData['buyer_wallet_id'] = $walletId;

        // B. Products
        $product1 = Product::create([
            'id' => $this->generateUuid(),
            'seller_profile_id' => $sellerProfile->id,
            'title' => "QA Product 1 {$sessionShort}",
            'description' => 'Test food product description',
            'price' => 15000.00,
            'original_price' => 20000.00,
            'stock_quantity' => 10,
            'portion_quantity' => 1,
            'expiry_date' => now()->addDays(2),
            'is_donation' => false,
            'status' => 'active',
        ]);
        $this->tempData['product_1'] = $product1;

        $productDonation = Product::create([
            'id' => $this->generateUuid(),
            'seller_profile_id' => $sellerProfile->id,
            'title' => "QA Donation Food {$sessionShort}",
            'description' => 'Test donation food description',
            'price' => 0.00,
            'original_price' => 12000.00,
            'stock_quantity' => 50,
            'portion_quantity' => 1,
            'expiry_date' => now()->addDays(3),
            'is_donation' => true,
            'target_lks_id' => $lksProfile->id,
            'status' => 'active',
        ]);
        $this->tempData['product_donation'] = $productDonation;
    }

    private function dispatchRequest(string $method, string $uri, array $payload = [], ?User $user = null): array
    {
        DB::disconnect();
        DB::reconnect();

        $this->currentRequestQueries = [];
        $this->profileRequests = true;

        $request = Request::create($uri, $method, $payload);
        $request->headers->set('Accept', 'application/json');

        if ($user) {
            $request->setUserResolver(fn() => $user);
            Auth::guard('sanctum')->setUser($user);
        } else {
            $request->setUserResolver(fn() => null);
            $auth = app('auth');
            $auth->forgetUser();
            
            $reflector = new \ReflectionClass($auth);
            $property = $reflector->getProperty('guards');
            $property->setAccessible(true);
            $property->setValue($auth, []);
        }

        $response = app()->handle($request);

        $this->profileRequests = false;
        $queries = $this->currentRequestQueries;

        $sqlList = array_column($queries, 'sql');
        $uniqueSql = array_unique($sqlList);
        $duplicates = count($sqlList) - count($uniqueSql);
        $totalTime = array_sum(array_column($queries, 'time'));

        $endpointKey = "{$method} {$uri}";
        if (!isset($this->tempData['endpoints'][$endpointKey])) {
            $this->tempData['endpoints'][$endpointKey] = [];
        }
        $this->tempData['endpoints'][$endpointKey][] = [
            'queries' => count($queries),
            'duplicates' => $duplicates,
            'time' => $totalTime,
            'details' => $queries
        ];

        return [
            'status' => $response->getStatusCode(),
            'json' => json_decode($response->getContent(), true)
        ];
    }

    private function recordVerdict(string $flow, string $scenario, string $expected, string $actual, bool $pass, array $payload = [], array $response = []): void
    {
        $this->results[] = [
            'flow' => $flow,
            'scenario' => $scenario,
            'expected' => $expected,
            'actual' => $actual,
            'pass' => $pass,
            'payload' => $payload,
            'response' => $response,
            'time' => now()->toDateTimeString()
        ];

        if ($pass) {
            $this->info("PASS: [{$flow}] {$scenario}");
        } else {
            $this->error("FAIL: [{$flow}] {$scenario} | Expected: {$expected} | Actual: {$actual}");
        }
    }

    /**
     * Seller Flow QA
     */
    private function runSellerFlowQa(): void
    {
        $seller = $this->tempData['seller'];
        $buyer = $this->tempData['buyer'];
        $product = $this->tempData['product_1'];

        // 1. Baseline measurements
        $resBefore = $this->dispatchRequest('GET', '/api/seller/analytics/dashboard', [], $seller);
        $beforeStats = $resBefore['json']['data'] ?? [];

        // 2. Execute flow: Create completed purchase order
        $orderId = $this->generateUuid();
        $orderCode = 'QA-S-' . strtoupper(Str::random(5));
        
        DB::table('orders')->insert([
            'id' => $orderId,
            'order_code' => $orderCode,
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'order_type' => 'purchase',
            'order_status' => 'completed',
            'subtotal' => 30000.00,
            'delivery_fee' => 5000.00,
            'platform_fee' => 1500.00,
            'total_amount' => 36500.00, // subtotal + delivery + platform
            'total_portions' => 2,
            'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa",
            'ordered_at' => now(),
            'completed_at' => now(),
        ]);

        DB::table('order_items')->insert([
            'id' => $this->generateUuid(),
            'order_id' => $orderId,
            'product_id' => $product->id,
            'quantity' => 2,
            'price' => 15000.00,
            'total_price' => 30000.00,
            'portion_quantity' => 1
        ]);

        // 3. Post-flow measurements
        $resAfter = $this->dispatchRequest('GET', '/api/seller/analytics/dashboard', [], $seller);
        $afterStats = $resAfter['json']['data'] ?? [];

        $diffRevenue = ($afterStats['total_revenue'] ?? 0.0) - ($beforeStats['total_revenue'] ?? 0.0);
        $diffOrders = ($afterStats['total_orders'] ?? 0) - ($beforeStats['total_orders'] ?? 0);
        $diffMeals = ($afterStats['meals_saved'] ?? 0) - ($beforeStats['meals_saved'] ?? 0);

        $this->recordVerdict(
            'Seller Flow',
            'Total Revenue increment on completed purchase order',
            '36500.00',
            (string)$diffRevenue,
            abs($diffRevenue - 36500.00) < 0.01,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'Seller Flow',
            'Total Orders count increment',
            '1',
            (string)$diffOrders,
            $diffOrders === 1,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'Seller Flow',
            'Meals Saved (quantity) increment',
            '2',
            (string)$diffMeals,
            $diffMeals === 2,
            [],
            $resAfter
        );

        // 4. Verify top products
        $resTop = $this->dispatchRequest('GET', '/api/seller/analytics/top-products', [], $seller);
        $topProducts = $resTop['json']['data']['data'] ?? [];
        $foundProd = collect($topProducts)->firstWhere('product_id', $product->id);
        $passTop = $foundProd && $foundProd['total_quantity'] >= 2 && $foundProd['total_revenue'] >= 30000;

        $this->recordVerdict(
            'Seller Flow',
            'Top Products sorting and inclusion',
            "Includes product {$product->id} with quantity >= 2",
            $foundProd ? "Found: quant={$foundProd['total_quantity']}, rev={$foundProd['total_revenue']}" : 'Not Found',
            (bool)$passTop,
            [],
            $resTop
        );

        // 5. Verify revenue chart
        $resChart = $this->dispatchRequest('GET', '/api/seller/analytics/revenue-chart', [], $seller);
        $chartData = $resChart['json']['data'] ?? [];
        $todayStr = now()->toDateString();
        $todayRevenue = collect($chartData)->firstWhere('date', $todayStr)['revenue'] ?? 0.0;

        $this->recordVerdict(
            'Seller Flow',
            'Revenue Chart daily aggregation for today',
            '36500.00',
            (string)$todayRevenue,
            $todayRevenue >= 36500.00,
            [],
            $resChart
        );
    }

    /**
     * Courier Flow QA
     */
    private function runCourierFlowQa(): void
    {
        $courier = $this->tempData['courier'];
        $buyer = $this->tempData['buyer'];

        // 1. Baseline
        $resBefore = $this->dispatchRequest('GET', '/api/courier/analytics/dashboard', [], $courier);
        $beforeStats = $resBefore['json']['data'] ?? [];

        // 2. Execute: Insert completed and failed deliveries
        // For completed delivery
        $orderId1 = $this->generateUuid();
        DB::table('orders')->insert([
            'id' => $orderId1, 'order_code' => 'QA-C-' . strtoupper(Str::random(5)), 'buyer_id' => $buyer->id, 'seller_id' => $this->tempData['seller']->id,
            'order_type' => 'purchase', 'order_status' => 'completed', 'subtotal' => 10000, 'delivery_fee' => 3000, 'platform_fee' => 1000, 'total_amount' => 14000,
            'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa", 'ordered_at' => now(), 'completed_at' => now()
        ]);
        DB::table('deliveries')->insert([
            'id' => $this->generateUuid(), 'order_id' => $orderId1, 'courier_id' => $courier->id,
            'pickup_address' => 'S1', 'destination_address' => 'B1', 'distance_km' => 6.2, 'delivery_status' => 'delivered',
            'created_at' => now(), 'delivered_at' => now()
        ]);

        // For failed delivery
        $orderId2 = $this->generateUuid();
        DB::table('orders')->insert([
            'id' => $orderId2, 'order_code' => 'QA-C-' . strtoupper(Str::random(5)), 'buyer_id' => $buyer->id, 'seller_id' => $this->tempData['seller']->id,
            'order_type' => 'purchase', 'order_status' => 'cancelled', 'subtotal' => 10000, 'delivery_fee' => 3000, 'platform_fee' => 1000, 'total_amount' => 14000,
            'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa", 'ordered_at' => now()
        ]);
        DB::table('deliveries')->insert([
            'id' => $this->generateUuid(), 'order_id' => $orderId2, 'courier_id' => $courier->id,
            'pickup_address' => 'S1', 'destination_address' => 'B2', 'distance_km' => 3.5, 'delivery_status' => 'failed',
            'created_at' => now()
        ]);

        // 3. Post-flow measurements
        $resAfter = $this->dispatchRequest('GET', '/api/courier/analytics/dashboard', [], $courier);
        $afterStats = $resAfter['json']['data'] ?? [];

        $diffCompleted = ($afterStats['completed_deliveries'] ?? 0) - ($beforeStats['completed_deliveries'] ?? 0);
        $diffFailed = ($afterStats['failed_deliveries'] ?? 0) - ($beforeStats['failed_deliveries'] ?? 0);
        $diffDistance = ($afterStats['total_distance_km'] ?? 0.0) - ($beforeStats['total_distance_km'] ?? 0.0);

        $this->recordVerdict(
            'Courier Flow',
            'Completed deliveries count increment',
            '1',
            (string)$diffCompleted,
            $diffCompleted === 1,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'Courier Flow',
            'Failed deliveries count increment',
            '1',
            (string)$diffFailed,
            $diffFailed === 1,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'Courier Flow',
            'Total Distance aggregate increment',
            '9.70',
            sprintf('%.2f', $diffDistance),
            abs($diffDistance - 9.7) < 0.01,
            [],
            $resAfter
        );

        // 4. Verify history endpoint
        $resHistory = $this->dispatchRequest('GET', '/api/courier/analytics/history', [], $courier);
        $historyList = $resHistory['json']['data']['data'] ?? [];
        $containsD1 = collect($historyList)->firstWhere('order_id', $orderId1);
        $containsD2 = collect($historyList)->firstWhere('order_id', $orderId2);

        $this->recordVerdict(
            'Courier Flow',
            'History contains new delivery records',
            'Contains both completed and failed order deliveries',
            ($containsD1 && $containsD2) ? 'Contains both' : 'Missing records',
            (bool)($containsD1 && $containsD2),
            [],
            $resHistory
        );
    }

    /**
     * LKS Flow QA
     */
    private function runLksFlowQa(): void
    {
        $lks = $this->tempData['lks'];
        $seller = $this->tempData['seller'];

        // 1. Baseline
        $resBefore = $this->dispatchRequest('GET', '/api/lks/analytics/dashboard', [], $lks);
        $beforeStats = $resBefore['json']['data'] ?? [];

        // 2. Execute: Create completed donation order & rejected donation order
        // Completed donation
        $orderId1 = $this->generateUuid();
        DB::table('orders')->insert([
            'id' => $orderId1, 'order_code' => 'QA-L-' . strtoupper(Str::random(5)), 'buyer_id' => null, 'seller_id' => $seller->id, 'lks_id' => $this->tempData['lks_profile']->id,
            'order_type' => 'donation', 'order_status' => 'completed', 'subtotal' => 0, 'delivery_fee' => 0, 'platform_fee' => 0, 'total_amount' => 0,
            'total_portions' => 15, 'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa", 'ordered_at' => now(), 'completed_at' => now()
        ]);
        DB::table('deliveries')->insert([
            'id' => $this->generateUuid(), 'order_id' => $orderId1, 'courier_id' => $this->tempData['courier']->id,
            'pickup_address' => 'S1', 'destination_address' => 'L1', 'distance_km' => 2.0, 'delivery_status' => 'delivered',
            'created_at' => now(), 'delivered_at' => now()
        ]);

        // Rejected donation (delivery_status = rejected_by_lks, order_status = cancelled)
        $orderId2 = $this->generateUuid();
        DB::table('orders')->insert([
            'id' => $orderId2, 'order_code' => 'QA-L-' . strtoupper(Str::random(5)), 'buyer_id' => null, 'seller_id' => $seller->id, 'lks_id' => $this->tempData['lks_profile']->id,
            'order_type' => 'donation', 'order_status' => 'cancelled', 'subtotal' => 0, 'delivery_fee' => 0, 'platform_fee' => 0, 'total_amount' => 0,
            'total_portions' => 5, 'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa", 'ordered_at' => now(), 'cancelled_at' => now()
        ]);
        DB::table('deliveries')->insert([
            'id' => $this->generateUuid(), 'order_id' => $orderId2, 'courier_id' => null,
            'pickup_address' => 'S1', 'destination_address' => 'L1', 'distance_km' => 0.0, 'delivery_status' => 'rejected_by_lks',
            'created_at' => now(), 'lks_confirmed_at' => now()
        ]);

        // 3. Post-flow measurements
        $resAfter = $this->dispatchRequest('GET', '/api/lks/analytics/dashboard', [], $lks);
        $afterStats = $resAfter['json']['data'] ?? [];

        $diffReceived = ($afterStats['total_donations_received'] ?? 0) - ($beforeStats['total_donations_received'] ?? 0);
        $diffMeals = ($afterStats['total_meals_received'] ?? 0) - ($beforeStats['total_meals_received'] ?? 0);
        $diffCompleted = ($afterStats['completed_donations'] ?? 0) - ($beforeStats['completed_donations'] ?? 0);
        $diffRejected = ($afterStats['rejected_donations'] ?? 0) - ($beforeStats['rejected_donations'] ?? 0);

        $this->recordVerdict(
            'LKS Flow',
            'Total Donations Received count increment',
            '2',
            (string)$diffReceived,
            $diffReceived === 2,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'LKS Flow',
            'Total Meals Received (portions) increment',
            '15',
            (string)$diffMeals,
            $diffMeals === 15,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'LKS Flow',
            'Completed Donations count increment',
            '1',
            (string)$diffCompleted,
            $diffCompleted === 1,
            [],
            $resAfter
        );

        $this->recordVerdict(
            'LKS Flow',
            'Rejected Donations count increment',
            '1',
            (string)$diffRejected,
            $diffRejected === 1,
            [],
            $resAfter
        );

        // 4. Verify top-sellers list
        $resSellers = $this->dispatchRequest('GET', '/api/lks/analytics/top-sellers', [], $lks);
        $topSellersList = $resSellers['json']['data']['data'] ?? [];
        $foundSeller = collect($topSellersList)->firstWhere('seller_id', $seller->id);
        $passSeller = $foundSeller && $foundSeller['total_donations'] >= 1 && $foundSeller['total_portions'] >= 15;

        $this->recordVerdict(
            'LKS Flow',
            'Top Donating Sellers list inclusion',
            "Contains seller {$seller->id} with total portions >= 15",
            $foundSeller ? "Found: portions={$foundSeller['total_portions']}" : 'Not Found',
            (bool)$passSeller,
            [],
            $resSellers
        );
    }

    /**
     * Admin Flow QA
     */
    private function runAdminFlowQa(): void
    {
        $admin = $this->tempData['admin'];
        $buyer = $this->tempData['buyer'];
        $seller = $this->tempData['seller'];

        // 1. Baselines
        $resBeforeDash = $this->dispatchRequest('GET', '/api/admin/analytics/dashboard', [], $admin);
        $beforeDash = $resBeforeDash['json']['data'] ?? [];

        $resBeforeVer = $this->dispatchRequest('GET', '/api/admin/analytics/verifications', [], $admin);
        $beforeVer = $resBeforeVer['json']['data'] ?? [];

        $resBeforeTx = $this->dispatchRequest('GET', '/api/admin/analytics/transactions', [], $admin);
        $beforeTx = $resBeforeTx['json']['data'] ?? [];

        // 2. Execute: Create completed purchase order, verification status modifications, withdrawals
        // Purchase order
        $orderId = $this->generateUuid();
        DB::table('orders')->insert([
            'id' => $orderId, 'order_code' => 'QA-A-' . strtoupper(Str::random(5)), 'buyer_id' => $buyer->id, 'seller_id' => $seller->id,
            'order_type' => 'purchase', 'order_status' => 'completed', 'subtotal' => 40000.00, 'delivery_fee' => 5000.00, 'platform_fee' => 7000.00, 'total_amount' => 52000.00,
            'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa", 'ordered_at' => now(), 'completed_at' => now()
        ]);
        // Platform cut = 5% of 40000 + 5000 = 2000 + 5000 = 7000.

        // Verification updates
        // Let's create new profiles with different verification statuses
        $tempSellerUser = User::create([
            'full_name' => 'QA Temp Seller', 'email' => "tempseller_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'), 'role' => 'seller', 'is_verified' => false, 'verification_status' => 'pending', 'is_active' => true
        ]);
        SellerProfile::create([
            'id' => $this->generateUuid(), 'user_id' => $tempSellerUser->id,
            'business_name' => 'Temp Seller Inc', 'business_type' => 'Restaurant', 'legal_document_url' => 'x', 'verification_status' => 'pending'
        ]);

        $tempCourierUser = User::create([
            'full_name' => 'QA Temp Courier', 'email' => "tempcourier_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'), 'role' => 'courier', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        DB::table('courier_profiles')->insert([
            'id' => $this->generateUuid(), 'user_id' => $tempCourierUser->id, 'vehicle_type' => 'Motor', 'vehicle_plate_number' => 'X',
            'driver_license_url' => 'x', 'vehicle_registration_url' => 'x', 'verification_status' => 'approved', 'created_at' => now()
        ]);

        $tempLksUser = User::create([
            'full_name' => 'QA Temp Lks', 'email' => "templks_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('123'), 'role' => 'lks', 'is_verified' => false, 'verification_status' => 'rejected', 'is_active' => true
        ]);
        LksProfile::create([
            'id' => $this->generateUuid(), 'user_id' => $tempLksUser->id,
            'foundation_name' => 'Temp Lks Foundation', 'lks_category' => 'Orphanage', 'legal_permit_number' => 'x', 'legal_document_url' => 'x',
            'verification_status' => 'rejected'
        ]);

        // Withdrawal
        DB::table('withdrawal_requests')->insert([
            'id' => $this->generateUuid(), 'user_id' => $buyer->id, 'wallet_id' => $this->tempData['buyer_wallet_id'],
            'amount' => 15000.00, 'bank_name' => 'Bank Mandiri', 'account_name' => 'John Doe', 'account_number' => '12345',
            'status' => 'completed', 'created_at' => now(), 'completed_at' => now()
        ]);

        // 3. Post-flow measurements
        $resAfterDash = $this->dispatchRequest('GET', '/api/admin/analytics/dashboard', [], $admin);
        $afterDash = $resAfterDash['json']['data'] ?? [];

        $resAfterVer = $this->dispatchRequest('GET', '/api/admin/analytics/verifications', [], $admin);
        $afterVer = $resAfterVer['json']['data'] ?? [];

        $resAfterTx = $this->dispatchRequest('GET', '/api/admin/analytics/transactions', [], $admin);
        $afterTx = $resAfterTx['json']['data'] ?? [];

        $diffRevenue = ($afterDash['platform_revenue'] ?? 0.0) - ($beforeDash['platform_revenue'] ?? 0.0);
        $diffGtv = ($afterTx['gross_transaction_volume'] ?? 0.0) - ($beforeTx['gross_transaction_volume'] ?? 0.0);
        $diffWithdrawals = ($afterTx['withdrawals'] ?? 0) - ($beforeTx['withdrawals'] ?? 0);

        $diffPending = ($afterVer['pending'] ?? 0) - ($beforeVer['pending'] ?? 0);
        $diffApproved = ($afterVer['approved'] ?? 0) - ($beforeVer['approved'] ?? 0);
        $diffRejected = ($afterVer['rejected'] ?? 0) - ($beforeVer['rejected'] ?? 0);

        $this->recordVerdict(
            'Admin Flow',
            'Platform Revenue cut matches dynamic formula',
            '7000.00',
            (string)$diffRevenue,
            abs($diffRevenue - 7000.00) < 0.01,
            [],
            $resAfterDash
        );

        $this->recordVerdict(
            'Admin Flow',
            'Gross Transaction Volume (GTV) matches completed amount',
            '52000.00',
            (string)$diffGtv,
            abs($diffGtv - 52000.00) < 0.01,
            [],
            $resAfterTx
        );

        $this->recordVerdict(
            'Admin Flow',
            'Withdrawals count increment',
            '1',
            (string)$diffWithdrawals,
            $diffWithdrawals === 1,
            [],
            $resAfterTx
        );

        $this->recordVerdict(
            'Admin Flow',
            'Verification stats count changes for all roles',
            'pending += 1, approved += 1, rejected += 1',
            "pending: {$diffPending}, approved: {$diffApproved}, rejected: {$diffRejected}",
            $diffPending === 1 && $diffApproved === 1 && $diffRejected === 1,
            [],
            $resAfterVer
        );
    }

    /**
     * Security checks
     */
    private function runSecurityQa(): void
    {
        $seller = $this->tempData['seller'];
        $courier = $this->tempData['courier'];
        $lks = $this->tempData['lks'];

        // 1. Unauthenticated -> 401
        $resUnauth = $this->dispatchRequest('GET', '/api/seller/analytics/dashboard');
        $this->recordVerdict(
            'Security QA',
            'Unauthenticated request returns 401',
            '401',
            (string)$resUnauth['status'],
            $resUnauth['status'] === 401
        );

        // 2. Seller accesses courier analytics -> 403
        $resWrongRole1 = $this->dispatchRequest('GET', '/api/courier/analytics/dashboard', [], $seller);
        $this->recordVerdict(
            'Security QA',
            'Seller accesses Courier Analytics returns 403',
            '403',
            (string)$resWrongRole1['status'],
            $resWrongRole1['status'] === 403
        );

        // 3. Courier accesses LKS analytics -> 403
        $resWrongRole2 = $this->dispatchRequest('GET', '/api/lks/analytics/dashboard', [], $courier);
        $this->recordVerdict(
            'Security QA',
            'Courier accesses LKS Analytics returns 403',
            '403',
            (string)$resWrongRole2['status'],
            $resWrongRole2['status'] === 403
        );

        // 4. LKS accesses Admin analytics -> 403
        $resWrongRole3 = $this->dispatchRequest('GET', '/api/admin/analytics/dashboard', [], $lks);
        $this->recordVerdict(
            'Security QA',
            'LKS accesses Admin Analytics returns 403',
            '403',
            (string)$resWrongRole3['status'],
            $resWrongRole3['status'] === 403
        );
    }

    /**
     * Profiling and metrics parsing
     */
    private function compilePerformanceAudit(): array
    {
        $totalQueries = count($this->queryLog);
        $slowQueries = 0;
        $duplicateQueries = 0;
        $slowestQuery = null;
        $slowestTime = 0.0;
        $uniqueQueries = [];

        foreach ($this->queryLog as $q) {
            $sql = $q['sql'];
            $time = (float) $q['time'];

            if ($time > 50.0) {
                $slowQueries++;
            }

            if ($time > $slowestTime) {
                $slowestTime = $time;
                $slowestQuery = $sql;
            }

            if (isset($uniqueQueries[$sql])) {
                $uniqueQueries[$sql]++;
                $duplicateQueries++;
            } else {
                $uniqueQueries[$sql] = 1;
            }
        }

        // Detect N+1 risks
        $nPlusOneRisk = false;
        foreach ($uniqueQueries as $sql => $count) {
            if ($count > 5) {
                $nPlusOneRisk = true;
                break;
            }
        }

        return [
            'total_queries' => $totalQueries,
            'duplicate_queries' => $duplicateQueries,
            'slow_queries' => $slowQueries,
            'slowest_query' => $slowestQuery ?? 'None',
            'slowest_time' => $slowestTime,
            'n_plus_one_detected' => $nPlusOneRisk
        ];
    }

    /**
     * Reports writer (json and markdown)
     */
    private function generateReports(array $perf): void
    {
        $passedScenarios = collect($this->results)->where('pass', true)->count();
        $totalScenarios = count($this->results);
        $finalVerdict = ($passedScenarios === $totalScenarios) ? 'PASS' : 'FAIL';

        // 1. JSON report
        $jsonReport = [
            'qa_session_id' => $this->qaSessionId,
            'timestamp' => now()->toDateTimeString(),
            'environment' => app()->environment(),
            'verdict' => $finalVerdict,
            'summary' => [
                'total_scenarios' => $totalScenarios,
                'passed' => $passedScenarios,
                'failed' => $totalScenarios - $passedScenarios,
            ],
            'performance' => $perf,
            'scenarios' => $this->results,
        ];

        $jsonDir = storage_path('app/qa-reports/analytics/json');
        if (!is_dir($jsonDir)) {
            mkdir($jsonDir, 0755, true);
        }
        file_put_contents("{$jsonDir}/qa_report_{$this->qaSessionId}.json", json_encode($jsonReport, JSON_PRETTY_PRINT));

        // 2. Markdown report
        $md = "# EcoEat Analytics Flow QA Report\n\n";
        $md .= "- **Session ID**: `{$this->qaSessionId}`\n";
        $md .= "- **Timestamp**: `" . now()->toDateTimeString() . "`\n";
        $md .= "- **Environment**: `" . app()->environment() . "`\n";
        $md .= "- **Final Verdict**: **{$finalVerdict}**\n\n";

        $md .= "## 📊 Scenario Summary\n";
        $md .= "| Flow | Scenario | Expected | Actual | Status |\n";
        $md .= "| :--- | :--- | :--- | :--- | :--- |\n";
        foreach ($this->results as $r) {
            $statusMark = $r['pass'] ? '✅ PASS' : '❌ FAIL';
            $md .= "| {$r['flow']} | {$r['scenario']} | `{$r['expected']}` | `{$r['actual']}` | {$statusMark} |\n";
        }

        $md .= "\n## ⏱️ Query & Performance Profiling\n";
        $md .= "- **Total SQL Queries**: `{$perf['total_queries']}`\n";
        $md .= "- **Duplicate Queries**: `{$perf['duplicate_queries']}`\n";
        $md .= "- **Slow Queries (>50ms)**: `{$perf['slow_queries']}`\n";
        $md .= "- **Slowest SQL Execution Time**: `{$perf['slowest_time']} ms`\n";
        $md .= "- **Slowest SQL Query**: `{$perf['slowest_query']}`\n";
        $md .= "- **N+1 Query Loop Detection**: " . ($perf['n_plus_one_detected'] ? '⚠️ **WARNING** (Possible loop detected)' : '✅ **NONE**') . "\n\n";

        $md .= "## 🧬 Endpoint Execution Profile (Top 5 Slowest)\n";
        $md .= "| Endpoint | Avg Time (ms) | Queries | Duplicates |\n";
        $md .= "| :--- | :--- | :--- | :--- |\n";

        $endpoints = [];
        foreach ($this->tempData['endpoints'] ?? [] as $uri => $runs) {
            $totalQueries = array_sum(array_column($runs, 'queries'));
            $totalDuplicates = array_sum(array_column($runs, 'duplicates'));
            $totalTime = array_sum(array_column($runs, 'time'));
            $count = count($runs);

            $endpoints[] = [
                'uri' => $uri,
                'time' => round($totalTime / $count, 2),
                'queries' => round($totalQueries / $count, 1),
                'duplicates' => round($totalDuplicates / $count, 1),
            ];
        }
        usort($endpoints, fn($a, $b) => $b['time'] <=> $a['time']);

        foreach (array_slice($endpoints, 0, 5) as $ep) {
            $md .= "| `{$ep['uri']}` | {$ep['time']}ms | {$ep['queries']} | {$ep['duplicates']} |\n";
        }

        $md .= "\n## 📜 Audit Trail Metadata Tags\n";
        $md .= "- **QA Tag**: `analytics_qa`\n";
        $md .= "- All transient users generated contain email pattern: `*_{$this->qaSessionId}@ecoeat-qa.com`\n";
        $md .= "- All transient orders contain notes pattern: `QA_SESSION:{$this->qaSessionId}|QA_TAG:analytics_qa`\n";
        $md .= "- Seeded records remain in the database for compliance audits and have not been deleted.\n";

        $mdDir = storage_path('app/qa-reports/analytics/markdown');
        if (!is_dir($mdDir)) {
            mkdir($mdDir, 0755, true);
        }
        file_put_contents("{$mdDir}/qa_report_{$this->qaSessionId}.md", $md);
    }
}
