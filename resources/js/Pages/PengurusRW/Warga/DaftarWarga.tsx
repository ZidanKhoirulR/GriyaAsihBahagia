import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import ToastAlert from '@/Components/ToastAlert';
import Modal from '@/Components/Modal';

interface Keluarga {
    id: number;
    nomor_kk: string;
    rumah_id: number;
    status_tinggal: string;
    tanggal_dikeluarkan: string | null;
    alamat_detail: string;
    rt: string;
    rw: string;
    catatan: string | null;
    rumah?: {
        id: number;
        alamat_detail: string;
        rt: string;
        rw: string;
    };
}

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
    tanggal_pindah_pergi: string | null;
    status_perkawinan: string;
    tanggal_perkawinan: string | null;
    shdk: string;
    nama_ayah: string;
    nama_ibu: string;
    catatan: string | null;
    tanggal_mulai_kehamilan: string | null;
    tanggal_melahirkan: string | null;
}

interface Wilayah {
    provinsi: string | null;
    kabupaten: string | null;
    kecamatan: string | null;
    kelurahan: string | null;
    kodepos: string | null;
}

interface Options {
    agama: string[];
    pendidikan: string[];
    golongan_darah: string[];
    kewarganegaraan: string[];
    status_perkawinan: string[];
    shdk: string[];
    jenis_pekerjaan: string[];
}

interface Props {
    keluarga: Keluarga;
    wargas: Warga[];
    wilayah: Wilayah;
    options: Options;
}

export default function DaftarWarga({ keluarga, wargas, wilayah, options }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedWarga, setSelectedWarga] = useState<Warga | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const form = useForm({
        kk_id: keluarga.id,
        nama_lengkap: '',
        nik: '',
        no_whatsapp: '',
        jenis_kelamin: '' as '' | 'L' | 'P',
        tempat_lahir: '',
        tanggal_lahir: '',
        tempat_meninggal: '',
        tanggal_meninggal: '',
        agama: '',
        pendidikan: '',
        jenis_pekerjaan: '',
        golongan_darah: '',
        kewarganegaraan: '',
        nomor_paspor: '',
        nomor_kitap: '',
        pindah_datang_dari: '',
        tanggal_pindah_datang: '',
        pindah_pergi: '',
        tanggal_pindah_pergi: '',
        status_perkawinan: '',
        tanggal_perkawinan: '',
        shdk: '',
        nama_ayah: '',
        nama_ibu: '',
        catatan: '',
        tanggal_mulai_kehamilan: '',
        tanggal_melahirkan: '',
        _method: 'POST',
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setToast({ message, type });
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        form.reset();
        form.setData('kk_id', keluarga.id);
        form.setData('_method', 'POST');
        form.clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (warga: Warga) => {
        setIsEditMode(true);
        setSelectedWarga(warga);
        form.setData({
            kk_id: keluarga.id,
            nama_lengkap: warga.nama_lengkap,
            nik: warga.nik,
            no_whatsapp: warga.no_whatsapp || '',
            jenis_kelamin: warga.jenis_kelamin,
            tempat_lahir: warga.tempat_lahir,
            tanggal_lahir: warga.tanggal_lahir ? warga.tanggal_lahir.split('T')[0] : '',
            tempat_meninggal: warga.tempat_meninggal || '',
            tanggal_meninggal: warga.tanggal_meninggal ? warga.tanggal_meninggal.split('T')[0] : '',
            agama: warga.agama,
            pendidikan: warga.pendidikan,
            jenis_pekerjaan: warga.jenis_pekerjaan,
            golongan_darah: warga.golongan_darah,
            kewarganegaraan: warga.kewarganegaraan,
            nomor_paspor: warga.nomor_paspor || '',
            nomor_kitap: warga.nomor_kitap || '',
            pindah_datang_dari: warga.pindah_datang_dari || '',
            tanggal_pindah_datang: warga.tanggal_pindah_datang ? warga.tanggal_pindah_datang.split('T')[0] : '',
            pindah_pergi: warga.pindah_pergi || '',
            tanggal_pindah_pergi: warga.tanggal_pindah_pergi ? warga.tanggal_pindah_pergi.split('T')[0] : '',
            status_perkawinan: warga.status_perkawinan,
            tanggal_perkawinan: warga.tanggal_perkawinan ? warga.tanggal_perkawinan.split('T')[0] : '',
            shdk: warga.shdk,
            nama_ayah: warga.nama_ayah || '',
            nama_ibu: warga.nama_ibu || '',
            catatan: warga.catatan || '',
            tanggal_mulai_kehamilan: warga.tanggal_mulai_kehamilan ? warga.tanggal_mulai_kehamilan.split('T')[0] : '',
            tanggal_melahirkan: warga.tanggal_melahirkan ? warga.tanggal_melahirkan.split('T')[0] : '',
            _method: 'PUT',
        });
        form.clearErrors();
        setIsModalOpen(true);
    };

    const closeModals = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
        setSelectedWarga(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditMode && selectedWarga) {
            form.post(route('pengurus-rw.warga.update', selectedWarga.id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModals();
                    showToast('Data anggota keluarga berhasil diperbarui!', 'success');
                },
                onError: () => {
                    showToast('Terdapat kesalahan pada input form.', 'error');
                }
            });
        } else {
            form.post(route('pengurus-rw.warga.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    closeModals();
                    showToast('Data anggota keluarga berhasil ditambahkan!', 'success');
                },
                onError: () => {
                    showToast('Terdapat kesalahan pada input form.', 'error');
                }
            });
        }
    };

    const deleteWarga = () => {
        if (!selectedWarga) return;
        
        form.delete(route('pengurus-rw.warga.destroy', selectedWarga.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModals();
                showToast('Data anggota keluarga berhasil dihapus.', 'success');
            },
        });
    };

    const kepalaKeluarga = wargas.find(w => w.shdk === 'Kepala Keluarga')?.nama_lengkap || '-';
    
    // Formatting helper
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const inputClass = "mt-1 block w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-md shadow-sm py-1.5 px-3 text-sm";
    const labelClass = "block text-xs font-medium text-gray-700";
    const errorClass = "text-red-500 text-xs mt-1";

    return (
        <PengurusRWLayout title="Detail Keluarga & Anggota">
            <Head title="Detail Keluarga - Pengurus RW" />

            {toast && (
                <ToastAlert
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mb-4">
                <Link href={route('pengurus-rw.keluarga.index')} className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar Keluarga
                </Link>
            </div>

            {/* HEADER DETAIL KELUARGA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                
                <div className="text-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-gray-800">KARTU KELUARGA</h2>
                    <p className="text-xl font-bold tracking-widest text-amber-600 mt-1">{keluarga.nomor_kk}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                    {/* Kolom Kiri */}
                    <div className="space-y-4">
                        <div>
                            <span className="block text-xs text-gray-500 font-medium">Kepala Keluarga</span>
                            <span className="block font-medium text-gray-800 mt-0.5 capitalize">{kepalaKeluarga}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <span className="block text-xs text-gray-500 font-medium">Alamat</span>
                                <span className="block font-medium text-gray-800 mt-0.5 capitalize">{keluarga.alamat_detail}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">RT / RW</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{keluarga.rt} / {keluarga.rw}</span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 font-medium">Rumah / Bangunan</span>
                            <span className="block font-medium text-gray-800 mt-0.5 capitalize">
                                {keluarga.rumah ? `${keluarga.rumah.alamat_detail} (RT ${keluarga.rumah.rt}/RW ${keluarga.rumah.rw})` : '-'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Status Tinggal</span>
                                <span className="block font-medium text-gray-800 mt-0.5 capitalize">{keluarga.status_tinggal}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Tanggal Dikeluarkan</span>
                                <span className="block font-medium text-gray-800 mt-0.5">{formatDate(keluarga.tanggal_dikeluarkan)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Desa / Kelurahan</span>
                                <span className="block font-medium text-gray-800 mt-0.5 uppercase">{wilayah.kelurahan || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Kecamatan</span>
                                <span className="block font-medium text-gray-800 mt-0.5 uppercase">{wilayah.kecamatan || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Kabupaten / Kota</span>
                                <span className="block font-medium text-gray-800 mt-0.5 uppercase">{wilayah.kabupaten || '-'}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 font-medium">Provinsi</span>
                                <span className="block font-medium text-gray-800 mt-0.5 uppercase">{wilayah.provinsi || '-'}</span>
                            </div>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 font-medium">Kode Pos</span>
                            <span className="block font-medium text-gray-800 mt-0.5">{wilayah.kodepos || '-'}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 font-medium">Catatan</span>
                            <span className="block text-gray-700 mt-0.5 text-sm">{keluarga.catatan || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABEL ANGGOTA KELUARGA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Daftar Anggota Keluarga</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Total: {wargas.length} Orang</p>
                    </div>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-medium text-white hover:bg-amber-600 transition-colors whitespace-nowrap shadow-sm shadow-amber-200">
                        + Tambah Anggota
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-gray-500">
                        <thead className="text-[10px] text-gray-700 uppercase bg-gray-50/80 border-y border-gray-200">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-center">No</th>
                                <th scope="col" className="px-3 py-3 text-center">Nama Lengkap</th>
                                <th scope="col" className="px-3 py-3 text-center">NIK</th>
                                <th scope="col" className="px-3 py-3 text-center">Jenis Kelamin</th>
                                <th scope="col" className="px-3 py-3 text-center">Tempat, Tgl Lahir</th>
                                <th scope="col" className="px-3 py-3 text-center">Agama</th>
                                <th scope="col" className="px-3 py-3 text-center">Pendidikan</th>
                                <th scope="col" className="px-3 py-3 text-center">Pekerjaan</th>
                                <th scope="col" className="px-3 py-3 text-center">SHDK</th>
                                <th scope="col" className="px-3 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wargas.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                                        Belum ada anggota keluarga yang didaftarkan.
                                    </td>
                                </tr>
                            ) : (
                                wargas.map((warga, index) => (
                                    <tr key={warga.id} className="bg-white border-b hover:bg-gray-50/50 transition-colors">
                                        <td className="px-3 py-2 text-center">{index + 1}</td>
                                        <td className="px-3 py-2 text-center capitalize">{warga.nama_lengkap}</td>
                                        <td className="px-3 py-2 text-center font-medium">{warga.nik}</td>
                                        <td className="px-3 py-2 text-center">{warga.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                            {warga.tempat_lahir}, {formatDate(warga.tanggal_lahir)}
                                        </td>
                                        <td className="px-3 py-2 text-center">{warga.agama}</td>
                                        <td className="px-3 py-2 text-center">{warga.pendidikan}</td>
                                        <td className="px-3 py-2 text-center">{warga.jenis_pekerjaan}</td>
                                        <td className="px-3 py-2 text-center text-gray-700">{warga.shdk}</td>
                                        <td className="px-3 py-2 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button onClick={() => openEditModal(warga)} title="Edit" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => { setSelectedWarga(warga); setIsDeleteModalOpen(true); }} title="Hapus" className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL FORM TAMBAH/EDIT */}
            <Modal show={isModalOpen} onClose={closeModals} maxWidth="4xl">
                <form onSubmit={submit} className="flex flex-col max-h-[85vh]">
                    {/* Sticky Header */}
                    <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
                        <h2 className="text-base font-bold text-gray-900">
                            {isEditMode ? 'Edit Data Anggota Keluarga' : 'Tambah Anggota Keluarga Baru'}
                        </h2>
                    </div>
                    {/* Scrollable Body */}
                    <div className="overflow-y-auto flex-1 px-4 py-4">


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {/* Kolom 1: Data Utama */}
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>Nomor KK</label>
                                <input type="text" className={`${inputClass} bg-gray-100 font-medium text-gray-600`} value={keluarga.nomor_kk} disabled />
                            </div>
                            <div>
                                <label className={labelClass}>NIK <span className="text-red-500">*</span></label>
                                <input type="text" className={inputClass} value={form.data.nik} onChange={e => form.setData('nik', e.target.value)} maxLength={16} required />
                                {form.errors.nik && <div className={errorClass}>{form.errors.nik}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
                                <input type="text" className={inputClass} value={form.data.nama_lengkap} onChange={e => form.setData('nama_lengkap', e.target.value)} required />
                                {form.errors.nama_lengkap && <div className={errorClass}>{form.errors.nama_lengkap}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Jenis Kelamin <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.jenis_kelamin} onChange={e => form.setData('jenis_kelamin', e.target.value as ''|'L'|'P')} required>
                                    <option value="">Pilih Gender</option>
                                    <option value="L">Laki-Laki (L)</option>
                                    <option value="P">Perempuan (P)</option>
                                </select>
                                {form.errors.jenis_kelamin && <div className={errorClass}>{form.errors.jenis_kelamin}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Tempat Lahir <span className="text-red-500">*</span></label>
                                <input type="text" className={inputClass} value={form.data.tempat_lahir} onChange={e => form.setData('tempat_lahir', e.target.value)} required />
                                {form.errors.tempat_lahir && <div className={errorClass}>{form.errors.tempat_lahir}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Tanggal Lahir <span className="text-red-500">*</span></label>
                                <input type="date" className={inputClass} value={form.data.tanggal_lahir} onChange={e => form.setData('tanggal_lahir', e.target.value)} required />
                                {form.errors.tanggal_lahir && <div className={errorClass}>{form.errors.tanggal_lahir}</div>}
                            </div>
                        </div>

                        {/* Kolom 2: Informasi Pribadi Tambahan */}
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>Golongan Darah <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.golongan_darah} onChange={e => form.setData('golongan_darah', e.target.value)} required>
                                    <option value="">Pilih Golongan Darah</option>
                                    {options.golongan_darah.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.golongan_darah && <div className={errorClass}>{form.errors.golongan_darah}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Agama <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.agama} onChange={e => form.setData('agama', e.target.value)} required>
                                    <option value="">Pilih Agama</option>
                                    {options.agama.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.agama && <div className={errorClass}>{form.errors.agama}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Kewarganegaraan <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.kewarganegaraan} onChange={e => form.setData('kewarganegaraan', e.target.value)} required>
                                    <option value="">Pilih Kewarganegaraan</option>
                                    {options.kewarganegaraan.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.kewarganegaraan && <div className={errorClass}>{form.errors.kewarganegaraan}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Nomor Paspor</label>
                                <input type="text" className={inputClass} value={form.data.nomor_paspor} onChange={e => form.setData('nomor_paspor', e.target.value)} />
                                {form.errors.nomor_paspor && <div className={errorClass}>{form.errors.nomor_paspor}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Nomor KITAP</label>
                                <input type="text" className={inputClass} value={form.data.nomor_kitap} onChange={e => form.setData('nomor_kitap', e.target.value)} />
                                {form.errors.nomor_kitap && <div className={errorClass}>{form.errors.nomor_kitap}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Nomor WhatsApp</label>
                                <input type="text" className={inputClass} value={form.data.no_whatsapp} onChange={e => form.setData('no_whatsapp', e.target.value)} />
                                {form.errors.no_whatsapp && <div className={errorClass}>{form.errors.no_whatsapp}</div>}
                            </div>
                        </div>

                        {/* Kolom 3: Status & Pendidikan */}
                        <div className="space-y-3">
                            <div>
                                <label className={labelClass}>Status Hub. Dlm Keluarga <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.shdk} onChange={e => form.setData('shdk', e.target.value)} required>
                                    <option value="">Pilih SHDK</option>
                                    {options.shdk.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.shdk && <div className={errorClass}>{form.errors.shdk}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Status Perkawinan <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.status_perkawinan} onChange={e => form.setData('status_perkawinan', e.target.value)} required>
                                    <option value="">Pilih Status Perkawinan</option>
                                    {options.status_perkawinan.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.status_perkawinan && <div className={errorClass}>{form.errors.status_perkawinan}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Tanggal Perkawinan</label>
                                <input type="date" className={inputClass} value={form.data.tanggal_perkawinan} onChange={e => form.setData('tanggal_perkawinan', e.target.value)} />
                                {form.errors.tanggal_perkawinan && <div className={errorClass}>{form.errors.tanggal_perkawinan}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Pendidikan Terakhir <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.pendidikan} onChange={e => form.setData('pendidikan', e.target.value)} required>
                                    <option value="">Pilih Pendidikan</option>
                                    {options.pendidikan.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.pendidikan && <div className={errorClass}>{form.errors.pendidikan}</div>}
                            </div>
                            <div>
                                <label className={labelClass}>Jenis Pekerjaan <span className="text-red-500">*</span></label>
                                <select className={inputClass} value={form.data.jenis_pekerjaan} onChange={e => form.setData('jenis_pekerjaan', e.target.value)} required>
                                    <option value="">Pilih Pekerjaan</option>
                                    {options.jenis_pekerjaan.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                                {form.errors.jenis_pekerjaan && <div className={errorClass}>{form.errors.jenis_pekerjaan}</div>}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className={labelClass}>Nama Ayah <span className="text-red-500">*</span></label>
                                    <input type="text" className={inputClass} value={form.data.nama_ayah} onChange={e => form.setData('nama_ayah', e.target.value)} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Nama Ibu <span className="text-red-500">*</span></label>
                                    <input type="text" className={inputClass} value={form.data.nama_ibu} onChange={e => form.setData('nama_ibu', e.target.value)} required />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3 pt-4 mt-1 border-t border-gray-100">
                            {/* Catatan Lain - Full Width di atas judul */}
                            <div className="mb-4">
                                <label className={labelClass}>Catatan Lain</label>
                                <input
                                    type="text"
                                    className={`${inputClass} mt-1 w-full`}
                                    value={form.data.catatan}
                                    onChange={e => form.setData('catatan', e.target.value)}
                                    placeholder="Tuliskan catatan tambahan jika ada..."
                                />
                            </div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Informasi Tambahan & Riwayat</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                                {/* Riwayat Pindah Pergi */}
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">Riwayat Pindah Pergi</p>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className={labelClass}>Tanggal Pindah Pergi</label>
                                            <input type="date" className={inputClass} value={form.data.tanggal_pindah_pergi} onChange={e => form.setData('tanggal_pindah_pergi', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Pindah Pergi Ke</label>
                                            <input type="text" className={inputClass} value={form.data.pindah_pergi} onChange={e => form.setData('pindah_pergi', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Riwayat Datang */}
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-2">Riwayat Pindah Datang</p>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className={labelClass}>Tanggal Datang</label>
                                            <input type="date" className={inputClass} value={form.data.tanggal_pindah_datang} onChange={e => form.setData('tanggal_pindah_datang', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Pindah Datang Dari</label>
                                            <input type="text" className={inputClass} value={form.data.pindah_datang_dari} onChange={e => form.setData('pindah_datang_dari', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Riwayat Wafat */}
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">Riwayat Wafat</p>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className={labelClass}>Tanggal Wafat</label>
                                            <input type="date" className={inputClass} value={form.data.tanggal_meninggal} onChange={e => form.setData('tanggal_meninggal', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Tempat Wafat</label>
                                            <input type="text" className={inputClass} value={form.data.tempat_meninggal} onChange={e => form.setData('tempat_meninggal', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                    
                                {/* Ibu Hamil */}
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-bold text-pink-500 uppercase tracking-wider mb-2">Mulai Kehamilan</p>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className={labelClass}>Tanggal Kehamilan</label>
                                            <input type="date" className={inputClass} value={form.data.tanggal_mulai_kehamilan} onChange={e => form.setData('tanggal_mulai_kehamilan', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Mulai Melahirkan */}
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-bold text-pink-500 uppercase tracking-wider mb-2">Mulai Melahirkan</p>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className={labelClass}>Tanggal Melahirkan</label>
                                            <input type="date" className={inputClass} value={form.data.tanggal_melahirkan} onChange={e => form.setData('tanggal_melahirkan', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    </div>{/* End Scrollable Body */}

                    {/* Sticky Footer */}
                    <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0 bg-white">
                        <button type="button" onClick={closeModals} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button type="submit" disabled={form.processing} className="px-4 py-2 bg-amber-500 rounded-lg text-sm font-medium text-white hover:bg-amber-600 transition-colors disabled:opacity-50">
                            {form.processing ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL HAPUS */}
            <Modal show={isDeleteModalOpen} onClose={closeModals} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Hapus Anggota Keluarga</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus data <strong>{selectedWarga?.nama_lengkap}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button onClick={closeModals} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Batal
                        </button>
                        <button onClick={deleteWarga} disabled={form.processing} className="px-4 py-2 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                            {form.processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </Modal>

        </PengurusRWLayout>
    );
}
