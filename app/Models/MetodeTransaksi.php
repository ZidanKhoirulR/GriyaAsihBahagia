<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodeTransaksi extends Model
{
    protected $table = 'metode_transaksi';

    protected $fillable = [
        'nama_metode',
        'nomor_rekening',
        'atas_nama',
        'keterangan',
        'is_aktif',
        'rt', // null = berlaku untuk RW/semua, isi nomor RT jika spesifik
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
    ];
}
