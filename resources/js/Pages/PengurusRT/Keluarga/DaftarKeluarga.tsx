import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import PengurusRTLayout from '@/Layouts/PengurusRTLayout';
import { useState, useEffect, FormEventHandler, useMemo } from 'react';
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
    alamat_detail: string;
}

interface KeluargaItem {
    id: number;
    encrypted_id: string;
    rumah_id: number;
    nomor_kk: string;
    status_tinggal: string;
    foto_kk: string | null;
    tanggal_dikeluarkan: string;
    provinsi_id: string | null;
    kabupaten_id: string | null;
    kecamatan_id: string | null;
    kelurahan_id: string | null;
    kodepos: string | null;
    alamat_detail: string;
    rt: string;
    rw: string;
    catatan: string | null;
    rumah?: RumahItem;
    warga?: any[];
}

export default function DaftarKeluarga({ keluargas, rumahs, eksporUrl, currentRt }: { keluargas: KeluargaItem[], rumahs: RumahItem[], eksporUrl: string, currentRt: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKeluarga, setSelectedKeluarga] = useState<KeluargaItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setToast({ message, type });
    };

    // Wilayah state
    const [provinsiList, setProvinsiList] = useState<WilayahItem[]>([]);
    const [kabupatenList, setKabupatenList] = useState<WilayahItem[]>([]);
    const [kecamatanList, setKecamatanList] = useState<WilayahItem[]>([]);
    const [kelurahanList, setKelurahanList] = useState<WilayahItem[]>([]);
    const [kodeposList, setKodeposList] = useState<string[]>([]);

    const uniqueRTs = useMemo(() => Array.from(new Set(rumahs.map(r => r.rt))).sort(), [rumahs]);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    // ===== Form: TAMBAH =====
    const { data, setData, post, processing, errors, reset } = useForm({
        rt: currentRt || '',
        rumah_id: '',
        nomor_kk: '',
        status_tinggal: 'tetap',
        foto_kk: null as File | null,
        tanggal_dikeluarkan: '',
        provinsi_id: '',
        kabupaten_id: '',
        kecamatan_id: '',
        kelurahan_id: '',
        kodepos: '',
        alamat_detail: '',
        rw: '040',
        catatan: '',
    });

    // ===== Form: EDIT =====
    const editForm = useForm({
        rt: currentRt || '',
        rumah_id: '',
        nomor_kk: '',
        status_tinggal: 'tetap',
        foto_kk: null as File | null,
        tanggal_dikeluarkan: '',
        provinsi_id: '',
        kabupaten_id: '',
        kecamatan_id: '',
        kelurahan_id: '',
        kodepos: '',
        alamat_detail: '',
        rw: '040',
        catatan: '',
        _method: 'PUT',
    });

    // Load provinsi saat modal dibuka
    useEffect(() => {
        if ((isModalOpen || isEditModalOpen) && provinsiList.length === 0) {
            axios.get('/api/wilayah/provinsi').then(res => setProvinsiList(res.data));
        }
    }, [isModalOpen, isEditModalOpen]);

    // Pagination & Search logic
    const filteredKeluargas = keluargas.filter(keluarga => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            String(keluarga.nomor_kk).toLowerCase().includes(search) ||
            String(keluarga.warga?.find(w => w.shdk === 'Kepala Keluarga')?.nama_lengkap || '').toLowerCase().includes(search)
        );
    });

    const totalItems = filteredKeluargas.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentData = filteredKeluargas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    const openEditModal = (keluarga: KeluargaItem) => {
        setSelectedKeluarga(keluarga);
        editForm.setData({
            rt: keluarga.rt,
            rumah_id: String(keluarga.rumah_id),
            nomor_kk: keluarga.nomor_kk,
            status_tinggal: keluarga.status_tinggal,
            foto_kk: null,
            tanggal_dikeluarkan: keluarga.tanggal_dikeluarkan ? keluarga.tanggal_dikeluarkan.split('T')[0] : '',
            provinsi_id: String(keluarga.provinsi_id || ''),
            kabupaten_id: String(keluarga.kabupaten_id || ''),
            kecamatan_id: String(keluarga.kecamatan_id || ''),
            kelurahan_id: String(keluarga.kelurahan_id || ''),
            kodepos: keluarga.kodepos || '',
            alamat_detail: keluarga.alamat_detail,
            rw: keluarga.rw,
            catatan: keluarga.catatan || '',
            _method: 'PUT',
        });
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
        setIsEditModalOpen(true);

        // Hydrate dropdowns
        if (keluarga.provinsi_id) {
            const provKode = provinsiList.find(p => String(p.id) === String(keluarga.provinsi_id))?.kode;
            if (provKode) {
                axios.get('/api/wilayah/kabupaten', { params: { kode_provinsi: provKode } }).then(res => {
                    setKabupatenList(res.data);
                    if (keluarga.kabupaten_id) {
                        const kabKode = res.data.find((k: WilayahItem) => String(k.id) === String(keluarga.kabupaten_id))?.kode_kabkota || res.data.find((k: WilayahItem) => String(k.id) === String(keluarga.kabupaten_id))?.kode;
                        if (kabKode) {
                            axios.get('/api/wilayah/kecamatan', { params: { kode_kabkota: kabKode } }).then(res2 => {
                                setKecamatanList(res2.data);
                                if (keluarga.kecamatan_id) {
                                    const kecKode = res2.data.find((k: WilayahItem) => String(k.id) === String(keluarga.kecamatan_id))?.kode_kecamatan || res2.data.find((k: WilayahItem) => String(k.id) === String(keluarga.kecamatan_id))?.kode;
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
        setSelectedKeluarga(null);
        editForm.reset();
        setKabupatenList([]); setKecamatanList([]); setKelurahanList([]); setKodeposList([]);
    };

    const openDeleteModal = (keluarga: KeluargaItem) => {
        setSelectedKeluarga(keluarga);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setSelectedKeluarga(null); };

    // ========== SUBMIT ==========
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('pengurus-rt.keluarga.store'), {
            onSuccess: () => { closeModal(); showToast('Data keluarga berhasil disimpan.', 'success'); },
            onError: () => showToast('Gagal menyimpan data. Periksa kembali isian form.', 'error'),
            preserveScroll: true,
        });
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedKeluarga) return;
        editForm.post(route('pengurus-rt.keluarga.update', selectedKeluarga.encrypted_id), {
            onSuccess: () => { closeEditModal(); showToast('Data keluarga berhasil diperbarui.', 'success'); },
            onError: () => showToast('Gagal memperbarui data. Periksa kembali isian form.', 'error'),
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        if (!selectedKeluarga) return;
        router.delete(route('pengurus-rt.keluarga.destroy', selectedKeluarga.encrypted_id), {
            onSuccess: () => { closeDeleteModal(); showToast('Data keluarga berhasil dihapus.', 'success'); },
            onError: () => showToast('Gagal menghapus data.', 'error'),
            preserveScroll: true,
        });
    };

    const selectClass = "mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm";

    const renderFormFields = (
        formData: typeof data | typeof editForm.data,
        setFormData: (key: any, value: any) => void,
        formErrors: any,
        onProvinsi: (v: string) => void,
        onKabupaten: (v: string) => void,
        onKecamatan: (v: string) => void,
        onKelurahan: (v: string) => void,
        onKodepos: (v: string) => void
    ) => {
        // Filter rumah berdasarkan RT yang dipilih
        const filteredRumahs = formData.rt ? rumahs.filter(r => r.rt === formData.rt) : [];

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <InputLabel htmlFor="rt" value="RT" className="!text-xs" required />
                            <TextInput id="rt" type="text" className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed py-1.5 px-3 text-sm" value={formData.rt} disabled required />
                            <InputError message={formErrors.rt} className="mt-1 text-xs" />
                        </div>
                        <div className="col-span-1">
                            <InputLabel htmlFor="rw" value="RW" className="!text-xs" />
                            <TextInput id="rw" type="text" className="mt-1 block w-full bg-gray-100 text-gray-500 py-1.5 px-3 text-sm cursor-not-allowed" value={formData.rw} disabled />
                        </div>
                        <div className="col-span-2">
                            <InputLabel htmlFor="rumah_id" value="Pilih Rumah" className="!text-xs" required />
                            <select id="rumah_id" className={selectClass} value={formData.rumah_id} onChange={e => setFormData('rumah_id', e.target.value)} disabled={!formData.rt} required>
                                <option value="">Pilih Rumah</option>
                                {filteredRumahs.map(r => <option key={r.id} value={r.id}>{r.alamat_detail}</option>)}
                            </select>
                            <InputError message={formErrors.rumah_id} className="mt-1 text-xs" />
                        </div>
                    </div>
                    <div>
                        <InputLabel htmlFor="nomor_kk" value="Nomor KK (16 Digit)" className="!text-xs" required />
                        <TextInput id="nomor_kk" type="text" className="mt-1 block w-full py-1.5 px-3 text-sm" value={formData.nomor_kk} onChange={e => setFormData('nomor_kk', e.target.value)} maxLength={16} required />
                        <InputError message={formErrors.nomor_kk} className="mt-1 text-xs" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <InputLabel htmlFor="status_tinggal" value="Status Tinggal" className="!text-xs" required />
                        <select id="status_tinggal" className={selectClass} value={formData.status_tinggal} onChange={e => setFormData('status_tinggal', e.target.value)} required>
                            <option value="tetap">Tetap</option>
                            <option value="kontrak">Kontrak</option>
                            <option value="kos">Kos</option>
                            <option value="numpang">Numpang</option>
                        </select>
                        <InputError message={formErrors.status_tinggal} className="mt-1 text-xs" />
                    </div>
                    <div>
                        <InputLabel htmlFor="tanggal_dikeluarkan" value="Tanggal Dikeluarkan" className="!text-xs" required />
                        <TextInput id="tanggal_dikeluarkan" type="date" className="mt-1 block w-full py-1.5 px-3 text-sm" value={formData.tanggal_dikeluarkan} onChange={e => setFormData('tanggal_dikeluarkan', e.target.value)} required />
                        <InputError message={formErrors.tanggal_dikeluarkan} className="mt-1 text-xs" />
                    </div>
                    <div>
                        <InputLabel value="Foto KK (Opsional)" className="!text-xs mb-1" />
                        {formData.foto_kk instanceof File ? (
                            <div className="mb-2 relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                                <img src={URL.createObjectURL(formData.foto_kk)} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setFormData('foto_kk', null); const fileInput = document.getElementById('foto_kk_input') as HTMLInputElement; if (fileInput) fileInput.value = ''; }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors" title="Batal Pilih Foto">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        ) : (selectedKeluarga?.foto_kk && formData === editForm.data) ? (
                            <div className="mb-2 relative w-full h-32 rounded-md overflow-hidden border border-gray-200">
                                <img src={`/storage/${selectedKeluarga.foto_kk}`} alt="Preview Lama" className="w-full h-full object-cover" />
                            </div>
                        ) : null}
                        <input type="file"
                            id="foto_kk_input"
                            className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer border border-gray-300 rounded-md bg-white mt-1"
                            onChange={e => setFormData('foto_kk', e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                            accept="image/png, image/jpeg, image/gif"
                        />
                        <InputError message={formErrors.foto_kk} className="mt-1 text-xs" />
                    </div>
                </div>

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
                            <option value="">Pilih Kabupaten</option>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="alamat_detail" value="Alamat Sesuai KK" className="!text-xs" required />
                        <textarea id="alamat_detail" className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm" rows={2} value={formData.alamat_detail} onChange={e => setFormData('alamat_detail', e.target.value)} placeholder="Contoh: Jl. Mawar No 10" required></textarea>
                        <InputError message={formErrors.alamat_detail} className="mt-1 text-xs" />
                    </div>
                    <div>
                        <InputLabel htmlFor="catatan" value="Catatan (Opsional)" className="!text-xs" />
                        <textarea id="catatan" className="mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm" rows={2} value={formData.catatan} onChange={e => setFormData('catatan', e.target.value)}></textarea>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <PengurusRTLayout title="Data Keluarga">
            <Head title="Halaman Data Keluarga" />

            {/* Toast Alert */}
            {toast && (
                <ToastAlert
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Panduan Pengelolaan Data Keluarga</h3>
                <ul className="text-sm text-gray-600 list-disc list-outside space-y-1.5 ml-5">
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-amber-500 rounded text-xs font-medium text-white cursor-default align-baseline">
                            + Tambah Data
                        </span>: Gunakan tombol ini untuk mendaftarkan Kartu Keluarga (KK) baru. Pastikan data rumah sudah terdaftar terlebih dahulu di sub-menu Rumah sebelum menambahkan KK.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 cursor-default align-baseline">
                            Ekspor Data
                        </span>: Gunakan tombol ini untuk mengunduh seluruh data Kartu Keluarga ke dalam file.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700 cursor-default align-baseline">
                            Edit (Pensil)
                        </span>: Klik tombol ini pada kolom aksi untuk memperbarui data Kartu Keluarga seperti nomor KK, status tinggal, atau alamat.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 rounded text-xs font-medium text-emerald-700 cursor-default align-baseline">
                            Kelola (Anggota)
                        </span>: Klik tombol ini untuk mengelola daftar anggota keluarga yang terdaftar dalam KK tersebut.
                    </li>
                    <li className="leading-relaxed">
                        <span className="inline-block px-2 py-0.5 bg-red-100 rounded text-xs font-medium text-red-700 cursor-default align-baseline">
                            Hapus (Sampah)
                        </span>: Klik tombol ini untuk menghapus data Kartu Keluarga. <span className="text-red-600 font-medium">Pastikan seluruh anggota keluarga dalam KK tersebut sudah dihapus terlebih dahulu sebelum menghapus data KK.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="w-full sm:w-80 relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full p-2 pl-9 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-amber-500 focus:border-amber-500" placeholder="Cari No. KK, Kepala Keluarga..." />
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

                {keluargas.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-500 font-medium">Belum ada data keluarga.</p>
                        <p className="mt-1">Silakan tambahkan data baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-center text-gray-500">
                            <thead className="text-[10px] text-gray-700 capitalize font-semibold bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-3 py-2 rounded-tl-lg text-center">No</th>
                                    <th scope="col" className="px-3 py-2 text-center">RT</th>
                                    <th scope="col" className="px-3 py-2 text-center">Rumah</th>
                                    <th scope="col" className="px-3 py-2 text-center">Foto KK</th>
                                    <th scope="col" className="px-3 py-2 text-center">No Kartu Keluarga</th>
                                    <th scope="col" className="px-3 py-2 text-center">Tanggal Dikeluarkan</th>
                                    <th scope="col" className="px-3 py-2 text-center">Kepala Keluarga</th>
                                    <th scope="col" className="px-3 py-2 text-center">Anggota Keluarga</th>
                                    <th scope="col" className="px-3 py-2 text-center">Status Tinggal</th>
                                    <th scope="col" className="px-3 py-2 text-center">Catatan</th>
                                    <th scope="col" className="px-3 py-2 rounded-tr-lg text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((keluarga, index) => {
                                    const kepalaKeluarga = keluarga.warga?.find(w => w.shdk === 'Kepala Keluarga')?.nama_lengkap || '-';
                                    const jumlahAnggota = keluarga.warga ? keluarga.warga.length : 0;

                                    return (
                                        <tr key={keluarga.id} className="bg-white border-b hover:bg-gray-50 transition-colors text-center">
                                            <td className="px-3 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                            <td className="px-3 py-2">{keluarga.rt}</td>
                                            <td className="px-3 py-2 text-center">{keluarga.rumah?.alamat_detail || '-'}</td>
                                            <td className="px-3 py-2 text-center">
                                                {keluarga.foto_kk ? (
                                                    <button onClick={() => setPreviewImage(`/storage/${keluarga.foto_kk}`)} className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md transition-transform hover:scale-105">
                                                        <img src={`/storage/${keluarga.foto_kk}`} alt="Foto KK" className="w-9 h-9 object-cover rounded-md mx-auto border border-gray-200" title="Klik untuk perbesar" />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-gray-600">{keluarga.nomor_kk}</td>
                                            <td className="px-3 py-2 text-center">{keluarga.tanggal_dikeluarkan ? new Date(keluarga.tanggal_dikeluarkan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</td>
                                            <td className="px-3 py-2 text-center capitalize">{kepalaKeluarga}</td>
                                            <td className="px-3 py-2 text-center">
                                                <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                                                    <span className="text-gray-600">{jumlahAnggota} Orang</span>
                                                    <Link href={route('pengurus-rt.warga.index', { keluarga: keluarga.encrypted_id })} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded hover:bg-emerald-200 transition-colors font-medium">
                                                        Kelola
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-center capitalize">{keluarga.status_tinggal}</td>
                                            <td className="px-3 py-2 text-center">{keluarga.catatan || '-'}</td>
                                            <td className="px-3 py-2 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => openEditModal(keluarga)} title="Edit" className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    {jumlahAnggota === 0 && (
                                                        <button onClick={() => openDeleteModal(keluarga)} title="Hapus" className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
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
                )}
            </div>

            {/* ===== MODAL TAMBAH ===== */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="4xl">
                <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Form Tambah Data Keluarga</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Masukkan data detail kartu keluarga warga.</p>
                        </div>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        {renderFormFields(data, setData, errors, handleProvinsiChange, handleKabupatenChange, handleKecamatanChange, handleKelurahanChange, (v) => setData('kodepos', v))}
                        <div className="flex items-center justify-end pt-3 border-t border-gray-100 gap-3">
                            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">Batal</button>
                            <PrimaryButton disabled={processing} className="bg-amber-600 hover:bg-amber-700">Simpan Data</PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* ===== MODAL EDIT ===== */}
            <Modal show={isEditModalOpen} onClose={closeEditModal} maxWidth="4xl">
                <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Edit Data Keluarga</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Perbarui data kartu keluarga yang dipilih.</p>
                        </div>
                        <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-500">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <form onSubmit={submitEdit} className="space-y-4">
                        {renderFormFields(editForm.data, editForm.setData, editForm.errors, handleEditProvinsiChange, handleEditKabupatenChange, handleEditKecamatanChange, handleEditKelurahanChange, (v) => editForm.setData('kodepos', v))}
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
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Data KK?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Anda akan menghapus data Kartu Keluarga <strong>{selectedKeluarga?.nomor_kk}</strong>. Semua anggota keluarga (warga) yang terkait dengan KK ini juga akan terhapus. Tindakan ini tidak dapat dibatalkan.
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

            {/* ===== MODAL FOTO ===== */}
            <Modal show={!!previewImage} onClose={() => setPreviewImage(null)} maxWidth="2xl">
                <div className="p-4 bg-gray-900 rounded-xl relative overflow-hidden">
                    <button onClick={() => setPreviewImage(null)} className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors z-10" title="Tutup">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    {previewImage && <img src={previewImage} alt="Preview" className="w-full h-auto object-contain max-h-[80vh]" />}
                </div>
            </Modal>
        </PengurusRTLayout>
    );
}
