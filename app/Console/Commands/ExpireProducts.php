<?php

namespace App\Console\Commands;

use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpireProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire active products whose expiry date has passed';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $today = Carbon::today();

        Product::where('status', 'active')
            ->whereDate('expiry_date', '<', $today)
            ->update(['status' => 'expired']);

        $this->info('Expired products updated successfully');

        return self::SUCCESS;
    }
}
