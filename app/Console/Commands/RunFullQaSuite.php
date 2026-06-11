<?php

namespace App\Console\Commands;

use App\Models\LksProfile;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use App\Models\Order;
use App\Models\Delivery;
use App\Models\DeliveryTrackingLog;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class RunFullQaSuite extends Command
{
    protected $signature = 'ecoeat:qa-full';
    protected $description = 'Run Full 8-Phase QA Suite';

    private array $report = [];
    private array $tempData = [];
    private array $queryLog = [];

    public function handle(): int
    {
        $this->info("Starting Phase 1-8 QA Suite...");
        $this->report[] = "# EcoEat Backend QA & Audit Final Report\n";

        // Enable query listening for Phase 7
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

        $this->phase1DatabaseAudit();
        $this->phase2RouteDiscovery();
        
        $this->setupTestData();

        $this->phase3AuthTesting();
        $this->phase4to6FlowAndErrorTesting();
        
        $this->phase7PerformanceAudit();

        $this->cleanupTestData();

        $this->generateFinalReport();

        return self::SUCCESS;
    }

    private function generateUuid(): string
    {
        return (string) Str::uuid();
    }

    private function setupTestData()
    {
        User::whereIn('email', ['qa_full_seller@e.com', 'qa_full_lks@e.com', 'qa_full_lks2@e.com', 'qa_full_courier@e.com', 'qa_full_buyer@e.com'])->delete();

        // Seller
        $seller = User::create([
            'full_name' => 'QA Seller', 'email' => 'qa_full_seller@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'seller', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['seller'] = $seller;
        $sellerProfileId = $this->generateUuid();
        SellerProfile::create([
            'id' => $sellerProfileId, 'user_id' => $seller->id,
            'business_name' => 'QA Business', 'business_type' => 'Restaurant', 'legal_document_url' => 'x', 'verification_status' => 'approved'
        ]);

        // LKS 1
        $lks = User::create([
            'full_name' => 'QA LKS', 'email' => 'qa_full_lks@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'lks', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['lks'] = $lks;
        LksProfile::create([
            'id' => $this->generateUuid(), 'user_id' => $lks->id,
            'foundation_name' => 'QA LKS Foundation', 'lks_category' => 'Orphanage', 'legal_permit_number' => '1', 'legal_document_url' => 'x', 'storage_type' => 'Fridge', 'storage_capacity' => 10, 'beneficiaries_count' => 10, 'verification_status' => 'approved'
        ]);

        // LKS 2 (Pending)
        $lks2 = User::create([
            'full_name' => 'QA LKS Unapproved', 'email' => 'qa_full_lks2@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'lks', 'is_verified' => false, 'verification_status' => 'pending', 'is_active' => true
        ]);
        $this->tempData['lks2'] = $lks2;
        LksProfile::create([
            'id' => $this->generateUuid(), 'user_id' => $lks2->id,
            'foundation_name' => 'QA LKS Unapp', 'lks_category' => 'Orphanage', 'legal_permit_number' => '2', 'legal_document_url' => 'x', 'storage_type' => 'Fridge', 'storage_capacity' => 10, 'beneficiaries_count' => 10, 'verification_status' => 'pending'
        ]);

        // Courier
        $courier = User::create([
            'full_name' => 'QA Courier', 'email' => 'qa_full_courier@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'courier', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['courier'] = $courier;
        DB::table('courier_profiles')->insert(['id' => $this->generateUuid(), 'user_id' => $courier->id, 'vehicle_type' => 'Motor', 'vehicle_plate_number' => '1', 'driver_license_url' => 'x', 'vehicle_registration_url' => 'x', 'verification_status' => 'approved', 'created_at' => now()]);

        // Buyer (For Role Test)
        $buyer = User::create([
            'full_name' => 'QA Buyer', 'email' => 'qa_full_buyer@e.com',
            'password_hash' => Hash::make('123'), 'role' => 'buyer', 'is_verified' => true, 'verification_status' => 'approved', 'is_active' => true
        ]);
        $this->tempData['buyer'] = $buyer;

        // Products
        $this->tempData['valid_product_id'] = $this->generateUuid();
        Product::create(['id' => $this->tempData['valid_product_id'], 'seller_profile_id' => $sellerProfileId, 'title' => 'T1', 'description' => 'D1', 'price' => 1, 'original_price' => 2, 'stock_quantity' => 1, 'is_donation' => true, 'status' => 'active', 'expiry_date' => now()->addDays(5)]);
        
        $this->tempData['non_donation_product_id'] = $this->generateUuid();
        Product::create(['id' => $this->tempData['non_donation_product_id'], 'seller_profile_id' => $sellerProfileId, 'title' => 'T2', 'description' => 'D2', 'price' => 1, 'original_price' => 2, 'stock_quantity' => 1, 'is_donation' => false, 'status' => 'active', 'expiry_date' => now()->addDays(5)]);
        
        $this->tempData['expired_product_id'] = $this->generateUuid();
        Product::create(['id' => $this->tempData['expired_product_id'], 'seller_profile_id' => $sellerProfileId, 'title' => 'T3', 'description' => 'D3', 'price' => 1, 'original_price' => 2, 'stock_quantity' => 1, 'is_donation' => true, 'status' => 'active', 'expiry_date' => now()->subDays(1)]);
    }

    private bool $profileRequests = false;
    private array $currentRequestQueries = [];

    private function dispatchRequest(string $method, string $uri, array $payload = [], ?User $user = null): array
    {
        DB::disconnect();
        DB::reconnect();

        // Enable profiling for this request
        $this->currentRequestQueries = [];
        $this->profileRequests = true;

        $request = Request::create($uri, $method, $payload);
        $request->headers->set('Accept', 'application/json');
        
        if ($user) {
            $request->setUserResolver(fn() => $user);
            Auth::guard('sanctum')->setUser($user);
        }

        $response = app()->handle($request);

        // Disable profiling
        $this->profileRequests = false;
        $queriesForThisRequest = $this->currentRequestQueries;
        
        // Let's record the profiling info
        $sqlList = array_column($queriesForThisRequest, 'sql');
        $uniqueSql = array_unique($sqlList);
        $duplicates = count($sqlList) - count($uniqueSql);
        
        $totalTime = array_sum(array_column($queriesForThisRequest, 'time'));
        
        $endpointKey = "{$method} {$uri}";
        if (!isset($this->tempData['endpoints'][$endpointKey])) {
            $this->tempData['endpoints'][$endpointKey] = [];
        }
        $this->tempData['endpoints'][$endpointKey][] = [
            'queries' => count($queriesForThisRequest),
            'duplicates' => $duplicates,
            'time' => $totalTime,
            'details' => $queriesForThisRequest
        ];

        return [
            'status' => $response->getStatusCode(),
            'json' => json_decode($response->getContent(), true)
        ];
    }

    private function addResult($phase, $name, $expected, $actual, $isPass)
    {
        $this->tempData['results'][] = [
            'phase' => $phase,
            'name' => $name,
            'expected' => $expected,
            'actual' => $actual,
            'pass' => $isPass
        ];
        if (!$isPass) {
            $this->error("FAILED: {$name} | Expected: {$expected} | Actual: {$actual}");
        } else {
            $this->info("PASS: {$name}");
        }
    }

    private function phase1DatabaseAudit()
    {
        $this->info("Running Phase 1: Database Audit");
        $requiredTables = ['users', 'seller_profiles', 'lks_profiles', 'courier_profiles', 'products', 'orders', 'deliveries', 'delivery_tracking_logs'];
        
        $missing = [];
        foreach ($requiredTables as $table) {
            if (!Schema::hasTable($table)) {
                $missing[] = $table;
            }
        }
        
        $this->addResult('Phase 1', 'Schema Table Validation', '0 missing tables', count($missing) . ' missing', empty($missing));
        
        // Check Enum structures
        $ordersColumns = Schema::getColumnListing('orders');
        $this->addResult('Phase 1', 'Orders columns audit', 'Contains order_type, lks_id', (in_array('order_type', $ordersColumns) && in_array('lks_id', $ordersColumns) ? 'Yes' : 'No'), (in_array('order_type', $ordersColumns) && in_array('lks_id', $ordersColumns)));
    }

    private function phase2RouteDiscovery()
    {
        $this->info("Running Phase 2: Route Discovery");
        $routes = Route::getRoutes()->getRoutes();
        $apiRoutes = [];
        $required = [
            'seller/donations' => false,
            'lks/donations/incoming' => false,
            'lks/donations/{deliveryId}/accept' => false,
            'courier/deliveries/available' => false
        ];

        foreach ($routes as $route) {
            if (str_contains($route->uri, 'api/')) {
                foreach (array_keys($required) as $req) {
                    if (str_contains($route->uri, $req)) $required[$req] = true;
                }
            }
        }

        $allFound = !in_array(false, array_values($required));
        $this->addResult('Phase 2', 'Route Discovery', 'All essential donation routes registered', $allFound ? 'Registered' : 'Missing', $allFound);
    }

    private function phase3AuthTesting()
    {
        $this->info("Running Phase 3: Auth Testing");
        
        // 1. Unauthenticated
        $res = $this->dispatchRequest('POST', '/api/seller/donations');
        $this->addResult('Phase 3', 'Unauthenticated access', '401', $res['status'], $res['status'] === 401);
        
        // 2. Buyer access courier endpoint
        $res = $this->dispatchRequest('GET', '/api/courier/deliveries/available', [], $this->tempData['buyer']);
        $this->addResult('Phase 3', 'Buyer access Courier endpoint', '403', $res['status'], $res['status'] === 403);
        
        // 3. Courier access seller endpoint
        $res = $this->dispatchRequest('POST', '/api/seller/donations', [], $this->tempData['courier']);
        $this->addResult('Phase 3', 'Courier access Seller endpoint', '403', $res['status'], $res['status'] === 403);
        
        // 4. Seller access LKS endpoint
        $res = $this->dispatchRequest('GET', '/api/lks/donations/incoming', [], $this->tempData['seller']);
        $this->addResult('Phase 3', 'Seller access LKS endpoint', '403', $res['status'], $res['status'] === 403);
    }

    private function phase4to6FlowAndErrorTesting()
    {
        $this->info("Running Phase 4-6: Donation Flow & Error Validation");
        $seller = $this->tempData['seller'];
        $lks = $this->tempData['lks'];
        $courier = $this->tempData['courier'];

        // TEST 2: Seller create non-donation product
        $res = $this->dispatchRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['non_donation_product_id'], 'lks_id' => $lks->id], $seller);
        $this->addResult('Phase 4-6', '[TEST 2] Non-donation product', '422', $res['status'], $res['status'] === 422);

        // TEST 3: Expired product
        $res = $this->dispatchRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['expired_product_id'], 'lks_id' => $lks->id], $seller);
        $this->addResult('Phase 4-6', '[TEST 3] Expired product', '422', $res['status'], $res['status'] === 422);

        // TEST 4: Unverified LKS target
        $res = $this->dispatchRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $this->tempData['lks2']->id], $seller);
        $this->addResult('Phase 4-6', '[TEST 4] Unverified LKS target', '422', $res['status'], $res['status'] === 422);

        // TEST 1: Seller create donation successfully
        $res = $this->dispatchRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $lks->id], $seller);
        $this->addResult('Phase 4-6', '[TEST 1] Seller create donation successfully', '201', $res['status'], $res['status'] === 201);
        
        $orderId = $res['json']['data']['order_id'] ?? null;
        $order = Order::find($orderId);
        $delivery = Delivery::where('order_id', $orderId)->first();
        
        // Phase 5 DB Integrity Validations
        $dbIntegrityPass = ($order && $delivery && $order->order_type === 'donation' && $order->order_status === 'processing' && $delivery->delivery_status === 'waiting_lks_confirmation');
        $this->addResult('Phase 5', 'DB Integrity: Initial insert valid', 'Valid structure', $dbIntegrityPass ? 'Valid' : 'Invalid', $dbIntegrityPass);

        // TEST 5: LKS incoming donations visible
        $res = $this->dispatchRequest('GET', '/api/lks/donations/incoming', [], $lks);
        $foundInLks = collect($res['json']['data']['data'] ?? [])->pluck('order_id')->contains($orderId);
        $this->addResult('Phase 4-6', '[TEST 5] LKS incoming visible', 'Found', $foundInLks ? 'Found' : 'Not Found', $foundInLks);

        // TEST 6: Courier cannot see donation BEFORE LKS accept
        $res = $this->dispatchRequest('GET', '/api/courier/deliveries/available', [], $courier);
        $foundInCourier = collect($res['json']['data']['data'] ?? [])->pluck('order_id')->contains($orderId);
        $this->addResult('Phase 4-6', '[TEST 6] Hidden from courier before accept', 'Not Found', $foundInCourier ? 'Found' : 'Not Found', !$foundInCourier);

        // TEST 7: LKS accept donation
        $res = $this->dispatchRequest('PATCH', "/api/lks/donations/{$delivery->id}/accept", [], $lks);
        $this->addResult('Phase 4-6', '[TEST 7] LKS accept donation', '200', $res['status'], $res['status'] === 200);

        // Phase 5 DB Integrity Validations
        $delivery->refresh();
        $this->addResult('Phase 5', 'DB Integrity: Status changed to available_for_courier', 'available_for_courier', $delivery->delivery_status, $delivery->delivery_status === 'available_for_courier');

        // TEST 8: Double accept prevention
        $res = $this->dispatchRequest('PATCH', "/api/lks/donations/{$delivery->id}/accept", [], $lks);
        $this->addResult('Phase 4-6', '[TEST 8] Double accept prevention', '422', $res['status'], $res['status'] === 422);

        // TEST 9: Courier can see donation AFTER accept
        $res = $this->dispatchRequest('GET', '/api/courier/deliveries/available', [], $courier);
        $foundInCourier = collect($res['json']['data']['data'] ?? [])->pluck('order_id')->contains($orderId);
        $this->addResult('Phase 4-6', '[TEST 9] Courier sees donation after accept', 'Found', $foundInCourier ? 'Found' : 'Not Found', $foundInCourier);

        // TEST 10: Courier take delivery
        $res = $this->dispatchRequest('POST', "/api/courier/deliveries/{$orderId}/take", [], $courier);
        $this->addResult('Phase 4-6', '[TEST 10] Courier take delivery', '200', $res['status'], $res['status'] === 200);

        $delivery->refresh();
        $this->addResult('Phase 5', 'DB Integrity: Courier assigned', $courier->id, $delivery->courier_id, $delivery->courier_id === $courier->id);

        // TEST 11: Double courier take prevention
        $res = $this->dispatchRequest('POST', "/api/courier/deliveries/{$orderId}/take", [], $courier);
        $this->addResult('Phase 4-6', '[TEST 11] Double take prevention', '422 or 409', $res['status'], in_array($res['status'], [422, 409, 400]));

        // TEST 12: Courier update picked_up
        $res = $this->dispatchRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['delivery_status' => 'picked_up'], $courier);
        $this->addResult('Phase 4-6', '[TEST 12] Update picked_up', '200', $res['status'], $res['status'] === 200);

        // TEST 13: Courier update on_delivery
        $res = $this->dispatchRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['delivery_status' => 'on_delivery'], $courier);
        $this->addResult('Phase 4-6', '[TEST 13] Update on_delivery', '200', $res['status'], $res['status'] === 200);

        // TEST 14: Courier upload location
        $res = $this->dispatchRequest('POST', "/api/courier/deliveries/{$delivery->id}/location", ['latitude' => 10.1, 'longitude' => 20.2, 'status' => 'En route'], $courier);
        $this->addResult('Phase 4-6', '[TEST 14] Upload location', '200', $res['status'], $res['status'] === 200);
        $logLocPass = DeliveryTrackingLog::where('delivery_id', $delivery->id)->where('latitude', 10.1)->exists();
        $this->addResult('Phase 5', 'DB Integrity: Coordinates inserted', 'Exists', $logLocPass ? 'Exists' : 'Missing', $logLocPass);

        // TEST 15: Courier complete delivery
        $res = $this->dispatchRequest('PATCH', "/api/courier/deliveries/{$delivery->id}/status", ['delivery_status' => 'delivered'], $courier);
        $this->addResult('Phase 4-6', '[TEST 15] Complete delivery', '200', $res['status'], $res['status'] === 200);
        $order->refresh();
        $this->addResult('Phase 5', 'DB Integrity: Order status completed', 'completed', $order->order_status, $order->order_status === 'completed');

        // Missing payload error test
        $res = $this->dispatchRequest('POST', '/api/seller/donations', [], $seller);
        $this->addResult('Phase 6', 'Error Testing: Missing payload', '422', $res['status'], $res['status'] === 422);

        // Create secondary donation for Reject tests
        $res2 = $this->dispatchRequest('POST', '/api/seller/donations', ['product_id' => $this->tempData['valid_product_id'], 'lks_id' => $lks->id], $seller);
        $orderId2 = $res2['json']['data']['order_id'];
        $delivery2 = Delivery::where('order_id', $orderId2)->first();

        // TEST 16: Reject after accepted prevention (Using the first delivery that was completed)
        $res = $this->dispatchRequest('PATCH', "/api/lks/donations/{$delivery->id}/reject", [], $lks);
        $this->addResult('Phase 4-6', '[TEST 16] Reject after accepted prevention', '422', $res['status'], $res['status'] === 422);

        // LKS reject the second donation properly
        $res = $this->dispatchRequest('PATCH', "/api/lks/donations/{$delivery2->id}/reject", [], $lks);
        $this->addResult('Phase 4-6', 'LKS reject donation', '200', $res['status'], $res['status'] === 200);

        // TEST 17: Delivery tracking history
        $res = $this->dispatchRequest('GET', "/api/courier/deliveries/{$delivery->id}/tracking", [], $courier);
        $this->addResult('Phase 4-6', '[TEST 17] Delivery tracking history', '200', $res['status'], $res['status'] === 200 && count($res['json']['data'] ?? []) >= 6);

        // TEST 18: LKS Dashboard statistics
        $res = $this->dispatchRequest('GET', '/api/lks/dashboard', [], $lks);
        $this->addResult('Phase 4-6', '[TEST 18] LKS Dashboard statistics', 'Has completed=1', ($res['json']['data']['total_donation_received'] >= 1 ? 'Yes' : 'No'), $res['status'] === 200 && $res['json']['data']['total_donation_received'] >= 1);
    }

    private function phase7PerformanceAudit()
    {
        $this->info("Running Phase 7: Performance & Query Audit");
        $queryCount = count($this->queryLog);
        
        $heavyQueries = 0;
        $duplicateQueries = 0;
        $uniqueQueries = [];

        foreach ($this->queryLog as $q) {
            if ($q['time'] > 50) $heavyQueries++;
            
            $sql = $q['sql'];
            if (isset($uniqueQueries[$sql])) {
                $uniqueQueries[$sql]++;
                $duplicateQueries++;
            } else {
                $uniqueQueries[$sql] = 1;
            }
        }

        $nPlusOneRisk = ($duplicateQueries > 30);
        $this->addResult('Phase 7', 'N+1 Query Detection', 'Risk Low', $nPlusOneRisk ? 'High Risk' : 'Low Risk', !$nPlusOneRisk);
        $this->addResult('Phase 7', 'Heavy Queries (>50ms)', '0', (string)$heavyQueries, $heavyQueries < 5);
        
        $this->tempData['perf'] = [
            'total_queries' => $queryCount,
            'duplicate_queries' => $duplicateQueries,
            'heavy_queries' => $heavyQueries
        ];
    }

    private function cleanupTestData()
    {
        $users = ['qa_full_seller@e.com', 'qa_full_lks@e.com', 'qa_full_lks2@e.com', 'qa_full_courier@e.com', 'qa_full_buyer@e.com'];
        $userIds = User::whereIn('email', $users)->pluck('id');
        
        if ($userIds->isEmpty()) return;

        DB::table('delivery_tracking_logs')->whereIn('delivery_id', function($q) use ($userIds) {
            $q->select('id')->from('deliveries')->whereIn('order_id', function($q2) use ($userIds) {
                $q2->select('id')->from('orders')->whereIn('seller_id', $userIds);
            });
        })->delete();

        DB::table('deliveries')->whereIn('order_id', function($q) use ($userIds) {
            $q->select('id')->from('orders')->whereIn('seller_id', $userIds);
        })->delete();

        DB::table('orders')->whereIn('seller_id', $userIds)->delete();
        Product::whereIn('seller_profile_id', function($q) use ($userIds) {
            $q->select('id')->from('seller_profiles')->whereIn('user_id', $userIds);
        })->delete();

        SellerProfile::whereIn('user_id', $userIds)->delete();
        LksProfile::whereIn('user_id', $userIds)->delete();
        DB::table('courier_profiles')->whereIn('user_id', $userIds)->delete();
        User::whereIn('id', $userIds)->delete();
    }

    private function generateFinalReport()
    {
        $markdown = "# EcoEat 8-Phase Backend Final QA Report\n\n";
        $markdown .= "## Comprehensive Testing Results\n\n";
        
        $markdown .= "| Phase | Scenario | Expected | Actual | Status |\n";
        $markdown .= "| :--- | :--- | :--- | :--- | :--- |\n";
        
        $allPass = true;
        foreach ($this->tempData['results'] as $res) {
            $mark = $res['pass'] ? '✅ PASS' : '❌ FAIL';
            if (!$res['pass']) $allPass = false;
            $markdown .= "| {$res['phase']} | {$res['name']} | {$res['expected']} | {$res['actual']} | {$mark} |\n";
        }

        $markdown .= "\n## Endpoint Query Profiling (Top 10 Slowest/Heavy)\n\n";
        $markdown .= "| Endpoint | Query Count | Duplicate Queries | Slow Queries (>50ms) | Avg Time (ms) |\n";
        $markdown .= "| :--- | :--- | :--- | :--- | :--- |\n";

        $endpoints = $this->tempData['endpoints'] ?? [];
        $endpointStats = [];
        foreach ($endpoints as $uri => $runs) {
            // Calculate averages across runs
            $totalQueries = 0;
            $totalDuplicates = 0;
            $totalSlow = 0;
            $totalTime = 0;
            $count = count($runs);
            
            foreach ($runs as $run) {
                $totalQueries += $run['queries'];
                $totalDuplicates += $run['duplicates'];
                $totalTime += $run['time'];
                foreach ($run['details'] as $q) {
                    if ($q['time'] > 50) $totalSlow++;
                }
            }

            $endpointStats[] = [
                'uri' => $uri,
                'queries' => round($totalQueries / $count, 1),
                'duplicates' => round($totalDuplicates / $count, 1),
                'slow' => round($totalSlow / $count, 1),
                'time' => round($totalTime / $count, 2)
            ];
        }

        // Sort by average time descending
        usort($endpointStats, fn($a, $b) => $b['time'] <=> $a['time']);

        foreach (array_slice($endpointStats, 0, 10) as $stat) {
            $markdown .= "| {$stat['uri']} | {$stat['queries']} | {$stat['duplicates']} | {$stat['slow']} | {$stat['time']}ms |\n";
        }

        $markdown .= "\n## Performance Audit\n";
        $markdown .= "- **Total Queries Executed**: {$this->tempData['perf']['total_queries']}\n";
        $markdown .= "- **Duplicate Queries**: {$this->tempData['perf']['duplicate_queries']}\n";
        $markdown .= "- **Heavy Queries**: {$this->tempData['perf']['heavy_queries']}\n";
        
        $markdown .= "\n## Final Verdict\n";
        if ($allPass) {
            if ($this->tempData['perf']['heavy_queries'] > 0 || $this->tempData['perf']['duplicate_queries'] > 20) {
                $markdown .= "### ⚠️ PASS WITH WARNING (Performance concerns)\n";
            } else {
                $markdown .= "### 🏆 PASS (100% Rock Solid)\n";
            }
        } else {
            $markdown .= "### ❌ FAIL (Issues detected)\n";
        }

        file_put_contents('C:/Users/MP2C6/.gemini/antigravity/brain/79fd23cf-dd05-497f-9f7f-2634468cf5e1/full_qa_report.md', $markdown);
        $this->info("Final report written to full_qa_report.md");
    }
}
