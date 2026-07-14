<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\MetodeTransaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MetodeTransaksiController extends Controller
{
    public function index()
    {
        $metode = MetodeTransaksi::orderBy('nama_metode')->get();
        return Inertia::render('PengurusRW/Keuangan/MetodeTransaksi', [
            'metode' => $metode,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_metode'    => 'required|string|max:100',
            'nomor_rekening' => 'nullable|string|max:100',
            'atas_nama'      => 'nullable|string|max:100',
            'keterangan'     => 'nullable|string',
            'is_aktif'       => 'boolean',
        ]);

        MetodeTransaksi::create($validated);
        return back()->with('success', 'Metode transaksi berhasil ditambahkan.');
    }

    public function update(Request $request, MetodeTransaksi $metodeTransaksi)
    {
        $validated = $request->validate([
            'nama_metode'    => 'required|string|max:100',
            'nomor_rekening' => 'nullable|string|max:100',
            'atas_nama'      => 'nullable|string|max:100',
            'keterangan'     => 'nullable|string',
            'is_aktif'       => 'boolean',
        ]);

        $metodeTransaksi->update($validated);
        return back()->with('success', 'Metode transaksi berhasil diperbarui.');
    }

    public function destroy(MetodeTransaksi $metodeTransaksi)
    {
        $metodeTransaksi->delete();
        return back()->with('success', 'Metode transaksi berhasil dihapus.');
    }
}
