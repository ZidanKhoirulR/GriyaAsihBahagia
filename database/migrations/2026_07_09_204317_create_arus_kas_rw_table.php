<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('arus_kas_rw', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('rt');
            $table->string('kategori');
            $table->foreignId('metode_transaksi_id')->nullable()->constrained('metode_transaksi')->nullOnDelete();
            $table->enum('jenis', ['pemasukan', 'pengeluaran']);
            $table->decimal('nominal', 15, 2)->default(0);
            $table->string('slip_struk')->nullable();
            $table->string('penyetor')->nullable();
            $table->string('penerima')->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status_validasi', ['menunggu', 'tervalidasi'])->default('menunggu');
            $table->string('divalidasi_oleh')->nullable();
            $table->timestamp('divalidasi_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('arus_kas_rw');
    }
};
