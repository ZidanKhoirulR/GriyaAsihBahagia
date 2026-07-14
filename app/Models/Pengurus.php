<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengurus extends Model
{
    protected $table = 'pengurus';

    protected $fillable = [
        'warga_id',
        'jabatan',
        'tingkat',
        'rt',
        'periode_mulai',
        'periode_selesai',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
        'periode_mulai' => 'date',
        'periode_selesai' => 'date',
    ];

    public function warga()
    {
        return $this->belongsTo(Warga::class, 'warga_id');
    }
}
