<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class MutasiWargaController extends Controller
{
    public function kelahiran()
    {
        // Menampilkan warga (bayi) maksimal berumur 365 hari (1 tahun) dari tanggal lahir
        $warga = Warga::with('kartuKeluarga')
            ->where('tanggal_lahir', '>=', now()->subDays(365))
            ->orderBy('tanggal_lahir', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rw.mutasi-warga.kelahiran.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/MutasiWarga/Kelahiran', [
            'warga' => $warga,
            'eksporUrl' => $eksporUrl,
        ]);
    }

    public function eksporPdfKelahiran()
    {
        $warga = Warga::with('kartuKeluarga')
            ->where('tanggal_lahir', '>=', now()->subDays(365))
            ->orderBy('tanggal_lahir', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-kelahiran', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Kelahiran_Bayi_RW.pdf');
    }

    public function kematian()
    {
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_meninggal')
            ->orderBy('tanggal_meninggal', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rw.mutasi-warga.kematian.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/MutasiWarga/Kematian', [
            'warga' => $warga,
            'eksporUrl' => $eksporUrl,
        ]);
    }

    public function eksporPdfKematian()
    {
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_meninggal')
            ->orderBy('tanggal_meninggal', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-kematian', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Kematian_Warga_RW.pdf');
    }

    public function pindahDatang()
    {
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_pindah_datang')
            ->orderBy('tanggal_pindah_datang', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rw.mutasi-warga.pindah-datang.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/MutasiWarga/PindahDatang', [
            'warga' => $warga,
            'eksporUrl' => $eksporUrl,
        ]);
    }

    public function eksporPdfPindahDatang()
    {
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('tanggal_pindah_datang')
            ->orderBy('tanggal_pindah_datang', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-pindah-datang', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Pindah_Datang_RW.pdf');
    }

    public function pindahPergi()
    {
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('pindah_pergi')
            ->orderBy('tanggal_pindah_pergi', 'desc')
            ->get();

        $eksporUrl = URL::temporarySignedRoute('pengurus-rw.mutasi-warga.pindah-pergi.pdf', now()->addMinutes(5));

        return Inertia::render('PengurusRW/MutasiWarga/PindahPergi', [
            'warga' => $warga,
            'eksporUrl' => $eksporUrl,
        ]);
    }

    public function eksporPdfPindahPergi()
    {
        $warga = Warga::with('kartuKeluarga')
            ->whereNotNull('pindah_pergi')
            ->orderBy('tanggal_pindah_pergi', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mutasi-pindah-pergi', compact('warga'))
            ->setPaper('a4', 'landscape');

        return $pdf->stream('Daftar_Pindah_Pergi_RW.pdf');
    }
}

