import { Head, useForm } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { FormEventHandler, useState, useRef } from 'react';
import Swal from 'sweetalert2';

export default function Index({ warga, iuranBulanIni, riwayatIuran, rekeningRT, bulanIni }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kk_id: warga?.kk_id || '',
        bukti_pembayaran: null as File | null,
        nominal: '',
        catatan: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('bukti_pembayaran', file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('warga.iuran.upload'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Bukti pembayaran berhasil diunggah dan menunggu konfirmasi.',
                    confirmButtonColor: '#d97706'
                });
                reset('bukti_pembayaran', 'nominal', 'catatan');
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: err.bukti_pembayaran || err.error || 'Terjadi kesalahan. Silakan coba lagi.',
                    confirmButtonColor: '#d97706'
                });
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'lunas': return 'text-green-600 font-semibold';
            case 'menunggu_konfirmasi': return 'text-amber-600 font-semibold';
            case 'belum_bayar': return 'text-red-600 font-semibold';
            default: return 'text-gray-600 font-semibold';
        }
    };

    return (
        <WargaLayout title="Iuran Warga">
            <Head title="Iuran Warga" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pembayaran Iuran Warga</h1>
                <p className="text-gray-500 mt-1">Status dan riwayat iuran Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Kolom Kiri: Form & Status Saat Ini */}
                <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
                    {/* Form Upload Iuran */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        {/* Form Upload jika belum lunas/menunggu konfirmasi */}
                        {(!iuranBulanIni || iuranBulanIni.status === 'belum_bayar') && warga?.kk_id ? (
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Bukti Pembayaran</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-500 hover:bg-amber-50/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="space-y-1 text-center">
                                            {previewUrl ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-contain mb-3 rounded-lg border border-gray-200" />
                                                    <span className="text-sm text-amber-600 font-medium">Klik untuk mengubah gambar</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <span className="relative rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                                            <span>Pilih file gambar</span>
                                                        </span>
                                                        <p className="pl-1">atau tarik dan lepas</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG hingga 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleFileChange}
                                    />
                                    {errors.bukti_pembayaran && <p className="mt-2 text-sm text-red-600">{errors.bukti_pembayaran}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jumlah Nominal <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Rp</span>
                                        </div>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            placeholder="Contoh: 50000"
                                            className="w-full pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl shadow-sm placeholder:text-sm text-sm"
                                            value={data.nominal}
                                            onChange={(e) => setData('nominal', e.target.value)}
                                        />
                                    </div>
                                    {errors.nominal && <p className="mt-2 text-sm text-red-600">{errors.nominal}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catatan Iuran <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Contoh: Iuran Keamanan Bulan Juli"
                                        className="w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl shadow-sm placeholder:text-sm text-sm"
                                        value={data.catatan}
                                        onChange={(e) => setData('catatan', e.target.value)}
                                    ></textarea>
                                    {errors.catatan && <p className="mt-2 text-sm text-red-600">{errors.catatan}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.bukti_pembayaran}
                                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-gray-100">
                                {iuranBulanIni?.status === 'menunggu_konfirmasi' ? (
                                    <>
                                        <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">Menunggu Konfirmasi Pengurus</h4>
                                        <p className="text-sm text-gray-500">Bukti pembayaran Anda sudah diterima dan sedang dalam tahap verifikasi oleh pengurus.</p>
                                    </>
                                ) : iuranBulanIni?.status === 'lunas' ? (
                                    <>
                                        <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-1">Iuran Bulan Ini Lunas</h4>
                                        <p className="text-sm text-gray-500">Terima kasih, iuran keluarga Anda untuk bulan ini telah lunas tercatat.</p>
                                    </>
                                ) : (
                                    <p className="text-gray-500">Data warga/KK tidak valid.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Riwayat Iuran */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Riwayat Iuran</h3>
                        {riwayatIuran && riwayatIuran.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {riwayatIuran.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">{item.bulan_label}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={getStatusColor(item.status)}>
                                                        {item.label_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                                    {item.tanggal_bayar || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                                Belum ada riwayat iuran.
                            </div>
                        )}
                    </div>
                </div>

                {/* Kolom Kanan: Petunjuk & Info Bank */}
                <div className="order-1 lg:order-2 space-y-6">
                    {/* Petunjuk Pembayaran */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <h3 className="text-lg font-bold text-gray-900">Petunjuk Pembayaran</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-2">
                                <span className="font-bold">1.</span>
                                <span>Lakukan transfer sejumlah nominal iuran yang telah disepakati di lingkungan RT Anda.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">2.</span>
                                <span>Transfer hanya ke rekening resmi yang tertera di bawah.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">3.</span>
                                <span>Simpan bukti transfer (struk ATM / screenshot M-Banking).</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">4.</span>
                                <span>Unggah foto bukti transfer pada form yang telah disediakan, dan beri keterangan bayaran di form catatan. lalu klik tombol kirim.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">5.</span>
                                <span>Tunggu konfirmasi dari pengurus. Status otomatis berlaku untuk seluruh anggota keluarga (KK) Anda.</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2 items-start">
                            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            <p className="text-xs text-amber-800">
                                <span className="font-semibold">Catatan:</span> Apabila Anda sudah membayar iuran secara tunai langsung kepada pengurus setempat, Anda <span className="font-semibold">tidak perlu</span> mengisi formulir di menu ini.
                            </p>
                        </div>
                    </div>

                    {/* Informasi Rekening */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Rekening Iuran</h3>
                        {rekeningRT && rekeningRT.length > 0 ? (
                            <div className="space-y-4">
                                {rekeningRT.map((rek: any) => (
                                    <div key={rek.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-900 text-lg">{rek.nama_metode}</span>
                                            {rek.rt && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">RT {rek.rt}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">No. Rekening:</p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-mono text-lg font-medium text-gray-800 tracking-wider">{rek.nomor_rekening}</p>
                                                <button 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(rek.nomor_rekening);
                                                        alert('Nomor rekening disalin!');
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                    title="Salin nomor rekening"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">A.n. <span className="font-semibold">{rek.atas_nama}</span></p>
                                            {rek.keterangan && (
                                                <p className="text-xs text-gray-500 mt-2 italic">{rek.keterangan}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                Belum ada informasi rekening untuk RT Anda. Silakan hubungi pengurus RT setempat.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </WargaLayout>
    );
}
