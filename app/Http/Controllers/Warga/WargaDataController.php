<?php

namespace App\Http\Controllers\Warga;

use App\Http\Controllers\Controller;
use App\Models\Warga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WargaDataController extends Controller
{
    public function index(Request $request)
    {
        // Get all warga, potentially we could paginate if needed, 
        // but PRD says "mengambil data seluruh warga tanpa paginasi berlebih atau dengan infinite scroll"
        // Let's just pass all or a good chunk since it's a card grid.
        
        $wargas = Warga::with(['kartuKeluarga', 'user'])->orderBy('created_at', 'desc')->get();

        return Inertia::render('Warga/DataWarga/Index', [
            'wargas' => $wargas
        ]);
    }
}
