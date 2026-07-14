import { Head, Link } from '@inertiajs/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';

interface Warga {
    id: number;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    nama_ayah: string | null;
    nama_ibu: string | null;
    catatan: string | null;
    kartu_keluarga: {
        nomor_kk: string;
        rt: string;
        kepala_keluarga: string;
    };
}

export default function Kelahiran({ auth, warga, eksporUrl }: PageProps<{ warga: Warga[], eksporUrl: string }>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredWarga = warga.filter((w) =>
        w.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.nik.includes(searchTerm)
    );

    const currentData = filteredWarga.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const hitungUsia = (tglLahir: string) => {
        const lahir = new Date(tglLahir);
        const sekarang = new Date();
        const diffTime = Math.abs(sekarang.getTime() - lahir.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return `${diffDays} hari`;
    };

    return (
        <PengurusRWLayout title="Data Kelahiran Warga">
            <Head title="Data Kelahiran Warga" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Mutasi: Kelahiran</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        Halaman ini hanya untuk melihat rekapan data kelahiran warga (bayi berumur maksimal 365 hari).
                    </li>
                    <li className="leading-relaxed">
                        Data bayi secara otomatis akan hilang dari daftar mutasi kelahiran jika usianya sudah melebihi 365 hari.
                    </li>
                    <li className="leading-relaxed">
                        Untuk mengubah, menambah, atau menghapus data secara fisik, silakan kelola melalui Menu Keluarga.
                    </li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="w-full sm:w-64 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full p-2 pl-9 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Cari nama atau NIK..."
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

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center text-gray-500">
                        <thead className="text-[10px] text-gray-700 capitalize font-semibold bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-2 rounded-tl-lg text-center">No</th>
                                <th scope="col" className="px-3 py-2 text-center">RT</th>
                                <th scope="col" className="px-3 py-2 text-center">Nama Lengkap</th>
                                <th scope="col" className="px-3 py-2 text-center">No. Kartu Keluarga</th>
                                <th scope="col" className="px-3 py-2 text-center">Jenis Kelamin</th>
                                <th scope="col" className="px-3 py-2 text-center">Tanggal Lahir</th>
                                <th scope="col" className="px-3 py-2 text-center">Usia</th>
                                <th scope="col" className="px-3 py-2 text-center">Nama Ayah</th>
                                <th scope="col" className="px-3 py-2 text-center">Nama Ibu</th>
                                <th scope="col" className="px-3 py-2 rounded-tr-lg text-center">Catatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWarga.length > 0 ? (
                                currentData.map((item, index) => (
                                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors text-center">
                                        <td className="px-3 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className="px-3 py-2">{item.kartu_keluarga?.rt || '-'}</td>
                                        <td className="px-3 py-2 text-center capitalize">
                                            {item.nama_lengkap}
                                        </td>
                                        <td className="px-3 py-2">{item.kartu_keluarga?.nomor_kk || '-'}</td>
                                        <td className="px-3 py-2">{item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {item.tanggal_lahir ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="px-3 py-2">{item.tanggal_lahir ? hitungUsia(item.tanggal_lahir) : '-'}</td>
                                        <td className="px-3 py-2">{item.nama_ayah || '-'}</td>
                                        <td className="px-3 py-2">{item.nama_ibu || '-'}</td>
                                        <td className="px-3 py-2">{item.catatan || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="px-3 py-6 text-center text-gray-500">
                                        {searchTerm ? 'Data kelahiran tidak ditemukan.' : 'Belum ada data kelahiran.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                {filteredWarga.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between rounded-b-xl gap-4 mt-2">
                        <div className="text-xs text-gray-500">
                            Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredWarga.length)}</span> dari <span className="font-medium">{filteredWarga.length}</span> data
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
                                {Array.from({ length: Math.ceil(filteredWarga.length / itemsPerPage) }, (_, i) => i + 1).map(page => {
                                    const totalPages = Math.ceil(filteredWarga.length / itemsPerPage);
                                    if (totalPages > 7) {
                                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                            return <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{page}</button>;
                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="px-2 py-1.5 text-xs text-gray-500">...</span>;
                                        }
                                        return null;
                                    }
                                    return <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>{page}</button>;
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredWarga.length / itemsPerPage)))}
                                disabled={currentPage === Math.ceil(filteredWarga.length / itemsPerPage) || filteredWarga.length === 0}
                                className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === Math.ceil(filteredWarga.length / itemsPerPage) || filteredWarga.length === 0 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </PengurusRWLayout>
    );
}
