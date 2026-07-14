<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\Rumah;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class RumahController extends Controller
{
    public function eksporPdf()
    {
        $rumahs = Rumah::with(['kartuKeluarga', 'kartuKeluarga.warga'])->orderBy('rt')->get();

        $pdf = Pdf::loadView('pdf.daftar-rumah', compact('rumahs'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'defaultFont'   => 'serif',
                'enable_css_float' => true,
            ]);

        return $pdf->stream('Daftar-Rumah-RW.pdf');
    }

    public function index()
    {
        $rumahs = Rumah::with(['kartuKeluarga', 'kartuKeluarga.warga'])->orderBy('created_at', 'desc')->get();

        // Generate signed URL — valid 5 menit, dan akan berubah terus signaturenya
        $eksporUrl = URL::temporarySignedRoute('pengurus-rw.rumah.ekspor.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/Rumah/DaftarRumah', [
            'rumahs'    => $rumahs,
            'eksporUrl' => $eksporUrl,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rt'           => 'required|string|max:5',
            'rw'           => 'required|string|max:5',
            'alamat_detail' => 'required|string',
            'provinsi_id'  => 'required|string',
            'kabupaten_id' => 'required|string',
            'kecamatan_id' => 'required|string',
            'kelurahan_id' => 'required|string',
            'kodepos'      => 'required|string',
            'foto_rumah'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'catatan'      => 'nullable|string',
        ]);

        if ($request->hasFile('foto_rumah')) {
            $validated['foto_rumah'] = $request->file('foto_rumah')->store('rumah_fotos', 'public');
        }

        Rumah::create($validated);

        return redirect()->route('pengurus-rw.rumah.index')->with('success', 'Data rumah berhasil disimpan.');
    }

    public function update(Request $request, Rumah $rumah)
    {
        $validated = $request->validate([
            'rt'           => 'required|string|max:5',
            'rw'           => 'required|string|max:5',
            'alamat_detail' => 'required|string',
            'provinsi_id'  => 'required|string',
            'kabupaten_id' => 'required|string',
            'kecamatan_id' => 'required|string',
            'kelurahan_id' => 'required|string',
            'kodepos'      => 'required|string',
            'foto_rumah'   => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'catatan'      => 'nullable|string',
        ]);

        if ($request->hasFile('foto_rumah')) {
            // Hapus foto lama jika ada
            if ($rumah->foto_rumah) {
                Storage::disk('public')->delete($rumah->foto_rumah);
            }
            $validated['foto_rumah'] = $request->file('foto_rumah')->store('rumah_fotos', 'public');
        } else {
            // Pertahankan foto lama jika tidak ada foto baru
            unset($validated['foto_rumah']);
        }

        $rumah->update($validated);

        return redirect()->route('pengurus-rw.rumah.index')->with('success', 'Data rumah berhasil diperbarui.');
    }

    public function destroy(Rumah $rumah)
    {
        if ($rumah->foto_rumah) {
            Storage::disk('public')->delete($rumah->foto_rumah);
        }

        $rumah->delete();

        return redirect()->route('pengurus-rw.rumah.index')->with('success', 'Data rumah berhasil dihapus.');
    }
}
