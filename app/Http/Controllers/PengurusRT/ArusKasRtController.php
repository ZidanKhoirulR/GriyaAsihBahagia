<?php

namespace App\Http\Controllers\PengurusRT;

use App\Http\Controllers\Controller;
use App\Models\ArusKasRt;
use App\Models\MetodeTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArusKasRtController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $pengurus = \App\Models\Pengurus::whereHas('warga', function($q) use ($user) {
            $q->where('nik', $user->nik);
        })->where('tingkat', 'rt')->where('is_aktif', true)->first();
        
        $rt = $pengurus ? $pengurus->rt : '';

        $transaksi = ArusKasRt::with('metodeTransaksi')
            ->when($rt, function($query) use ($rt) {
                $query->where('rt', $rt);
            })
            ->orderBy('tanggal', 'desc')
            ->get();
            
        $metode    = MetodeTransaksi::where('is_aktif', true)->orderBy('nama_metode')->get();

        $totalPemasukan   = $transaksi->where('jenis', 'pemasukan')->where('status_validasi', 'tervalidasi')->sum('nominal');
        $totalPengeluaran = $transaksi->where('jenis', 'pengeluaran')->where('status_validasi', 'tervalidasi')->sum('nominal');
        $saldo            = $totalPemasukan - $totalPengeluaran;

        return Inertia::render('PengurusRT/Keuangan/ArusKasRt', [
            'transaksi'        => $transaksi,
            'metode'           => $metode,
            'totalPemasukan'   => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'saldo'            => $saldo,
            'currentRt'        => $rt,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal'             => 'required|date',
            'rt'                  => 'required|string|max:10',
            'kategori'            => 'required|string|max:100',
            'metode_transaksi_id' => 'nullable|exists:metode_transaksi,id',
            'jenis'               => 'required|in:pemasukan,pengeluaran',
            'nominal'             => 'required|numeric|min:0',
            'slip_struk'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'penyetor'            => 'nullable|string|max:100',
            'penerima'            => 'nullable|string|max:100',
            'catatan'             => 'nullable|string',
        ]);

        if ($request->hasFile('slip_struk')) {
            $validated['slip_struk'] = $request->file('slip_struk')->store('slip_struk/rt', 'public');
        }

        ArusKasRt::create($validated);

        return back()->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function update(Request $request, ArusKasRt $arusKasRt)
    {
        $validated = $request->validate([
            'tanggal'             => 'required|date',
            'rt'                  => 'required|string|max:10',
            'kategori'            => 'required|string|max:100',
            'metode_transaksi_id' => 'nullable|exists:metode_transaksi,id',
            'jenis'               => 'required|in:pemasukan,pengeluaran',
            'nominal'             => 'required|numeric|min:0',
            'slip_struk'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:3072',
            'penyetor'            => 'nullable|string|max:100',
            'penerima'            => 'nullable|string|max:100',
            'catatan'             => 'nullable|string',
        ]);

        if ($request->hasFile('slip_struk')) {
            if ($arusKasRt->slip_struk) {
                Storage::disk('public')->delete($arusKasRt->slip_struk);
            }
            $validated['slip_struk'] = $request->file('slip_struk')->store('slip_struk/rt', 'public');
        } else {
            unset($validated['slip_struk']);
        }

        $arusKasRt->update($validated);

        return back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function validasi(Request $request, $id)
    {
        $transaksi = ArusKasRt::findOrFail($id);
        $user = auth()->user();
        
        $transaksi->update([
            'status_validasi' => 'tervalidasi',
            'divalidasi_oleh' => $user->nama_lengkap ?? 'Pengurus RT',
            'divalidasi_at'   => now(),
        ]);

        // Jika transaksi ini berasal dari iuran warga, ubah status iurannya menjadi lunas
        if ($transaksi->iuran_warga_id) {
            \App\Models\IuranWarga::where('id', $transaksi->iuran_warga_id)->update([
                'status'             => 'lunas',
                'dikonfirmasi_oleh'  => $user->id,
                'tanggal_konfirmasi' => now(),
            ]);
        }

        return back()->with('success', 'Transaksi berhasil divalidasi.');
    }

    public function destroy(ArusKasRt $arusKasRt)
    {
        if ($arusKasRt->slip_struk) {
            Storage::disk('public')->delete($arusKasRt->slip_struk);
        }

        // Jika ada iuran yang terkait, kembalikan statusnya ke belum_bayar karena ditolak/dihapus RT
        if ($arusKasRt->iuran_warga_id) {
            \App\Models\IuranWarga::where('id', $arusKasRt->iuran_warga_id)->update([
                'status'             => 'belum_bayar',
                'bukti_pembayaran'   => null,
                'dikonfirmasi_oleh'  => null,
                'tanggal_konfirmasi' => null,
            ]);
        }

        $arusKasRt->delete();

        return back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
