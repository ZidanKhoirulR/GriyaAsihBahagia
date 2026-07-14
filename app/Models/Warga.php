<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warga extends Model
{
    use HasFactory;

    protected $table = 'warga';

    protected $fillable = [
        'kk_id',
        'nama_lengkap',
        'nik',
        'no_whatsapp',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'tempat_meninggal',
        'tanggal_meninggal',
        'agama',
        'pendidikan',
        'jenis_pekerjaan',
        'golongan_darah',
        'kewarganegaraan',
        'nomor_paspor',
        'nomor_kitap',
        'pindah_datang_dari',
        'tanggal_pindah_datang',
        'pindah_pergi',
        'tanggal_pindah_pergi',
        'status_perkawinan',
        'tanggal_perkawinan',
        'shdk',
        'nama_ayah',
        'nama_ibu',
        'catatan',
        'tanggal_mulai_kehamilan',
        'tanggal_melahirkan',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_meninggal' => 'date',
        'tanggal_pindah_datang' => 'date',
        'tanggal_pindah_pergi' => 'date',
        'tanggal_perkawinan' => 'date',
        'tanggal_mulai_kehamilan' => 'date',
        'tanggal_melahirkan' => 'date',
    ];

    public function kartuKeluarga()
    {
        return $this->belongsTo(KartuKeluarga::class, 'kk_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'nik', 'nik');
    }
}
