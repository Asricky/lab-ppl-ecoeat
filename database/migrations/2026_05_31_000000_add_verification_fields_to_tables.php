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
        if (Schema::hasTable('kyc_documents')) {
            Schema::table('kyc_documents', function (Blueprint $table) {
                if (! Schema::hasColumn('kyc_documents', 'document_number')) {
                    $table->string('document_number')->nullable()->after('document_type');
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'rejection_note')) {
                    $table->text('rejection_note')->nullable()->after('status');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('kyc_documents')) {
            Schema::table('kyc_documents', function (Blueprint $table) {
                if (Schema::hasColumn('kyc_documents', 'document_number')) {
                    $table->dropColumn('document_number');
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'rejection_note')) {
                    $table->dropColumn('rejection_note');
                }
            });
        }
    }
};
