import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface SidebarLink {
    name: string;
    href: string;
    icon: JSX.Element;
    children?: { name: string; href: string }[];
}

export default function PengurusRWLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { auth } = usePage<PageProps>().props;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const [dataWargaOpen, setDataWargaOpen] = useState(false);
    const [kelompokSasaranOpen, setKelompokSasaranOpen] = useState(false);
    const [keuanganOpen, setKeuanganOpen] = useState(false);
    const [papanInformasiOpen, setPapanInformasiOpen] = useState(false);
    const [kelolaPengurusOpen, setKelolaPengurusOpen] = useState(false);
    const [mutasiWargaOpen, setMutasiWargaOpen] = useState(false);
    const currentPath = window.location.pathname;

    const sidebarWidth = desktopSidebarOpen ? 'lg:w-64' : 'lg:w-20';

    const sidebarLinks: SidebarLink[] = [
        {
            name: 'Dashboard',
            href: route('pengurus-rw.dashboard'),
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
    ];

    const dataWargaLinks = [
        { name: 'Rumah', href: route('pengurus-rw.rumah.index') },
        { name: 'Keluarga', href: route('pengurus-rw.keluarga.index') },
        { name: 'Warga', href: route('pengurus-rw.warga.semua') },
    ];

    const mutasiWargaLinks = [
        { name: 'Kelahiran', href: route('pengurus-rw.mutasi-warga.kelahiran') },
        { name: 'Kematian', href: route('pengurus-rw.mutasi-warga.kematian') },
        { name: 'Pindah Datang', href: route('pengurus-rw.mutasi-warga.pindah-datang') },
        { name: 'Pindah Pergi', href: route('pengurus-rw.mutasi-warga.pindah-pergi') },
    ];

    const kelompokSasaranLinks = [
        { name: 'Pemilih', href: route('pengurus-rw.kelompok-sasaran.pemilih') },
        { name: 'Balita', href: route('pengurus-rw.kelompok-sasaran.balita') },
        { name: 'Lansia', href: route('pengurus-rw.kelompok-sasaran.lansia') },
        { name: 'Ibu Menyusui', href: route('pengurus-rw.kelompok-sasaran.ibu-menyusui') },
        { name: 'Ibu Hamil', href: route('pengurus-rw.kelompok-sasaran.ibu-hamil') },
    ];

    const keuanganLinks = [
        { name: 'Arus Kas RW', href: route('pengurus-rw.arus-kas-rw.index') },
        { name: 'Arus Kas RT', href: route('pengurus-rw.arus-kas-rt.index') },
        { name: 'Metode Transaksi', href: route('pengurus-rw.metode-transaksi.index') },
    ];

    const papanInformasiLinks = [
        { name: 'Pengumuman', href: route('pengurus-rw.pengumuman.index') },
        { name: 'Berita Warga', href: route('pengurus-rw.berita.index') },
    ];

    const kelolaPengurusLinks = [
        { name: 'Pengurus RW', href: route('pengurus-rw.kelola-pengurus.rw') },
        { name: 'Pengurus RT', href: route('pengurus-rw.kelola-pengurus.rt') },
    ];

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 ${sidebarWidth} ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Desktop Toggle Button (Menempel di Pinggir Sidebar) */}
                <button 
                    onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    className="hidden lg:flex items-center justify-center absolute -right-4 top-8 w-8 h-8 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 hover:scale-110 transition-all duration-300 z-50 shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
                >
                    <svg className={`w-4 h-4 transition-transform duration-300 ease-in-out ${!desktopSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {/* Mobile Close Button & Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 lg:hidden">
                    <span className="text-base font-bold text-amber-600">Griya Asri Bahagia</span>
                    <button 
                        onClick={() => setMobileSidebarOpen(false)} 
                        className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 py-4 space-y-1 overflow-y-auto flex-1 scrollbar-hide">
                    {/* Dashboard Link */}
                    {sidebarLinks.map((link) => {
                        const isActive = currentPath === new URL(link.href).pathname;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                title={!desktopSidebarOpen ? link.name : undefined}
                                className={`flex items-center ${desktopSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-amber-50 text-amber-600 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                                }`}
                            >
                                {link.icon}
                                {desktopSidebarOpen && <span className="whitespace-nowrap">{link.name}</span>}
                            </Link>
                        );
                    })}

                    {/* Data Warga Dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (!desktopSidebarOpen) setDesktopSidebarOpen(true);
                                setDataWargaOpen(!dataWargaOpen);
                            }}
                            title={!desktopSidebarOpen ? "Data Warga" : undefined}
                            className={`flex items-center ${desktopSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-all duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {desktopSidebarOpen && <span className="whitespace-nowrap">Data Warga</span>}
                            </div>
                            {desktopSidebarOpen && (
                                <svg className={`w-4 h-4 transition-transform duration-200 ${dataWargaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${dataWargaOpen && desktopSidebarOpen ? 'max-h-48' : 'max-h-0'}`}>
                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {dataWargaLinks.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                            currentPath === new URL(sub.href).pathname
                                                ? 'text-amber-600 bg-amber-50 font-medium'
                                                : 'text-gray-500 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kelompok Sasaran Dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (!desktopSidebarOpen) setDesktopSidebarOpen(true);
                                setKelompokSasaranOpen(!kelompokSasaranOpen);
                            }}
                            title={!desktopSidebarOpen ? "Kelompok Sasaran" : undefined}
                            className={`flex items-center ${desktopSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-all duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                {desktopSidebarOpen && <span className="whitespace-nowrap">Kelompok Sasaran</span>}
                            </div>
                            {desktopSidebarOpen && (
                                <svg className={`w-4 h-4 transition-transform duration-200 ${kelompokSasaranOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${kelompokSasaranOpen && desktopSidebarOpen ? 'max-h-56' : 'max-h-0'}`}>
                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {kelompokSasaranLinks.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                            currentPath === new URL(sub.href).pathname
                                                ? 'text-amber-600 bg-amber-50 font-medium'
                                                : 'text-gray-500 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mutasi Warga Dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (!desktopSidebarOpen) setDesktopSidebarOpen(true);
                                setMutasiWargaOpen(!mutasiWargaOpen);
                            }}
                            title={!desktopSidebarOpen ? "Mutasi Warga" : undefined}
                            className={`flex items-center ${desktopSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-all duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                {desktopSidebarOpen && <span className="whitespace-nowrap">Mutasi Warga</span>}
                            </div>
                            {desktopSidebarOpen && (
                                <svg className={`w-4 h-4 transition-transform duration-200 ${mutasiWargaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${mutasiWargaOpen && desktopSidebarOpen ? 'max-h-56' : 'max-h-0'}`}>
                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {mutasiWargaLinks.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                            currentPath === new URL(sub.href).pathname
                                                ? 'text-amber-600 bg-amber-50 font-medium'
                                                : 'text-gray-500 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Keuangan Dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (!desktopSidebarOpen) setDesktopSidebarOpen(true);
                                setKeuanganOpen(!keuanganOpen);
                            }}
                            title={!desktopSidebarOpen ? "Keuangan" : undefined}
                            className={`flex items-center ${desktopSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-all duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {desktopSidebarOpen && <span className="whitespace-nowrap">Keuangan</span>}
                            </div>
                            {desktopSidebarOpen && (
                                <svg className={`w-4 h-4 transition-transform duration-200 ${keuanganOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${keuanganOpen && desktopSidebarOpen ? 'max-h-40' : 'max-h-0'}`}>
                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {keuanganLinks.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                            currentPath === new URL(sub.href).pathname
                                                ? 'text-amber-600 bg-amber-50 font-medium'
                                                : 'text-gray-500 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Papan Informasi Dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (!desktopSidebarOpen) setDesktopSidebarOpen(true);
                                setPapanInformasiOpen(!papanInformasiOpen);
                            }}
                            title={!desktopSidebarOpen ? "Papan Informasi" : undefined}
                            className={`flex items-center ${desktopSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-all duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {desktopSidebarOpen && <span className="whitespace-nowrap">Papan Informasi</span>}
                            </div>
                            {desktopSidebarOpen && (
                                <svg className={`w-4 h-4 transition-transform duration-200 ${papanInformasiOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${papanInformasiOpen && desktopSidebarOpen ? 'max-h-32' : 'max-h-0'}`}>
                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {papanInformasiLinks.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                            currentPath === new URL(sub.href).pathname
                                                ? 'text-amber-600 bg-amber-50 font-medium'
                                                : 'text-gray-500 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kelola Pengurus Dropdown */}
                    <div>
                        <button
                            onClick={() => {
                                if (!desktopSidebarOpen) setDesktopSidebarOpen(true);
                                setKelolaPengurusOpen(!kelolaPengurusOpen);
                            }}
                            title={!desktopSidebarOpen ? "Kelola Pengurus" : undefined}
                            className={`flex items-center ${desktopSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-all duration-200`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {desktopSidebarOpen && <span className="whitespace-nowrap">Kelola Pengurus</span>}
                            </div>
                            {desktopSidebarOpen && (
                                <svg className={`w-4 h-4 transition-transform duration-200 ${kelolaPengurusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            )}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${kelolaPengurusOpen && desktopSidebarOpen ? 'max-h-32' : 'max-h-0'}`}>
                            <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                                {kelolaPengurusLinks.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                            currentPath === (sub.href !== '#' ? new URL(sub.href).pathname : sub.href)
                                                ? 'text-amber-600 bg-amber-50 font-medium'
                                                : 'text-gray-500 hover:text-amber-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>


            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 bg-gray-50">
                {/* Top Navbar */}
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu button */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 mr-2">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>


                            {/* Page Title */}
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">Selamat Datang, {auth.user?.nama_lengkap || 'User'}</h1>
                        </div>

                        {/* Right side Profile Dropdown */}
                        <Menu as="div" className="relative inline-block text-left z-50 flex-shrink-0">
                            <Menu.Button className="flex items-center gap-2 sm:gap-3 w-full cursor-pointer hover:bg-gray-50 p-1.5 sm:pr-2 rounded-xl transition-colors border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-amber-100 border-2 border-amber-200">
                                    {(auth.user as any)?.foto_profile_url ? (
                                        <img src={(auth.user as any).foto_profile_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm sm:text-base font-bold text-amber-700">
                                            {auth.user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'P'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col items-start leading-tight max-w-[100px] sm:max-w-[200px]">
                                    <span className="text-xs sm:text-sm font-bold text-gray-900 truncate w-full text-left">{auth.user?.nama_lengkap || 'User'}</span>
                                    <span className="text-[10px] sm:text-sm text-gray-600 truncate w-full text-left">Pengurus RW</span>
                                </div>
                                <svg className="w-4 h-4 text-gray-500 ml-0 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Menu.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-1 py-1 ">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('profile.edit')}
                                                    className={`${
                                                        active ? 'bg-amber-50 text-amber-600' : 'text-gray-700'
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                                                >
                                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Edit Profil
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className={`${
                                                        active ? 'bg-red-50' : ''
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-red-600`}
                                                >
                                                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Keluar
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
