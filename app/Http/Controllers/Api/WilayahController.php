<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;
use Illuminate\Http\Request;

class WilayahController extends Controller
{
    /**
     * GET /api/wilayah/provinsi
     */
    public function provinsi()
    {
        $data = Wilayah::provinsi()->get(['id', 'kode', 'nama']);
        return response()->json($data);
    }

    /**
     * GET /api/wilayah/kabupaten?kode_provinsi=XX
     */
    public function kabupaten(Request $request)
    {
        $request->validate(['kode_provinsi' => 'required|string']);

        $data = Wilayah::kabupaten($request->kode_provinsi)
            ->get(['id', 'kode', 'nama', 'kode_kabkota']);

        return response()->json($data);
    }

    /**
     * GET /api/wilayah/kecamatan?kode_kabkota=XX.XX
     */
    public function kecamatan(Request $request)
    {
        $request->validate(['kode_kabkota' => 'required|string']);

        $data = Wilayah::kecamatan($request->kode_kabkota)
            ->get(['id', 'kode', 'nama', 'kode_kecamatan']);

        return response()->json($data);
    }

    /**
     * GET /api/wilayah/kelurahan?kode_kecamatan=XX.XX.XX
     */
    public function kelurahan(Request $request)
    {
        $request->validate(['kode_kecamatan' => 'required|string']);

        $data = Wilayah::kelurahan($request->kode_kecamatan)
            ->get(['id', 'kode', 'nama', 'kodepos']);

        return response()->json($data);
    }
}
