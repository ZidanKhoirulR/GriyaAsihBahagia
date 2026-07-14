import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import ToastAlert from '@/Components/ToastAlert';
import Modal from '@/Components/Modal';

interface Berita {
    id: number;
    judul: string;
    gambar: string | null;
    isi_kalimat: string;
    tanggal_upload: string;
    created_at: string;
}

export default function Berita({ berita }: { berita: Berita[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<Berita | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setToast({ message, type });
    };

    const { data, setData, post, delete: destroy, reset, errors, clearErrors } = useForm({
        judul: '',
        isi_kalimat: '',
        tanggal_upload: '',
        gambar: null as File | null,
        _method: 'POST',
    });

    const openCreateModal = () => {
        setEditingBerita(null);
        reset();
        setData('_method', 'POST');
        clearErrors();
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const openEditModal = (b: Berita) => {
        setEditingBerita(b);
        setData({
            judul: b.judul,
            isi_kalimat: b.isi_kalimat,
            tanggal_upload: b.tanggal_upload ? b.tanggal_upload.split('T')[0] : '',
            gambar: null,
            _method: 'POST', // Inertia workaround for file uploads with PUT
        });
        clearErrors();
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingBerita) {
            post(route('pengurus-rw.berita.update', editingBerita.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    showToast('Berita berhasil diperbarui', 'success');
                },
                onError: () => showToast('Gagal memperbarui berita', 'error'),
                preserveScroll: true,
            });
        } else {
            post(route('pengurus-rw.berita.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    showToast('Berita berhasil ditambahkan', 'success');
                },
                onError: () => showToast('Gagal menambahkan berita', 'error'),
                preserveScroll: true,
            });
        }
    };

    const openDeleteModal = (b: Berita) => {
        setSelectedForDelete(b);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedForDelete) {
            destroy(route('pengurus-rw.berita.destroy', selectedForDelete.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedForDelete(null);
                    showToast('Berita berhasil dihapus', 'success');
                },
                onError: () => showToast('Gagal menghapus berita', 'error'),
                preserveScroll: true,
            });
        }
    };

    return (
        <PengurusRWLayout title="Papan Informasi - Berita Warga">
            <Head title="Manajemen Berita Warga" />

            {/* Panduan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Berita Warga</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-amber-500 rounded text-xs font-medium text-white cursor-default align-baseline">
                            + Tambah Berita
                        </span>: Gunakan tombol ini untuk menambahkan berita atau kegiatan warga baru beserta gambar, judul, tanggal, dan isi berita.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 cursor-default align-baseline">
                            Edit (Pensil)
                        </span>: Klik tombol ini untuk mengubah data berita yang sudah ada. Kosongkan kolom gambar jika tidak ingin mengganti foto.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-red-100 rounded text-xs font-medium text-red-700 cursor-default align-baseline">
                            Hapus (Sampah)
                        </span>: Klik tombol ini untuk menghapus berita beserta gambarnya secara permanen. <span className="text-red-600 font-medium">Data yang dihapus tidak dapat dikembalikan.</span>
                    </li>
                    <li className="leading-relaxed">
                        Berita yang ditambahkan akan otomatis tampil di bagian <span className="inline-block px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-xs font-medium text-amber-700 cursor-default align-baseline">Berita Terkini</span> pada halaman beranda.
                    </li>
                </ul>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Daftar Berita Warga</h2>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium text-sm flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Berita
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {berita.length > 0 ? berita.map((b) => (
                    <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="h-48 bg-gray-100 relative">
                            {b.gambar ? (
                                <img src={`/storage/${b.gambar}`} alt={b.judul} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="text-xs text-gray-500 mb-2 font-medium">
                                {new Date(b.tanggal_upload).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{b.judul}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{b.isi_kalimat}</p>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                <button
                                    onClick={() => openEditModal(b)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => openDeleteModal(b)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                        Belum ada data berita warga.
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingBerita ? 'Edit Berita Warga' : 'Tambah Berita Warga'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita / Kegiatan</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Upload</label>
                            <input
                                type="date"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                value={data.tanggal_upload}
                                onChange={e => setData('tanggal_upload', e.target.value)}
                                required
                            />
                            {errors.tanggal_upload && <p className="text-sm text-red-600 mt-1">{errors.tanggal_upload}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gambar (Opsional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                onChange={e => setData('gambar', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.gambar && <p className="text-sm text-red-600 mt-1">{errors.gambar}</p>}
                            {editingBerita && editingBerita.gambar && !data.gambar && (
                                <p className="text-xs text-gray-500 mt-2">Biarkan kosong jika tidak ingin mengubah gambar.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Berita</label>
                            <textarea
                                rows={6}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                value={data.isi_kalimat}
                                onChange={e => setData('isi_kalimat', e.target.value)}
                                required
                            />
                            {errors.isi_kalimat && <p className="text-sm text-red-600 mt-1">{errors.isi_kalimat}</p>}
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
                    <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Hapus Berita?</h3>
                    <p className="text-sm text-center text-gray-500 mb-6">
                        Apakah Anda yakin ingin menghapus berita ini? Data yang sudah dihapus tidak dapat dikembalikan.
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
