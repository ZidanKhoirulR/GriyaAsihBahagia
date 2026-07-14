import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PengurusRTLayout from '@/Layouts/PengurusRTLayout';
import Modal from '@/Components/Modal';

interface Warga {
    id: number;
    kk_id: number;
    nama_lengkap: string;
    nik: string;
    no_whatsapp: string | null;
    jenis_kelamin: 'L' | 'P';
    tempat_lahir: string;
    tanggal_lahir: string;
    tempat_meninggal: string | null;
    tanggal_meninggal: string | null;
    agama: string;
    pendidikan: string;
    jenis_pekerjaan: string;
    golongan_darah: string;
    kewarganegaraan: string;
    nomor_paspor: string | null;
    nomor_kitap: string | null;
    pindah_datang_dari: string | null;
    tanggal_pindah_datang: string | null;
    pindah_pergi: string | null;
    status_perkawinan: string;
    tanggal_perkawinan: string | null;
    shdk: string;
    nama_ayah: string;
    nama_ibu: string;
    catatan: string | null;
    kartu_keluarga?: {
        id: number;
        nomor_kk: string;
        rt: string;
        rw: string;
        encrypted_id?: string;
    };
}

export default function SemuaWarga({ wargas, eksporUrl }: { wargas: Warga[], eksporUrl: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewWarga, setViewWarga] = useState<Warga | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredWargas = wargas.filter(warga => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            String(warga.nama_lengkap || '').toLowerCase().includes(search) ||
            String(warga.nik || '').toLowerCase().includes(search) ||
            String(warga.kartu_keluarga?.nomor_kk || '').toLowerCase().includes(search) ||
            String(warga.kartu_keluarga?.rt || '').toLowerCase().includes(search)
        );
    });

    const totalItems = filteredWargas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentData = filteredWargas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when searching
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const openViewModal = (warga: Warga) => {
        setViewWarga(warga);
        setIsViewModalOpen(true);
    };

    const inputClass = "mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm";
    const labelClass = "block text-xs font-medium text-gray-700";
    const errorClass = "text-red-500 text-xs mt-1";

    return (
        <PengurusRTLayout title="Data Semua Warga">
            <Head title="Halaman Data Warga" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Data Semua Warga</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 cursor-default align-baseline">
                            Ekspor PDF
                        </span>: Gunakan tombol ini untuk mengunduh seluruh data warga dari semua RT/RW ke dalam file.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 rounded text-xs font-medium text-emerald-600 border border-emerald-100 cursor-default align-baseline">
                            Lihat Detail (Mata)
                        </span>: Klik tombol ini pada kolom aksi untuk melihat rincian lengkap biodata warga.
                    </li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full p-2 pl-9 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Cari NIK, Nama, No. KK..."
                        />
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto justify-end">
                        <a
                            href={eksporUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 17.5c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5H10c.8 0 1.5.7 1.5 1.5S10.8 14.5 10 14.5H9.5V17c0 .3-.2.5-.5.5zm1-4h.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H9.5V13.5zm4.5 4c0 .3-.2.5-.5.5h-1.5c-.3 0-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5H13c1.1 0 2 .9 2 2v1.5c0 1.1-.9 2-2 2zm-.5-5v4h.5c.6 0 1-.4 1-1V13c0-.6-.4-1-1-1H13zm4.5 0h-1v1.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1V17c0 .3-.2.5-.5.5s-.5-.2-.5-.5v-5c0-.3.2-.5.5-.5h1.5c.3 0 .5.2.5.5s-.2.5-.5.5z" />
                            </svg>
                            Ekspor PDF
                        </a>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs text-left text-gray-500">
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50/80 border-y border-gray-200">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-center">No</th>
                                <th scope="col" className="px-3 py-3 text-center">RT</th>
                                <th scope="col" className="px-3 py-3 text-center">Nama Lengkap</th>
                                <th scope="col" className="px-3 py-3 text-center">NIK</th>
                                <th scope="col" className="px-3 py-3 text-center">No. KK</th>
                                <th scope="col" className="px-3 py-3 text-center">No. WhatsApp</th>
                                <th scope="col" className="px-3 py-3 text-center">Tempat, Tgl Lahir</th>
                                <th scope="col" className="px-3 py-3 text-center">Agama</th>
                                <th scope="col" className="px-3 py-3 text-center">SHDK</th>
                                <th scope="col" className="px-3 py-3 text-center">Catatan</th>
                                <th scope="col" className="px-3 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWargas.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-3 py-8 text-center text-gray-500 font-medium">
                                        Tidak ada data warga yang ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((warga, index) => (
                                    <tr key={warga.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                                        <td className="px-3 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-3 py-2 text-center">{warga.kartu_keluarga?.rt || '-'}</td>
                                        <td className="px-3 py-2 text-center capitalize">{warga.nama_lengkap}</td>
                                        <td className="px-3 py-2 text-center font-medium">{warga.nik}</td>
                                        <td className="px-3 py-2 text-center text-gray-600">{warga.kartu_keluarga?.nomor_kk || '-'}</td>
                                        <td className="px-3 py-2 text-center">{warga.no_whatsapp || '-'}</td>
                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                            {warga.tempat_lahir}, {formatDate(warga.tanggal_lahir)}
                                        </td>
                                        <td className="px-3 py-2 text-center">{warga.agama}</td>
                                        <td className="px-3 py-2 text-center text-gray-700">{warga.shdk}</td>
                                        <td className="px-3 py-2 text-center max-w-[150px] truncate" title={warga.catatan || ''}>
                                            {warga.catatan || '-'}
                                        </td>
                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button onClick={() => openViewModal(warga)} title="Lihat Detail" className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {totalItems > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between rounded-b-xl gap-4">
                            <div className="text-xs text-gray-500">
                                Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span className="font-medium">{totalItems}</span> data
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Sebelumnya
                                </button>

                                <div className="hidden sm:flex space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                        if (totalPages > 7) {
                                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                return (
                                                    <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} className="px-2 py-1.5 text-xs text-gray-500">...</span>;
                                            }
                                            return null;
                                        }
                                        return (
                                            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* View Detail Modal */}
            <Modal show={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} maxWidth="4xl">
                {viewWarga && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Detail Data Warga</h3>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 text-sm">
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Nama Lengkap</span>
                                <span className="block font-medium text-gray-800 mt-0.5 capitalize">{viewWarga.nama_lengkap}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">NIK</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.nik}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">No. KK</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.kartu_keluarga?.nomor_kk || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">RT / RW</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.kartu_keluarga?.rt || '-'} / {viewWarga.kartu_keluarga?.rw || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Jenis Kelamin</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Tempat, Tanggal Lahir</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.tempat_lahir}, {formatDate(viewWarga.tanggal_lahir)}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Agama</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.agama}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Pendidikan</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.pendidikan}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Pekerjaan</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.jenis_pekerjaan}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Golongan Darah</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.golongan_darah}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Kewarganegaraan</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.kewarganegaraan}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Status Perkawinan</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.status_perkawinan}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">No. WhatsApp</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.no_whatsapp || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">SHDK</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.shdk}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Nama Ayah</span>
                                <span className="block font-medium text-gray-800 mt-0.5 capitalize">{viewWarga.nama_ayah || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Nama Ibu</span>
                                <span className="block font-medium text-gray-800 mt-0.5 capitalize">{viewWarga.nama_ibu || '-'}</span>
                            </div>
                            <div className="col-span-2 md:col-span-4 mt-2 pt-3 border-t border-gray-100">
                                <span className="block text-xs text-gray-500 font-medium">Catatan</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{viewWarga.catatan || '-'}</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </PengurusRTLayout>
    );
}
