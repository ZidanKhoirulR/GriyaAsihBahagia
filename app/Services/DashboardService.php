<?php

namespace App\Services;

use App\Models\Warga;
use App\Models\KartuKeluarga;
use Carbon\Carbon;

class DashboardService
{
    public function getDashboardData($rt = null)
    {
        $wargaQuery = Warga::query()
            ->whereNull('tanggal_meninggal')
            ->whereNull('tanggal_pindah_pergi');

        $kkQuery = KartuKeluarga::query();

        if ($rt) {
            // Raw RT from auth usually like "001" or "1" depending on how they store it.
            // But we filter accordingly.
            $wargaQuery->whereHas('kartuKeluarga', function ($q) use ($rt) {
                $q->where('rt', $rt);
            });
            $kkQuery->where('rt', $rt);
        }

        $totalKeluarga = (clone $kkQuery)->count();
        
        // Load all valid warga with their KK
        $wargas = (clone $wargaQuery)->with('kartuKeluarga')->get();

        $totalWarga = $wargas->count();
        $pria = $wargas->where('jenis_kelamin', 'L')->count();
        $wanita = $wargas->where('jenis_kelamin', 'P')->count();

        // Calculate ages
        $now = Carbon::now();
        $balitaCount = 0;
        $lansiaCount = 0;
        
        $kelompokUsia = [
            '0-5 Tahun' => 0,
            '6-17 Tahun' => 0,
            '18-30 Tahun' => 0,
            '31-45 Tahun' => 0,
            '46-60 Tahun' => 0,
            '60+ Tahun' => 0,
        ];

        foreach ($wargas as $w) {
            if (!$w->tanggal_lahir) continue;
            
            // Safe age calculation
            try {
                $age = Carbon::parse($w->tanggal_lahir)->age;
            } catch (\Exception $e) {
                continue;
            }
            
            if ($age <= 5) $balitaCount++;
            if ($age >= 60) $lansiaCount++;

            if ($age <= 5) $kelompokUsia['0-5 Tahun']++;
            elseif ($age <= 17) $kelompokUsia['6-17 Tahun']++;
            elseif ($age <= 30) $kelompokUsia['18-30 Tahun']++;
            elseif ($age <= 45) $kelompokUsia['31-45 Tahun']++;
            elseif ($age <= 60) $kelompokUsia['46-60 Tahun']++;
            else $kelompokUsia['60+ Tahun']++;
        }

        // Ibu Menyusui (wanita dengan bayi 0-24 bulan di KK yang sama)
        // Ibu Hamil (wanita dengan tanggal_mulai_kehamilan terisi dan < 300 hari)
        $ibuMenyusuiCount = 0;
        $ibuHamilCount = 0;
        
        $wargasByKk = $wargas->groupBy('kk_id');

        foreach ($wargas as $w) {
            if ($w->jenis_kelamin === 'P') {
                // Check Ibu Hamil
                if ($w->tanggal_mulai_kehamilan) {
                    try {
                        $daysPregnant = Carbon::parse($w->tanggal_mulai_kehamilan)->diffInDays($now);
                        if ($daysPregnant <= 300) {
                            $ibuHamilCount++;
                        }
                    } catch (\Exception $e) {}
                }

                // Check Ibu Menyusui
                if ($w->kk_id && isset($wargasByKk[$w->kk_id])) {
                    $hasBaby = false;
                    foreach ($wargasByKk[$w->kk_id] as $anggotaKk) {
                        if ($anggotaKk->id !== $w->id && $anggotaKk->tanggal_lahir) {
                            try {
                                $months = Carbon::parse($anggotaKk->tanggal_lahir)->diffInMonths($now);
                                if ($months <= 24) {
                                    $hasBaby = true;
                                    break;
                                }
                            } catch (\Exception $e) {}
                        }
                    }
                    if ($hasBaby) {
                        $ibuMenyusuiCount++;
                    }
                }
            }
        }

        // Data per RT
        $dataPerRT = [];
        // Get all unique RTs in this dataset
        $rts = $wargas->map(function ($w) {
            return $w->kartuKeluarga ? $w->kartuKeluarga->rt : null;
        })->filter()->unique()->sort();
        
        foreach ($rts as $r) {
            $count = $wargas->filter(function($w) use ($r) {
                return $w->kartuKeluarga && $w->kartuKeluarga->rt === $r;
            })->count();
            
            // Format to 'RT 001'
            $rtLabel = str_starts_with(strtoupper($r), 'RT') ? $r : "RT " . str_pad($r, 3, '0', STR_PAD_LEFT);
            $dataPerRT[] = ['rt' => $rtLabel, 'jumlah' => $count];
        }

        // Colors for charts
        $usiaColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#6366f1'];
        $formattedUsia = [];
        $i = 0;
        foreach ($kelompokUsia as $label => $jumlah) {
            $formattedUsia[] = ['label' => $label, 'jumlah' => $jumlah, 'color' => $usiaColors[$i % count($usiaColors)]];
            $i++;
        }

        // Agama
        $agamas = $wargas->groupBy(function($w) { return $w->agama ?: 'Tidak Diketahui'; })->map->count();
        $formattedAgama = [];
        $i = 0;
        foreach ($agamas as $agama => $count) {
            $formattedAgama[] = ['label' => $agama, 'jumlah' => $count, 'color' => $usiaColors[$i % count($usiaColors)]];
            $i++;
        }

        // Pendidikan
        $pendidikans = $wargas->groupBy(function($w) { return $w->pendidikan ?: 'Tidak Diketahui'; })->map->count();
        $formattedPendidikan = [];
        $i = 0;
        foreach ($pendidikans as $pendidikan => $count) {
            $formattedPendidikan[] = ['label' => $pendidikan, 'jumlah' => $count, 'color' => $usiaColors[$i % count($usiaColors)]];
            $i++;
        }

        // Pekerjaan
        $pekerjaans = $wargas->groupBy(function($w) { return $w->jenis_pekerjaan ?: 'Tidak Diketahui'; })->map->count();
        $formattedPekerjaan = [];
        $i = 0;
        // Sort to get top 5, group rest as "Lainnya"
        $pekerjaans = $pekerjaans->sortDesc();
        $top5 = $pekerjaans->take(5);
        $others = $pekerjaans->skip(5)->sum();
        
        foreach ($top5 as $pekerjaan => $count) {
            $formattedPekerjaan[] = ['label' => $pekerjaan, 'jumlah' => $count, 'color' => $usiaColors[$i % count($usiaColors)]];
            $i++;
        }
        if ($others > 0) {
            $formattedPekerjaan[] = ['label' => 'Lainnya', 'jumlah' => $others, 'color' => '#9ca3af'];
        }

        return [
            'stats' => [
                'keluarga' => $totalKeluarga,
                'warga' => $totalWarga,
                'pria' => $pria,
                'wanita' => $wanita,
                'balita' => $balitaCount,
                'lansia' => $lansiaCount,
                'ibuMenyusui' => $ibuMenyusuiCount,
                'ibuHamil' => $ibuHamilCount,
            ],
            'charts' => [
                'dataPerRT' => $dataPerRT,
                'dataKelompokUsia' => $formattedUsia,
                'dataAgama' => $formattedAgama,
                'dataPendidikan' => $formattedPendidikan,
                'dataPekerjaan' => $formattedPekerjaan,
            ]
        ];
    }
}
