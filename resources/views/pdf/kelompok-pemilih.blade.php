<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Data Pemilih RW</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 9px; color: #1f2937; background: #fff; }
        .header { text-align: center; padding: 14px 0 10px; border-bottom: 2px solid #3b82f6; margin-bottom: 12px; }
        .header h1 { font-size: 14px; font-weight: bold; letter-spacing: 0.5px; color: #1f2937; }
        .header h2 { font-size: 10px; color: #3b82f6; margin-top: 2px; }
        .header p { font-size: 8.5px; color: #6b7280; margin-top: 2px; }
        .meta { display: flex; justify-content: space-between; font-size: 8px; color: #6b7280; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background-color: #3b82f6; color: #ffffff; }
        thead th { padding: 6px 4px; text-align: center; font-size: 8px; font-weight: bold; border: 1px solid #2563eb; }
        tbody tr:nth-child(even) { background-color: #eff6ff; }
        tbody tr:nth-child(odd) { background-color: #ffffff; }
        tbody td { padding: 5px 4px; border: 1px solid #e5e7eb; font-size: 8px; vertical-align: middle; }
        td.center { text-align: center; }
        .footer { margin-top: 14px; display: flex; justify-content: space-between; font-size: 7.5px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 6px; }
        .ttd { text-align: right; font-size: 8px; color: #374151; }
        .ttd .label { margin-bottom: 40px; }
        .ttd .name { font-weight: bold; border-top: 1px solid #374151; padding-top: 2px; display: inline-block; min-width: 120px; text-align: center; }
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
        <h1>DATA KELOMPOK PEMILIH</h1>
        <h2>Kelompok Sasaran â€” Warga Usia â‰¥ 17 Tahun</h2>
        <p>Sistem Informasi Rukun Warga</p>
    </div>

    <div class="meta">
        <span>Tanggal Acuan: {{ \Carbon\Carbon::parse($tanggalAcuan)->isoFormat('D MMMM YYYY') }} | Tanggal Cetak: {{ \Carbon\Carbon::now('Asia/Jakarta')->isoFormat('D MMMM YYYY, HH:mm') }} WIB</span>
        <span>Total Data: {{ $wargas->count() }} Pemilih</span>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:3%">No</th>
                <th style="width:4%">RT</th>
                <th style="width:18%">Nama Lengkap</th>
                <th style="width:12%">NIK</th>
                <th style="width:4%">L/P</th>
                <th style="width:6%">Usia</th>
                <th style="width:13%">Status Perkawinan</th>
                <th style="width:13%">No. WhatsApp</th>
            </tr>
        </thead>
        <tbody>
            @forelse($wargas as $i => $w)
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    <td class="center">{{ $w->kartuKeluarga?->rt ?? '-' }}</td>
                    <td style="text-transform: capitalize;">{{ $w->nama_lengkap }}</td>
                    <td class="center">{{ $w->nik }}</td>
                    <td class="center">{{ $w->jenis_kelamin }}</td>
                    <td class="center">{{ $w->usia }} thn</td>
                    <td class="center">{{ $w->status_perkawinan ?? '-' }}</td>
                    <td class="center">{{ $w->no_whatsapp ?: '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="center" style="padding: 20px; color: #9ca3af;">Belum ada data Pemilih.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <span>Dokumen ini dicetak secara otomatis oleh sistem.</span>
        <div class="ttd">
            <div class="label">{{ $jabatanPenandatangan }}</div>
            <div class="name">(.........................)</div>
        </div>
    </div>

</body>
</html>


