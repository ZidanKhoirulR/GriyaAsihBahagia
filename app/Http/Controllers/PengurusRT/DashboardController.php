<?php

namespace App\Http\Controllers\PengurusRT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index()
    {
        $user = Auth::user();
        $rt = null;
        
        $warga = \App\Models\Warga::where('nik', $user->nik)->first();
        if ($warga) {
            $pengurus = \App\Models\Pengurus::where('warga_id', $warga->id)
                ->where('is_aktif', true)
                ->first();
            if ($pengurus) {
                $rt = $pengurus->rt;
            }
        }
        
        $data = $this->dashboardService->getDashboardData($rt);
        return Inertia::render('PengurusRT/Dashboard', $data);
    }
}
