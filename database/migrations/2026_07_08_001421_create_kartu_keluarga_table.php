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
        Schema::create('kartu_keluarga', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rumah_id')->constrained('rumah')->onDelete('cascade');
            $table->bigInteger('nomor_kk')->unique();
            $table->enum('status_tinggal', ['tetap', 'kontrak', 'kos', 'numpang']);
            $table->string('foto_kk')->nullable();
            $table->date('tanggal_dikeluarkan');
            
            // Foreign Keys untuk wilayah
            $table->bigInteger('provinsi_id')->unsigned()->nullable();
            $table->bigInteger('kabupaten_id')->unsigned()->nullable();
            $table->bigInteger('kecamatan_id')->unsigned()->nullable();
            $table->bigInteger('kelurahan_id')->unsigned()->nullable();
            
            $table->text('alamat_detail');
            $table->string('rt', 5);
            $table->string('rw', 5)->default('040');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_keluarga');
    }
};
