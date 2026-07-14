import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PageProps } from '@/types';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#beranda' },
        { name: 'Profile', href: '#profile' },
        { name: 'Visi Misi', href: '#visi-misi' },
        { name: 'Data Warga', href: '#data-warga' },
        { name: 'Pengumuman', href: '#pengumuman' },
        { name: 'Berita', href: '#berita' },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMobileMenuOpen(false);
        } else {
            // Elemen tidak ada di halaman ini (misal halaman login)
            // Simpan target ke sessionStorage lalu navigasi ke beranda via Inertia
            e.preventDefault();
            const targetId = href.replace('#', '');
            sessionStorage.setItem('scrollTarget', targetId);
            router.visit('/');
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav
            id="main-navbar"
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/95 backdrop-blur-md shadow-lg shadow-black/5"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/icons/logoperumahan.png"
                            alt="Logo Perumahan Griya Asri Bahagia"
                            className="h-14 w-14 rounded-full object-cover shadow-md border-2 border-brand-gold-400/50 transition-transform duration-300 hover:scale-110"
                        />
                        <div>
                            <h1 className="text-base sm:text-lg font-semibold leading-tight transition-colors duration-300 text-gray-800">
                                Perumahan Griya Asri Bahagia
                            </h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => scrollToSection(e, link.href)}
                                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group whitespace-nowrap text-gray-800 hover:text-brand-green-700 hover:bg-brand-green-50"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-gold-500 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
                            </a>
                        ))}

                        {/* Login Button */}
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="ml-4 px-5 py-2.5 text-sm font-semibold bg-brand-gold-500 text-black rounded-xl shadow-md hover:bg-brand-gold-400 hover:scale-105 transition-all duration-300"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="ml-4 px-5 py-2.5 text-sm font-semibold bg-brand-gold-500 text-black rounded-xl shadow-md hover:bg-brand-gold-400 hover:scale-105 transition-all duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        id="mobile-menu-button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg transition-colors duration-300 text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 space-y-1 shadow-xl">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="block px-4 py-3 text-sm font-medium text-gray-800 hover:text-brand-green-700 hover:bg-brand-green-50 rounded-lg transition-all duration-200"
                        >
                            {link.name}
                        </a>
                    ))}
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="block w-full text-center mt-3 px-4 py-3 text-sm font-semibold bg-brand-gold-500 hover:bg-brand-gold-400 text-black rounded-xl shadow-md transition-colors duration-300"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="block w-full text-center mt-3 px-4 py-3 text-sm font-semibold bg-brand-gold-500 hover:bg-brand-gold-400 text-black rounded-xl shadow-md transition-colors duration-300"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
