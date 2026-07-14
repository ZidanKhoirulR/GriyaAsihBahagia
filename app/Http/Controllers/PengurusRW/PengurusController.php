<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pengurus;
use App\Models\Warga;
use Inertia\Inertia;

class PengurusController extends Controller
{
    /**
     * Tampilkan semua warga + tandai siapa yang sudah menjadi pengurus RW
     */
    public function indexRw()
    {
        $pengurusAktif = Pengurus::where('tingkat', 'rw')->where('is_aktif', true)->pluck('warga_id')->toArray();

        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($w) use ($pengurusAktif) {
                $w->usia = $w->tanggal_lahir ? \Carbon\Carbon::parse($w->tanggal_lahir)->age : null;
                $w->is_pengurus = in_array($w->id, $pengurusAktif);
                $pengurusData = Pengurus::where('warga_id', $w->id)->where('tingkat', 'rw')->where('is_aktif', true)->first();
                $w->jabatan_pengurus = $pengurusData ? $pengurusData->jabatan : null;
                $w->pengurus_id = $pengurusData ? $pengurusData->id : null;
                return $w;
            });

        return Inertia::render('PengurusRW/KelolaPengurus/PengurusRW', [
            'wargas'        => $wargas,
            'totalData'     => $wargas->count(),
            'totalPengurus' => $wargas->where('is_pengurus', true)->count(),
        ]);
    }

    /**
     * Tampilkan semua warga + tandai siapa yang sudah menjadi pengurus RT
     */
    public function indexRt()
    {
        $pengurusAktif = Pengurus::where('tingkat', 'rt')->where('is_aktif', true)->pluck('warga_id')->toArray();

        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->orderBy('nama_lengkap')
            ->get()
            ->map(function ($w) use ($pengurusAktif) {
                $w->usia = $w->tanggal_lahir ? \Carbon\Carbon::parse($w->tanggal_lahir)->age : null;
                $w->is_pengurus = in_array($w->id, $pengurusAktif);
                $pengurusData = Pengurus::where('warga_id', $w->id)->where('tingkat', 'rt')->where('is_aktif', true)->first();
                $w->jabatan_pengurus = $pengurusData ? $pengurusData->jabatan : null;
                $w->pengurus_id = $pengurusData ? $pengurusData->id : null;
                $w->rt_pengurus = $pengurusData ? $pengurusData->rt : null;
                return $w;
            });

        return Inertia::render('PengurusRW/KelolaPengurus/PengurusRT', [
            'wargas'        => $wargas,
            'totalData'     => $wargas->count(),
            'totalPengurus' => $wargas->where('is_pengurus', true)->count(),
        ]);
    }

    /**
     * Jadikan warga sebagai pengurus (aktifkan)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'warga_id'        => 'required|exists:warga,id',
            'jabatan'         => 'required|string|max:255',
            'tingkat'         => 'required|in:rw,rt',
            'rt'              => 'required_if:tingkat,rt|nullable|string|max:5',
        ]);

        $validated['is_aktif'] = true;
        
        Pengurus::create($validated);

        $warga = Warga::find($request->warga_id);
        if ($warga) {
            $user = \App\Models\User::where('nik', $warga->nik)->first();
            if ($user) {
                $user->update(['role' => $request->tingkat === 'rt' ? 'pengurus_rt' : 'pengurus_rw']);
            }
        }

        return redirect()->back()->with('success', 'Warga berhasil dijadikan pengurus');
    }

    /**
     * Edit jabatan pengurus
     */
    public function update(Request $request, Pengurus $pengurus)
    {
        $validated = $request->validate([
            'jabatan'         => 'required|string|max:255',
            'rt'              => 'nullable|string|max:5',
        ]);

        $pengurus->update($validated);
        return redirect()->back()->with('success', 'Jabatan pengurus berhasil diperbarui');
    }

    /**
     * Toggle aktif / nonaktif pengurus (melepas atau memulihkan jabatan)
     */
    public function toggle(Pengurus $pengurus)
    {
        $pengurus->update(['is_aktif' => !$pengurus->is_aktif]);
        
        $warga = Warga::find($pengurus->warga_id);
        if ($warga) {
            $user = \App\Models\User::where('nik', $warga->nik)->first();
            if ($user) {
                if ($pengurus->is_aktif) {
                    $user->update(['role' => $pengurus->tingkat === 'rt' ? 'pengurus_rt' : 'pengurus_rw']);
                } else {
                    $user->update(['role' => 'warga']);
                }
            }
        }

        $status = $pengurus->is_aktif ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()->with('success', "Pengurus berhasil $status");
    }

    /**
     * Hapus data pengurus permanen
     */
    public function destroy(Pengurus $pengurus)
    {
        $pengurus->delete();
        return redirect()->back()->with('success', 'Data pengurus berhasil dihapus');
    }
}
