<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $hasLatitude = Schema::hasColumn('users', 'latitude');
        $hasLongitude = Schema::hasColumn('users', 'longitude');

        if ($hasLatitude && $hasLongitude) {
            return;
        }

        Schema::table('users', function (Blueprint $table) use ($hasLatitude, $hasLongitude): void {
            if (! $hasLatitude) {
                $table->decimal('latitude', 10, 7)->nullable()->after('status');
            }

            if (! $hasLongitude) {
                $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $hasLatitude = Schema::hasColumn('users', 'latitude');
        $hasLongitude = Schema::hasColumn('users', 'longitude');

        if (! $hasLatitude && ! $hasLongitude) {
            return;
        }

        Schema::table('users', function (Blueprint $table) use ($hasLatitude, $hasLongitude): void {
            $columns = [];

            if ($hasLatitude) {
                $columns[] = 'latitude';
            }

            if ($hasLongitude) {
                $columns[] = 'longitude';
            }

            $table->dropColumn($columns);
        });
    }
};
