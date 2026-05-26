<?php

namespace App\Services\QA;

class QaFlowLoggerService
{
    private array $logs = [];

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
        $this->logs[] = [
            'flow' => $flowName,
            'step' => $stepName,
            'method' => $method,
            'uri' => $uri,
            'payload' => $payload,
            'status_code' => $statusCode,
            'response_body' => $responseBody,
            'execution_time_ms' => $executionTimeMs,
            'query_stats' => $queryStats,
            'pass' => $isPass,
            'error_details' => $errorDetails,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    public function getLogs(): array
    {
        return $this->logs;
    }
}
