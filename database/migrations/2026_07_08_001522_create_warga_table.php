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
        Schema::create('warga', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kk_id')->constrained('kartu_keluarga')->onDelete('cascade');
            $table->string('nama_lengkap');
            $table->bigInteger('nik')->unique();
            $table->string('no_whatsapp', 20)->nullable();
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('tempat_lahir', 100);
            $table->date('tanggal_lahir');
            $table->string('tempat_meninggal', 100)->nullable();
            $table->date('tanggal_meninggal')->nullable();
            $table->enum('agama', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']);
            $table->enum('pendidikan', ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']);
            $table->string('jenis_pekerjaan', 100);
            $table->enum('golongan_darah', ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Tidak Tahu']);
            $table->string('kewarganegaraan', 50)->default('WNI');
            $table->string('nomor_paspor', 50)->nullable();
            $table->string('nomor_kitap', 50)->nullable();
            $table->string('pindah_datang_dari')->nullable();
            $table->date('tanggal_pindah_datang')->nullable();
            $table->string('pindah_pergi')->nullable();
            $table->enum('status_perkawinan', ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']);
            $table->date('tanggal_perkawinan')->nullable();
            $table->enum('shdk', ['Kepala Keluarga', 'Suami', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Pembantu', 'Lainnya']);
            $table->string('nama_ayah');
            $table->string('nama_ibu');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warga');
    }
};
