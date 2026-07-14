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
        Schema::table('arus_kas_rt', function (Blueprint $table) {
            $table->foreignId('iuran_warga_id')->nullable()->constrained('iuran_warga')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('arus_kas_rt', function (Blueprint $table) {
            $table->dropForeign(['iuran_warga_id']);
            $table->dropColumn('iuran_warga_id');
        });
    }
};
