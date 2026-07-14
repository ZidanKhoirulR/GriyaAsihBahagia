<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WilayahController;

Route::prefix('wilayah')->group(function () {
    Route::get('/provinsi', [WilayahController::class, 'provinsi']);
    Route::get('/kabupaten', [WilayahController::class, 'kabupaten']);
    Route::get('/kecamatan', [WilayahController::class, 'kecamatan']);
    Route::get('/kelurahan', [WilayahController::class, 'kelurahan']);
});
