import { Head } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Fungsi helper untuk menghitung umur
const hitungUmur = (tanggalLahir: string) => {
    if (!tanggalLahir) return '-';
    const hariIni = new Date();
    const lahir = new Date(tanggalLahir);
    let umur = hariIni.getFullYear() - lahir.getFullYear();
    const m = hariIni.getMonth() - lahir.getMonth();
    if (m < 0 || (m === 0 && hariIni.getDate() < lahir.getDate())) {
        umur--;
    }
    return `${umur} Tahun`;
};

// Fungsi helper format tanggal
const formatTanggal = (tanggal: string) => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

export default function Index({ wargas }: { wargas: any[] }) {
    const [selectedWarga, setSelectedWarga] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRt, setFilterRt] = useState('');

    const availableRts = Array.from(new Set(wargas.map(w => w.kartu_keluarga?.rt).filter(Boolean))).sort();

    const filteredWargas = wargas.filter(warga => {
        const matchName = warga.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRt = filterRt === '' ? true : String(warga.kartu_keluarga?.rt || '') === filterRt;
        return matchName && matchRt;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRt]);

    const totalPages = Math.ceil(filteredWargas.length / itemsPerPage);
    const currentData = filteredWargas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <WargaLayout title="Direktori Warga">
            <Head title="Direktori Warga" />

            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                <div className="w-full sm:w-72 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari nama warga..."
                        className="w-full pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl shadow-sm text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select
                        className="w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl shadow-sm text-sm"
                        value={filterRt}
                        onChange={(e) => setFilterRt(e.target.value)}
                    >
                        <option value="">Semua RT</option>
                        {availableRts.map(rt => (
                            <option key={rt as string} value={rt as string}>RT {rt}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid Warga */}
            {currentData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {currentData.map((warga) => (
                        <div key={warga.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 flex flex-col transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden border border-amber-200">
                                    {warga.user?.foto_profile_url ? (
                                        <img src={warga.user.foto_profile_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        warga.nama_lengkap.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 font-semibold truncate" title={warga.nama_lengkap}>
                                        {warga.nama_lengkap}
                                    </h3>
                                    <p className="text-sm text-gray-500 truncate">RT {warga.kartu_keluarga?.rt || '-'}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 flex-1 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Umur</span>
                                    <span className="font-medium text-gray-900">{hitungUmur(warga.tanggal_lahir)}</span>
                                </div>
                                <div className="flex items-start justify-between text-sm gap-4">
                                    <span className="text-gray-500 whitespace-nowrap">Pekerjaan</span>
                                    <span className="font-medium text-gray-900 text-right line-clamp-2" title={warga.jenis_pekerjaan}>
                                        {warga.jenis_pekerjaan || '-'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto pt-1 text-center sm:text-right">
                                <button
                                    onClick={() => setSelectedWarga(warga)}
                                    className="text-amber-600 hover:text-amber-700 font-medium text-sm underline transition-colors focus:outline-none"
                                >
                                    Lihat Selengkapnya
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                    Tidak ada data warga ditemukan.
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <span className="text-sm text-gray-700">
                        Menampilkan <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredWargas.length)}</span> dari <span className="font-semibold text-gray-900">{filteredWargas.length}</span> data
                    </span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600 transition-colors'
                            }`}
                        >
                            Sebelumnya
                        </button>
                        
                        <div className="hidden sm:flex space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                // Show first, last, current, and adjacent pages
                                if (
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                                                currentPage === page
                                                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-2 py-1.5 text-gray-400">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        <div className="sm:hidden flex items-center px-2 text-sm font-medium text-gray-700">
                            {currentPage} / {totalPages}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600 transition-colors'
                            }`}
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Detail Warga */}
            <Transition appear show={!!selectedWarga} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSelectedWarga(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 md:p-8 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-6 pb-3 border-b border-gray-100">
                                        Detail Informasi Warga
                                    </Dialog.Title>
                                    
                                    {selectedWarga && (
                                        <div className="mt-2 space-y-6">
                                            <div className="flex items-center gap-5 mb-2">
                                                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-3xl flex-shrink-0 overflow-hidden border-2 border-amber-200">
                                                    {selectedWarga.user?.foto_profile_url ? (
                                                        <img src={selectedWarga.user.foto_profile_url} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        selectedWarga.nama_lengkap.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-bold text-gray-900">{selectedWarga.nama_lengkap}</h4>
                                                    <p className="text-md text-gray-500 mt-1">RT {selectedWarga.kartu_keluarga?.rt || '-'}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Jenis Kelamin</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.jenis_kelamin === 'L' ? 'Laki-laki' : (selectedWarga.jenis_kelamin === 'P' ? 'Perempuan' : '-')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Umur</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{hitungUmur(selectedWarga.tanggal_lahir)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Tempat Lahir</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.tempat_lahir || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Lahir</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{formatTanggal(selectedWarga.tanggal_lahir)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Agama</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.agama || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Pendidikan</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.pendidikan || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Jenis Pekerjaan</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.jenis_pekerjaan || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Status Perkawinan</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.status_perkawinan || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Status Hubungan dlm Keluarga</p>
                                                    <p className="text-sm text-gray-900 font-semibold">{selectedWarga.shdk || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-xl border border-transparent bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                                            onClick={() => setSelectedWarga(null)}
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </WargaLayout>
    );
}
