import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PengurusRTLayout from '@/Layouts/PengurusRTLayout';
import ToastAlert from '@/Components/ToastAlert';
import Modal from '@/Components/Modal';

const BANK_LIST = [
    'BCA', 'BRI', 'BNI', 'Mandiri', 'BSI (Bank Syariah Indonesia)',
    'CIMB Niaga', 'Danamon', 'Permata Bank', 'BTN', 'BCA Syariah',
    'BRI Syariah', 'Bank Mega', 'Maybank', 'OCBC NISP', 'Bank Jago',
    'Jenius (BTPN)', 'Allo Bank', 'SeaBank', 'Bank Neo Commerce',
    'Bank BJB', 'Bank BPD Jatim', 'Bank BPD Jateng', 'Bank BPD DIY',
    'Bank BPD Bali', 'Bank BPD Sulselbar', 'Bank Jakarta', 'Bank Sulut',
    'Bank BPD Aceh', 'Bank BPD Sumut', 'Bank BPD Riau Kepri',
    'Bank BPD Sumsel Babel', 'Bank BPD Lampung', 'Bank BPD Kalbar',
    'Bank BPD Kalteng', 'Bank BPD Kalimantan Timur', 'Bank BPD Kalteng',
    'Bank BPD Sultra', 'Bank BPD Sulteng', 'Bank BPD Sulutgo',
    'Bank BPD Maluku Malut', 'Bank BPD Papua', 'Bank BPD NTB Syariah', 'Bank BPD NTT',
];

const EWALLET_LIST = [
    'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja',
    'Astra Pay', 'Blu by BCA', 'Jenius Pay', 'Sakuku',
    'TrueMoney', 'Doku Wallet', 'iSaku', 'Paydia', 'Flip',
];

interface MetodeTransaksi {
    id: number;
    nama_metode: string;
    nomor_rekening: string | null;
    atas_nama: string | null;
    keterangan: string | null;
    is_aktif: boolean;
}

export default function MetodeTransaksi({ metode }: { metode: MetodeTransaksi[] }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMetode, setEditingMetode] = useState<MetodeTransaksi | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<MetodeTransaksi | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const [jenisMetode, setJenisMetode] = useState<'bank' | 'ewallet' | ''>('');

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => setToast({ message, type });

    const { data, setData, post, put, reset, errors, clearErrors } = useForm({
        nama_metode: '',
        nomor_rekening: '',
        atas_nama: '',
        keterangan: '',
        is_aktif: true as boolean,
    });

    const openCreateModal = () => {
        setEditingMetode(null);
        reset();
        setData('is_aktif', true);
        setJenisMetode('');
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (m: MetodeTransaksi) => {
        setEditingMetode(m);
        setData({
            nama_metode: m.nama_metode,
            nomor_rekening: m.nomor_rekening || '',
            atas_nama: m.atas_nama || '',
            keterangan: m.keterangan || '',
            is_aktif: m.is_aktif,
        });
        // Deteksi jenis berdasarkan nama yang tersimpan
        const isEwallet = EWALLET_LIST.some(e => e.toLowerCase() === m.nama_metode.toLowerCase());
        setJenisMetode(isEwallet ? 'ewallet' : 'bank');
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMetode) {
            put(route('pengurus-rt.metode-transaksi.update', editingMetode.id), {
                onSuccess: () => { setIsModalOpen(false); showToast('Metode transaksi berhasil diperbarui', 'success'); },
                onError: () => showToast('Gagal memperbarui metode transaksi', 'error'),
                preserveScroll: true,
            });
        } else {
            post(route('pengurus-rt.metode-transaksi.store'), {
                onSuccess: () => { setIsModalOpen(false); showToast('Metode transaksi berhasil ditambahkan', 'success'); },
                onError: () => showToast('Gagal menambahkan metode transaksi', 'error'),
                preserveScroll: true,
            });
        }
    };

    const confirmDelete = () => {
        if (selectedForDelete) {
            router.delete(route('pengurus-rt.metode-transaksi.destroy', selectedForDelete.id), {
                onSuccess: () => { setIsDeleteModalOpen(false); setSelectedForDelete(null); showToast('Metode transaksi berhasil dihapus', 'success'); },
                onError: () => showToast('Gagal menghapus metode transaksi', 'error'),
                preserveScroll: true,
            });
        }
    };

    return (
        <PengurusRTLayout title="Keuangan - Metode Transaksi">
            <Head title="Metode Transaksi RW" />

            {/* Panduan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Metode Transaksi</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-amber-500 rounded text-xs font-medium text-white cursor-default align-baseline">+ Tambah Metode</span>: Tambahkan rekening bank, dompet digital, atau metode pembayaran tunai yang digunakan oleh RW.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 cursor-default align-baseline">Edit (Pensil)</span>: Ubah detail metode transaksi seperti nomor rekening atau nama pemilik rekening.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-red-100 rounded text-xs font-medium text-red-700 cursor-default align-baseline">Hapus (Sampah)</span>: Hapus metode transaksi. <span className="text-red-600 font-medium">Pastikan metode tidak sedang digunakan di transaksi arus kas.</span>
                    </li>
                </ul>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full sm:w-80 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" className="block w-full p-2 pl-9 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500" placeholder="Cari metode transaksi..." />
                    </div>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-medium text-white hover:bg-amber-600 transition-colors whitespace-nowrap">
                        + Tambah Metode
                    </button>
                </div>

                {metode.length === 0 ? (
                    <div className="h-52 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 font-medium">Belum ada metode transaksi.</p>
                        <p className="mt-1 text-sm text-gray-400">Silakan tambahkan data baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-center text-gray-500">
                            <thead className="text-[10px] text-gray-700 capitalize font-semibold bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 rounded-tl-lg">No</th>
                                    <th className="px-3 py-2">Nama Metode</th>
                                    <th className="px-3 py-2">Nomor Rekening</th>
                                    <th className="px-3 py-2">Atas Nama</th>
                                    <th className="px-3 py-2 rounded-tr-lg">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {metode.map((m, i) => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-3 py-3">{i + 1}</td>
                                        <td className="px-3 py-3 font-semibold text-gray-800">
                                            {m.nama_metode}
                                        </td>
                                        <td className="px-3 py-3">{m.nomor_rekening || '-'}</td>
                                        <td className="px-3 py-3">{m.atas_nama || '-'}</td>

                                        <td className="px-3 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEditModal(m)} className="p-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => { setSelectedForDelete(m); setIsDeleteModalOpen(true); }} className="p-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus">
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

            {/* Modal Tambah/Edit */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{editingMetode ? 'Edit Metode Transaksi' : 'Tambah Metode Transaksi'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Jenis Metode Transfer */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Metode Transfer <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    value={jenisMetode}
                                    onChange={e => {
                                        setJenisMetode(e.target.value as 'bank' | 'ewallet' | '');
                                        setData('nama_metode', '');
                                    }}
                                    required
                                >
                                    <option value="">Pilih Metode Transfer</option>
                                    <option value="bank">Bank</option>
                                    <option value="ewallet">E-Wallet</option>
                                </select>
                            </div>
                            {/* Nama Bank/E-Wallet (muncul setelah jenis dipilih) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    value={data.nama_metode}
                                    onChange={e => setData('nama_metode', e.target.value)}
                                    disabled={!jenisMetode}
                                    required
                                >
                                    <option value="">{jenisMetode ? 'Pilih nama bank/ewallet' : 'Pilih Metode Transfer Dahulu'}</option>
                                    {(jenisMetode === 'bank' ? BANK_LIST : jenisMetode === 'ewallet' ? EWALLET_LIST : []).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                                {errors.nama_metode && <p className="text-xs text-red-600 mt-1">{errors.nama_metode}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" placeholder="Masukkan nomor rekening" value={data.nomor_rekening} onChange={e => setData('nomor_rekening', e.target.value)} required />
                                {errors.nomor_rekening && <p className="text-xs text-red-600 mt-1">{errors.nomor_rekening}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" placeholder="Nama pemilik rekening" value={data.atas_nama} onChange={e => setData('atas_nama', e.target.value)} required />
                                {errors.atas_nama && <p className="text-xs text-red-600 mt-1">{errors.atas_nama}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700">Simpan</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Hapus */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Hapus Metode Transaksi?</h3>
                    <p className="text-sm text-center text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Hapus</button>
                    </div>
                </div>
            </Modal>

            {toast && <ToastAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </PengurusRTLayout>
    );
}
