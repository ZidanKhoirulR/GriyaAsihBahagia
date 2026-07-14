import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';

interface Warga {
    id: number;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    usia: number;
    no_whatsapp: string | null;
    tanggal_mulai_kehamilan: string;
    usia_kandungan_bulan: number;
    usia_kandungan_minggu: number;
    kartu_keluarga?: { rt: string; rw: string; nomor_kk: string };
}

export default function IbuHamil({ wargas, totalData, tanggalAcuan, eksporUrl }: { wargas: Warga[]; totalData: number; tanggalAcuan: string; eksporUrl: string }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = wargas.filter(w => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return w.nama_lengkap.toLowerCase().includes(s) || w.nik.includes(s);
    });

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const getTrimester = (bulan: number) => {
        if (bulan <= 3) return { label: 'Trimester 1', color: 'bg-green-50 text-green-600' };
        if (bulan <= 6) return { label: 'Trimester 2', color: 'bg-yellow-50 text-yellow-600' };
        return { label: 'Trimester 3', color: 'bg-red-50 text-red-600' };
    };

    const formatTanggal = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <PengurusRWLayout title="Kelompok Sasaran – Ibu Hamil">
            <Head title="Data Ibu Hamil" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Card Total Ibu Hamil – gaya dashboard */}
                <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                            <img src="/images/icons/logoibuhamil.png" alt="Ibu Hamil" className="w-7 h-7 object-contain" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-gray-900 leading-tight">Total Ibu Hamil</p>
                        </div>
                    </div>
                    <p className="text-xl md:text-2xl text-gray-900 tracking-tight">
                        {totalData.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Kelompok Ibu Hamil</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li>Menampilkan warga perempuan yang sedang hamil dengan usia kandungan <strong>0 – 10 bulan (≈300 hari)</strong>.</li>
                    <li>Data kehamilan <strong>diinput manual</strong> oleh Pengurus RW melalui menu <strong>Keluarga → Edit Warga</strong> (field &quot;Tgl Mulai Kehamilan&quot;).</li>
                    <li>Ibu <strong>otomatis keluar</strong> dari daftar setelah 300 hari sejak tanggal mulai kehamilan.</li>
                    <li>Setelah melahirkan, hapus/kosongkan field &quot;Tgl Mulai Kehamilan&quot; agar tidak lagi muncul di daftar ini.</li>
                    <li>Gunakan tombol <strong>Ekspor PDF</strong> untuk mencetak data.</li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full p-2 pl-9 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Cari nama atau NIK..." />
                    </div>
                    <a href={eksporUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 17.5c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5H10c.8 0 1.5.7 1.5 1.5S10.8 14.5 10 14.5H9.5V17c0 .3-.2.5-.5.5zm1-4h.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H9.5V13.5zm4.5 4c0 .3-.2.5-.5.5h-1.5c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5H13c1.1 0 2 .9 2 2v1.5c0 1.1-.9 2-2 2zm-.5-5v4h.5c.6 0 1-.4 1-1V13c0-.6-.4-1-1-1H13zm4.5 0h-1v1.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1V17c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5h1.5c.3 0 .5.2.5.5s-.2.5-.5.5z" />
                        </svg>
                        Ekspor PDF
                    </a>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs text-left text-gray-500">
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50/80 border-y border-gray-200">
                            <tr>
                                <th className="px-3 py-3 text-center">No</th>
                                <th className="px-3 py-3 text-center">RT</th>
                                <th className="px-3 py-3 text-center">Nama Lengkap</th>
                                <th className="px-3 py-3 text-center">NIK</th>
                                <th className="px-3 py-3 text-center">Usia Ibu</th>
                                <th className="px-3 py-3 text-center">Tgl Mulai Kehamilan</th>
                                <th className="px-3 py-3 text-center">Usia Kandungan</th>
                                <th className="px-3 py-3 text-center">Trimester</th>
                                <th className="px-3 py-3 text-center">No. WhatsApp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-500">Tidak ada data ibu hamil ditemukan.</td></tr>
                            ) : (
                                currentData.map((w, i) => {
                                    const trimester = getTrimester(w.usia_kandungan_bulan);
                                    return (
                                        <tr key={w.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                                            <td className="px-3 py-2 text-center">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                            <td className="px-3 py-2 text-center">{w.kartu_keluarga?.rt || '-'}</td>
                                            <td className="px-3 py-2 text-center capitalize">{w.nama_lengkap}</td>
                                            <td className="px-3 py-2 text-center">{w.nik}</td>
                                            <td className="px-3 py-2 text-center">{w.usia} thn</td>
                                            <td className="px-3 py-2 text-center">{formatTanggal(w.tanggal_mulai_kehamilan)}</td>
                                            <td className="px-3 py-2 text-center">{w.usia_kandungan_bulan} bln ({w.usia_kandungan_minggu} mgg)</td>
                                            <td className="px-3 py-2 text-center">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${trimester.color}`}>{trimester.label}</span>
                                            </td>
                                            <td className="px-3 py-2 text-center">{w.no_whatsapp || '-'}</td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {totalItems > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between rounded-b-xl gap-4 mt-2">
                        <div className="text-xs text-gray-500">
                            Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="font-medium">{totalItems}</span> data
                        </div>
                        <div className="flex space-x-1">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Sebelumnya</button>
                            <div className="hidden sm:flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                    if (totalPages > 7) {
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                                            return <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{page}</button>;
                                        else if (page === currentPage - 2 || page === currentPage + 2)
                                            return <span key={page} className="px-2 py-1.5 text-xs text-gray-500">...</span>;
                                        return null;
                                    }
                                    return <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{page}</button>;
                                })}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
                                className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>Selanjutnya</button>
                        </div>
                    </div>
                )}
            </div>
        </PengurusRWLayout>
    );
}
