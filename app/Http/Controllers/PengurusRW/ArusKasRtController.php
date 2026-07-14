<?php

namespace App\Http\Controllers\PengurusRW;

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
        $transaksi = ArusKasRt::with('metodeTransaksi')
            ->orderBy('tanggal', 'desc')
            ->get();

        $metode = MetodeTransaksi::where('is_aktif', true)->orderBy('nama_metode')->get();

        $totalPemasukan  = $transaksi->where('jenis', 'pemasukan')->sum('nominal');
        $totalPengeluaran = $transaksi->where('jenis', 'pengeluaran')->sum('nominal');
        $saldo = $totalPemasukan - $totalPengeluaran;

        return Inertia::render('PengurusRW/Keuangan/ArusKasRt', [
            'transaksi'        => $transaksi,
            'metode'           => $metode,
            'totalPemasukan'   => $totalPemasukan,
            'totalPengeluaran' => $totalPengeluaran,
            'saldo'            => $saldo,
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
        $transaksi->update([
            'status_validasi' => 'tervalidasi',
            'divalidasi_oleh' => auth()->user()->name ?? 'Pengurus RW',
            'divalidasi_at'   => now(),
        ]);
        return back()->with('success', 'Transaksi berhasil divalidasi.');
    }

    public function destroy(ArusKasRt $arusKasRt)
    {
        if ($arusKasRt->slip_struk) {
            Storage::disk('public')->delete($arusKasRt->slip_struk);
        }
        $arusKasRt->delete();
        return back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
