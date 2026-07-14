<?php

namespace App\Http\Controllers\PengurusRT;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use App\Traits\GetCurrentRt;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class MutasiWargaController extends Controller
{
    use GetCurrentRt;

    public function kelahiran()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->where('tanggal_lahir', '>=', now()->subDays(365))
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_lahir', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.mutasi-warga.kelahiran.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/MutasiWarga/Kelahiran', [
            'warga'     => $warga,
            'eksporUrl' => $eksporUrl,
            'currentRt' => $rt,
        ]);
    }

    public function eksporPdfKelahiran()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->where('tanggal_lahir', '>=', now()->subDays(365))
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_lahir', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-kelahiran', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Kelahiran_Bayi_RT.pdf');
    }

    public function kematian()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_meninggal')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_meninggal', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.mutasi-warga.kematian.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/MutasiWarga/Kematian', [
            'warga'     => $warga,
            'eksporUrl' => $eksporUrl,
            'currentRt' => $rt,
        ]);
    }

    public function eksporPdfKematian()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_meninggal')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_meninggal', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-kematian', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Kematian_Warga_RT.pdf');
    }

    public function pindahDatang()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_pindah_datang')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_pindah_datang', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.mutasi-warga.pindah-datang.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/MutasiWarga/PindahDatang', [
            'warga'     => $warga,
            'eksporUrl' => $eksporUrl,
            'currentRt' => $rt,
        ]);
    }

    public function eksporPdfPindahDatang()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_pindah_datang')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_pindah_datang', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-pindah-datang', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Pindah_Datang_RT.pdf');
    }

    public function pindahPergi()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('pindah_pergi')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_pindah_pergi', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rt.mutasi-warga.pindah-pergi.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRT/MutasiWarga/PindahPergi', [
            'warga'     => $warga,
            'eksporUrl' => $eksporUrl,
            'currentRt' => $rt,
        ]);
    }

    public function eksporPdfPindahPergi()
    {
        $rt    = $this->getCurrentRt();
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('pindah_pergi')
            ->when($rt, fn($q) => $q->whereHas('kartuKeluarga', fn($kk) => $kk->where('rt', $rt)))
            ->orderBy('tanggal_pindah_pergi', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-pindah-pergi', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Pindah_Pergi_RT.pdf');
    }
}
