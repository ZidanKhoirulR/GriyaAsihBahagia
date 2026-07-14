<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = \App\Models\Berita::orderBy('tanggal_upload', 'desc')->get();
        return inertia('PengurusRW/PapanInformasi/Berita', [
            'berita' => $berita,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi_kalimat' => 'required|string',
            'tanggal_upload' => 'required|date',
            'gambar' => 'nullable|image|max:2048', // max 2MB
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = $path;
        }

        \App\Models\Berita::create($validated);

        return redirect()->back()->with('success', 'Berita berhasil ditambahkan');
    }

    public function update(Request $request, \App\Models\Berita $beritum)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi_kalimat' => 'required|string',
            'tanggal_upload' => 'required|date',
            'gambar' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            // Delete old image
            if ($beritum->gambar && \Illuminate\Support\Facades\Storage::disk('public')->exists($beritum->gambar)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($beritum->gambar);
            }
            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = $path;
        }

        $beritum->update($validated);

        return redirect()->back()->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(\App\Models\Berita $beritum)
    {
        if ($beritum->gambar && \Illuminate\Support\Facades\Storage::disk('public')->exists($beritum->gambar)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($beritum->gambar);
        }
        $beritum->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus');
    }
}
