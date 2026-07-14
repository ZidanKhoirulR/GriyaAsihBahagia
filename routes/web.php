<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $dashboardService = app(\App\Services\DashboardService::class);
    $dashboardData = $dashboardService->getDashboardData();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'pengumuman' => \App\Models\Pengumuman::where('status', 'aktif')
                            ->orderBy('created_at', 'desc')
                            ->take(5)
                            ->get(),
        'berita' => \App\Models\Berita::orderBy('tanggal_upload', 'desc')
                            ->take(6)
                            ->get(),
        'stats' => $dashboardData['stats'],
        'charts' => $dashboardData['charts'],
    ]);
});

// Redirect dashboard berdasarkan role
Route::get('/dashboard', function () {
    $user = auth()->user();
    
    return match($user->role) {
        'pengurus_rw' => redirect()->route('pengurus-rw.dashboard'),
        'pengurus_rt' => redirect()->route('pengurus-rt.dashboard'),
        'sekretaris'  => redirect()->route('pengurus-rw.dashboard'),
        'bendahara'   => redirect()->route('pengurus-rw.dashboard'),
        'warga'       => redirect()->route('warga.dashboard'),
        default       => Inertia::render('Dashboard'),
    };
})->middleware(['auth'])->name('dashboard');

// Route Pengurus RW
Route::middleware(['auth', 'role:pengurus_rw'])->prefix('pengurus-rw')->name('pengurus-rw.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\PengurusRW\DashboardController::class, 'index'])->name('dashboard');

    // Sub Menu Data Warga - Rumah
    Route::get('/rumah', [\App\Http\Controllers\PengurusRW\RumahController::class, 'index'])->name('rumah.index');
    Route::post('/rumah', [\App\Http\Controllers\PengurusRW\RumahController::class, 'store'])->name('rumah.store');
    Route::put('/rumah/{rumah}', [\App\Http\Controllers\PengurusRW\RumahController::class, 'update'])->name('rumah.update');
    Route::delete('/rumah/{rumah}', [\App\Http\Controllers\PengurusRW\RumahController::class, 'destroy'])->name('rumah.destroy');
    Route::get('/r/doc', [\App\Http\Controllers\PengurusRW\RumahController::class, 'eksporPdf'])->name('rumah.ekspor.pdf')->middleware('signed');
    // Sub Menu Data Warga - Keluarga
    Route::get('/keluarga', [\App\Http\Controllers\PengurusRW\KartuKeluargaController::class, 'index'])->name('keluarga.index');
    Route::post('/keluarga', [\App\Http\Controllers\PengurusRW\KartuKeluargaController::class, 'store'])->name('keluarga.store');
    Route::put('/keluarga/{keluarga}', [\App\Http\Controllers\PengurusRW\KartuKeluargaController::class, 'update'])->name('keluarga.update');
    Route::delete('/keluarga/{keluarga}', [\App\Http\Controllers\PengurusRW\KartuKeluargaController::class, 'destroy'])->name('keluarga.destroy');
    Route::get('/k/doc', [\App\Http\Controllers\PengurusRW\KartuKeluargaController::class, 'eksporPdf'])->name('keluarga.ekspor.pdf')->middleware('signed');
    Route::get('/keluarga/create', function () {
        return Inertia::render('PengurusRW/Keluarga/FormTambahKeluarga');
    })->name('keluarga.create');
    
    // Sub Menu Data Warga - Warga
    Route::get('/semua-warga', [\App\Http\Controllers\PengurusRW\WargaController::class, 'semuaWarga'])->name('warga.semua');
    Route::get('/w/doc', [\App\Http\Controllers\PengurusRW\WargaController::class, 'eksporPdfSemuaWarga'])->name('warga.ekspor.pdf')->middleware('signed');
    Route::get('/warga', function() {
        return redirect()->route('pengurus-rw.warga.semua');
    });
    Route::get('/warga/{keluarga}', [\App\Http\Controllers\PengurusRW\WargaController::class, 'index'])->name('warga.index');
    Route::post('/warga', [\App\Http\Controllers\PengurusRW\WargaController::class, 'store'])->name('warga.store');
    Route::put('/warga/{warga}', [\App\Http\Controllers\PengurusRW\WargaController::class, 'update'])->name('warga.update');
    Route::delete('/warga/{warga}', [\App\Http\Controllers\PengurusRW\WargaController::class, 'destroy'])->name('warga.destroy');

    // Mutasi Warga
    Route::get('/mutasi-warga/kelahiran', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'kelahiran'])->name('mutasi-warga.kelahiran');
    Route::get('/mw/kel/doc', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'eksporPdfKelahiran'])->name('mutasi-warga.kelahiran.pdf')->middleware('signed');
    Route::get('/mutasi-warga/kematian', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'kematian'])->name('mutasi-warga.kematian');
    Route::get('/mw/kem/doc', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'eksporPdfKematian'])->name('mutasi-warga.kematian.pdf')->middleware('signed');
    Route::get('/mutasi-warga/pindah-datang', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'pindahDatang'])->name('mutasi-warga.pindah-datang');
    Route::get('/mw/pdat/doc', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'eksporPdfPindahDatang'])->name('mutasi-warga.pindah-datang.pdf')->middleware('signed');
    Route::get('/mutasi-warga/pindah-pergi', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'pindahPergi'])->name('mutasi-warga.pindah-pergi');
    Route::get('/mw/pper/doc', [\App\Http\Controllers\PengurusRW\MutasiWargaController::class, 'eksporPdfPindahPergi'])->name('mutasi-warga.pindah-pergi.pdf')->middleware('signed');


    // Kelola Pengurus
    Route::get('/kelola-pengurus/rw', [\App\Http\Controllers\PengurusRW\PengurusController::class, 'indexRw'])->name('kelola-pengurus.rw');
    Route::get('/kelola-pengurus/rt', [\App\Http\Controllers\PengurusRW\PengurusController::class, 'indexRt'])->name('kelola-pengurus.rt');
    Route::post('/kelola-pengurus', [\App\Http\Controllers\PengurusRW\PengurusController::class, 'store'])->name('kelola-pengurus.store');
    Route::put('/kelola-pengurus/{pengurus}', [\App\Http\Controllers\PengurusRW\PengurusController::class, 'update'])->name('kelola-pengurus.update');
    Route::patch('/kelola-pengurus/{pengurus}/toggle', [\App\Http\Controllers\PengurusRW\PengurusController::class, 'toggle'])->name('kelola-pengurus.toggle');
    Route::delete('/kelola-pengurus/{pengurus}', [\App\Http\Controllers\PengurusRW\PengurusController::class, 'destroy'])->name('kelola-pengurus.destroy');

    // Kelompok Sasaran
    Route::get('/kelompok-sasaran/pemilih', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'pemilih'])->name('kelompok-sasaran.pemilih');
    Route::get('/kelompok-sasaran/balita', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'balita'])->name('kelompok-sasaran.balita');
    Route::get('/kelompok-sasaran/lansia', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'lansia'])->name('kelompok-sasaran.lansia');
    Route::get('/kelompok-sasaran/ibu-menyusui', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'ibuMenyusui'])->name('kelompok-sasaran.ibu-menyusui');
    Route::get('/kelompok-sasaran/ibu-hamil', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'ibuHamil'])->name('kelompok-sasaran.ibu-hamil');
    // PDF Ekspor Kelompok Sasaran
    Route::get('/ks/pemilih/doc', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'eksporPdfPemilih'])->name('kelompok-sasaran.pemilih.pdf')->middleware('signed');
    Route::get('/ks/balita/doc', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'eksporPdfBalita'])->name('kelompok-sasaran.balita.pdf')->middleware('signed');
    Route::get('/ks/lansia/doc', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'eksporPdfLansia'])->name('kelompok-sasaran.lansia.pdf')->middleware('signed');
    Route::get('/ks/ibu-menyusui/doc', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'eksporPdfIbuMenyusui'])->name('kelompok-sasaran.ibu-menyusui.pdf')->middleware('signed');
    Route::get('/ks/ibu-hamil/doc', [\App\Http\Controllers\PengurusRW\KelompokSasaranController::class, 'eksporPdfIbuHamil'])->name('kelompok-sasaran.ibu-hamil.pdf')->middleware('signed');
    // Papan Informasi
    Route::get('/pengumuman', [\App\Http\Controllers\PengurusRW\PengumumanController::class, 'index'])->name('pengumuman.index');
    Route::post('/pengumuman', [\App\Http\Controllers\PengurusRW\PengumumanController::class, 'store'])->name('pengumuman.store');
    Route::put('/pengumuman/{pengumuman}', [\App\Http\Controllers\PengurusRW\PengumumanController::class, 'update'])->name('pengumuman.update');
    Route::delete('/pengumuman/{pengumuman}', [\App\Http\Controllers\PengurusRW\PengumumanController::class, 'destroy'])->name('pengumuman.destroy');

    Route::get('/berita', [\App\Http\Controllers\PengurusRW\BeritaController::class, 'index'])->name('berita.index');
    Route::post('/berita', [\App\Http\Controllers\PengurusRW\BeritaController::class, 'store'])->name('berita.store');
    Route::post('/berita/{beritum}', [\App\Http\Controllers\PengurusRW\BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{beritum}', [\App\Http\Controllers\PengurusRW\BeritaController::class, 'destroy'])->name('berita.destroy');

    // Keuangan - Metode Transaksi
    Route::get('/metode-transaksi', [\App\Http\Controllers\PengurusRW\MetodeTransaksiController::class, 'index'])->name('metode-transaksi.index');
    Route::post('/metode-transaksi', [\App\Http\Controllers\PengurusRW\MetodeTransaksiController::class, 'store'])->name('metode-transaksi.store');
    Route::put('/metode-transaksi/{metodeTransaksi}', [\App\Http\Controllers\PengurusRW\MetodeTransaksiController::class, 'update'])->name('metode-transaksi.update');
    Route::delete('/metode-transaksi/{metodeTransaksi}', [\App\Http\Controllers\PengurusRW\MetodeTransaksiController::class, 'destroy'])->name('metode-transaksi.destroy');

    // Keuangan - Arus Kas RW
    Route::get('/arus-kas-rw', [\App\Http\Controllers\PengurusRW\ArusKasRwController::class, 'index'])->name('arus-kas-rw.index');
    Route::post('/arus-kas-rw', [\App\Http\Controllers\PengurusRW\ArusKasRwController::class, 'store'])->name('arus-kas-rw.store');
    Route::post('/arus-kas-rw/{arusKasRw}', [\App\Http\Controllers\PengurusRW\ArusKasRwController::class, 'update'])->name('arus-kas-rw.update');
    Route::patch('/arus-kas-rw/{id}/validasi', [\App\Http\Controllers\PengurusRW\ArusKasRwController::class, 'validasi'])->name('arus-kas-rw.validasi');
    Route::delete('/arus-kas-rw/{arusKasRw}', [\App\Http\Controllers\PengurusRW\ArusKasRwController::class, 'destroy'])->name('arus-kas-rw.destroy');

    // Keuangan - Arus Kas RT
    Route::get('/arus-kas-rt', [\App\Http\Controllers\PengurusRW\ArusKasRtController::class, 'index'])->name('arus-kas-rt.index');
    Route::post('/arus-kas-rt', [\App\Http\Controllers\PengurusRW\ArusKasRtController::class, 'store'])->name('arus-kas-rt.store');
    Route::post('/arus-kas-rt/{arusKasRt}', [\App\Http\Controllers\PengurusRW\ArusKasRtController::class, 'update'])->name('arus-kas-rt.update');
    Route::patch('/arus-kas-rt/{id}/validasi', [\App\Http\Controllers\PengurusRW\ArusKasRtController::class, 'validasi'])->name('arus-kas-rt.validasi');
    Route::delete('/arus-kas-rt/{arusKasRt}', [\App\Http\Controllers\PengurusRW\ArusKasRtController::class, 'destroy'])->name('arus-kas-rt.destroy');
});

// Route Pengurus RT
Route::middleware(['auth', 'role:pengurus_rt'])->prefix('pengurus-rt')->name('pengurus-rt.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\PengurusRT\DashboardController::class, 'index'])->name('dashboard');

    // Data Warga - Rumah
    Route::get('/rumah', [\App\Http\Controllers\PengurusRT\RumahController::class, 'index'])->name('rumah.index');
    Route::post('/rumah', [\App\Http\Controllers\PengurusRT\RumahController::class, 'store'])->name('rumah.store');
    Route::put('/rumah/{rumah}', [\App\Http\Controllers\PengurusRT\RumahController::class, 'update'])->name('rumah.update');
    Route::delete('/rumah/{rumah}', [\App\Http\Controllers\PengurusRT\RumahController::class, 'destroy'])->name('rumah.destroy');
    Route::get('/r/doc', [\App\Http\Controllers\PengurusRT\RumahController::class, 'eksporPdf'])->name('rumah.ekspor.pdf')->middleware('signed');

    // Data Warga - Keluarga
    Route::get('/keluarga', [\App\Http\Controllers\PengurusRT\KartuKeluargaController::class, 'index'])->name('keluarga.index');
    Route::post('/keluarga', [\App\Http\Controllers\PengurusRT\KartuKeluargaController::class, 'store'])->name('keluarga.store');
    Route::put('/keluarga/{keluarga}', [\App\Http\Controllers\PengurusRT\KartuKeluargaController::class, 'update'])->name('keluarga.update');
    Route::delete('/keluarga/{keluarga}', [\App\Http\Controllers\PengurusRT\KartuKeluargaController::class, 'destroy'])->name('keluarga.destroy');
    Route::get('/k/doc', [\App\Http\Controllers\PengurusRT\KartuKeluargaController::class, 'eksporPdf'])->name('keluarga.ekspor.pdf')->middleware('signed');

    // Data Warga - Warga
    Route::get('/semua-warga', [\App\Http\Controllers\PengurusRT\WargaController::class, 'semuaWarga'])->name('warga.semua');
    Route::get('/w/doc', [\App\Http\Controllers\PengurusRT\WargaController::class, 'eksporPdfSemuaWarga'])->name('warga.ekspor.pdf')->middleware('signed');
    Route::get('/warga/{keluarga}', [\App\Http\Controllers\PengurusRT\WargaController::class, 'index'])->name('warga.index');
    Route::post('/warga', [\App\Http\Controllers\PengurusRT\WargaController::class, 'store'])->name('warga.store');
    Route::put('/warga/{warga}', [\App\Http\Controllers\PengurusRT\WargaController::class, 'update'])->name('warga.update');
    Route::delete('/warga/{warga}', [\App\Http\Controllers\PengurusRT\WargaController::class, 'destroy'])->name('warga.destroy');

    // Mutasi Warga
    Route::get('/mutasi-warga/kelahiran', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'kelahiran'])->name('mutasi-warga.kelahiran');
    Route::get('/mw/kel/doc', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'eksporPdfKelahiran'])->name('mutasi-warga.kelahiran.pdf')->middleware('signed');
    Route::get('/mutasi-warga/kematian', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'kematian'])->name('mutasi-warga.kematian');
    Route::get('/mw/kem/doc', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'eksporPdfKematian'])->name('mutasi-warga.kematian.pdf')->middleware('signed');
    Route::get('/mutasi-warga/pindah-datang', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'pindahDatang'])->name('mutasi-warga.pindah-datang');
    Route::get('/mw/pdat/doc', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'eksporPdfPindahDatang'])->name('mutasi-warga.pindah-datang.pdf')->middleware('signed');
    Route::get('/mutasi-warga/pindah-pergi', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'pindahPergi'])->name('mutasi-warga.pindah-pergi');
    Route::get('/mw/pper/doc', [\App\Http\Controllers\PengurusRT\MutasiWargaController::class, 'eksporPdfPindahPergi'])->name('mutasi-warga.pindah-pergi.pdf')->middleware('signed');

    // Kelompok Sasaran
    Route::get('/kelompok-sasaran/pemilih', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'pemilih'])->name('kelompok-sasaran.pemilih');
    Route::get('/kelompok-sasaran/balita', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'balita'])->name('kelompok-sasaran.balita');
    Route::get('/kelompok-sasaran/lansia', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'lansia'])->name('kelompok-sasaran.lansia');
    Route::get('/kelompok-sasaran/ibu-menyusui', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'ibuMenyusui'])->name('kelompok-sasaran.ibu-menyusui');
    Route::get('/kelompok-sasaran/ibu-hamil', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'ibuHamil'])->name('kelompok-sasaran.ibu-hamil');
    Route::get('/ks/pemilih/doc', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'eksporPdfPemilih'])->name('kelompok-sasaran.pemilih.pdf')->middleware('signed');
    Route::get('/ks/balita/doc', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'eksporPdfBalita'])->name('kelompok-sasaran.balita.pdf')->middleware('signed');
    Route::get('/ks/lansia/doc', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'eksporPdfLansia'])->name('kelompok-sasaran.lansia.pdf')->middleware('signed');
    Route::get('/ks/ibu-menyusui/doc', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'eksporPdfIbuMenyusui'])->name('kelompok-sasaran.ibu-menyusui.pdf')->middleware('signed');
    Route::get('/ks/ibu-hamil/doc', [\App\Http\Controllers\PengurusRT\KelompokSasaranController::class, 'eksporPdfIbuHamil'])->name('kelompok-sasaran.ibu-hamil.pdf')->middleware('signed');

    // Keuangan - Arus Kas RT (TANPA Arus Kas RW)
    Route::get('/arus-kas-rt', [\App\Http\Controllers\PengurusRT\ArusKasRtController::class, 'index'])->name('arus-kas-rt.index');
    Route::post('/arus-kas-rt', [\App\Http\Controllers\PengurusRT\ArusKasRtController::class, 'store'])->name('arus-kas-rt.store');
    Route::post('/arus-kas-rt/{arusKasRt}', [\App\Http\Controllers\PengurusRT\ArusKasRtController::class, 'update'])->name('arus-kas-rt.update');
    Route::patch('/arus-kas-rt/{id}/validasi', [\App\Http\Controllers\PengurusRT\ArusKasRtController::class, 'validasi'])->name('arus-kas-rt.validasi');
    Route::delete('/arus-kas-rt/{arusKasRt}', [\App\Http\Controllers\PengurusRT\ArusKasRtController::class, 'destroy'])->name('arus-kas-rt.destroy');

    // Keuangan - Metode Transaksi
    Route::get('/metode-transaksi', [\App\Http\Controllers\PengurusRT\MetodeTransaksiController::class, 'index'])->name('metode-transaksi.index');
    Route::post('/metode-transaksi', [\App\Http\Controllers\PengurusRT\MetodeTransaksiController::class, 'store'])->name('metode-transaksi.store');
    Route::put('/metode-transaksi/{metodeTransaksi}', [\App\Http\Controllers\PengurusRT\MetodeTransaksiController::class, 'update'])->name('metode-transaksi.update');
    Route::delete('/metode-transaksi/{metodeTransaksi}', [\App\Http\Controllers\PengurusRT\MetodeTransaksiController::class, 'destroy'])->name('metode-transaksi.destroy');
});

// Route Warga
Route::middleware(['auth', 'role:warga'])->prefix('warga')->name('warga.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Warga\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/data-warga', [\App\Http\Controllers\Warga\WargaDataController::class, 'index'])->name('data-warga.index');
    Route::get('/iuran', [\App\Http\Controllers\Warga\IuranController::class, 'index'])->name('iuran.index');
    Route::post('/iuran/upload', [\App\Http\Controllers\Warga\IuranController::class, 'uploadBukti'])->name('iuran.upload');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/foto', [ProfileController::class, 'deleteFoto'])->name('profile.foto.delete');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
