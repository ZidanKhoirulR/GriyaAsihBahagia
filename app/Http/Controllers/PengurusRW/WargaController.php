<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Warga;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WargaController extends Controller
{
    public function eksporPdfSemuaWarga()
    {
        $wargas = Warga::with('kartuKeluarga')->orderBy('created_at', 'desc')->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.daftar-warga', compact('wargas'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Semua-Data-Warga-RW.pdf');
    }

    public function semuaWarga()
    {
        $wargas = Warga::with('kartuKeluarga')->orderBy('created_at', 'desc')->get();
        $eksporUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute('pengurus-rw.warga.ekspor.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/Warga/SemuaWarga', [
            'wargas' => $wargas,
            'eksporUrl' => $eksporUrl,
            'options'   => [
                'agama'             => ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],
                'pendidikan'        => ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'],
                'golongan_darah'    => ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Tidak Tahu'],
                'kewarganegaraan'   => ['WNI', 'WNA'],
                'status_perkawinan' => ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'],
                'shdk'              => ['Kepala Keluarga', 'Suami', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Pembantu', 'Lainnya'],
                'jenis_pekerjaan'   => [
                    'Belum/Tidak Bekerja', 'Mengurus Rumah Tangga', 'Pelajar/Mahasiswa',
                    'Pegawai Negeri Sipil (PNS)', 'Tentara Nasional Indonesia (TNI)', 'Kepolisian RI (POLRI)',
                    'Perdagangan', 'Petani/Pekebun', 'Peternak', 'Nelayan/Perikanan', 'Industri',
                    'Konstruksi', 'Transportasi', 'Karyawan Swasta', 'Karyawan BUMN', 'Karyawan BUMD',
                    'Karyawan Honorer', 'Buruh Harian Lepas', 'Buruh Tani/Perkebunan',
                    'Buruh Nelayan/Perikanan', 'Buruh Peternakan', 'Pembantu Rumah Tangga',
                    'Tukang Cukur', 'Tukang Listrik', 'Tukang Batu', 'Tukang Kayu', 'Tukang Sol Sepatu',
                    'Tukang Las/Pandai Besi', 'Tukang Jahit', 'Penata Rambut', 'Mekanik',
                    'Seniman', 'Tabib', 'Paraji', 'Perancang Busana', 'Penerjemah', 'Imam Masjid',
                    'Pendeta', 'Pastor', 'Wartawan', 'Ustadz/Mubaligh', 'Juru Masak', 'Promotor Acara',
                    'Anggota DPR-RI', 'Anggota DPD', 'Anggota BPK', 'Presiden', 'Wakil Presiden',
                    'Anggota Mahkamah Konstitusi', 'Anggota Kabinet/Kementerian', 'Duta Besar',
                    'Gubernur', 'Wakil Gubernur', 'Bupati', 'Wakil Bupati', 'Walikota', 'Wakil Walikota',
                    'Anggota DPRD Provinsi', 'Anggota DPRD Kabupaten/Kota', 'Dosen', 'Guru', 'Pilot',
                    'Pengacara', 'Notaris', 'Arsitek', 'Akuntan', 'Konsultan', 'Dokter', 'Bidan',
                    'Perawat', 'Apoteker', 'Psikiater/Psikolog', 'Penyiar Televisi', 'Penyiar Radio',
                    'Pelaut', 'Peneliti', 'Sopir', 'Pialang', 'Paranormal', 'Pedagang',
                    'Perangkat Desa', 'Kepala Desa', 'Biarawati', 'Wiraswasta', 'Lainnya'
                ]
            ]
        ]);
    }

    public function index(KartuKeluarga $keluarga)
    {
        $keluarga->load(['rumah', 'warga']);

        // Ambil ID wilayah dari rumah jika ada, jika tidak dari keluarga
        $source = $keluarga->rumah ? $keluarga->rumah : $keluarga;

        // Resolve nama wilayah dari ID
        $provinsi  = $source->provinsi_id  ? Wilayah::find($source->provinsi_id)?->nama  : null;
        $kabupaten = $source->kabupaten_id ? Wilayah::find($source->kabupaten_id)?->nama : null;
        $kecamatan = $source->kecamatan_id ? Wilayah::find($source->kecamatan_id)?->nama : null;
        $kelurahan = $source->kelurahan_id ? Wilayah::find($source->kelurahan_id)?->nama : null;
        $kodepos   = $source->kodepos;

        return Inertia::render('PengurusRW/Warga/DaftarWarga', [
            'keluarga'  => $keluarga,
            'wargas'    => $keluarga->warga,
            'wilayah'   => [
                'provinsi'  => $provinsi,
                'kabupaten' => $kabupaten,
                'kecamatan' => $kecamatan,
                'kelurahan' => $kelurahan,
                'kodepos'   => $kodepos,
            ],
            'options'   => [
                'agama'             => ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'],
                'pendidikan'        => ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'],
                'golongan_darah'    => ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Tidak Tahu'],
                'kewarganegaraan'   => ['WNI', 'WNA'],
                'status_perkawinan' => ['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'],
                'shdk'              => ['Kepala Keluarga', 'Suami', 'Istri', 'Anak', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Famili Lain', 'Pembantu', 'Lainnya'],
                'jenis_pekerjaan'   => [
                    'Belum/Tidak Bekerja', 'Mengurus Rumah Tangga', 'Pelajar/Mahasiswa',
                    'Pegawai Negeri Sipil (PNS)', 'Tentara Nasional Indonesia (TNI)', 'Kepolisian RI (POLRI)',
                    'Perdagangan', 'Petani/Pekebun', 'Peternak', 'Nelayan/Perikanan', 'Industri',
                    'Konstruksi', 'Transportasi', 'Karyawan Swasta', 'Karyawan BUMN', 'Karyawan BUMD',
                    'Karyawan Honorer', 'Buruh Harian Lepas', 'Buruh Tani/Perkebunan',
                    'Buruh Nelayan/Perikanan', 'Buruh Peternakan', 'Pembantu Rumah Tangga',
                    'Tukang Cukur', 'Tukang Listrik', 'Tukang Batu', 'Tukang Kayu', 'Tukang Sol Sepatu',
                    'Tukang Las/Pandai Besi', 'Tukang Jahit', 'Penata Rambut', 'Mekanik',
                    'Seniman', 'Tabib', 'Paraji', 'Perancang Busana', 'Penerjemah', 'Imam Masjid',
                    'Wartawan', 'Ustadz/Mubaligh', 'Juru Masak', 'Promotor Acara', 'Anggota DPR-RI',
                    'Anggota DPD', 'Anggota BPK', 'Presiden', 'Wakil Presiden', 'Anggota Mahkamah Konstitusi',
                    'Wiraswasta', 'Lainnya',
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kk_id'                 => 'required|exists:kartu_keluarga,id',
            'nama_lengkap'          => 'required|string|max:255',
            'nik'                   => 'required|digits:16|unique:warga,nik',
            'no_whatsapp'           => 'nullable|string|max:20',
            'jenis_kelamin'         => 'required|in:L,P',
            'tempat_lahir'          => 'required|string|max:100',
            'tanggal_lahir'         => 'required|date',
            'tempat_meninggal'      => 'nullable|string|max:100',
            'tanggal_meninggal'     => 'nullable|date',
            'agama'                 => 'required|string',
            'pendidikan'            => 'required|string',
            'jenis_pekerjaan'       => 'required|string|max:100',
            'golongan_darah'        => 'required|string',
            'kewarganegaraan'       => 'required|string|max:50',
            'nomor_paspor'          => 'nullable|string|max:50',
            'nomor_kitap'           => 'nullable|string|max:50',
            'pindah_datang_dari'    => 'nullable|string|max:255',
            'tanggal_pindah_datang' => 'nullable|date',
            'pindah_pergi'          => 'nullable|string|max:255',
            'tanggal_pindah_pergi'  => 'nullable|date',
            'status_perkawinan'     => 'required|string',
            'tanggal_perkawinan'    => 'nullable|date',
            'shdk'                  => 'required|string',
            'nama_ayah'             => 'required|string|max:255',
            'nama_ibu'              => 'required|string|max:255',
            'catatan'               => 'nullable|string',
            'tanggal_mulai_kehamilan' => 'nullable|date',
            'tanggal_melahirkan'      => 'nullable|date',
        ]);

        Warga::create($validated);

        // Auto-create akun user untuk warga
        \App\Models\User::firstOrCreate(
            ['nik' => $validated['nik']],
            [
                'nama_lengkap' => $validated['nama_lengkap'],
                'role' => 'warga',
                'password' => $validated['nik'], // Laravel otomatis melakukan hashing karena ada cast 'hashed'
            ]
        );

        $keluarga = KartuKeluarga::findOrFail($request->kk_id);

        return redirect()->route('pengurus-rw.warga.index', ['keluarga' => $keluarga->encrypted_id])
            ->with('success', 'Data warga berhasil ditambahkan.');
    }

    public function update(Request $request, Warga $warga)
    {
        $validated = $request->validate([
            'nama_lengkap'          => 'required|string|max:255',
            'nik'                   => 'required|digits:16|unique:warga,nik,' . $warga->id,
            'no_whatsapp'           => 'nullable|string|max:20',
            'jenis_kelamin'         => 'required|in:L,P',
            'tempat_lahir'          => 'required|string|max:100',
            'tanggal_lahir'         => 'required|date',
            'tempat_meninggal'      => 'nullable|string|max:100',
            'tanggal_meninggal'     => 'nullable|date',
            'agama'                 => 'required|string',
            'pendidikan'            => 'required|string',
            'jenis_pekerjaan'       => 'required|string|max:100',
            'golongan_darah'        => 'required|string',
            'kewarganegaraan'       => 'required|string|max:50',
            'nomor_paspor'          => 'nullable|string|max:50',
            'nomor_kitap'           => 'nullable|string|max:50',
            'pindah_datang_dari'    => 'nullable|string|max:255',
            'tanggal_pindah_datang' => 'nullable|date',
            'pindah_pergi'          => 'nullable|string|max:255',
            'tanggal_pindah_pergi'  => 'nullable|date',
            'status_perkawinan'     => 'required|string',
            'tanggal_perkawinan'    => 'nullable|date',
            'shdk'                  => 'required|string',
            'nama_ayah'             => 'required|string|max:255',
            'nama_ibu'              => 'required|string|max:255',
            'catatan'               => 'nullable|string',
            'tanggal_mulai_kehamilan' => 'nullable|date',
            'tanggal_melahirkan'      => 'nullable|date',
        ]);

        $oldNik = $warga->nik;
        $warga->update($validated);

        // Update akun user jika ada
        $user = \App\Models\User::where('nik', $oldNik)->first();
        if ($user) {
            $user->update([
                'nik' => $validated['nik'],
                'nama_lengkap' => $validated['nama_lengkap'],
            ]);
        }

        $keluarga = KartuKeluarga::findOrFail($warga->kk_id);

        return redirect()->route('pengurus-rw.warga.index', ['keluarga' => $keluarga->encrypted_id])
            ->with('success', 'Data warga berhasil diperbarui.');
    }

    public function destroy(Warga $warga)
    {
        $kkId = $warga->kk_id;
        $keluarga = KartuKeluarga::findOrFail($kkId);
        
        $user = \App\Models\User::where('nik', $warga->nik)->first();
        if ($user) {
            $user->delete();
        }

        $warga->delete();

        return redirect()->route('pengurus-rw.warga.index', ['keluarga' => $keluarga->encrypted_id])
            ->with('success', 'Data warga berhasil dihapus.');
    }
}
