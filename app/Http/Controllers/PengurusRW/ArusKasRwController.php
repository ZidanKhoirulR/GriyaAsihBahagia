<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\ArusKasRw;
use App\Models\MetodeTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ArusKasRwController extends Controller
{
    public function index()
    {
        $transaksi = ArusKasRw::with('metodeTransaksi')
            ->orderBy('tanggal', 'desc')
            ->get();

        $metode = MetodeTransaksi::where('is_aktif', true)->orderBy('nama_metode')->get();

        $totalPemasukan  = $transaksi->where('jenis', 'pemasukan')->sum('nominal');
        $totalPengeluaran = $transaksi->where('jenis', 'pengeluaran')->sum('nominal');
        $saldo = $totalPemasukan - $totalPengeluaran;

        return Inertia::render('PengurusRW/Keuangan/ArusKasRw', [
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
            $validated['slip_struk'] = $request->file('slip_struk')->store('slip_struk/rw', 'public');
        }

        ArusKasRw::create($validated);
        return back()->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function update(Request $request, ArusKasRw $arusKasRw)
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
            if ($arusKasRw->slip_struk) {
                Storage::disk('public')->delete($arusKasRw->slip_struk);
            }
            $validated['slip_struk'] = $request->file('slip_struk')->store('slip_struk/rw', 'public');
        } else {
            unset($validated['slip_struk']);
        }

        $arusKasRw->update($validated);
        return back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function validasi(Request $request, $id)
    {
        $transaksi = ArusKasRw::findOrFail($id);
        $transaksi->update([
            'status_validasi' => 'tervalidasi',
            'divalidasi_oleh' => auth()->user()->name ?? 'Pengurus RW',
            'divalidasi_at'   => now(),
        ]);
        return back()->with('success', 'Transaksi berhasil divalidasi.');
    }

    public function destroy(ArusKasRw $arusKasRw)
    {
        if ($arusKasRw->slip_struk) {
            Storage::disk('public')->delete($arusKasRw->slip_struk);
        }
        $arusKasRw->delete();
        return back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
