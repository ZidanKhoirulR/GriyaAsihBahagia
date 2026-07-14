<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('metode_transaksi', function (Blueprint $table) {
            // null = rekening RW (untuk semua), isi = rekening RT spesifik (misal: '01', '02', '03', dst)
            $table->string('rt', 5)->nullable()->after('is_aktif')
                  ->comment('null = berlaku untuk semua (RW), isi nomor RT jika spesifik RT');
        });
    }

    public function down(): void
    {
        Schema::table('metode_transaksi', function (Blueprint $table) {
            $table->dropColumn('rt');
        });
    }
};
