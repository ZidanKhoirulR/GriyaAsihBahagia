<?php

namespace App\Http\Controllers\PengurusRW;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class KelompokSasaranController extends Controller
{
    /**
     * Pemilih: Warga usia >= 17 tahun
     */
    public function pemilih()
    {
        $today = Carbon::now();
        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '<=', $today->copy()->subYears(17))
            ->orderBy('tanggal_lahir', 'asc')
            ->get()
            ->map(function ($w) use ($today) {
                $w->usia = Carbon::parse($w->tanggal_lahir)->age;
                return $w;
            });

        return Inertia::render('PengurusRW/KelompokSasaran/Pemilih', [
            'wargas'       => $wargas,
            'totalData'    => $wargas->count(),
            'tanggalAcuan' => $today->toDateString(),
            'eksporUrl'    => URL::temporarySignedRoute('pengurus-rw.kelompok-sasaran.pemilih.pdf', now()->addMinutes(5)),
        ]);
    }

    public function eksporPdfPemilih()
    {
        $today = Carbon::now();
        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '<=', $today->copy()->subYears(17))
            ->orderBy('tanggal_lahir', 'asc')
            ->get()
            ->map(function ($w) use ($today) {
                $w->usia = Carbon::parse($w->tanggal_lahir)->age;
                return $w;
            });
        $tanggalAcuan = $today->toDateString();
        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kelompok-pemilih', compact('wargas', 'tanggalAcuan'))
            ->setPaper('a4', 'landscape')->stream('Data-Pemilih-RW.pdf');
    }

    /**
     * Balita: Warga usia 0 - < 6 tahun
     */
    public function balita()
    {
        $today = Carbon::now();
        $batasAtas = $today->copy()->subYears(6)->addDay();

        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '>', $batasAtas)
            ->whereDate('tanggal_lahir', '<=', $today)
            ->orderBy('tanggal_lahir', 'desc')
            ->get()
            ->map(function ($w) use ($today) {
                $lahir = Carbon::parse($w->tanggal_lahir);
                $w->usia_tahun = $lahir->diffInYears($today);
                $w->usia_bulan = $lahir->diffInMonths($today);
                return $w;
            });

        return Inertia::render('PengurusRW/KelompokSasaran/Balita', [
            'wargas'       => $wargas,
            'totalData'    => $wargas->count(),
            'tanggalAcuan' => $today->toDateString(),
            'eksporUrl'    => URL::temporarySignedRoute('pengurus-rw.kelompok-sasaran.balita.pdf', now()->addMinutes(5)),
        ]);
    }

    public function eksporPdfBalita()
    {
        $today = Carbon::now();
        $batasAtas = $today->copy()->subYears(6)->addDay();
        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '>', $batasAtas)
            ->whereDate('tanggal_lahir', '<=', $today)
            ->orderBy('tanggal_lahir', 'desc')
            ->get()
            ->map(function ($w) use ($today) {
                $lahir = Carbon::parse($w->tanggal_lahir);
                $w->usia_tahun = $lahir->diffInYears($today);
                $w->usia_bulan = $lahir->diffInMonths($today);
                return $w;
            });
        $tanggalAcuan = $today->toDateString();
        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kelompok-balita', compact('wargas', 'tanggalAcuan'))
            ->setPaper('a4', 'landscape')->stream('Data-Balita-RW.pdf');
    }

    /**
     * Lansia: Warga usia >= 60 tahun
     */
    public function lansia()
    {
        $today = Carbon::now();
        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '<=', $today->copy()->subYears(60))
            ->orderBy('tanggal_lahir', 'asc')
            ->get()
            ->map(function ($w) use ($today) {
                $w->usia = Carbon::parse($w->tanggal_lahir)->age;
                return $w;
            });

        return Inertia::render('PengurusRW/KelompokSasaran/Lansia', [
            'wargas'       => $wargas,
            'totalData'    => $wargas->count(),
            'tanggalAcuan' => $today->toDateString(),
            'eksporUrl'    => URL::temporarySignedRoute('pengurus-rw.kelompok-sasaran.lansia.pdf', now()->addMinutes(5)),
        ]);
    }

    public function eksporPdfLansia()
    {
        $today = Carbon::now();
        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '<=', $today->copy()->subYears(60))
            ->orderBy('tanggal_lahir', 'asc')
            ->get()
            ->map(function ($w) use ($today) {
                $w->usia = Carbon::parse($w->tanggal_lahir)->age;
                return $w;
            });
        $tanggalAcuan = $today->toDateString();
        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kelompok-lansia', compact('wargas', 'tanggalAcuan'))
            ->setPaper('a4', 'landscape')->stream('Data-Lansia-RW.pdf');
    }

    /**
     * Ibu Menyusui: Perempuan yang memiliki bayi 0-24 bulan di KK yang sama
     */
    public function ibuMenyusui()
    {
        $today = Carbon::now();
        $batasBayi = $today->copy()->subMonths(24);

        $kkDenganBayi = Warga::whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '>', $batasBayi)
            ->whereDate('tanggal_lahir', '<=', $today)
            ->pluck('kk_id')->unique();

        $ibuMenyusui = Warga::with(['kartuKeluarga'])
            ->whereNull('tanggal_meninggal')
            ->where('jenis_kelamin', 'P')
            ->whereIn('kk_id', $kkDenganBayi)
            ->get()
            ->map(function ($ibu) use ($today, $batasBayi) {
                $bayi = Warga::where('kk_id', $ibu->kk_id)
                    ->whereNull('tanggal_meninggal')
                    ->whereNotNull('tanggal_lahir')
                    ->whereDate('tanggal_lahir', '>', $batasBayi)
                    ->whereDate('tanggal_lahir', '<=', $today)
                    ->orderBy('tanggal_lahir', 'desc')->first();
                if ($bayi) {
                    $ibu->nama_bayi = $bayi->nama_lengkap;
                    $ibu->usia_bayi_bulan = Carbon::parse($bayi->tanggal_lahir)->diffInMonths($today);
                    $ibu->tanggal_lahir_bayi = $bayi->tanggal_lahir->toDateString();
                }
                $ibu->usia = Carbon::parse($ibu->tanggal_lahir)->age;
                return $ibu;
            })
            ->filter(fn($ibu) => isset($ibu->nama_bayi))
            ->values();

        return Inertia::render('PengurusRW/KelompokSasaran/IbuMenyusui', [
            'wargas'       => $ibuMenyusui,
            'totalData'    => $ibuMenyusui->count(),
            'tanggalAcuan' => $today->toDateString(),
            'eksporUrl'    => URL::temporarySignedRoute('pengurus-rw.kelompok-sasaran.ibu-menyusui.pdf', now()->addMinutes(5)),
        ]);
    }

    public function eksporPdfIbuMenyusui()
    {
        $today = Carbon::now();
        $batasBayi = $today->copy()->subMonths(24);
        $kkDenganBayi = Warga::whereNull('tanggal_meninggal')
            ->whereNotNull('tanggal_lahir')
            ->whereDate('tanggal_lahir', '>', $batasBayi)
            ->whereDate('tanggal_lahir', '<=', $today)
            ->pluck('kk_id')->unique();

        $wargas = Warga::with(['kartuKeluarga'])
            ->whereNull('tanggal_meninggal')
            ->where('jenis_kelamin', 'P')
            ->whereIn('kk_id', $kkDenganBayi)
            ->get()
            ->map(function ($ibu) use ($today, $batasBayi) {
                $bayi = Warga::where('kk_id', $ibu->kk_id)
                    ->whereNull('tanggal_meninggal')
                    ->whereNotNull('tanggal_lahir')
                    ->whereDate('tanggal_lahir', '>', $batasBayi)
                    ->whereDate('tanggal_lahir', '<=', $today)
                    ->orderBy('tanggal_lahir', 'desc')->first();
                if ($bayi) {
                    $ibu->nama_bayi = $bayi->nama_lengkap;
                    $ibu->usia_bayi_bulan = Carbon::parse($bayi->tanggal_lahir)->diffInMonths($today);
                }
                $ibu->usia = Carbon::parse($ibu->tanggal_lahir)->age;
                return $ibu;
            })
            ->filter(fn($ibu) => isset($ibu->nama_bayi))
            ->values();

        $tanggalAcuan = $today->toDateString();
        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kelompok-ibu-menyusui', compact('wargas', 'tanggalAcuan'))
            ->setPaper('a4', 'landscape')->stream('Data-Ibu-Menyusui-RW.pdf');
    }

    /**
     * Ibu Hamil: Perempuan dengan tanggal_mulai_kehamilan <= 300 hari lalu
     */
    public function ibuHamil()
    {
        $today = Carbon::now();
        $batasKehamilan = $today->copy()->subDays(300);

        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->where('jenis_kelamin', 'P')
            ->whereNotNull('tanggal_mulai_kehamilan')
            ->whereDate('tanggal_mulai_kehamilan', '>=', $batasKehamilan)
            ->whereDate('tanggal_mulai_kehamilan', '<=', $today)
            ->orderBy('tanggal_mulai_kehamilan', 'asc')
            ->get()
            ->map(function ($w) use ($today) {
                $mulai = Carbon::parse($w->tanggal_mulai_kehamilan);
                $w->usia_kandungan_bulan = $mulai->diffInMonths($today);
                $w->usia_kandungan_minggu = $mulai->diffInWeeks($today);
                $w->usia = Carbon::parse($w->tanggal_lahir)->age;
                return $w;
            });

        return Inertia::render('PengurusRW/KelompokSasaran/IbuHamil', [
            'wargas'       => $wargas,
            'totalData'    => $wargas->count(),
            'tanggalAcuan' => $today->toDateString(),
            'eksporUrl'    => URL::temporarySignedRoute('pengurus-rw.kelompok-sasaran.ibu-hamil.pdf', now()->addMinutes(5)),
        ]);
    }

    public function eksporPdfIbuHamil()
    {
        $today = Carbon::now();
        $batasKehamilan = $today->copy()->subDays(300);
        $wargas = Warga::with('kartuKeluarga')
            ->whereNull('tanggal_meninggal')
            ->where('jenis_kelamin', 'P')
            ->whereNotNull('tanggal_mulai_kehamilan')
            ->whereDate('tanggal_mulai_kehamilan', '>=', $batasKehamilan)
            ->whereDate('tanggal_mulai_kehamilan', '<=', $today)
            ->orderBy('tanggal_mulai_kehamilan', 'asc')
            ->get()
            ->map(function ($w) use ($today) {
                $mulai = Carbon::parse($w->tanggal_mulai_kehamilan);
                $w->usia_kandungan_bulan = $mulai->diffInMonths($today);
                $w->usia_kandungan_minggu = $mulai->diffInWeeks($today);
                $w->usia = Carbon::parse($w->tanggal_lahir)->age;
                return $w;
            });
        $tanggalAcuan = $today->toDateString();
        return \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.kelompok-ibu-hamil', compact('wargas', 'tanggalAcuan'))
            ->setPaper('a4', 'landscape')->stream('Data-Ibu-Hamil-RW.pdf');
    }
}
