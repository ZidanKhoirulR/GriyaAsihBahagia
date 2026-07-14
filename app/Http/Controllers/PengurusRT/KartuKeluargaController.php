<?php

namespace App\Http\Controllers\PengurusRT;

use App\Http\Controllers\PengurusRW\KartuKeluargaController as BaseController;
use App\Models\KartuKeluarga;
use App\Models\Rumah;
use App\Traits\GetCurrentRt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class KartuKeluargaController extends BaseController
{
    use GetCurrentRt;

    public function eksporPdf()
    {
        $rt        = $this->getCurrentRt();
        $keluargas = KartuKeluarga::with(['rumah', 'warga'])
            ->when($rt, fn($q) => $q->where('rt', $rt))
            ->orderBy('rt')
            ->get();

        $pdf = Pdf::loadView('pdf.daftar-keluarga', compact('keluargas'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar-Keluarga-RT.pdf');
    }

    public function index()
    {
        $rt        = $this->getCurrentRt();
        $keluargas = KartuKeluarga::with(['rumah', 'warga'])
            ->when($rt, fn($q) => $q->where('rt', $rt))
            ->orderBy('created_at', 'desc')
            ->get();

        $rumahs = Rumah::when($rt, fn($q) => $q->where('rt', $rt))
            ->orderBy('rt', 'asc')
            ->get(['id', 'rt', 'alamat_detail']);

        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.keluarga.ekspor.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/Keluarga/DaftarKeluarga', [
            'keluargas' => $keluargas,
            'rumahs'    => $rumahs,
            'eksporUrl' => $eksporUrl,
            'currentRt' => $rt,
        ]);
    }

    public function store(Request $request)
    {
        $rt = $this->getCurrentRt();

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

        // Force RT to the current pengurus RT's value if available
        if ($rt) {
            $validated['rt'] = $rt;
        }

        if ($request->hasFile('foto_kk')) {
            $validated['foto_kk'] = $request->file('foto_kk')->store('kk_fotos', 'public');
        }

        KartuKeluarga::create($validated);

        return redirect()->route('pengurus-rt.keluarga.index')->with('success', 'Data keluarga berhasil disimpan.');
    }

    public function update(Request $request, KartuKeluarga $keluarga)
    {
        $rt = $this->getCurrentRt();

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

        // Force RT to the current pengurus RT's value if available
        if ($rt) {
            $validated['rt'] = $rt;
        }

        if ($request->hasFile('foto_kk')) {
            if ($keluarga->foto_kk) {
                Storage::disk('public')->delete($keluarga->foto_kk);
            }
            $validated['foto_kk'] = $request->file('foto_kk')->store('kk_fotos', 'public');
        } else {
            unset($validated['foto_kk']);
        }

        $keluarga->update($validated);

        return redirect()->route('pengurus-rt.keluarga.index')->with('success', 'Data keluarga berhasil diperbarui.');
    }

    public function destroy(KartuKeluarga $keluarga)
    {
        if ($keluarga->foto_kk) {
            Storage::disk('public')->delete($keluarga->foto_kk);
        }
        $keluarga->delete();

        return redirect()->route('pengurus-rt.keluarga.index')->with('success', 'Data keluarga berhasil dihapus.');
    }
}
