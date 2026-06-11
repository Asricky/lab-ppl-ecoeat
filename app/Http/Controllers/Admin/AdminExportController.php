<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExportFilterRequest;
use App\Services\Admin\AdminExportService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminExportController extends Controller
{
    public function __construct(private readonly AdminExportService $service)
    {
    }

    /**
     * Export all users (filtered) as a streamed CSV file.
     */
    public function exportUsers(ExportFilterRequest $request): StreamedResponse
    {
        return $this->service->exportUsers($request->validated());
    }

    /**
     * Export all wallet transactions (filtered) as a streamed CSV file.
     */
    public function exportTransactions(ExportFilterRequest $request): StreamedResponse
    {
        return $this->service->exportTransactions($request->validated());
    }

    /**
     * Export system report (filtered orders list) as a streamed CSV file.
     */
    public function exportReports(ExportFilterRequest $request): StreamedResponse
    {
        return $this->service->exportReports($request->validated());
    }
}
