<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Rumah;
use App\Models\Wilayah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class KartuKeluargaController extends Controller
{
    public function eksporPdf()
    {
        $keluargas = KartuKeluarga::with(['rumah', 'warga'])->orderBy('rt')->get();

        $pdf = Pdf::loadView('pdf.daftar-keluarga', compact('keluargas'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar-Keluarga-RW.pdf');
    }

    public function index()
    {
        $keluargas = KartuKeluarga::with(['rumah', 'warga'])
            ->orderBy('created_at', 'desc')
            ->get();

        $rumahs = Rumah::orderBy('rt', 'asc')->get(['id', 'rt', 'alamat_detail']);

        $eksporUrl = URL::temporarySignedRoute('pengurus-rw.keluarga.ekspor.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/Keluarga/DaftarKeluarga', [
            'keluargas' => $keluargas,
            'rumahs'    => $rumahs,
            'eksporUrl' => $eksporUrl,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rumah_id'            => 'required|exists:rumah,id',
            'nomor_kk'            => 'required|digits:16|unique:kartu_keluarga,nomor_kk',
            'status_tinggal'      => 'required|in:tetap,kontrak,kos,numpang',
            'foto_kk'             => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tanggal_dikeluarkan' => 'required|date',
            'provinsi_id'         => 'required|string',
            'kabupaten_id'        => 'required|string',
            'kecamatan_id'        => 'required|string',
            'kelurahan_id'        => 'required|string',
            'kodepos'             => 'nullable|string|max:10',
            'alamat_detail'       => 'required|string',
            'rt'                  => 'required|string|max:5',
            'rw'                  => 'required|string|max:5',
            'catatan'             => 'nullable|string',
        ]);

        if ($request->hasFile('foto_kk')) {
            $validated['foto_kk'] = $request->file('foto_kk')->store('kk_fotos', 'public');
        }

        KartuKeluarga::create($validated);

        return redirect()->route('pengurus-rw.keluarga.index')->with('success', 'Data keluarga berhasil disimpan.');
    }

    public function update(Request $request, KartuKeluarga $keluarga)
    {
        $validated = $request->validate([
            'rumah_id'            => 'required|exists:rumah,id',
            'nomor_kk'            => 'required|digits:16|unique:kartu_keluarga,nomor_kk,' . $keluarga->id,
            'status_tinggal'      => 'required|in:tetap,kontrak,kos,numpang',
            'foto_kk'             => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tanggal_dikeluarkan' => 'required|date',
            'provinsi_id'         => 'required|string',
            'kabupaten_id'        => 'required|string',
            'kecamatan_id'        => 'required|string',
            'kelurahan_id'        => 'required|string',
            'kodepos'             => 'nullable|string|max:10',
            'alamat_detail'       => 'required|string',
            'rt'                  => 'required|string|max:5',
            'rw'                  => 'required|string|max:5',
            'catatan'             => 'nullable|string',
        ]);

        if ($request->hasFile('foto_kk')) {
            if ($keluarga->foto_kk) {
                Storage::disk('public')->delete($keluarga->foto_kk);
            }
            $validated['foto_kk'] = $request->file('foto_kk')->store('kk_fotos', 'public');
        } else {
            unset($validated['foto_kk']);
        }

        $keluarga->update($validated);

        return redirect()->route('pengurus-rw.keluarga.index')->with('success', 'Data keluarga berhasil diperbarui.');
    }

    public function destroy(KartuKeluarga $keluarga)
    {
        if ($keluarga->foto_kk) {
            Storage::disk('public')->delete($keluarga->foto_kk);
        }

        $keluarga->delete();

        return redirect()->route('pengurus-rw.keluarga.index')->with('success', 'Data keluarga berhasil dihapus.');
    }
}
