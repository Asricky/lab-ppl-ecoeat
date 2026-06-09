<?php

namespace App\Services\QA;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class QaSessionService
{
    private string $sessionId;
    private string $startedAt;
    private array $dbInitialSnapshot;
    private array $dbFinalSnapshot;
    
    public function __construct(
        private readonly QaFlowLoggerService $flowLogger,
        private readonly QaDatabaseAuditService $dbAuditor
    ) {
        $this->sessionId = 'QA-SES-' . strtoupper(Str::random(10));
        $this->startedAt = now()->toIso8601String();
    }

    public function start(): void
    {
        $this->dbAuditor->startSession();
        $this->dbInitialSnapshot = $this->dbAuditor->getSnapshot();
    }

    public function logStep(
        string $flowName,
        string $stepName,
        string $method,
        string $uri,
        array $payload,
        int $statusCode,
        $responseBody,
        float $executionTimeMs,
        array $queryStats,
        bool $isPass,
        ?string $errorDetails = null
    ): void {
        $this->flowLogger->logStep(
            $flowName,
            $stepName,
            $method,
            $uri,
            $payload,
            $statusCode,
            $responseBody,
            $executionTimeMs,
            $queryStats,
            $isPass,
            $errorDetails
        );
    }

    public function completeSession(): array
    {
        $this->dbFinalSnapshot = $this->dbAuditor->getSnapshot();
        $insertedData = $this->dbAuditor->getInsertedCount();
        $consistencyResult = $this->dbAuditor->validateConsistency();
        
        $logs = $this->flowLogger->getLogs();
        $totalTests = count($logs);
        $totalPass = collect($logs)->where('pass', true)->count();
        $totalFail = $totalTests - $totalPass;
        
        // Calculate query and performance stats
        $totalQueries = 0;
        $duplicateQueries = 0;
        $heavyQueries = 0;
        
        foreach ($logs as $log) {
            $totalQueries += $log['query_stats']['total_queries'] ?? 0;
            $duplicateQueries += $log['query_stats']['duplicate_queries'] ?? 0;
            $heavyQueries += $log['query_stats']['heavy_queries'] ?? 0;
        }
        
        $nPlusOneRisk = ($duplicateQueries > 30 || collect($logs)->contains(fn($l) => ($l['query_stats']['duplicate_queries'] ?? 0) > 10));
        
        $verdict = ($totalFail === 0 && $consistencyResult['valid']) ? 'PASS' : 'FAIL';
        
        $perfAudit = [
            'total_queries' => $totalQueries,
            'duplicate_queries' => $duplicateQueries,
            'heavy_queries' => $heavyQueries,
            'n_plus_one_risk' => $nPlusOneRisk ? 'High Risk' : 'Low Risk',
        ];
        
        $dbAudit = [
            'inserted_orders' => $insertedData['orders'],
            'inserted_deliveries' => $insertedData['deliveries'],
            'inserted_tracking_logs' => $insertedData['delivery_tracking_logs'],
            'inserted_wallet_transactions' => $insertedData['wallet_transactions'],
            'consistency' => $consistencyResult,
        ];
        
        // Ensure folders exist
        @mkdir(storage_path('app/qa-reports/json'), 0777, true);
        @mkdir(storage_path('app/qa-reports/markdown'), 0777, true);

        $timestamp = now()->format('Ymd_His');

        // 1. Generate JSON Report
        $jsonReport = [
            'qa_session_id' => $this->sessionId,
            'started_at' => $this->startedAt,
            'environment' => config('app.env', 'local'),
            'summary' => [
                'total_tests' => $totalTests,
                'total_pass' => $totalPass,
                'total_fail' => $totalFail,
            ],
            'flows' => $logs,
            'database_audit' => $dbAudit,
            'performance' => $perfAudit,
            'final_verdict' => $verdict,
        ];
        
        $jsonPath = storage_path("app/qa-reports/json/donation_flow_qa_{$timestamp}.json");
        file_put_contents($jsonPath, json_encode($jsonReport, JSON_PRETTY_PRINT));

        // 2. Generate Markdown Report
        $markdown = $this->buildMarkdownReport($jsonReport, $totalTests, $totalPass, $totalFail, $dbAudit, $perfAudit, $verdict);
        $markdownPath = storage_path("app/qa-reports/markdown/donation_flow_qa_{$timestamp}.md");
        file_put_contents($markdownPath, $markdown);

        // Also update standard artifacts path for Gemini UI visual reference
        $brainMarkdownPath = "C:/Users/MP2C6/.gemini/antigravity/brain/79fd23cf-dd05-497f-9f7f-2634468cf5e1/donation_qa_report.md";
        file_put_contents($brainMarkdownPath, $markdown);

        return [
            'qa_session_id' => $this->sessionId,
            'json_path' => $jsonPath,
            'markdown_path' => $markdownPath,
            'verdict' => $verdict,
            'summary' => $jsonReport['summary']
        ];
    }

    private function buildMarkdownReport(
        array $report,
        int $totalTests,
        int $totalPass,
        int $totalFail,
        array $dbAudit,
        array $perfAudit,
        string $verdict
    ): string {
        $md = "# QA RUN HEADER\n";
        $md .= "- **QA Session ID**: {$this->sessionId}\n";
        $md .= "- **Started At**: {$this->startedAt}\n";
        $md .= "- **Environment**: {$report['environment']}\n";
        $md .= "- **Total Tests**: {$totalTests}\n";
        $md .= "- **Total Pass**: {$totalPass}\n";
        $md .= "- **Total Fail**: {$totalFail}\n\n";

        $md .= "# FLOW RESULTS\n\n";
        
        $currentFlow = '';
        foreach ($report['flows'] as $log) {
            if ($currentFlow !== $log['flow']) {
                $currentFlow = $log['flow'];
                $md .= "## Flow: {$currentFlow}\n\n";
            }
            
            $statusMark = $log['pass'] ? '✅ PASS' : '❌ FAIL';
            $md .= "### Step: {$log['step']}\n";
            $md .= "- **Endpoint**: `{$log['method']} {$log['uri']}`\n";
            $md .= "- **Payload**: `" . json_encode($log['payload']) . "`\n";
            $md .= "- **Response Status**: `{$log['status_code']}`\n";
            $md .= "- **Execution Time**: `{$log['execution_time_ms']} ms`\n";
            $md .= "- **Query Count**: `{$log['query_stats']['total_queries']}` (Duplicates: `{$log['query_stats']['duplicate_queries']}`, Heavy: `{$log['query_stats']['heavy_queries']}`)\n";
            $md .= "- **Status**: **{$statusMark}**\n";
            if ($log['error_details']) {
                $md .= "- **Error Info**: `{$log['error_details']}`\n";
            }
            if ($log['response_body']) {
                $bodyString = is_array($log['response_body']) ? json_encode($log['response_body'], JSON_PRETTY_PRINT) : $log['response_body'];
                $md .= "- **Response Body**:\n```json\n" . substr($bodyString, 0, 1000) . (strlen($bodyString) > 1000 ? "\n... (truncated)" : "") . "\n```\n";
            }
            $md .= "\n---\n\n";
        }

        $md .= "# DATABASE AUDIT\n";
        $md .= "- **Inserted Orders**: {$dbAudit['inserted_orders']}\n";
        $md .= "- **Inserted Deliveries**: {$dbAudit['inserted_deliveries']}\n";
        $md .= "- **Inserted Tracking Logs**: {$dbAudit['inserted_tracking_logs']}\n";
        $md .= "- **Inserted Wallet Transactions**: {$dbAudit['inserted_wallet_transactions']}\n";
        
        $consistencyValid = $dbAudit['consistency']['valid'] ? '✅ Consistent' : '❌ Inconsistent';
        $md .= "- **Lifecycle Consistency**: **{$consistencyValid}**\n";
        if (!$dbAudit['consistency']['valid']) {
            $md .= "\n### Consistency Issues Found:\n";
            foreach ($dbAudit['consistency']['issues'] as $issue) {
                $md .= "- ⚠️ {$issue}\n";
            }
        }
        $md .= "\n";

        $md .= "# PERFORMANCE AUDIT\n";
        $md .= "- **Query Count**: {$perfAudit['total_queries']}\n";
        $md .= "- **Duplicate Query Count**: {$perfAudit['duplicate_queries']}\n";
        $md .= "- **Heavy Queries**: {$perfAudit['heavy_queries']}\n";
        $md .= "- **N+1 Risk**: **{$perfAudit['n_plus_one_risk']}**\n\n";

        $md .= "# FINAL VERDICT\n";
        if ($verdict === 'PASS') {
            $md .= "## 🏆 **PASS**\n";
        } else {
            $md .= "## ❌ **FAIL**\n";
        }

        return $md;
    }
}
