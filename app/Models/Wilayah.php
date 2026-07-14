<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wilayah extends Model
{
    protected $table = 'wilayah';

    protected $fillable = [
        'kode',
        'nama',
        'level',
        'kode_provinsi',
        'kode_kabkota',
        'kode_kecamatan',
        'kodepos',
    ];

    public $timestamps = false;

    const UPDATED_AT = null;

    /**
     * Scope: Provinsi (level 1)
     */
    public function scopeProvinsi($query)
    {
        return $query->where('level', 1)->orderBy('nama');
    }

    /**
     * Scope: Kabupaten/Kota (level 2) berdasarkan kode_provinsi
     */
    public function scopeKabupaten($query, string $kodeProvinsi)
    {
        return $query->where('level', 2)
            ->where('kode_provinsi', $kodeProvinsi)
            ->orderBy('nama');
    }

    /**
     * Scope: Kecamatan (level 3) berdasarkan kode_kabkota
     */
    public function scopeKecamatan($query, string $kodeKabkota)
    {
        return $query->where('level', 3)
            ->where('kode_kabkota', $kodeKabkota)
            ->orderBy('nama');
    }

    /**
     * Scope: Kelurahan/Desa (level 4) berdasarkan kode_kecamatan
     */
    public function scopeKelurahan($query, string $kodeKecamatan)
    {
        return $query->where('level', 4)
            ->where('kode_kecamatan', $kodeKecamatan)
            ->orderBy('nama');
    }
}
