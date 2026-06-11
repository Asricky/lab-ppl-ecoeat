<?php

namespace App\Console\Commands\QA;

use App\Models\User;
use App\Models\SellerProfile;
use App\Models\CourierProfile;
use App\Models\LksProfile;
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

class RunAdminQaSuite extends Command
{
    protected $signature = 'ecoeat:admin-qa';
    protected $description = 'Run EcoEat Admin Subsystem QA Automation & Performance Suite';

    private string $qaSessionId;
    private array $results = [];
    private array $tempData = [];
    private array $queryLog = [];
    private array $currentRequestQueries = [];
    private array $endpointQueries = [];
    private bool $profileRequests = false;
    private bool $anyRequestNPlusOne = false;

    public function handle(): int
    {
        $this->qaSessionId = (string) Str::uuid();
        $this->info("=====================================================================");
        $this->info("             ECOEAT ADMIN SUBSYSTEM QA AUTOMATION RUN                ");
        $this->info("             SESSION: {$this->qaSessionId}                           ");
        $this->info("=====================================================================");

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

        try {
            // Phase 1: Route & Schema Validation Audit
            $this->runPhase1();

            // Setup Seed Data
            $this->setupTestData();

            // Phase 2: Moderation Status Transitions
            $this->runPhase2();

            // Phase 3: Transaction & Wallet Monitoring
            $this->runPhase3();

            // Phase 4: Streamed CSV Exports
            $this->runPhase4();

            // Phase 5: Security & Role Protections
            $this->runPhase5();

            // Phase 6: Query & Performance Profiling
            $this->runPhase6();

            // Phase 7: Report Compilations
            $this->runPhase7();

        } catch (\Throwable $e) {
            $this->error("QA Exec Encountered Uncaught Exception: " . $e->getMessage());
            $this->error($e->getTraceAsString());
            return self::FAILURE;
        }

        $failedCount = collect($this->results)->where('pass', false)->count();
        $this->info("=====================================================================");
        $this->info("QA Execution Completed. Verdict: " . ($failedCount === 0 ? "🏆 PASS" : "❌ FAIL"));
        $this->info("Total Tests: " . count($this->results) . " | Passed: " . (count($this->results) - $failedCount) . " | Failed: " . $failedCount);
        $this->info("=====================================================================");

        return $failedCount === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function generateUuid(): string
    {
        return (string) Str::uuid();
    }

    private function recordVerdict(
        string $phase,
        string $scenario,
        string $expected,
        string $actual,
        bool $pass,
        array $payload = [],
        array $response = [],
        ?string $errorDetails = null,
        ?array $queryStats = null
    ): void {
        $this->results[] = [
            'phase' => $phase,
            'scenario' => $scenario,
            'expected' => $expected,
            'actual' => $actual,
            'pass' => $pass,
            'payload' => $payload,
            'response' => $response,
            'error_details' => $errorDetails,
            'query_stats' => $queryStats ?? ['total_queries' => 0, 'duplicate_queries' => 0, 'heavy_queries' => 0],
            'time' => now()->toDateTimeString()
        ];

        $statusMark = $pass ? "✅ PASS" : "❌ FAIL";
        if ($pass) {
            $this->line("  {$statusMark}: [{$phase}] {$scenario}");
        } else {
            $this->error("  {$statusMark}: [{$phase}] {$scenario}");
            $this->error("    ↳ Expected: {$expected} | Actual: {$actual}");
            if ($errorDetails) {
                $this->error("    ↳ Details: {$errorDetails}");
            }
        }
    }

    private function dispatchRequest(string $method, string $uri, array $payload = [], ?User $user = null): array
    {
        DB::disconnect();
        DB::reconnect();

        $this->currentRequestQueries = [];
        $this->profileRequests = true;

        $startTime = microtime(true);

        $request = Request::create($uri, $method, $payload);
        $request->headers->set('Accept', 'application/json');

        // Reset guards using Reflection to prevent singleton bleeding
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

        $this->profileRequests = false;

        foreach ($this->currentRequestQueries as $q) {
            $this->endpointQueries[] = $q;
        }

        $sqls = array_column($this->currentRequestQueries, 'sql');
        $uniqueSqls = array_unique($sqls);
        $duplicateQueries = count($sqls) - count($uniqueSqls);
        
        $heavyQueries = 0;
        foreach ($this->currentRequestQueries as $q) {
            if ($q['time'] > 200.0) {
                $heavyQueries++;
            }
        }

        $nPlusOneRisk = false;
        $counts = array_count_values($sqls);
        foreach ($counts as $sql => $count) {
            if ($count > 3) {
                $nPlusOneRisk = true;
                break;
            }
        }

        if ($nPlusOneRisk) {
            $this->anyRequestNPlusOne = true;
        }

        return [
            'status' => $statusCode,
            'json' => $responseJson,
            'time_ms' => $executionTimeMs,
            'query_stats' => [
                'total_queries' => count($this->currentRequestQueries),
                'duplicate_queries' => $duplicateQueries,
                'heavy_queries' => $heavyQueries,
                'n_plus_one_risk' => $nPlusOneRisk,
            ],
            'queries' => $this->currentRequestQueries,
        ];
    }

    /**
     * Phase 1: Route & Schema Validation Audit
     */
    private function runPhase1(): void
    {
        $this->info("\n[Phase 1] Running Route & Schema Validation Audit...");

        // 1. Verify Database Connection
        try {
            DB::select('SELECT 1');
            $dbOk = true;
            $dbMsg = "Connection Active";
        } catch (\Throwable $e) {
            $dbOk = false;
            $dbMsg = $e->getMessage();
        }
        $this->recordVerdict("Phase 1: Pre-Test Audit", "Database Connection Active", "Active", $dbMsg, $dbOk);

        // 2. Route registration verification
        $registeredRoutes = collect(Route::getRoutes())->map(fn($r) => $r->uri());
        
        $expectedRoutes = [
            'api/admin/verifications',
            'api/admin/verifications/{userId}/approve',
            'api/admin/verifications/{userId}/reject',
            'api/admin/verifications/{userId}/undo',
            'api/admin/transactions',
            'api/admin/transactions/{id}',
            'api/admin/withdrawals',
            'api/admin/withdrawals/{id}',
            'api/admin/export/users',
            'api/admin/export/transactions',
            'api/admin/export/reports',
        ];

        foreach ($expectedRoutes as $route) {
            $hasRoute = $registeredRoutes->contains($route);
            $this->recordVerdict("Phase 1: Pre-Test Audit", "Route {$route} registered", "Registered", $hasRoute ? "Registered" : "Missing", $hasRoute);
        }
    }

    /**
     * Setup Seed Data for testing
     */
    private function setupTestData(): void
    {
        $sessionShort = substr($this->qaSessionId, 0, 8);

        // 1. Create Admin
        $admin = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Admin {$sessionShort}",
            'email' => "admin_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'admin',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['admin'] = $admin;

        // 2. Create Non-Admin (Buyer) for Security Testing
        $buyer = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Buyer {$sessionShort}",
            'email' => "buyer_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'buyer',
            'is_verified' => true,
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        $this->tempData['buyer'] = $buyer;

        // 3. Create Seller with pending verification
        $seller = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Pending Seller {$sessionShort}",
            'email' => "seller_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'seller',
            'is_verified' => false,
            'verification_status' => 'pending',
            'is_active' => true,
        ]);
        $this->tempData['seller'] = $seller;

        $sellerProfile = SellerProfile::create([
            'id' => $this->generateUuid(),
            'user_id' => $seller->id,
            'business_name' => "QA Biz {$sessionShort}",
            'business_type' => 'Bakery',
            'legal_document_url' => 'https://ecoeat-qa.com/legal_seller.pdf',
            'verification_status' => 'pending',
        ]);
        $this->tempData['seller_profile'] = $sellerProfile;

        // 4. Create Courier with pending verification
        $courier = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Pending Courier {$sessionShort}",
            'email' => "courier_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'courier',
            'is_verified' => false,
            'verification_status' => 'pending',
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
            'verification_status' => 'pending',
        ]);
        $this->tempData['courier_profile'] = $courierProfile;

        // 5. Create LKS with pending verification
        $lks = User::create([
            'id' => $this->generateUuid(),
            'full_name' => "QA Pending LKS {$sessionShort}",
            'email' => "lks_qa_{$this->qaSessionId}@ecoeat-qa.com",
            'password_hash' => Hash::make('secret123'),
            'role' => 'lks',
            'is_verified' => false,
            'verification_status' => 'pending',
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
            'verification_status' => 'pending',
        ]);
        $this->tempData['lks_profile'] = $lksProfile;
    }

    /**
     * Phase 2: Moderation Status Transitions
     */
    private function runPhase2(): void
    {
        $this->info("\n[Phase 2] Running Moderation Status Transition Flow Scenarios...");
        $admin = $this->tempData['admin'];
        $seller = $this->tempData['seller'];
        $courier = $this->tempData['courier'];
        $lks = $this->tempData['lks'];

        // 1. Check Moderation List has the pending seller
        $resList = $this->dispatchRequest('GET', '/api/admin/verifications', ['role' => 'seller', 'verification_status' => 'pending'], $admin);
        $users = $resList['json']['data'] ?? [];
        $foundSeller = collect($users)->firstWhere('id', $seller->id);
        $this->recordVerdict("Phase 2: Moderation Flow", "Verification list retrieves pending seller", "Found", $foundSeller ? "Found" : "Not Found", !empty($foundSeller), [], $resList);

        // 2. Approve Seller (pending -> approved)
        $resApprove = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/approve", ['notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa|Approving seller"], $admin);
        $dbUserStatus = DB::table('users')->where('id', $seller->id)->value('verification_status');
        $dbUserVerified = DB::table('users')->where('id', $seller->id)->value('is_verified');
        $dbProfileStatus = DB::table('seller_profiles')->where('user_id', $seller->id)->value('verification_status');
        $dbProfileReviewedBy = DB::table('seller_profiles')->where('user_id', $seller->id)->value('reviewed_by');
        $logCount = DB::table('verification_logs')->where('user_id', $seller->id)->where('new_status', 'approved')->count();

        $approvePass = ($dbUserStatus === 'approved' && $dbUserVerified === true && $dbProfileStatus === 'approved' && $dbProfileReviewedBy === $admin->id && $logCount === 1);
        $this->recordVerdict("Phase 2: Moderation Flow", "Seller verification approve updates status & logs", "approved / verified / logged", "{$dbUserStatus} / " . ($dbUserVerified ? 'verified' : 'unverified') . " / logs={$logCount}", $approvePass, [], $resApprove);

        // 3. Prohibit direct transition: Approved -> Rejected
        $resProhibitReject = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/reject", ['notes' => 'Attempt to transition approved directly to rejected'], $admin);
        $this->recordVerdict("Phase 2: Moderation Flow", "Direct transition Approved -> Rejected is blocked", "422", (string)$resProhibitReject['status'], $resProhibitReject['status'] === 422, [], $resProhibitReject);

        // 4. Undo Seller (approved -> pending)
        $resUndo = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/undo", ['notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa|Undo approval"], $admin);
        $dbUserStatusUndo = DB::table('users')->where('id', $seller->id)->value('verification_status');
        $dbUserVerifiedUndo = DB::table('users')->where('id', $seller->id)->value('is_verified');
        $dbProfileStatusUndo = DB::table('seller_profiles')->where('user_id', $seller->id)->value('verification_status');
        $logCountUndo = DB::table('verification_logs')->where('user_id', $seller->id)->where('new_status', 'pending')->count();

        $undoPass = ($dbUserStatusUndo === 'pending' && $dbUserVerifiedUndo === false && $dbProfileStatusUndo === 'pending' && $logCountUndo === 1);
        $this->recordVerdict("Phase 2: Moderation Flow", "Seller verification undo resets back to pending", "pending / unverified / logged", "{$dbUserStatusUndo} / " . ($dbUserVerifiedUndo ? 'verified' : 'unverified') . " / logs={$logCountUndo}", $undoPass, [], $resUndo);

        // 5. Reject Seller (pending -> rejected)
        $resReject = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/reject", ['notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa|Rejecting seller"], $admin);
        $dbUserStatusReject = DB::table('users')->where('id', $seller->id)->value('verification_status');
        $dbUserVerifiedReject = DB::table('users')->where('id', $seller->id)->value('is_verified');
        $dbProfileStatusReject = DB::table('seller_profiles')->where('user_id', $seller->id)->value('verification_status');
        $logCountReject = DB::table('verification_logs')->where('user_id', $seller->id)->where('new_status', 'rejected')->count();

        $rejectPass = ($dbUserStatusReject === 'rejected' && $dbUserVerifiedReject === false && $dbProfileStatusReject === 'rejected' && $logCountReject === 1);
        $this->recordVerdict("Phase 2: Moderation Flow", "Seller verification reject updates status & logs", "rejected / unverified / logged", "{$dbUserStatusReject} / " . ($dbUserVerifiedReject ? 'verified' : 'unverified') . " / logs={$logCountReject}", $rejectPass, [], $resReject);

        // 6. Prohibit direct transition: Rejected -> Approved
        $resProhibitApprove = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$seller->id}/approve", ['notes' => 'Attempt to transition rejected directly to approved'], $admin);
        $this->recordVerdict("Phase 2: Moderation Flow", "Direct transition Rejected -> Approved is blocked", "422", (string)$resProhibitApprove['status'], $resProhibitApprove['status'] === 422, [], $resProhibitApprove);

        // 7. Verify Courier & LKS approval transitions
        $resCourierApp = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$courier->id}/approve", ['notes' => 'Approved'], $admin);
        $dbCourierStatus = DB::table('courier_profiles')->where('user_id', $courier->id)->value('verification_status');
        $this->recordVerdict("Phase 2: Moderation Flow", "Courier verification approved successfully", "approved", (string)$dbCourierStatus, $dbCourierStatus === 'approved', [], $resCourierApp);

        $resLksApp = $this->dispatchRequest('PATCH', "/api/admin/verifications/{$lks->id}/approve", ['notes' => 'Approved'], $admin);
        $dbLksStatus = DB::table('lks_profiles')->where('user_id', $lks->id)->value('verification_status');
        $this->recordVerdict("Phase 2: Moderation Flow", "LKS verification approved successfully", "approved", (string)$dbLksStatus, $dbLksStatus === 'approved', [], $resLksApp);
    }

    /**
     * Phase 3: Transaction & Wallet Monitoring
     */
    private function runPhase3(): void
    {
        $this->info("\n[Phase 3] Running Transaction Monitoring Scenarios...");
        $admin = $this->tempData['admin'];
        $buyer = $this->tempData['buyer'];

        // 1. Create Wallet and insert dummy transactions
        $wallet = Wallet::create([
            'user_id' => $buyer->id,
            'balance' => 200000.00,
        ]);

        $tx1 = WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'order_id' => null,
            'transaction_type' => 'topup',
            'transaction_status' => 'completed',
            'amount' => 250000.00,
            'description' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa|Top up balance",
        ]);
        $txId1 = $tx1->id;

        $tx2 = WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'order_id' => null,
            'transaction_type' => 'withdrawal',
            'transaction_status' => 'pending',
            'amount' => -50000.00,
            'description' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa|Withdrawal transaction",
        ]);
        $txId2 = $tx2->id;

        // Create Withdrawal request
        $wReq = WithdrawalRequest::create([
            'user_id' => $buyer->id,
            'wallet_id' => $wallet->id,
            'amount' => 50000.00,
            'bank_name' => 'Bank BCA',
            'account_name' => 'QA Account',
            'account_number' => '987654321',
            'status' => 'pending',
        ]);
        $wReqId = $wReq->id;

        // 2. GET Transactions list (all)
        $resList = $this->dispatchRequest('GET', '/api/admin/transactions', [], $admin);
        $txs = $resList['json']['data'] ?? [];
        $found1 = collect($txs)->firstWhere('id', $txId1);
        $found2 = collect($txs)->firstWhere('id', $txId2);
        $this->recordVerdict("Phase 3: Transactions", "Retrieves wallet transactions successfully", "Found both", ($found1 && $found2) ? "Found both" : "Missing", ($found1 && $found2), [], $resList);

        // 3. GET Transactions filtered
        $resFilter = $this->dispatchRequest('GET', '/api/admin/transactions', ['type' => 'withdrawal'], $admin);
        $filteredTxs = $resFilter['json']['data'] ?? [];
        $onlyWithdrawal = collect($filteredTxs)->every(fn($item) => $item['transaction_type'] === 'withdrawal');
        $this->recordVerdict("Phase 3: Transactions", "Filter by transaction_type behaves correctly", "Only withdrawal", $onlyWithdrawal ? "Only withdrawal" : "Inconsistent", $onlyWithdrawal && count($filteredTxs) > 0, [], $resFilter);

        // 4. GET Transaction detail
        $resDetail = $this->dispatchRequest('GET', "/api/admin/transactions/{$txId1}", [], $admin);
        $detail = $resDetail['json']['data'] ?? [];
        $detailOk = ($detail['id'] === $txId1 && $detail['transaction_type'] === 'topup' && $detail['user']['id'] === $buyer->id);
        $this->recordVerdict("Phase 3: Transactions", "Transaction detail retrieves correct payload & eager loaded user", "Match transaction", $detailOk ? "Match transaction" : "Mismatch", $detailOk, [], $resDetail);

        // 5. Invalid transaction filters (Assert 422)
        $resInvalidType = $this->dispatchRequest('GET', '/api/admin/transactions', ['type' => 'invalid_type_name'], $admin);
        $this->recordVerdict("Phase 3: Transactions", "Invalid type filter rejected with 422", "422", (string)$resInvalidType['status'], $resInvalidType['status'] === 422, [], $resInvalidType);

        // 6. GET Withdrawal requests list
        $resWithdrawals = $this->dispatchRequest('GET', '/api/admin/withdrawals', ['status' => 'pending'], $admin);
        $wList = $resWithdrawals['json']['data'] ?? [];
        $foundW = collect($wList)->firstWhere('id', $wReqId);
        $this->recordVerdict("Phase 3: Transactions", "Retrieves withdrawal requests list successfully", "Found pending withdrawal", $foundW ? "Found" : "Not Found", !empty($foundW), [], $resWithdrawals);

        // 7. GET Withdrawal request details
        $resWDetail = $this->dispatchRequest('GET', "/api/admin/withdrawals/{$wReqId}", [], $admin);
        $wDetail = $resWDetail['json']['data'] ?? [];
        $wDetailOk = ($wDetail['id'] === $wReqId && $wDetail['status'] === 'pending' && $wDetail['user']['id'] === $buyer->id);
        $this->recordVerdict("Phase 3: Transactions", "Withdrawal request detail retrieves correct payload & user info", "Match details", $wDetailOk ? "Match details" : "Mismatch", $wDetailOk, [], $resWDetail);
    }

    /**
     * Phase 4: Streamed CSV Exports
     */
    private function runPhase4(): void
    {
        $this->info("\n[Phase 4] Running Streamed CSV Exports Scenarios...");
        $admin = $this->tempData['admin'];

        // 1. Export Users Stream
        $resUsers = $this->dispatchRequest('GET', '/api/admin/export/users', ['role' => 'seller'], $admin);
        $usersCsv = $resUsers['json'];
        $hasBOM = str_starts_with($usersCsv, "\xEF\xBB\xBF");
        if ($hasBOM) {
            $usersCsv = substr($usersCsv, 3);
        }
        $lines = explode("\n", trim($usersCsv));
        $header = str_getcsv($lines[0]);
        $hasUserRow = collect($lines)->contains(fn($l) => str_contains($l, $this->tempData['seller']->email));

        $usersCsvOk = ($resUsers['status'] === 200 && $header[0] === 'ID' && $header[2] === 'Email' && $hasUserRow);
        $this->recordVerdict("Phase 4: CSV Exports", "Users CSV export streams successfully with headers & data", "Valid CSV / rows match", "Headers: " . json_encode($header) . " / hasRow: " . ($hasUserRow ? 'Yes' : 'No'), $usersCsvOk, [], $resUsers);

        // 2. Export Transactions Stream
        $resTxs = $this->dispatchRequest('GET', '/api/admin/export/transactions', ['type' => 'topup'], $admin);
        $txsCsv = $resTxs['json'];
        $txHasBOM = str_starts_with($txsCsv, "\xEF\xBB\xBF");
        if ($txHasBOM) {
            $txsCsv = substr($txsCsv, 3);
        }
        $txLines = explode("\n", trim($txsCsv));
        $txHeader = str_getcsv($txLines[0]);
        $hasTxRow = collect($txLines)->contains(fn($l) => str_contains($l, $this->tempData['buyer']->email) && str_contains($l, 'topup'));

        $txsCsvOk = ($resTxs['status'] === 200 && $txHeader[0] === 'Transaction ID' && $txHeader[7] === 'Transaction Type' && $hasTxRow);
        $this->recordVerdict("Phase 4: CSV Exports", "Transactions CSV export streams successfully with headers & data", "Valid CSV / rows match", "Headers: " . json_encode($txHeader) . " / hasRow: " . ($hasTxRow ? 'Yes' : 'No'), $txsCsvOk, [], $resTxs);

        // 3. Export Reports Stream
        // Insert a dummy completed order to be exported
        $orderId = $this->generateUuid();
        DB::table('orders')->insert([
            'id' => $orderId,
            'order_code' => 'QA-EX-' . strtoupper(Str::random(5)),
            'buyer_id' => $this->tempData['buyer']->id,
            'seller_id' => $this->tempData['seller']->id,
            'order_type' => 'purchase',
            'order_status' => 'completed',
            'subtotal' => 10000.00,
            'delivery_fee' => 3000.00,
            'platform_fee' => 1000.00,
            'total_amount' => 14000.00,
            'total_portions' => 1,
            'notes' => "QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa|Export test",
            'ordered_at' => now(),
            'completed_at' => now()
        ]);

        $resReports = $this->dispatchRequest('GET', '/api/admin/export/reports', ['status' => 'completed'], $admin);
        $repCsv = $resReports['json'];
        $repHasBOM = str_starts_with($repCsv, "\xEF\xBB\xBF");
        if ($repHasBOM) {
            $repCsv = substr($repCsv, 3);
        }
        $repLines = explode("\n", trim($repCsv));
        $repHeader = str_getcsv($repLines[0]);
        $hasRepRow = collect($repLines)->contains(fn($l) => str_contains($l, 'purchase') && str_contains($l, 'completed') && str_contains($l, 'QA-EX-'));

        $repCsvOk = ($resReports['status'] === 200 && $repHeader[0] === 'Order ID' && $repHeader[1] === 'Order Code' && $hasRepRow);
        $this->recordVerdict("Phase 4: CSV Exports", "Reports CSV export streams successfully with headers & data", "Valid CSV / rows match", "Headers: " . json_encode($repHeader) . " / hasRow: " . ($hasRepRow ? 'Yes' : 'No'), $repCsvOk, [], $resReports);
    }

    /**
     * Phase 5: Security & Role Protections
     */
    private function runPhase5(): void
    {
        $this->info("\n[Phase 5] Running Security & Role Protection Checks...");
        $buyer = $this->tempData['buyer'];

        // 1. Unauthenticated request (Assert 401)
        $resUnauth = $this->dispatchRequest('GET', '/api/admin/verifications');
        $this->recordVerdict("Phase 5: Security", "Unauthenticated request returns 401", "401", (string)$resUnauth['status'], $resUnauth['status'] === 401, [], $resUnauth);

        // 2. Non-Admin accesses admin route (Assert 403)
        $resForbidden = $this->dispatchRequest('GET', '/api/admin/verifications', [], $buyer);
        $this->recordVerdict("Phase 5: Security", "Non-admin accessing admin verifications returns 403", "403", (string)$resForbidden['status'], $resForbidden['status'] === 403, [], $resForbidden);

        // 3. Non-Admin accesses transactions monitoring (Assert 403)
        $resForbiddenTx = $this->dispatchRequest('GET', '/api/admin/transactions', [], $buyer);
        $this->recordVerdict("Phase 5: Security", "Non-admin accessing admin transactions returns 403", "403", (string)$resForbiddenTx['status'], $resForbiddenTx['status'] === 403, [], $resForbiddenTx);

        // 4. Non-Admin accesses export endpoints (Assert 403)
        $resForbiddenExp = $this->dispatchRequest('GET', '/api/admin/export/users', [], $buyer);
        $this->recordVerdict("Phase 5: Security", "Non-admin accessing admin CSV exports returns 403", "403", (string)$resForbiddenExp['status'], $resForbiddenExp['status'] === 403, [], $resForbiddenExp);
    }

    /**
     * Phase 6: Query & Performance Profiling
     */
    private function runPhase6(): void
    {
        $this->info("\n[Phase 6] Profiling Query Performance...");

        $abnormalQueries = 0;
        $slowestQuery = null;
        $slowestTime = 0.0;

        foreach ($this->endpointQueries as $q) {
            $sql = $q['sql'];
            $time = (float)$q['time'];

            if ($time > 3000.0) {
                $abnormalQueries++;
            }

            if ($time > $slowestTime) {
                $slowestTime = $time;
                $slowestQuery = $sql;
            }
        }

        $this->recordVerdict(
            "Phase 6: Performance",
            "No abnormally slow query execution (>3000ms WAN threshold)",
            "0",
            (string)$abnormalQueries,
            $abnormalQueries === 0,
            [],
            [],
            $abnormalQueries > 0 ? "Abnormal queries found. Slowest: {$slowestTime}ms - {$slowestQuery}" : null
        );

        $this->recordVerdict(
            "Phase 6: Performance",
            "No N+1 query loop risks detected in any API request",
            "None",
            $this->anyRequestNPlusOne ? "N+1 loop detected in request(s)" : "None",
            !$this->anyRequestNPlusOne
        );
    }

    /**
     * Phase 7: Report Compilations
     */
    private function runPhase7(): void
    {
        $this->info("\n[Phase 7] Generating reports...");

        $totalTests = count($this->results);
        $failedCount = collect($this->results)->where('pass', false)->count();
        $passedCount = $totalTests - $failedCount;
        $verdict = ($failedCount === 0) ? "PASS" : "FAIL";

        // Query Stats
        $totalQueries = count($this->queryLog);
        $slowQueries = 0;
        $unique = [];
        $duplicateQueries = 0;

        foreach ($this->queryLog as $q) {
            $sql = $q['sql'];
            $time = $q['time'];
            if ($time > 200.0) {
                $slowQueries++;
            }
            if (isset($unique[$sql])) {
                $unique[$sql]++;
                $duplicateQueries++;
            } else {
                $unique[$sql] = 1;
            }
        }

        // 1. JSON Report Structure
        $jsonReport = [
            'qa_session_id' => $this->qaSessionId,
            'timestamp' => now()->toDateTimeString(),
            'environment' => app()->environment(),
            'verdict' => $verdict,
            'summary' => [
                'total_tests' => $totalTests,
                'passed' => $passedCount,
                'failed' => $failedCount,
            ],
            'performance' => [
                'total_queries' => $totalQueries,
                'duplicate_queries' => $duplicateQueries,
                'heavy_queries' => $slowQueries,
            ],
            'tests' => $this->results,
        ];

        $reportDir = storage_path('app/qa-reports/admin');
        if (!is_dir($reportDir)) {
            mkdir($reportDir, 0755, true);
        }

        $jsonFile = "{$reportDir}/admin_query_profile.json";
        file_put_contents($jsonFile, json_encode($jsonReport, JSON_PRETTY_PRINT));

        // 2. Markdown QA Report
        $md = "# EcoEat Admin Ecosystem Automation QA Report\n\n";
        $md .= "- **Session ID**: `{$this->qaSessionId}`\n";
        $md .= "- **Timestamp**: `" . now()->toDateTimeString() . "`\n";
        $md .= "- **Environment**: `" . app()->environment() . "`\n";
        $md .= "- **Final Verdict**: **{$verdict}**\n\n";

        $md .= "## 📊 Scenario Executive Summary\n";
        $md .= "| Phase | Scenario | Expected | Actual | Status |\n";
        $md .= "| :--- | :--- | :--- | :--- | :--- |\n";
        foreach ($this->results as $r) {
            $statusMark = $r['pass'] ? '✅ PASS' : '❌ FAIL';
            $md .= "| {$r['phase']} | {$r['scenario']} | `{$r['expected']}` | `{$r['actual']}` | {$statusMark} |\n";
        }

        $md .= "\n## ⏱️ Query Profiling & Performance Audit\n";
        $md .= "- **Total SQL Queries**: `{$totalQueries}`\n";
        $md .= "- **Duplicate Queries**: `{$duplicateQueries}`\n";
        $md .= "- **Heavy Queries (>200ms)**: `{$slowQueries}`\n";
        $md .= "- **N+1 Query Loop Detection**: " . ($duplicateQueries > 30 ? '⚠️ **WARNING** (Possible loop detected)' : '✅ **NONE**') . "\n\n";

        $md .= "## 🧬 Audit Trail Metadata Tags\n";
        $md .= "- **QA Tag**: `admin_qa`\n";
        $md .= "- All transient users generated contain email pattern: `*_{$this->qaSessionId}@ecoeat-qa.com`\n";
        $md .= "- All transient orders/transactions contain notes pattern: `QA_SESSION:{$this->qaSessionId}|QA_TAG:admin_qa`\n";
        $md .= "- Seeded records remain in the database for compliance audits and have not been deleted.\n";

        $mdFile = "{$reportDir}/admin_qa_report.md";
        file_put_contents($mdFile, $md);

        // 3. API Endpoint Documentation
        $doc = "# EcoEat Admin Subsystem API Endpoint Documentation\n\n";
        $doc .= "This document outlines the API contracts and usage for the registered Admin subsystem routes.\n\n";

        $doc .= "## 1. Verification Moderation APIs\n\n";
        
        $doc .= "### GET `/api/admin/verifications`\n";
        $doc .= "- **Description**: Lists seller, courier, and LKS profiles needing moderation.\n";
        $doc .= "- **Request Parameters (Query)**:\n";
        $doc .= "  - `role` (optional): `'seller' | 'courier' | 'lks'`\n";
        $doc .= "  - `verification_status` (optional): `'pending' | 'approved' | 'rejected' | 'resubmitted'`\n";
        $doc .= "  - `page` (optional): integer\n";
        $doc .= "- **Response (200)**:\n";
        $doc .= "```json\n";
        $doc .= "{\n";
        $doc .= "  \"success\": true,\n";
        $doc .= "  \"data\": [\n";
        $doc .= "    {\n";
        $doc .= "      \"id\": \"user-uuid\",\n";
        $doc .= "      \"full_name\": \"John Doe\",\n";
        $doc .= "      \"email\": \"john@example.com\",\n";
        $doc .= "      \"role\": \"seller\",\n";
        $doc .= "      \"verification_status\": \"pending\",\n";
        $doc .= "      \"profile\": { ... }\n";
        $doc .= "    }\n";
        $doc .= "  ],\n";
        $doc .= "  \"meta\": { \"current_page\": 1, \"last_page\": 1, \"per_page\": 15, \"total\": 1 }\n";
        $doc .= "}\n";
        $doc .= "```\n\n";

        $doc .= "### PATCH `/api/admin/verifications/{userId}/approve`\n";
        $doc .= "- **Description**: Approves a user verification profile.\n";
        $doc .= "- **Request Parameters (Body)**:\n";
        $doc .= "  - `notes` (optional): string\n";
        $doc .= "- **Response (200)**: Verification details with status `approved`.\n\n";

        $doc .= "### PATCH `/api/admin/verifications/{userId}/reject`\n";
        $doc .= "- **Description**: Rejects a user verification profile.\n";
        $doc .= "- **Request Parameters (Body)**:\n";
        $doc .= "  - `notes` (optional): string\n";
        $doc .= "- **Response (200)**: Verification details with status `rejected`.\n\n";

        $doc .= "### PATCH `/api/admin/verifications/{userId}/undo`\n";
        $doc .= "- **Description**: Reverts approved or rejected status back to pending.\n";
        $doc .= "- **Request Parameters (Body)**:\n";
        $doc .= "  - `notes` (optional): string\n";
        $doc .= "- **Response (200)**: Verification details with status `pending`.\n\n";

        $doc .= "## 2. Transaction & Wallet Monitoring APIs\n\n";

        $doc .= "### GET `/api/admin/transactions`\n";
        $doc .= "- **Description**: Retrieves and filters wallet transaction ledgers.\n";
        $doc .= "- **Request Parameters (Query)**:\n";
        $doc .= "  - `type` (optional): `'purchase' | 'payout' | 'refund' | 'topup' | 'withdrawal' | 'commission' | 'delivery_fee'`\n";
        $doc .= "  - `status` (optional): `'pending' | 'completed' | 'failed' | 'refunded'`\n";
        $doc .= "  - `from` (optional): date\n";
        $doc .= "  - `to` (optional): date\n";
        $doc .= "- **Response (200)**: Paginated transactions list.\n\n";

        $doc .= "### GET `/api/admin/transactions/{id}`\n";
        $doc .= "- **Description**: Retrieves specific transaction details.\n";
        $doc .= "- **Response (200)**: Transaction details with user profiles.\n\n";

        $doc .= "### GET `/api/admin/withdrawals`\n";
        $doc .= "- **Description**: Retrieves and filters withdrawal request logs.\n";
        $doc .= "- **Request Parameters (Query)**:\n";
        $doc .= "  - `status` (optional): `'pending' | 'completed' | 'failed'`\n";
        $doc .= "  - `from` (optional): date\n";
        $doc .= "  - `to` (optional): date\n";
        $doc .= "- **Response (200)**: Paginated withdrawal requests.\n\n";

        $doc .= "### GET `/api/admin/withdrawals/{id}`\n";
        $doc .= "- **Description**: Retrieves specific withdrawal request details.\n";
        $doc .= "- **Response (200)**: Withdrawal request details.\n\n";

        $doc .= "## 3. CSV Streaming Export APIs\n\n";

        $doc .= "### GET `/api/admin/export/users`\n";
        $doc .= "- **Description**: Stream downloads user records as UTF-8 CSV.\n";
        $doc .= "- **Request Parameters (Query)**: same as filters for users list.\n";
        $doc .= "- **Response (200)**: Streamed CSV file.\n\n";

        $doc .= "### GET `/api/admin/export/transactions`\n";
        $doc .= "- **Description**: Stream downloads wallet transaction ledgers as UTF-8 CSV.\n";
        $doc .= "- **Request Parameters (Query)**: same as transaction filters.\n";
        $doc .= "- **Response (200)**: Streamed CSV file.\n\n";

        $doc .= "### GET `/api/admin/export/reports`\n";
        $doc .= "- **Description**: Stream downloads orders report dataset as UTF-8 CSV.\n";
        $doc .= "- **Request Parameters (Query)**: order status and date filters.\n";
        $doc .= "- **Response (200)**: Streamed CSV file.\n\n";

        $docFile = "{$reportDir}/admin_endpoint_documentation.md";
        file_put_contents($docFile, $doc);

        $this->info("Reports successfully generated:");
        $this->info("- Markdown Report: {$mdFile}");
        $this->info("- JSON Query Profile: {$jsonFile}");
        $this->info("- Endpoint Documentation: {$docFile}");
    }
}
