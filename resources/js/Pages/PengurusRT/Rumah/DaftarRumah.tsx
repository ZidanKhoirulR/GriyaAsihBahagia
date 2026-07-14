import { Head, useForm, router } from '@inertiajs/react';
import PengurusRTLayout from '@/Layouts/PengurusRTLayout';
import { useState, useEffect, FormEventHandler } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import ToastAlert from '@/Components/ToastAlert';
import axios from 'axios';

interface WilayahItem {
    id: number;
    kode: string;
    nama: string;
    kode_kabkota?: string;
    kode_kecamatan?: string;
    kodepos?: string;
}

interface RumahItem {
    id: number;
    rt: string;
    rw: string;
    alamat_detail: string;
    provinsi_id: string | null;
    kabupaten_id: string | null;
    kecamatan_id: string | null;
    kelurahan_id: string | null;
    kodepos: string | null;
    foto_rumah: string | null;
    catatan: string | null;
    kartu_keluarga?: any[];
}

export default function DaftarRumah({ rumahs, eksporUrl, currentRt }: { rumahs: RumahItem[], eksporUrl: string, currentRt: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRumah, setSelectedRumah] = useState<RumahItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setToast({ message, type });
    };

    // Wilayah state (shared for both add & edit)
    const [provinsiList, setProvinsiList] = useState<WilayahItem[]>([]);
    const [kabupatenList, setKabupatenList] = useState<WilayahItem[]>([]);
    const [kecamatanList, setKecamatanList] = useState<WilayahItem[]>([]);
    const [kelurahanList, setKelurahanList] = useState<WilayahItem[]>([]);
    const [kodeposList, setKodeposList] = useState<string[]>([]);

    // ===== Form: TAMBAH =====
    const { data, setData, post, processing, errors, reset } = useForm({
        foto_rumah: null as File | null,
        rt: currentRt || '',
        rw: '040',
        provinsi_id: '',
        kabupaten_id: '',
        kecamatan_id: '',
        kelurahan_id: '',
        kodepos: '',
        alamat_detail: '',
        catatan: '',
    });

    // ===== Form: EDIT =====
    const editForm = useForm({
        foto_rumah: null as File | null,
        rt: '',
        rw: '040',
        provinsi_id: '',
        kabupaten_id: '',
        kecamatan_id: '',
        kelurahan_id: '',
        kodepos: '',
        alamat_detail: '',
        catatan: '',
        _method: 'PUT',
    });

    // Load provinsi saat modal dibuka
    useEffect(() => {
        if ((isModalOpen || isEditModalOpen) && provinsiList.length === 0) {
            axios.get('/api/wilayah/provinsi').then(res => setProvinsiList(res.data));
        }
    }, [isModalOpen, isEditModalOpen]);

    // ========== Handlers CASCADE TAMBAH ==========
    const handleProvinsiChange = (idProvinsi: string) => {
        const selected = provinsiList.find(p => String(p.id) === idProvinsi);
        const kode = selected?.kode || '';
        setData(prev => ({ ...prev, provinsi_id: idProvinsi, kabupaten_id: '', kecamatan_id: '', kelurahan_id: '', kodepos: '' }));
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
        if (kode) axios.get('/api/wilayah/kabupaten', { params: { kode_provinsi: kode } }).then(res => setKabupatenList(res.data));
    };
    const handleKabupatenChange = (idKabkota: string) => {
        const selected = kabupatenList.find(k => String(k.id) === idKabkota);
        const kode = selected?.kode_kabkota || selected?.kode || '';
        setData(prev => ({ ...prev, kabupaten_id: idKabkota, kecamatan_id: '', kelurahan_id: '', kodepos: '' }));
        setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
        if (kode) axios.get('/api/wilayah/kecamatan', { params: { kode_kabkota: kode } }).then(res => setKecamatanList(res.data));
    };
    const handleKecamatanChange = (idKecamatan: string) => {
        const selected = kecamatanList.find(k => String(k.id) === idKecamatan);
        const kode = selected?.kode_kecamatan || selected?.kode || '';
        setData(prev => ({ ...prev, kecamatan_id: idKecamatan, kelurahan_id: '', kodepos: '' }));
        setKelurahanList([]); setKodeposList([]);
        if (kode) axios.get('/api/wilayah/kelurahan', { params: { kode_kecamatan: kode } }).then(res => {
            setKelurahanList(res.data);
            const unique = [...new Set(res.data.map((i: WilayahItem) => i.kodepos).filter(Boolean))] as string[];
            setKodeposList(unique);
        });
    };
    const handleKelurahanChange = (idKelurahan: string) => {
        const selected = kelurahanList.find(k => String(k.id) === idKelurahan);
        setData(prev => ({ ...prev, kelurahan_id: idKelurahan, kodepos: selected?.kodepos || prev.kodepos }));
    };

    // ========== Handlers CASCADE EDIT ==========
    const handleEditProvinsiChange = (idProvinsi: string) => {
        const selected = provinsiList.find(p => String(p.id) === idProvinsi);
        const kode = selected?.kode || '';
        editForm.setData(prev => ({ ...prev, provinsi_id: idProvinsi, kabupaten_id: '', kecamatan_id: '', kelurahan_id: '', kodepos: '' }));
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
        if (kode) axios.get('/api/wilayah/kabupaten', { params: { kode_provinsi: kode } }).then(res => setKabupatenList(res.data));
    };
    const handleEditKabupatenChange = (idKabkota: string) => {
        const selected = kabupatenList.find(k => String(k.id) === idKabkota);
        const kode = selected?.kode_kabkota || selected?.kode || '';
        editForm.setData(prev => ({ ...prev, kabupaten_id: idKabkota, kecamatan_id: '', kelurahan_id: '', kodepos: '' }));
        setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
        if (kode) axios.get('/api/wilayah/kecamatan', { params: { kode_kabkota: kode } }).then(res => setKecamatanList(res.data));
    };
    const handleEditKecamatanChange = (idKecamatan: string) => {
        const selected = kecamatanList.find(k => String(k.id) === idKecamatan);
        const kode = selected?.kode_kecamatan || selected?.kode || '';
        editForm.setData(prev => ({ ...prev, kecamatan_id: idKecamatan, kelurahan_id: '', kodepos: '' }));
        setKelurahanList([]); setKodeposList([]);
        if (kode) axios.get('/api/wilayah/kelurahan', { params: { kode_kecamatan: kode } }).then(res => {
            setKelurahanList(res.data);
            const unique = [...new Set(res.data.map((i: WilayahItem) => i.kodepos).filter(Boolean))] as string[];
            setKodeposList(unique);
        });
    };
    const handleEditKelurahanChange = (idKelurahan: string) => {
        const selected = kelurahanList.find(k => String(k.id) === idKelurahan);
        editForm.setData(prev => ({ ...prev, kelurahan_id: idKelurahan, kodepos: selected?.kodepos || prev.kodepos }));
    };

    // ========== OPEN/CLOSE MODALS ==========
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
    };

    const openEditModal = (rumah: RumahItem) => {
        setSelectedRumah(rumah);
        editForm.setData({
            foto_rumah: null,
            rt: rumah.rt,
            rw: rumah.rw,
            provinsi_id: String(rumah.provinsi_id || ''),
            kabupaten_id: String(rumah.kabupaten_id || ''),
            kecamatan_id: String(rumah.kecamatan_id || ''),
            kelurahan_id: String(rumah.kelurahan_id || ''),
            kodepos: rumah.kodepos || '',
            alamat_detail: rumah.alamat_detail,
            catatan: rumah.catatan || '',
            _method: 'PUT',
        });
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
        setIsEditModalOpen(true);

        // Hydrate dropdowns
        if (rumah.provinsi_id) {
            const provKode = provinsiList.find(p => String(p.id) === String(rumah.provinsi_id))?.kode;
            if (provKode) {
                axios.get('/api/wilayah/kabupaten', { params: { kode_provinsi: provKode } }).then(res => {
                    setKabupatenList(res.data);
                    if (rumah.kabupaten_id) {
                        const kabKode = res.data.find((k: WilayahItem) => String(k.id) === String(rumah.kabupaten_id))?.kode_kabkota || res.data.find((k: WilayahItem) => String(k.id) === String(rumah.kabupaten_id))?.kode;
                        if (kabKode) {
                            axios.get('/api/wilayah/kecamatan', { params: { kode_kabkota: kabKode } }).then(res2 => {
                                setKecamatanList(res2.data);
                                if (rumah.kecamatan_id) {
                                    const kecKode = res2.data.find((k: WilayahItem) => String(k.id) === String(rumah.kecamatan_id))?.kode_kecamatan || res2.data.find((k: WilayahItem) => String(k.id) === String(rumah.kecamatan_id))?.kode;
                                    if (kecKode) {
                                        axios.get('/api/wilayah/kelurahan', { params: { kode_kecamatan: kecKode } }).then(res3 => {
                                            setKelurahanList(res3.data);
                                            const unique = [...new Set(res3.data.map((i: WilayahItem) => i.kodepos).filter(Boolean))] as string[];
                                            setKodeposList(unique);
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedRumah(null);
        editForm.reset();
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
    };

    const openDeleteModal = (rumah: RumahItem) => {
        setSelectedRumah(rumah);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setSelectedRumah(null); };

    // ========== SUBMIT ==========
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pengurus-rt.rumah.store'), {
            onSuccess: () => { closeModal(); showToast('Data rumah berhasil disimpan.', 'success'); },
            onError: () => showToast('Gagal menyimpan data. Periksa kembali isian form.', 'error'),
            preserveScroll: true,
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedRumah) return;
        editForm.post(route('pengurus-rt.rumah.update', selectedRumah.id), {
            onSuccess: () => { closeEditModal(); showToast('Data rumah berhasil diperbarui.', 'success'); },
            onError: () => showToast('Gagal memperbarui data. Periksa kembali isian form.', 'error'),
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        if (!selectedRumah) return;
        router.delete(route('pengurus-rt.rumah.destroy', selectedRumah.id), {
            onSuccess: () => { closeDeleteModal(); showToast('Data rumah berhasil dihapus.', 'success'); },
            onError: () => showToast('Gagal menghapus data.', 'error'),
            preserveScroll: true,
        });
    };

    const selectClass = "mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm";

    const renderWilayahDropdowns = (
        formData: typeof data | typeof editForm.data,
        onProvinsi: (v: string) => void,
        onKabupaten: (v: string) => void,
        onKecamatan: (v: string) => void,
        onKelurahan: (v: string) => void,
        onKodepos: (v: string) => void
    ) => (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
                <InputLabel htmlFor="provinsi" value="Provinsi" className="!text-xs" required />
                <select id="provinsi" className={selectClass} value={formData.provinsi_id} onChange={e => onProvinsi(e.target.value)} required>
                    <option value="">Pilih Provinsi</option>
                    {provinsiList.map(item => <option key={item.id} value={String(item.id)}>{item.nama}</option>)}
                </select>
            </div>
            <div>
                <InputLabel htmlFor="kabupaten" value="Kab/Kota" className="!text-xs" required />
                <select id="kabupaten" className={selectClass} value={formData.kabupaten_id} onChange={e => onKabupaten(e.target.value)} disabled={kabupatenList.length === 0} required>
                    <option value="">Pilih Kab/Kota</option>
                    {kabupatenList.map(item => <option key={item.id} value={String(item.id)}>{item.nama}</option>)}
                </select>
            </div>
            <div>
                <InputLabel htmlFor="kecamatan" value="Kecamatan" className="!text-xs" required />
                <select id="kecamatan" className={selectClass} value={formData.kecamatan_id} onChange={e => onKecamatan(e.target.value)} disabled={kecamatanList.length === 0} required>
                    <option value="">Pilih Kecamatan</option>
                    {kecamatanList.map(item => <option key={item.id} value={String(item.id)}>{item.nama}</option>)}
                </select>
            </div>
            <div>
                <InputLabel htmlFor="kelurahan" value="Kelurahan" className="!text-xs" required />
                <select id="kelurahan" className={selectClass} value={formData.kelurahan_id} onChange={e => onKelurahan(e.target.value)} disabled={kelurahanList.length === 0} required>
                    <option value="">Pilih Kelurahan</option>
                    {kelurahanList.map(item => <option key={item.id} value={String(item.id)}>{item.nama}</option>)}
                </select>
            </div>
            <div>
                <InputLabel htmlFor="kodepos" value="Kode Pos" className="!text-xs" required />
                <select id="kodepos" className={selectClass} value={formData.kodepos} onChange={e => onKodepos(e.target.value)} disabled={kodeposList.length === 0} required>
                    <option value="">Pilih Kode Pos</option>
                    {kodeposList.map(kp => <option key={kp} value={kp}>{kp}</option>)}
                </select>
            </div>
        </div>
    );

    const renderFormFields = (
        formData: typeof data | typeof editForm.data,
        setFormData: (key: any, value: any) => void,
        formErrors: any,
        onProvinsi: (v: string) => void,
        onKabupaten: (v: string) => void,
        onKecamatan: (v: string) => void,
        onKelurahan: (v: string) => void
    ) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <InputLabel value="Foto Rumah (Opsional)" className="!text-xs mb-1" />
                    {formData.foto_rumah instanceof File ? (
                        <div className="mb-2 relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                            <img src={URL.createObjectURL(formData.foto_rumah)} alt="Preview" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => { setFormData('foto_rumah', null); const fileInput = document.getElementById('foto_rumah_input') as HTMLInputElement; if (fileInput) fileInput.value = ''; }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors" title="Batal Pilih Foto">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    ) : (selectedRumah?.foto_rumah && formData === editForm.data) ? (
                        <div className="mb-2 relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                            <img src={`/storage/${selectedRumah.foto_rumah}`} alt="Preview Lama" className="w-full h-full object-cover" />
                        </div>
                    ) : null}
                    <input type="file"
                        id="foto_rumah_input"
                        className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-gray-300 rounded-md bg-white mt-1"
                        onChange={e => setFormData('foto_rumah', e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                        accept="image/png, image/jpeg, image/gif"
                    />
                    <InputError message={formErrors.foto_rumah} className="mt-1 text-xs" />
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="rt" value="RT" className="!text-xs" required />
                        <TextInput id="rt" type="text" className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed py-1.5 px-3 text-sm" value={formData.rt} disabled required />
                        <InputError message={formErrors.rt} className="mt-1 text-xs" />
                    </div>
                    <div>
                        <InputLabel htmlFor="rw" value="RW" className="!text-xs" />
                        <TextInput id="rw" type="text" className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed py-1.5 px-3 text-sm" value={formData.rw} disabled />
                    </div>
                </div>
            </div>

            {renderWilayahDropdowns(formData, onProvinsi, onKabupaten, onKecamatan, onKelurahan,
                (v) => setFormData('kodepos', v))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputLabel htmlFor="alamat_detail" value="Alamat Lengkap" className="!text-xs" required />
                    <textarea id="alamat_detail" className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm" rows={2} value={formData.alamat_detail} onChange={e => setFormData('alamat_detail', e.target.value)} placeholder="Contoh: Jl. Anggrek Raya Blok B No. 15" required></textarea>
                    <InputError message={formErrors.alamat_detail} className="mt-1 text-xs" />
                </div>
                <div>
                    <InputLabel htmlFor="catatan" value="Catatan (Opsional)" className="!text-xs" />
                    <textarea id="catatan" className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm" rows={2} value={formData.catatan} onChange={e => setFormData('catatan', e.target.value)} placeholder="Kondisi rumah, dll..."></textarea>
                </div>
            </div>
        </div>
    );

    // Pagination logic
    const filteredRumahs = rumahs.filter(rumah => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            (rumah.rt && String(rumah.rt).toLowerCase().includes(search)) ||
            (rumah.alamat_detail && String(rumah.alamat_detail).toLowerCase().includes(search)) ||
            (rumah.kartu_keluarga && rumah.kartu_keluarga.some((kk: any) =>
                (kk.nomor_kk && String(kk.nomor_kk).toLowerCase().includes(search)) ||
                (kk.warga && kk.warga.some((w: any) => w.shdk === 'Kepala Keluarga' && w.nama_lengkap && String(w.nama_lengkap).toLowerCase().includes(search)))
            ))
        );
    });

    const totalItems = filteredRumahs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentData = filteredRumahs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <PengurusRTLayout title="Data Rumah">
            <Head title="Halaman Data Rumah" />

            {/* Toast Alert */}
            {toast && (
                <ToastAlert
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Data Rumah</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-amber-500 rounded text-xs font-medium text-white cursor-default align-baseline">
                            + Tambah Data
                        </span>: Gunakan tombol ini untuk mendaftarkan rumah baru. Setiap rumah wajib didaftarkan terlebih dahulu sebelum Anda dapat menambahkan data Kartu Keluarga.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 cursor-default align-baseline">
                            Ekspor PDF
                        </span>: Gunakan tombol ini untuk mengunduh seluruh data rumah ke dalam file.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 cursor-default align-baseline">
                            Edit (Pensil)
                        </span>: Klik tombol ini pada kolom aksi untuk memperbarui data alamat, RT, foto, atau catatan rumah.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-red-100 rounded text-xs font-medium text-red-700 cursor-default align-baseline">
                            Hapus (Sampah)
                        </span>: Klik tombol ini untuk menghapus data rumah. <span className="text-red-600 font-medium">Jika data rumah telah terisi di sub-menu Keluarga, maka tombol Hapus akan otomatis hilang. Jika Anda ingin memunculkan kembali tombol Hapus, silakan hapus terlebih dahulu data keluarga yang terikat pada rumah tersebut.</span>
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
                            placeholder="Cari data..."
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
                        <button onClick={openModal} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-medium text-white hover:bg-amber-600 transition-colors inline-block whitespace-nowrap">
                            + Tambah Data
                        </button>
                    </div>
                </div>

                {rumahs.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 font-medium">Belum ada data rumah.</p>
                        <p className="mt-1">Silakan tambahkan data baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-center text-gray-500">
                            <thead className="text-[10px] text-gray-700 capitalize font-semibold bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-3 py-2 rounded-tl-lg text-center">No</th>
                                    <th scope="col" className="px-3 py-2 text-center">RT</th>
                                    <th scope="col" className="px-3 py-2 text-center">Foto Rumah</th>
                                    <th scope="col" className="px-3 py-2 text-center">Alamat Lengkap</th>
                                    <th scope="col" className="px-3 py-2 text-center">Kartu Keluarga</th>
                                    <th scope="col" className="px-3 py-2 text-center">Kepala Keluarga</th>
                                    <th scope="col" className="px-3 py-2 text-center">Anggota Keluarga</th>
                                    <th scope="col" className="px-3 py-2 text-center">Status Tinggal</th>
                                    <th scope="col" className="px-3 py-2 text-center">Catatan</th>
                                    <th scope="col" className="px-3 py-2 rounded-tr-lg text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((rumah, index) => {
                                    const hasKK = rumah.kartu_keluarga && rumah.kartu_keluarga.length > 0;

                                    return (
                                        <tr key={rumah.id} className="bg-white border-b hover:bg-gray-50 transition-colors text-center">
                                            <td className="px-3 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="px-3 py-2">{rumah.rt}</td>
                                            <td className="px-3 py-2 text-center">
                                                {rumah.foto_rumah ? (
                                                    <button onClick={() => setPreviewImage(`/storage/${rumah.foto_rumah}`)} className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md transition-transform hover:scale-105">
                                                        <img src={`/storage/${rumah.foto_rumah}`} alt="Foto Rumah" className="w-9 h-9 object-cover rounded-md mx-auto border border-gray-200" title="Klik untuk perbesar" />
                                                    </button>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-3 py-2">{rumah.alamat_detail}</td>
                                            <td className="px-3 py-2 text-center">
                                                {hasKK ? (
                                                    <ul className="text-gray-600 text-[11px] list-none">
                                                        {rumah.kartu_keluarga!.map((kk: any) => (
                                                            <li key={kk.id} className="mb-0.5 whitespace-nowrap">{kk.nomor_kk}</li>
                                                        ))}
                                                    </ul>
                                                ) : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {hasKK ? (
                                                    <ul className="text-gray-600 text-[11px] list-none">
                                                        {rumah.kartu_keluarga!.map((kk: any) => {
                                                            const kepK = kk.warga?.find((w: any) => w.shdk === 'Kepala Keluarga');
                                                            return <li key={kk.id} className="mb-0.5 whitespace-nowrap">{kepK ? kepK.nama_lengkap : 'Belum Ada'}</li>;
                                                        })}
                                                    </ul>
                                                ) : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {hasKK ? (
                                                    <ul className="text-gray-600 text-[11px] list-none">
                                                        {rumah.kartu_keluarga!.map((kk: any) => (
                                                            <li key={kk.id} className="mb-0.5 whitespace-nowrap">{kk.warga ? kk.warga.length : 0} Orang</li>
                                                        ))}
                                                    </ul>
                                                ) : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {hasKK ? (
                                                    <ul className="text-gray-600 text-[11px] list-none">
                                                        {rumah.kartu_keluarga!.map((kk: any) => (
                                                            <li key={kk.id} className="mb-0.5 whitespace-nowrap capitalize">
                                                                {kk.status_tinggal || '-'}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-center">{rumah.catatan || '-'}</td>
                                            <td className="px-3 py-2 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEditModal(rumah)} title="Edit" className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    {!hasKK && (
                                                        <button onClick={() => openDeleteModal(rumah)} title="Hapus" className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                <path d="M10 11v6" />
                                                                <path d="M14 11v6" />
                                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                            // Show limited pages on small screens or just logic to keep it simple: we show all pages for now since it's client side
                                            if (totalPages > 7) {
                                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                    return <span key={page} className="px-2 py-1.5 text-xs text-gray-500">...</span>;
                                                }
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${currentPage === page ? 'bg-amber-500 text-white border-amber-500 font-medium' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                                >
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
                )}
            </div>

            {/* ===== MODAL TAMBAH ===== */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="4xl">
                <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Form Tambah Rumah</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Masukkan data detail rumah warga dengan lengkap dan benar.</p>
                        </div>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        {renderFormFields(data, setData, errors, handleProvinsiChange, handleKabupatenChange, handleKecamatanChange, handleKelurahanChange)}
                        <div className="flex items-center justify-end pt-3 border-t border-gray-100 gap-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Batal</button>
                            <PrimaryButton disabled={processing} className="bg-amber-600 hover:bg-amber-700">Simpan Data Rumah</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ===== MODAL EDIT ===== */}
            <Modal show={isEditModalOpen} onClose={closeEditModal} maxWidth="4xl">
                <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Edit Data Rumah</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Perbarui data rumah yang dipilih.</p>
                        </div>
                        <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={submitEdit} className="space-y-4">
                        {renderFormFields(editForm.data, editForm.setData, editForm.errors, handleEditProvinsiChange, handleEditKabupatenChange, handleEditKecamatanChange, handleEditKelurahanChange)}
                        <div className="flex items-center justify-end pt-3 border-t border-gray-100 gap-3">
                            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Batal</button>
                            <PrimaryButton disabled={editForm.processing} className="bg-amber-600 hover:bg-amber-700">Simpan Perubahan</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ===== MODAL KONFIRMASI HAPUS ===== */}
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} maxWidth="sm">
                <div className="p-6 text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Data Rumah?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Anda akan menghapus data rumah RT <strong>{selectedRumah?.rt}</strong> di alamat "{selectedRumah?.alamat_detail}". Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-center gap-3">
                        <button onClick={closeDeleteModal} className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                            Batal
                        </button>
                        <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ===== MODAL PREVIEW GAMBAR ===== */}
            <Modal show={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="2xl">
                <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center p-2 min-h-[50vh]">
                    <button onClick={() => setPreviewImage(null)} className="absolute top-3 right-3 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    {previewImage && (
                        <img src={previewImage} alt="Preview Foto Rumah" className="max-w-full max-h-[85vh] object-contain" />
                    )}
                </div>
            </Modal>
        </PengurusRTLayout>
    );
}
