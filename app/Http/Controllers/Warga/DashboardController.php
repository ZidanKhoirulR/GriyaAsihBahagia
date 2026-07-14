<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index()
    {
        // Warga sees the whole RW stats, identical to PengurusRW
        $data = $this->dashboardService->getDashboardData();
        return Inertia::render('Warga/Dashboard', $data);
    }
}
