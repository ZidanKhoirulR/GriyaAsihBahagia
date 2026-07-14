<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\IuranWarga;
use App\Models\KartuKeluarga;
use App\Models\MetodeTransaksi;
use App\Models\Warga;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IuranController extends Controller
{
    /**
     * Tampilkan halaman iuran warga.
     * Mendeteksi RT warga yang login, lalu menampilkan rekening RT yang sesuai.
     */
    public function index()
    {
        $user = Auth::user();

        // Cari data warga berdasarkan NIK user yang login
        $warga = Warga::with(['kartuKeluarga'])->where('nik', $user->nik)->first();

        $rtWarga = null;
        $kkWarga = null;
        $iuranBulanIni = null;
        $riwayatIuran = collect();

        if ($warga && $warga->kartuKeluarga) {
            $kkWarga   = $warga->kartuKeluarga;
            $rtWarga   = $kkWarga->rt; // e.g. "03"

            // Ambil iuran bulan ini untuk KK ini
            $bulanIni = Carbon::now()->format('Y-m');
            $iuranBulanIni = IuranWarga::where('kk_id', $kkWarga->id)
                ->where('bulan', $bulanIni)
                ->first();

            // Riwayat 12 bulan terakhir
            $riwayatIuran = IuranWarga::where('kk_id', $kkWarga->id)
                ->orderBy('bulan', 'desc')
                ->take(12)
                ->get()
                ->map(fn($i) => [
                    'id'            => $i->id,
                    'bulan'         => $i->bulan,
                    'bulan_label'   => Carbon::createFromFormat('Y-m', $i->bulan)->translatedFormat('F Y'),
                    'status'        => $i->status,
                    'label_status'  => $i->label_status,
                    'tanggal_bayar' => $i->tanggal_bayar?->format('d/m/Y H:i'),
                    'bukti_pembayaran' => $i->bukti_pembayaran,
                ]);
        }

        // Rekening khusus RT warga atau rekening RW (rt = null)
        $rekeningRT = MetodeTransaksi::where('is_aktif', true)
            ->where(function ($q) use ($rtWarga) {
                $q->where('rt', $rtWarga)->orWhereNull('rt');
            })
            ->orderByRaw("rt IS NULL ASC") // RT spesifik duluan
            ->get();

        return Inertia::render('Warga/Iuran/Index', [
            'warga'          => $warga ? [
                'nama_lengkap' => $warga->nama_lengkap,
                'nik'          => $warga->nik,
                'rt'           => $rtWarga,
                'kk_id'        => $kkWarga?->id,
                'nomor_kk'     => $kkWarga?->nomor_kk,
            ] : null,
            'iuranBulanIni'  => $iuranBulanIni ? [
                'id'            => $iuranBulanIni->id,
                'bulan'         => $iuranBulanIni->bulan,
                'status'        => $iuranBulanIni->status,
                'label_status'  => $iuranBulanIni->label_status,
                'tanggal_bayar' => $iuranBulanIni->tanggal_bayar?->format('d/m/Y H:i'),
                'bukti_pembayaran' => $iuranBulanIni->bukti_pembayaran,
            ] : null,
            'riwayatIuran'   => $riwayatIuran,
            'rekeningRT'     => $rekeningRT,
            'bulanIni'       => Carbon::now()->translatedFormat('F Y'),
        ]);
    }

    /**
     * Upload bukti pembayaran dan ubah status iuran KK menjadi menunggu_konfirmasi.
     */
    public function uploadBukti(Request $request)
    {
        $request->validate([
            'bukti_pembayaran' => 'required|image|max:5120', // max 5MB
            'kk_id'            => 'required|exists:kartu_keluarga,id',
            'nominal'          => 'required|numeric|min:1',
            'catatan'          => 'required|string',
        ]);

        $user  = Auth::user();
        $warga = Warga::where('nik', $user->nik)->first();

        if (!$warga || $warga->kk_id != $request->kk_id) {
            return back()->withErrors(['error' => 'Anda tidak memiliki akses ke KK ini.']);
        }

        $bulanIni = Carbon::now()->format('Y-m');
        $rtWarga  = $warga->kartuKeluarga->rt ?? '00';

        // Simpan file
        $path = $request->file('bukti_pembayaran')->store('iuran/bukti', 'public');

        // Buat atau update record iuran KK ini
        $iuran = IuranWarga::updateOrCreate(
            ['kk_id' => $request->kk_id, 'bulan' => $bulanIni],
            [
                'rt'                 => $rtWarga,
                'status'             => 'menunggu_konfirmasi',
                'bukti_pembayaran'   => $path,
                'tanggal_bayar'      => Carbon::now(),
                'catatan'            => $request->catatan,
                'nominal'            => $request->nominal,
            ]
        );

        // Buat/Update juga di tabel ArusKasRt (agar muncul di menu RT)
        \App\Models\ArusKasRt::updateOrCreate(
            ['iuran_warga_id' => $iuran->id],
            [
                'tanggal'         => Carbon::now(),
                'rt'              => $rtWarga,
                'kategori'        => 'Iuran Warga (' . Carbon::createFromFormat('Y-m', $bulanIni)->translatedFormat('F Y') . ')',
                'jenis'           => 'pemasukan',
                'nominal'         => $request->nominal,
                'slip_struk'      => $path,
                'penyetor'        => $warga->nama_lengkap,
                'catatan'         => $request->catatan,
                'status_validasi' => 'menunggu',
            ]
        );

        return back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu konfirmasi pengurus.');
    }
}
