<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KartuKeluarga extends Model
{
    use HasFactory;

    protected $table = 'kartu_keluarga';

    protected $fillable = [
        'rumah_id',
        'nomor_kk',
        'status_tinggal',
        'foto_kk',
        'tanggal_dikeluarkan',
        'provinsi_id',
        'kabupaten_id',
        'kecamatan_id',
        'kelurahan_id',
        'kodepos',
        'alamat_detail',
        'rt',
        'rw',
        'catatan',
    ];

    protected $casts = [
        'tanggal_dikeluarkan' => 'date',
    ];

    protected $appends = ['encrypted_id'];

    public function getEncryptedIdAttribute()
    {
        return \Illuminate\Support\Facades\Crypt::encryptString($this->id);
    }

    public function resolveRouteBinding($value, $field = null)
    {
        try {
            $id = \Illuminate\Support\Facades\Crypt::decryptString($value);
            return $this->where('id', $id)->firstOrFail();
        } catch (\Exception $e) {
            abort(404);
        }
    }

    public function rumah()
    {
        return $this->belongsTo(Rumah::class, 'rumah_id');
    }

    public function warga()
    {
        return $this->hasMany(Warga::class, 'kk_id');
    }
}
