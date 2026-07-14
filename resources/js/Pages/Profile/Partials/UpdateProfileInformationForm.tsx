import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import ToastAlert from '@/Components/ToastAlert';
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    warga,
    foto_profile_url,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    warga?: any;
    foto_profile_url?: string | null;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const [toastMessage, setToastMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(foto_profile_url || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, errors, processing } = useForm({
        _method: 'PATCH',
        nama_lengkap: user.nama_lengkap,
        nik: user.nik,
        email: (user as any).email || '',
        no_whatsapp: warga?.no_whatsapp || '',
        foto_profile: null as File | null,
    });

    const handleFotoChange = (file: File | null) => {
        if (file) {
            setData('foto_profile', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setToastMessage('Informasi profil berhasil diperbarui.');
            },
        });
    };

    const handleDeleteFoto = () => {
        if (!foto_profile_url) {
            // Jika foto belum ada di DB (baru pilih), langsung hapus dari state
            setPreviewUrl(null);
            setData('foto_profile', null);
            return;
        }

        Swal.fire({
            title: 'Hapus Foto Profil?',
            text: "Apakah Anda yakin ingin menghapus foto profil? File foto akan dihapus secara permanen.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('profile.foto.delete'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setPreviewUrl(null);
                        setData('foto_profile', null);
                        setToastMessage('Foto profil berhasil dihapus.');
                    }
                });
            }
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi Profil
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">

                {/* Foto Profil */}
                <div>
                    <InputLabel value="Foto Profil" />
                    <div className="mt-2 flex items-center gap-5">
                        {/* Preview */}
                        <div className="h-20 w-20 flex-shrink-0 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Foto Profil" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-amber-700">
                                    {user.nama_lengkap?.charAt(0)?.toUpperCase() || 'P'}
                                </span>
                            )}
                        </div>

                        {/* Upload area */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Pilih Foto
                            </button>
                            <p className="text-xs text-gray-400">JPG, PNG, WEBP. Maks. 2MB</p>
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={handleDeleteFoto}
                                    className="text-xs text-red-500 hover:text-red-700 text-left"
                                >
                                    Hapus foto
                                </button>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handleFotoChange(e.target.files?.[0] || null)}
                        />
                    </div>
                    <InputError className="mt-2" message={(errors as any).foto_profile} />
                </div>

                {/* NIK & No KK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="no_kk" value="Nomor KK" />
                        <TextInput
                            id="no_kk"
                            className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                            value={warga?.kartu_keluarga?.nomor_kk || '-'}
                            readOnly
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="nik" value="NIK" />
                        <TextInput
                            id="nik"
                            type="number"
                            className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed"
                            value={data.nik}
                            readOnly
                            disabled
                        />
                    </div>
                </div>

                {/* Nama & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap" required />
                        <TextInput
                            id="nama_lengkap"
                            className="mt-1 block w-full"
                            value={data.nama_lengkap}
                            onChange={(e) => setData('nama_lengkap', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.nama_lengkap} />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">Digunakan untuk fitur lupa password.</p>
                        <InputError className="mt-2" message={(errors as any).email} />
                    </div>
                </div>

                {/* No WhatsApp */}
                <div>
                    <InputLabel htmlFor="no_whatsapp" value="No. WhatsApp" />
                    <TextInput
                        id="no_whatsapp"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.no_whatsapp}
                        onChange={(e) => setData('no_whatsapp', e.target.value)}
                    />
                    <InputError className="mt-2" message={(errors as any).no_whatsapp} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                </div>
            </form>
            <ToastAlert message={toastMessage} onClose={() => setToastMessage('')} />
        </section>
    );
}
