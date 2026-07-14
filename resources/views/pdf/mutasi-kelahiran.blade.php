<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Kelahiran Bayi</title>
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
            border: 1px solid #d1d5db;
            padding: 6px;
            vertical-align: middle;
        }
        .data-table th {
            text-align: center;
            font-weight: bold;
            color: #374151;
            background-color: #f9fafb;
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
        <h1>DAFTAR MUTASI KELAHIRAN BAYI</h1>
    </div>

    <table class="meta-table">
        <tr>
            <td>Tanggal cetak: {{ \Carbon\Carbon::now('Asia/Jakarta')->isoFormat('D MMMM YYYY, HH:mm') }} WIB</td>
            <td class="meta-right">Total data: {{ $warga->count() }} Data Kelahiran</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width:3%">No</th>
                <th style="width:4%">RT</th>
                <th style="width:16%">Nama Lengkap</th>
                <th style="width:12%">No. Kartu Keluarga</th>
                <th style="width:8%">Jenis Kelamin</th>
                <th style="width:12%">Tanggal Lahir</th>
                <th style="width:7%">Usia</th>
                <th style="width:13%">Nama Ayah</th>
                <th style="width:13%">Nama Ibu</th>
                <th style="width:12%">Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($warga as $i => $w)
                @php
                    $usia = \Carbon\Carbon::parse($w->tanggal_lahir)->diffInDays(now());
                    $usiaTeks = $usia . ' hari';
                @endphp
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    <td class="center">{{ $w->kartuKeluarga?->rt ?? '-' }}</td>
                    <td class="center" style="text-transform: capitalize;">{{ $w->nama_lengkap }}</td>
                    <td class="center">{{ $w->kartuKeluarga?->nomor_kk ?? '-' }}</td>
                    <td class="center">{{ $w->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                    <td class="center">{{ $w->tanggal_lahir ? \Carbon\Carbon::parse($w->tanggal_lahir)->isoFormat('D MMMM YYYY') : '-' }}</td>
                    <td class="center">{{ $usiaTeks }}</td>
                    <td class="center">{{ $w->nama_ayah ?: '-' }}</td>
                    <td class="center">{{ $w->nama_ibu ?: '-' }}</td>
                    <td>{{ $w->catatan ?: '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" class="center" style="padding: 20px; color: #555;">Belum ada data kelahiran.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="footer-table">
        <tr>
            <td></td>
            <td class="footer-ttd">
                <span>{{ $jabatanPenandatangan }},</span>
                <span class="ttd-nama">{{ auth()->user()?->nama_lengkap ?? '( ......................... )' }}</span>
            </td>
        </tr>
    </table>

</body>
</html>


