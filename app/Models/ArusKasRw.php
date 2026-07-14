<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArusKasRw extends Model
{
    protected $table = 'arus_kas_rw';

    protected $fillable = [
        'tanggal', 'rt', 'kategori', 'metode_transaksi_id',
        'jenis', 'nominal', 'slip_struk', 'penyetor', 'penerima',
        'catatan', 'status_validasi', 'divalidasi_oleh', 'divalidasi_at',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
        'divalidasi_at' => 'datetime',
    ];

    public function metodeTransaksi()
    {
        return $this->belongsTo(MetodeTransaksi::class, 'metode_transaksi_id');
    }
}
