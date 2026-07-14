import { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import ToastAlert from '@/Components/ToastAlert';
import Modal from '@/Components/Modal';

interface Metode { id: number; nama_metode: string; nomor_rekening: string | null; }
interface Transaksi {
    id: number; tanggal: string; rt: string; kategori: string;
    metode_transaksi_id: number | null; metode_transaksi?: Metode;
    jenis: 'pemasukan' | 'pengeluaran'; nominal: number;
    slip_struk: string | null; penyetor: string | null; penerima: string | null;
    catatan: string | null; status_validasi: 'menunggu' | 'tervalidasi';
    divalidasi_oleh: string | null; divalidasi_at: string | null;
}

const KATEGORI_PEMASUKAN = ['Iuran Warga', 'Dana Bantuan', 'Sumbangan', 'Lain-lain'];
const KATEGORI_PENGELUARAN = ['Operasional RT', 'Kegiatan Warga', 'Perbaikan Fasilitas', 'Dana Sosial', 'Administrasi', 'Lain-lain'];

const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function ArusKasRt({ transaksi, metode, totalPemasukan, totalPengeluaran, saldo }: {
    transaksi: Transaksi[]; metode: Metode[];
    totalPemasukan: number; totalPengeluaran: number; saldo: number;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrx, setEditingTrx] = useState<Transaksi | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isValidasiModalOpen, setIsValidasiModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const [selectedTrx, setSelectedTrx] = useState<Transaksi | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const showToast = (m: string, t: 'success' | 'error' | 'info' | 'warning' = 'success') => setToast({ message: m, type: t });

    const { data, setData, post, reset, errors, clearErrors } = useForm({
        tanggal: '', rt: '', kategori: '', metode_transaksi_id: '',
        jenis: 'pemasukan' as 'pemasukan' | 'pengeluaran',
        nominal: '', slip_struk: null as File | null,
        penyetor: '', penerima: '', catatan: '', _method: 'POST',
    });

    const openCreate = () => {
        setEditingTrx(null); reset(); setData('_method', 'POST'); clearErrors();
        if (fileRef.current) fileRef.current.value = '';
        setIsModalOpen(true);
    };

    const openEdit = (t: Transaksi) => {
        setEditingTrx(t);
        setData({
            tanggal: t.tanggal?.split('T')[0] || '',
            rt: t.rt, kategori: t.kategori,
            metode_transaksi_id: t.metode_transaksi_id ? String(t.metode_transaksi_id) : '',
            jenis: t.jenis, nominal: String(t.nominal),
            slip_struk: null, penyetor: t.penyetor || '',
            penerima: t.penerima || '', catatan: t.catatan || '', _method: 'POST',
        });
        clearErrors();
        if (fileRef.current) fileRef.current.value = '';
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = editingTrx ? route('pengurus-rw.arus-kas-rt.update', editingTrx.id) : route('pengurus-rw.arus-kas-rt.store');
        post(routeName, {
            onSuccess: () => { setIsModalOpen(false); showToast(editingTrx ? 'Transaksi berhasil diperbarui' : 'Transaksi berhasil ditambahkan'); },
            onError: () => showToast('Gagal menyimpan transaksi', 'error'),
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        if (!selectedTrx) return;
        router.delete(route('pengurus-rw.arus-kas-rt.destroy', selectedTrx.id), {
            onSuccess: () => { setIsDeleteModalOpen(false); setSelectedTrx(null); showToast('Transaksi berhasil dihapus'); },
            onError: () => showToast('Gagal menghapus', 'error'), preserveScroll: true,
        });
    };

    const confirmValidasi = () => {
        if (!selectedTrx) return;
        router.patch(route('pengurus-rw.arus-kas-rt.validasi', selectedTrx.id), {}, {
            onSuccess: () => { setIsValidasiModalOpen(false); setSelectedTrx(null); showToast('Transaksi berhasil divalidasi'); },
            onError: () => showToast('Gagal memvalidasi', 'error'), preserveScroll: true,
        });
    };

    const kategoriList = data.jenis === 'pemasukan' ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

    return (
        <PengurusRWLayout title="Keuangan - Arus Kas RT">
            <Head title="Arus Kas RT" />

            {/* Panduan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Arus Kas RT</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li><span className="inline-block px-2 py-0.5 bg-amber-500 rounded text-xs font-medium text-white">+ Tambah Transaksi</span>: Catat pemasukan atau pengeluaran kas RT beserta slip/struk pembayaran.</li>
                    <li><span className="inline-block px-2 py-0.5 bg-emerald-100 rounded text-xs font-medium text-emerald-700">Validasi (✓)</span>: Klik untuk menandai transaksi sudah diverifikasi oleh pengurus RW.</li>
                    <li><span className="inline-block px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700">Edit (Pensil)</span>: Ubah data transaksi yang sudah ada.</li>
                    <li><span className="inline-block px-2 py-0.5 bg-red-100 rounded text-xs font-medium text-red-700">Hapus (Sampah)</span>: Hapus transaksi secara permanen. <span className="text-red-600 font-medium">Data tidak dapat dikembalikan.</span></li>
                </ul>
            </div>

            {/* Ringkasan Saldo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-500 mb-1">Total Pemasukan</p>
                    <p className="text-xl font-bold text-green-600">{fmt(totalPemasukan)}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-500 mb-1">Total Pengeluaran</p>
                    <p className="text-xl font-bold text-red-500">{fmt(totalPengeluaran)}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-5">
                    <p className="text-xs text-amber-600 mb-1 font-medium">Saldo</p>
                    <p className={`text-xl font-bold ${saldo >= 0 ? 'text-amber-700' : 'text-red-600'}`}>{fmt(saldo)}</p>
                </div>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full sm:w-80 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" /></svg>
                        </div>
                        <input type="text" className="block w-full p-2 pl-9 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500" placeholder="Cari transaksi..." />
                    </div>
                    <button onClick={openCreate} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-medium text-white hover:bg-amber-600 transition-colors whitespace-nowrap">+ Tambah Transaksi</button>
                </div>

                {transaksi.length === 0 ? (
                    <div className="h-52 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 font-medium">Belum ada transaksi.</p>
                        <p className="mt-1 text-sm text-gray-400">Silakan tambahkan data baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-center text-gray-500">
                            <thead className="text-[10px] text-gray-700 font-semibold bg-gray-50">
                                <tr>
                                    {['No','Tanggal','RT','Kategori','Metode','Pemasukan','Pengeluaran','Slip','Penyetor','Penerima','Catatan', 'Divalidasi Oleh','Status','Aksi'].map((h, i) => (
                                        <th key={h} className={`px-2 py-2 ${i === 0 ? 'rounded-tl-lg' : i === 13 ? 'rounded-tr-lg' : ''}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transaksi.map((t, i) => (
                                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-2 py-3">{i + 1}</td>
                                        <td className="px-2 py-3 whitespace-nowrap">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                                        <td className="px-2 py-3">RT {t.rt}</td>
                                        <td className="px-2 py-3 text-left whitespace-nowrap">{t.kategori}</td>
                                        <td className="px-2 py-3">{t.metode_transaksi?.nama_metode || '-'}</td>
                                        <td className="px-2 py-3 font-semibold text-green-600">{t.jenis === 'pemasukan' ? fmt(t.nominal) : '-'}</td>
                                        <td className="px-2 py-3 font-semibold text-red-500">{t.jenis === 'pengeluaran' ? fmt(t.nominal) : '-'}</td>
                                        <td className="px-2 py-3">
                                            {t.slip_struk ? (
                                                <button onClick={() => { setPreviewSrc(`/storage/${t.slip_struk}`); setIsPreviewOpen(true); }} className="mx-auto block">
                                                    <img src={`/storage/${t.slip_struk}`} alt="slip" className="w-10 h-10 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                                                </button>
                                            ) : <span className="text-gray-300">-</span>}
                                        </td>
                                        <td className="px-2 py-3">{t.penyetor || '-'}</td>
                                        <td className="px-2 py-3">{t.penerima || '-'}</td>
                                        <td className="px-2 py-3 max-w-24 truncate">{t.catatan || '-'}</td>
                                        <td className="px-2 py-3">{t.divalidasi_oleh || '-'}</td>
                                        <td className="px-2 py-3">
                                            <span className={`text-[12px] font-medium ${t.status_validasi === 'tervalidasi' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {t.status_validasi === 'tervalidasi' ? 'Tervalidasi' : 'Menunggu'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3">
                                            <div className="flex justify-center gap-1.5">
                                                {t.status_validasi === 'menunggu' && (
                                                    <button onClick={() => { setSelectedTrx(t); setIsValidasiModalOpen(true); }} className="p-1 text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors" title="Validasi">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                    </button>
                                                )}
                                                <button onClick={() => openEdit(t)} className="p-1 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => { setSelectedTrx(t); setIsDeleteModalOpen(true); }} className="p-1 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus">
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
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{editingTrx ? 'Edit Transaksi' : 'Tambah Transaksi Kas RT'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                                <input type="date" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RT <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" placeholder="Contoh: 001" value={data.rt} onChange={e => setData('rt', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis <span className="text-red-500">*</span></label>
                                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.jenis} onChange={e => { setData('jenis', e.target.value as any); setData('kategori', ''); }}>
                                    <option value="pemasukan">Pemasukan</option>
                                    <option value="pengeluaran">Pengeluaran</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
                                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.kategori} onChange={e => setData('kategori', e.target.value)} required>
                                    <option value="">Pilih Kategori</option>
                                    {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Transaksi</label>
                                <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.metode_transaksi_id} onChange={e => setData('metode_transaksi_id', e.target.value)}>
                                    <option value="">Pilih Metode</option>
                                    {metode.map(m => <option key={m.id} value={String(m.id)}>{m.nama_metode}{m.nomor_rekening ? ` - ${m.nomor_rekening}` : ''}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp) <span className="text-red-500">*</span></label>
                                <input type="number" min="0" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" placeholder="0" value={data.nominal} onChange={e => setData('nominal', e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Penyetor</label>
                                <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.penyetor} onChange={e => setData('penyetor', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Penerima</label>
                                <input type="text" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.penerima} onChange={e => setData('penerima', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slip / Struk</label>
                            <input type="file" accept="image/*" ref={fileRef} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" onChange={e => setData('slip_struk', e.target.files ? e.target.files[0] : null)} />
                            {editingTrx?.slip_struk && !data.slip_struk && <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengganti gambar.</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                            <textarea rows={2} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500" value={data.catatan} onChange={e => setData('catatan', e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700">Simpan</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Validasi */}
            <Modal show={isValidasiModalOpen} onClose={() => setIsValidasiModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-emerald-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Validasi Transaksi?</h3>
                    <p className="text-sm text-center text-gray-500 mb-6">Transaksi akan ditandai sebagai tervalidasi oleh Anda.</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setIsValidasiModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button onClick={confirmValidasi} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Ya, Validasi</button>
                    </div>
                </div>
            </Modal>

            {/* Modal Hapus */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Hapus Transaksi?</h3>
                    <p className="text-sm text-center text-gray-500 mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
                        <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Hapus</button>
                    </div>
                </div>
            </Modal>

            {/* Modal Preview Slip */}
            <Modal show={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
                <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Preview Slip / Struk</h3>
                    <img src={previewSrc} alt="Preview Slip" className="w-full rounded-xl object-contain max-h-[70vh]" />
                    <div className="mt-4 flex justify-end">
                        <button onClick={() => setIsPreviewOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Tutup</button>
                    </div>
                </div>
            </Modal>

            {toast && <ToastAlert message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </PengurusRWLayout>
    );
}
