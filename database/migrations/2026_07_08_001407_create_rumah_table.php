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
        Schema::create('rumah', function (Blueprint $table) {
            $table->id();
            $table->string('rt', 5);
            $table->string('rw', 5)->default('040');
            $table->text('alamat_detail');
            
            // Foreign Keys untuk wilayah
            $table->bigInteger('provinsi_id')->unsigned()->nullable();
            $table->bigInteger('kabupaten_id')->unsigned()->nullable();
            $table->bigInteger('kecamatan_id')->unsigned()->nullable();
            $table->bigInteger('kelurahan_id')->unsigned()->nullable();
            
            $table->string('foto_rumah')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rumah');
    }
};
