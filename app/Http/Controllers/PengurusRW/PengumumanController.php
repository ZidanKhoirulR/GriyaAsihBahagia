<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    public function index()
    {
        $pengumuman = \App\Models\Pengumuman::orderBy('created_at', 'desc')->get();
        return inertia('PengurusRW/PapanInformasi/Pengumuman', [
            'pengumuman' => $pengumuman,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi_pengumuman' => 'required|string',
            'tanggal_berlaku' => 'nullable|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        \App\Models\Pengumuman::create($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil ditambahkan');
    }

    public function update(Request $request, \App\Models\Pengumuman $pengumuman)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi_pengumuman' => 'required|string',
            'tanggal_berlaku' => 'nullable|date',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $pengumuman->update($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui');
    }

    public function destroy(\App\Models\Pengumuman $pengumuman)
    {
        $pengumuman->delete();

        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus');
    }
}
