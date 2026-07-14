<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Kartu Keluarga RW</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            padding: 40px;
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 9px;
            color: #374151;
            background: #fff;
        }

        /* Header */
        .header {
            text-align: center;
            padding-top: 50px;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .header h1 {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: #111827;
            margin: 0;
            padding: 0;
            letter-spacing: 1px;
        }

        /* Meta info */
        .meta-table {
            width: 100%;
            margin-bottom: 12px;
            font-size: 8px;
            color: #6b7280;
        }
        .meta-table td {
            padding: 0;
            border: none;
        }
        .meta-right { text-align: right; }

        /* Data Table */
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }
        .data-table th, .data-table td {
            border: 1px solid #d1d5db; /* border abu-abu lebih halus/modern */
            padding: 6px;
            vertical-align: middle;
        }
        .data-table th {
            text-align: center;
            font-weight: bold;
            color: #374151;
            background-color: #f9fafb; /* Latar abu-abu sangat muda khusus untuk header agar tidak flat */
            font-size: 8px;
        }
        
        .center { text-align: center; }

        /* Footer */
        .footer-table {
            width: 100%;
            margin-top: 30px;
            font-size: 8.5px;
            color: #4b5563;
        }
        .footer-table td {
            padding: 0;
            border: none;
            vertical-align: bottom;
        }
        .footer-ttd {
            text-align: center;
            width: 250px;
        }
        .ttd-nama {
            font-weight: bold;
            text-decoration: underline;
            margin-top: 50px;
            display: block;
            color: #111827;
        }
    </style>
</head>
<body>
    @php
    $jabatanPenandatangan = 'Pengurus';
    if(auth()->check()) {
        $warga = \App\Models\Warga::where('nik', auth()->user()->nik)->first();
        if ($warga) {
            $pengurus = \App\Models\Pengurus::where('warga_id', $warga->id)->where('is_aktif', true)->first();
            if ($pengurus && $pengurus->jabatan) {
                $jabatanPenandatangan = $pengurus->jabatan;
                if ($pengurus->rt) {
                    $jabatanPenandatangan .= ' RT ' . $pengurus->rt;
                }
            } elseif(auth()->user()->role === 'pengurus_rw') {
                $jabatanPenandatangan = 'Pengurus RW';
            } else {
                $jabatanPenandatangan = 'Pengurus RT';
            }
        } elseif(auth()->user()->role === 'pengurus_rw') {
            $jabatanPenandatangan = 'Pengurus RW';
        } else {
            $jabatanPenandatangan = 'Pengurus RT';
        }
    }
@endphp

    <div class="header">
        <h1>DAFTAR DATA KARTU KELUARGA</h1>
    </div>

    <table class="meta-table">
        <tr>
            <td>Tanggal cetak: {{ \Carbon\Carbon::now('Asia/Jakarta')->isoFormat('D MMMM YYYY, HH:mm') }} WIB</td>
            <td class="meta-right">Total data: {{ $keluargas->count() }} Kartu Keluarga</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width:4%">No</th>
                <th style="width:5%">RT</th>
                <th style="width:18%">Alamat Rumah</th>
                <th style="width:15%">No. Kartu Keluarga</th>
                <th style="width:13%">Tanggal Dikeluarkan</th>
                <th style="width:16%">Kepala Keluarga</th>
                <th style="width:8%">Jumlah Anggota</th>
                <th style="width:10%">Status Tinggal</th>
                <th style="width:11%">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($keluargas as $i => $kk)
                @php
                    $kepala = collect($kk->warga)->firstWhere('shdk', 'Kepala Keluarga');
                    $jumlah = count($kk->warga ?? []);
                @endphp
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    <td class="center">{{ $kk->rt }}</td>
                    <td>{{ $kk->rumah?->alamat_detail ?? $kk->alamat_detail }}</td>
                    <td class="center">{{ $kk->nomor_kk }}</td>
                    <td class="center">{{ $kk->tanggal_dikeluarkan ? \Carbon\Carbon::parse($kk->tanggal_dikeluarkan)->isoFormat('D MMMM YYYY') : '-' }}</td>
                    <td class="center">{{ $kepala?->nama_lengkap ?? 'Belum Ada' }}</td>
                    <td class="center">{{ $jumlah }} orang</td>
                    <td class="center">{{ $kk->status_tinggal ? ucfirst($kk->status_tinggal) : '-' }}</td>
                    <td>{{ $kk->catatan ?: '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="center" style="padding: 20px; color: #555;">Belum ada data Kartu Keluarga.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="footer-table">
        <tr>
            <td></td>
            <td class="footer-ttd">
                <span>{{ $jabatanPenandatangan }}</span>
                <span class="ttd-nama">{{ auth()->user()?->nama_lengkap ?? '( ......................... )' }}</span>
            </td>
        </tr>
    </table>

</body>
</html>

