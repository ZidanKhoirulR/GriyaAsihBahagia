import React, { useState, useEffect, Fragment } from 'react';
import { Head, router } from '@inertiajs/react';
import { Menu, Transition } from '@headlessui/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import Modal from '@/Components/Modal';
import ToastAlert from '@/Components/ToastAlert';

interface Warga {
    id: number;
    nama_lengkap: string;
    nik: string;
    jenis_kelamin: 'L' | 'P';
    tanggal_lahir: string;
    usia: number | null;
    no_whatsapp: string | null;
    status_perkawinan: string;
    agama: string;
    is_pengurus: boolean;
    jabatan_pengurus: string | null;
    pengurus_id: number | null;
    kartu_keluarga?: { rt: string; rw: string; nomor_kk: string };
}

interface JabatanForm {
    jabatan: string;
    periode_mulai: string;
    periode_selesai: string;
}

export default function PengurusRW({ wargas, totalData, totalPengurus }: { wargas: Warga[]; totalData: number; totalPengurus: number }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'semua' | 'aktif'>('semua');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [modalWarga, setModalWarga] = useState<Warga | null>(null);
    const [jabatanForm, setJabatanForm] = useState<JabatanForm>({ jabatan: '', periode_mulai: '', periode_selesai: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

    const filtered = wargas.filter(w => {
        const s = searchTerm.toLowerCase();
        const matchSearch = !s || w.nama_lengkap.toLowerCase().includes(s) || w.nik.includes(s);
        const matchStatus = filterStatus === 'semua' || (filterStatus === 'aktif' ? w.is_pengurus : !w.is_pengurus);
        return matchSearch && matchStatus;
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openModal = (w: Warga) => {
        setModalWarga(w);
        if (w.is_pengurus) {
            setJabatanForm({ jabatan: w.jabatan_pengurus || '', periode_mulai: '', periode_selesai: '' });
        } else {
            setJabatanForm({ jabatan: '', periode_mulai: new Date().toISOString().split('T')[0], periode_selesai: '' });
        }
    };

    const handleToggle = () => {
        if (!modalWarga) return;
        setIsSubmitting(true);

        if (modalWarga.is_pengurus && modalWarga.pengurus_id) {
            // Nonaktifkan
            router.patch(route('pengurus-rw.kelola-pengurus.toggle', modalWarga.pengurus_id), {}, {
                onSuccess: () => { showToast('Pengurus berhasil dinonaktifkan'); setModalWarga(null); },
                onError: () => showToast('Gagal memperbarui status', 'error'),
                onFinish: () => setIsSubmitting(false),
                preserveScroll: true,
            });
        } else {
            // Aktifkan (store baru)
            router.post(route('pengurus-rw.kelola-pengurus.store'), {
                warga_id: modalWarga.id,
                jabatan: jabatanForm.jabatan,
                tingkat: 'rw',
            }, {
                onSuccess: () => { showToast('Warga berhasil dijadikan Pengurus RW'); setModalWarga(null); },
                onError: () => showToast('Gagal mengaktifkan pengurus', 'error'),
                onFinish: () => setIsSubmitting(false),
                preserveScroll: true,
            });
        }
    };

    return (
        <PengurusRWLayout title="Kelola Pengurus — RW">
            <Head title="Pengurus RW" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Kelola Pengurus RW</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li>Menampilkan seluruh warga yang <strong>masih hidup</strong> dan terdaftar di sistem.</li>
                    <li>Gunakan <strong>toggle</strong> di kolom Status untuk menjadikan atau melepas jabatan warga sebagai Pengurus RW.</li>
                    <li>Saat mengaktifkan, isi <strong>jabatan</strong> terlebih dahulu.</li>
                    <li>Gunakan filter <strong>Pengurus Aktif</strong> untuk melihat daftar pengurus yang sedang menjabat.</li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
                    <div className="relative w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full p-2 pl-9 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Cari nama atau NIK..." />
                    </div>
                    <Menu as="div" className="relative inline-block text-left w-full sm:w-48 z-10">
                        <div>
                            <Menu.Button className="inline-flex w-full justify-between items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-opacity-75 transition-colors duration-200">
                                {filterStatus === 'semua' ? 'Semua Warga' : 'Pengurus Aktif'}
                                <svg className="ml-2 -mr-1 h-5 w-5 text-gray-400 hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => setFilterStatus('semua')}
                                                className={`${active ? 'bg-amber-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium`}
                                            >
                                                Semua Warga
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => setFilterStatus('aktif')}
                                                className={`${active ? 'bg-amber-500 text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium mt-1`}
                                            >
                                                Pengurus Aktif
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs text-left text-gray-500">
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50/80 border-y border-gray-200">
                            <tr>
                                <th className="px-3 py-3 text-center">No</th>
                                <th className="px-3 py-3 text-center">RT</th>
                                <th className="px-3 py-3 text-center">Nama Lengkap</th>
                                <th className="px-3 py-3 text-center">NIK</th>
                                <th className="px-3 py-3 text-center">Jenis Kelamin</th>
                                <th className="px-3 py-3 text-center">Usia</th>
                                <th className="px-3 py-3 text-center">No. WhatsApp</th>
                                <th className="px-3 py-3 text-center">Jabatan</th>
                                <th className="px-3 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length === 0 ? (
                                <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-500">Tidak ada data ditemukan.</td></tr>
                            ) : (
                                currentData.map((w, i) => (
                                    <tr key={w.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                                        <td className="px-3 py-2 text-center">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                                        <td className="px-3 py-2 text-center">{w.kartu_keluarga?.rt || '-'}</td>
                                        <td className="px-3 py-2 text-center capitalize">{w.nama_lengkap}</td>
                                        <td className="px-3 py-2 text-center">{w.nik}</td>
                                        <td className="px-3 py-2 text-center">{w.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                        <td className="px-3 py-2 text-center">{w.usia != null ? `${w.usia} thn` : '-'}</td>
                                        <td className="px-3 py-2 text-center">{w.no_whatsapp || '-'}</td>
                                        <td className="px-3 py-2 text-center">
                                            {w.jabatan_pengurus
                                                ? <span className="capitalize">{w.jabatan_pengurus}</span>
                                                : <span className="text-gray-400">—</span>
                                            }
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {/* Toggle switch */}
                                            <button
                                                onClick={() => openModal(w)}
                                                title={w.is_pengurus ? 'Nonaktifkan sebagai Pengurus RW' : 'Jadikan Pengurus RW'}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${w.is_pengurus ? 'bg-green-500' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${w.is_pengurus ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                    <p className="text-xs text-gray-400">
                        Menampilkan <span className="font-semibold text-gray-600">{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span>–<span className="font-semibold text-gray-600">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> dari <span className="font-semibold text-gray-600">{filtered.length}</span> data
                    </p>
                    {totalPages > 1 && (
                        <div className="flex space-x-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600 transition-colors'}`}>
                                Sebelumnya
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                    return (
                                        <button key={page} onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600'}`}>
                                            {page}
                                        </button>
                                    );
                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={page} className="px-2 py-1.5 text-gray-400 text-xs">...</span>;
                                }
                                return null;
                            })}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-amber-600 transition-colors'}`}>
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Konfirmasi / Isi Jabatan */}
            <Modal show={!!modalWarga} onClose={() => setModalWarga(null)} maxWidth="sm">
                {modalWarga && (
                    <div className="p-6">
                        {modalWarga.is_pengurus ? (
                            <>
                                <h3 className="text-base font-bold text-center text-gray-900 mb-1">Nonaktifkan Pengurus RW?</h3>
                                <p className="text-sm text-center text-gray-500 mb-1"><strong>{modalWarga.nama_lengkap}</strong></p>
                                <p className="text-xs text-center text-gray-400 mb-5">Jabatan: <span className="font-medium text-amber-600">{modalWarga.jabatan_pengurus}</span></p>
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => setModalWarga(null)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                                    <button onClick={handleToggle} disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
                                        {isSubmitting ? 'Memproses...' : 'Nonaktifkan'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base font-bold text-center text-gray-900 mb-1">Jadikan Pengurus RW</h3>
                                <p className="text-sm text-center text-gray-500 mb-4"><strong>{modalWarga.nama_lengkap}</strong></p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Jabatan <span className="text-red-500">*</span></label>
                                        <input type="text" className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            placeholder="Contoh: Ketua RW, Sekretaris, Bendahara"
                                            value={jabatanForm.jabatan} onChange={e => setJabatanForm(p => ({ ...p, jabatan: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="flex justify-center gap-3 mt-5">
                                    <button onClick={() => setModalWarga(null)} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                                    <button onClick={handleToggle} disabled={isSubmitting || !jabatanForm.jabatan}
                                        className="px-4 py-2 text-sm text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors">
                                        {isSubmitting ? 'Memproses...' : 'Jadikan Pengurus'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>

            {toast && <ToastAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </PengurusRWLayout>
    );
}
