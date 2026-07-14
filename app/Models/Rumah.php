<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rumah extends Model
{
    use HasFactory;

    protected $table = 'rumah';

    protected $fillable = [
        'rt',
        'rw',
        'alamat_detail',
        'provinsi_id',
        'kabupaten_id',
        'kecamatan_id',
        'kelurahan_id',
        'kodepos',
        'foto_rumah',
        'catatan',
    ];

    public function kartuKeluarga()
    {
        return $this->hasMany(KartuKeluarga::class, 'rumah_id');
    }
}
