<?php

namespace App\Http\Controllers\PengurusRT;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use App\Models\KartuKeluarga;
use App\Models\Wilayah;
use App\Traits\GetCurrentRt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

class WargaController extends \App\Http\Controllers\PengurusRW\WargaController
{
    use GetCurrentRt;

    private function getOptions()
    {
        return [
            'agama'             => ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],
            'pendidikan'        => ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'],
            'golongan_darah'    => ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Tidak Tahu'],
            'kewarganegaraan'   => ['WNI', 'WNA'],
            'status_perkawinan' => ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'],
            'shdk'              => ['Kepala Keluarga', 'Suami', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Pembantu', 'Lainnya'],
            'jenis_pekerjaan'   => [
                'Belum/Tidak Bekerja', 'Mengurus Rumah Tangga', 'Pelajar/Mahasiswa',
                'Pensiunan', 'Pegawai Negeri Sipil', 'Tentara Nasional Indonesia',
                'Kepolisian RI', 'Perdagangan', 'Petani/Pekebun', 'Peternak',
                'Nelayan/Perikanan', 'Industri', 'Konstruksi', 'Transportasi',
                'Karyawan Swasta', 'Karyawan BUMN', 'Karyawan BUMD', 'Karyawan Honorer',
                'Buruh Harian Lepas', 'Buruh Tani/Perkebunan', 'Buruh Nelayan/Perikanan',
                'Buruh Peternakan', 'Pembantu Rumah Tangga', 'Tukang Cukur',
                'Tukang Listrik', 'Tukang Batu', 'Tukang Kayu', 'Tukang Sol Sepatu',
                'Tukang Las/Pandai Besi', 'Tukang Jahit', 'Tukang Gigi', 'Penata Rias',
                'Penata Busana', 'Penata Rambut', 'Mekanik', 'Seniman', 'Tabib',
                'Paraji', 'Perancang Busana', 'Penterjemah', 'Imam Masjid',
                'Pendeta', 'Pastor', 'Wartawan', 'Ustadz/Mubaligh', 'Juru Masak',
                'Promotor Acara', 'Anggota DPR-RI', 'Anggota DPD', 'Anggota BPK',
                'Presiden', 'Wakil Presiden', 'Anggota Mahkamah Konstitusi',
                'Anggota Kabinet/Kementerian', 'Duta Besar', 'Gubernur', 'Wakil Gubernur',
                'Bupati', 'Wakil Bupati', 'Walikota', 'Wakil Walikota', 'Anggota DPRD Provinsi',
                'Anggota DPRD Kabupaten/Kota', 'Dosen', 'Guru', 'Pilot', 'Pengacara',
                'Notaris', 'Arsitek', 'Akuntan', 'Konsultan', 'Dokter', 'Bidan',
                'Perawat', 'Apoteker', 'Psikiater/Psikolog', 'Penyiar Televisi',
                'Penyiar Radio', 'Pelaut', 'Peneliti', 'Sopir', 'Pialang', 'Paranormal',
                'Pedagang', 'Perangkat Desa', 'Kepala Desa', 'Biarawati', 'Wiraswasta',
            ]
        ];
    }

    public function eksporPdfSemuaWarga()
    {
        $rt    = $this->getCurrentRt();
        $wargas = Warga::with('kartuKeluarga')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.daftar-warga', compact('wargas'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Semua-Data-Warga-RT.pdf');
    }

    public function semuaWarga()
    {
        $rt    = $this->getCurrentRt();
        $wargas = Warga::with('kartuKeluarga')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('created_at', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.warga.ekspor.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/Warga/SemuaWarga', [
            'wargas'    => $wargas,
            'eksporUrl' => $eksporUrl,
            'options'   => $this->getOptions(),
            'currentRt' => $rt,
        ]);
    }

    public function index(KartuKeluarga $keluarga)
    {
        $keluarga->load(['rumah', 'warga']);

        $source    = $keluarga->rumah ? $keluarga->rumah : $keluarga;
        $provinsi  = $source->provinsi_id  ? Wilayah::find($source->provinsi_id)?->nama  : null;
        $kabupaten = $source->kabupaten_id ? Wilayah::find($source->kabupaten_id)?->nama : null;
        $kecamatan = $source->kecamatan_id ? Wilayah::find($source->kecamatan_id)?->nama : null;
        $kelurahan = $source->kelurahan_id ? Wilayah::find($source->kelurahan_id)?->nama : null;
        $kodepos   = $source->kodepos;

        return Inertia::render('PengurusRT/Warga/DaftarWarga', [
            'keluarga' => $keluarga,
            'wargas'   => $keluarga->warga,
            'wilayah'  => compact('provinsi', 'kabupaten', 'kecamatan', 'kelurahan', 'kodepos'),
            'options'  => $this->getOptions(),
        ]);
    }
}
