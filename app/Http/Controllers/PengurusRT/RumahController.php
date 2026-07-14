<?php

namespace App\Http\Controllers\PengurusRT;

use App\Http\Controllers\PengurusRW\RumahController as BaseController;
use App\Models\Rumah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;

class RumahController extends BaseController
{
    public function eksporPdf()
    {
        $user = auth()->user();
        $pengurus = \App\Models\Pengurus::whereHas('warga', function($q) use ($user) {
            $q->where('nik', $user->nik);
        })->where('tingkat', 'rt')->where('is_aktif', true)->first();
        
        $rt = $pengurus ? $pengurus->rt : '';

        $rumahs = Rumah::with(['kartuKeluarga', 'kartuKeluarga.warga'])
            ->when($rt, function($query) use ($rt) {
                $query->where('rt', $rt);
            })
            ->orderBy('rt')
            ->get();

        $pdf = Pdf::loadView('pdf.daftar-rumah', compact('rumahs'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'defaultFont'      => 'serif',
                'enable_css_float' => true,
            ]);

        return $pdf->stream('Daftar-Rumah-RT.pdf');
    }

    public function index()
    {
        $user = auth()->user();
        $pengurus = \App\Models\Pengurus::whereHas('warga', function($q) use ($user) {
            $q->where('nik', $user->nik);
        })->where('tingkat', 'rt')->where('is_aktif', true)->first();
        
        $rt = $pengurus ? $pengurus->rt : '';

        $rumahs = Rumah::with(['kartuKeluarga', 'kartuKeluarga.warga'])
            ->when($rt, function($query) use ($rt) {
                $query->where('rt', $rt);
            })
            ->orderBy('created_at', 'desc')
            ->get();
            
        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.rumah.ekspor.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/Rumah/DaftarRumah', [
            'rumahs'    => $rumahs,
            'eksporUrl' => $eksporUrl,
            'currentRt' => $rt,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rt'            => 'required|string|max:5',
            'rw'            => 'required|string|max:5',
            'alamat_detail' => 'required|string',
            'provinsi_id'   => 'required|string',
            'kabupaten_id'  => 'required|string',
            'kecamatan_id'  => 'required|string',
            'kelurahan_id'  => 'required|string',
            'kodepos'       => 'required|string',
            'foto_rumah'    => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'catatan'       => 'nullable|string',
        ]);

        if ($request->hasFile('foto_rumah')) {
            $validated['foto_rumah'] = $request->file('foto_rumah')->store('rumah_fotos', 'public');
        }

        Rumah::create($validated);

        return redirect()->route('pengurus-rt.rumah.index')->with('success', 'Data rumah berhasil disimpan.');
    }

    public function update(Request $request, Rumah $rumah)
    {
        $validated = $request->validate([
            'rt'            => 'required|string|max:5',
            'rw'            => 'required|string|max:5',
            'alamat_detail' => 'required|string',
            'provinsi_id'   => 'required|string',
            'kabupaten_id'  => 'required|string',
            'kecamatan_id'  => 'required|string',
            'kelurahan_id'  => 'required|string',
            'kodepos'       => 'required|string',
            'foto_rumah'    => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'catatan'       => 'nullable|string',
        ]);

        if ($request->hasFile('foto_rumah')) {
            if ($rumah->foto_rumah) {
                Storage::disk('public')->delete($rumah->foto_rumah);
            }
            $validated['foto_rumah'] = $request->file('foto_rumah')->store('rumah_fotos', 'public');
        } else {
            unset($validated['foto_rumah']);
        }

        $rumah->update($validated);

        return redirect()->route('pengurus-rt.rumah.index')->with('success', 'Data rumah berhasil diperbarui.');
    }

    public function destroy(Rumah $rumah)
    {
        if ($rumah->foto_rumah) {
            Storage::disk('public')->delete($rumah->foto_rumah);
        }
        $rumah->delete();

        return redirect()->route('pengurus-rt.rumah.index')->with('success', 'Data rumah berhasil dihapus.');
    }
}
