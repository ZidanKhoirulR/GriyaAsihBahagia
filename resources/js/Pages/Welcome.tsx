import { useEffect } from 'react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import HeroSlider from '@/Components/HeroSlider';
import ProfileSection from '@/Components/ProfileSection';
import VisiMisiSection from '@/Components/VisiMisiSection';
import DataWargaSection from '@/Components/DataWargaSection';
import PengumumanSection from '@/Components/PengumumanSection';
import BeritaSection from '@/Components/BeritaSection';
import Footer from '@/Components/Footer';
import { RTData, UsiaData } from '@/Components/WargaCharts';

interface WelcomeProps extends PageProps {
    pengumuman?: any[];
    berita?: any[];
    stats?: {
        keluarga: number;
        warga: number;
        pria: number;
        wanita: number;
        balita: number;
        lansia: number;
        ibuMenyusui: number;
        ibuHamil: number;
    };
    charts?: {
        dataPerRT: RTData[];
        dataKelompokUsia: UsiaData[];
        dataAgama: UsiaData[];
        dataPendidikan: UsiaData[];
        dataPekerjaan: UsiaData[];
    };
}

export default function Welcome({
    auth,
    pengumuman = [],
    berita = [],
    stats,
    charts,
}: WelcomeProps) {
    useEffect(() => {
        // Nonaktifkan scroll restoration browser
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Cek apakah ada target section dari navigasi halaman lain (misal dari login)
        const scrollTarget = sessionStorage.getItem('scrollTarget');
        if (scrollTarget) {
            sessionStorage.removeItem('scrollTarget');
            // Tunggu semua komponen selesai render lalu scroll
            setTimeout(() => {
                const element = document.getElementById(scrollTarget);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 600);
        } else {
            // Selalu kembali ke paling atas saat halaman dimuat tanpa target
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, []);
    return (
        <>
            <Head title="Beranda">
                <meta name="description" content="Website resmi Perumahan Griya Asri Bahagia RW 040, Kelurahan Bahagia, Kecamatan Babelan, Kabupaten Bekasi. Hunian modern, aman, dan nyaman untuk keluarga Anda." />
            </Head>

            <div className="min-h-screen bg-white font-sans">
                {/* Header Navigation */}
                <Navbar />

                {/* Hero Section with Image Slider */}
                <HeroSlider />

                {/* Profile Section */}
                <ProfileSection />

                {/* Visi Misi Section */}
                <VisiMisiSection />

                {/* Data Warga Section */}
                <DataWargaSection stats={stats} charts={charts} />

                {/* Pengumuman Section */}
                <PengumumanSection pengumuman={pengumuman} />

                {/* Berita Terkini Section */}
                <BeritaSection berita={berita} />

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
