<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('iuran_warga', function (Blueprint $table) {
            $table->id();
            // Relasi ke KK (bukan warga individu) agar sinkron dalam satu keluarga
            $table->foreignId('kk_id')->constrained('kartu_keluarga')->onDelete('cascade');
            $table->string('rt', 5); // RT dari KK warga yang membayar
            $table->string('bulan', 7); // Format: 2026-07 (YYYY-MM)
            $table->enum('status', ['belum_bayar', 'menunggu_konfirmasi', 'lunas'])->default('belum_bayar');
            $table->string('bukti_pembayaran')->nullable(); // path file bukti
            $table->timestamp('tanggal_bayar')->nullable();
            $table->foreignId('dikonfirmasi_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('tanggal_konfirmasi')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Satu KK hanya boleh punya satu record iuran per bulan
            $table->unique(['kk_id', 'bulan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('iuran_warga');
    }
};
