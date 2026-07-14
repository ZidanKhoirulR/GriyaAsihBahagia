import { useState } from 'react';
import PengurusRWLayout from '@/Layouts/PengurusRWLayout';
import WargaLayout from '@/Layouts/WargaLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
    warga,
    foto_profile_url,
}: PageProps<{ mustVerifyEmail: boolean; status?: string; warga?: any; foto_profile_url?: string | null }>) {
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const { auth } = usePage<PageProps>().props;
    const Layout = auth.user.role === 'warga' ? WargaLayout : PengurusRWLayout;

    return (
        <Layout>
            <Head title="Pengaturan Akun" />

            <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-xl overflow-hidden flex flex-col md:flex-row">
                    {/* Sidebar Menu */}
                    <div className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/50">
                        <nav className="flex flex-row md:flex-col p-4 gap-2 w-full">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium rounded-xl transition-colors duration-200 whitespace-nowrap ${
                                    activeTab === 'profile'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Informasi Profil
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 sm:gap-3 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium rounded-xl transition-colors duration-200 whitespace-nowrap ${
                                    activeTab === 'password'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Ubah Password
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 sm:p-8">
                        {activeTab === 'profile' && (
                            <div className="max-w-3xl">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    warga={warga}
                                    foto_profile_url={foto_profile_url}
                                />
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="max-w-3xl">
                                <UpdatePasswordForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
