<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IuranWarga extends Model
{
    protected $table = 'iuran_warga';

    protected $fillable = [
        'kk_id',
        'rt',
        'bulan',
        'status',
        'bukti_pembayaran',
        'tanggal_bayar',
        'dikonfirmasi_oleh',
        'tanggal_konfirmasi',
        'catatan',
        'nominal',
    ];

    protected $casts = [
        'tanggal_bayar'      => 'datetime',
        'tanggal_konfirmasi' => 'datetime',
    ];

    public function kartuKeluarga()
    {
        return $this->belongsTo(KartuKeluarga::class, 'kk_id');
    }

    public function dikonfirmasiOleh()
    {
        return $this->belongsTo(User::class, 'dikonfirmasi_oleh');
    }

    // Label status yang mudah dibaca
    public function getLabelStatusAttribute(): string
    {
        return match($this->status) {
            'belum_bayar'           => 'Belum Bayar',
            'menunggu_konfirmasi'   => 'Menunggu Konfirmasi',
            'lunas'                 => 'Lunas',
            default                 => '-',
        };
    }
}
