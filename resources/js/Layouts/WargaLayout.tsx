import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface SidebarLink {
    name: string;
    href: string;
    icon: JSX.Element;
}

export default function WargaLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { auth } = usePage<PageProps>().props;
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const currentPath = window.location.pathname;

    const sidebarWidth = desktopSidebarOpen ? 'lg:w-64' : 'lg:w-20';

    const sidebarLinks: SidebarLink[] = [
        {
            name: 'Dashboard',
            href: route('warga.dashboard'),
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            name: 'Data Warga',
            href: route('warga.data-warga.index'),
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            name: 'Iuran',
            href: route('warga.iuran.index'),
            icon: (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        }
    ];

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 ${sidebarWidth} ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Desktop Toggle Button */}
                <button 
                    onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                    className="hidden lg:flex items-center justify-center absolute -right-4 top-8 w-8 h-8 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 hover:scale-110 transition-all duration-300 z-50 shadow-md focus:outline-none"
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
                        className="p-2 -mr-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-3 py-4 space-y-1 overflow-y-auto flex-1 scrollbar-hide">
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
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 bg-gray-50">
                <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 mr-2">
                            <button
                                onClick={() => setMobileSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">Selamat Datang, {auth.user?.nama_lengkap || 'Warga'}</h1>
                        </div>

                        <Menu as="div" className="relative inline-block text-left z-50 flex-shrink-0">
                            <Menu.Button className="flex items-center gap-2 sm:gap-3 w-full cursor-pointer hover:bg-gray-50 p-1.5 sm:pr-2 rounded-xl transition-colors border border-transparent focus:outline-none">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-amber-100 border-2 border-amber-200">
                                    {(auth.user as any)?.foto_profile_url ? (
                                        <img src={(auth.user as any).foto_profile_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm sm:text-base font-bold text-amber-700">
                                            {auth.user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'W'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col items-start leading-tight max-w-[100px] sm:max-w-[200px]">
                                    <span className="text-xs sm:text-sm font-bold text-gray-900 truncate w-full text-left">{auth.user?.nama_lengkap || 'Warga'}</span>
                                    <span className="text-[10px] sm:text-sm text-gray-600 truncate w-full text-left">Warga</span>
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

                <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
