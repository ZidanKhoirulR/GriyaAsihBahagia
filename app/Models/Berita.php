<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Berita extends Model
{
    use HasFactory;

    protected $table = 'berita';

    protected $fillable = [
        'judul',
        'gambar',
        'isi_kalimat',
        'tanggal_upload',
    ];

    protected $casts = [
        'tanggal_upload' => 'date',
    ];
}
