import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import ToastAlert from '@/Components/ToastAlert';
import Modal from '@/Components/Modal';

interface Pengumuman {
    id: number;
    judul: string;
    isi_pengumuman: string;
    tanggal_berlaku: string | null;
    status: 'aktif' | 'nonaktif';
    created_at: string;
}

export default function Pengumuman({ pengumuman }: { pengumuman: Pengumuman[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPengumuman, setEditingPengumuman] = useState<Pengumuman | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<Pengumuman | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setToast({ message, type });
    };

    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors } = useForm({
        judul: '',
        isi_pengumuman: '',
        tanggal_berlaku: '',
        status: 'aktif' as 'aktif' | 'nonaktif',
    });

    const openCreateModal = () => {
        setEditingPengumuman(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (p: Pengumuman) => {
        setEditingPengumuman(p);
        setData({
            judul: p.judul,
            isi_pengumuman: p.isi_pengumuman,
            tanggal_berlaku: p.tanggal_berlaku ? p.tanggal_berlaku.split('T')[0] : '',
            status: p.status,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPengumuman) {
            put(route('pengurus-rw.pengumuman.update', editingPengumuman.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    showToast('Pengumuman berhasil diperbarui', 'success');
                },
                onError: () => showToast('Gagal memperbarui pengumuman', 'error'),
                preserveScroll: true,
            });
        } else {
            post(route('pengurus-rw.pengumuman.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    showToast('Pengumuman berhasil ditambahkan', 'success');
                },
                onError: () => showToast('Gagal menambahkan pengumuman', 'error'),
                preserveScroll: true,
            });
        }
    };

    const openDeleteModal = (p: Pengumuman) => {
        setSelectedForDelete(p);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedForDelete) {
            destroy(route('pengurus-rw.pengumuman.destroy', selectedForDelete.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedForDelete(null);
                    showToast('Pengumuman berhasil dihapus', 'success');
                },
                onError: () => showToast('Gagal menghapus pengumuman', 'error'),
                preserveScroll: true,
            });
        }
    };

    return (
        <PengurusRWLayout title="Papan Informasi - Pengumuman">
            <Head title="Manajemen Pengumuman" />

            {/* Panduan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Pengumuman</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-amber-500 rounded text-xs font-medium text-white cursor-default align-baseline">
                            + Tambah Pengumuman
                        </span>: Gunakan tombol ini untuk membuat pengumuman baru yang akan ditampilkan di halaman beranda.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 cursor-default align-baseline">
                            Edit (Pensil)
                        </span>: Klik tombol ini untuk mengubah judul, isi, tanggal berlaku, atau status pengumuman yang sudah ada.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-red-100 rounded text-xs font-medium text-red-700 cursor-default align-baseline">
                            Hapus (Sampah)
                        </span>: Klik tombol ini untuk menghapus pengumuman. <span className="text-red-600 font-medium">Data yang dihapus tidak dapat dikembalikan.</span>
                    </li>
                    <li className="leading-relaxed">
                        Atur status pengumuman menjadi <span className="inline-block px-2 py-0.5 bg-green-100 rounded text-xs font-medium text-green-700 cursor-default align-baseline">Aktif</span> agar tampil di beranda, atau <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600 cursor-default align-baseline">Nonaktif</span> untuk menyembunyikannya sementara.
                    </li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full sm:w-80 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" className="block w-full p-2 pl-9 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500" placeholder="Cari pengumuman..." />
                    </div>
                    <div className="flex space-x-3 w-full sm:w-auto justify-end">
                        <button onClick={openCreateModal} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-medium text-white hover:bg-amber-600 transition-colors inline-block whitespace-nowrap">
                            + Tambah Pengumuman
                        </button>
                    </div>
                </div>

                {pengumuman.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 font-medium">Belum ada pengumuman.</p>
                        <p className="mt-1">Silakan tambahkan data baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-center text-gray-500">
                            <thead className="text-[10px] text-gray-700 capitalize font-semibold bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-3 py-2 rounded-tl-lg text-center">Judul</th>
                                    <th scope="col" className="px-3 py-2 text-center">Isi Pengumuman</th>
                                    <th scope="col" className="px-3 py-2 text-center">Tanggal Berlaku</th>
                                    <th scope="col" className="px-3 py-2 text-center">Status</th>
                                    <th scope="col" className="px-3 py-2 rounded-tr-lg text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pengumuman.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-3 font-medium text-gray-900">{p.judul}</td>
                                        <td className="px-3 py-3 text-left max-w-md truncate">{p.isi_pengumuman}</td>
                                        <td className="px-3 py-3">{p.tanggal_berlaku ? new Date(p.tanggal_berlaku).toLocaleDateString('id-ID') : '-'}</td>
                                        <td className="px-3 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${p.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => openEditModal(p)} className="p-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => openDeleteModal(p)} className="p-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingPengumuman ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pengumuman</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                value={data.judul}
                                onChange={e => setData('judul', e.target.value)}
                                required
                            />
                            {errors.judul && <p className="text-sm text-red-600 mt-1">{errors.judul}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pengumuman</label>
                            <textarea
                                rows={4}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                value={data.isi_pengumuman}
                                onChange={e => setData('isi_pengumuman', e.target.value)}
                                required
                            />
                            {errors.isi_pengumuman && <p className="text-sm text-red-600 mt-1">{errors.isi_pengumuman}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berlaku (Opsional)</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    value={data.tanggal_berlaku}
                                    onChange={e => setData('tanggal_berlaku', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as 'aktif' | 'nonaktif')}
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Hapus Pengumuman?</h3>
                    <p className="text-sm text-center text-gray-500 mb-6">
                        Apakah Anda yakin ingin menghapus pengumuman ini? Data yang sudah dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Toast Alert */}
            {toast && (
                <ToastAlert
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </PengurusRWLayout>
    );
}
