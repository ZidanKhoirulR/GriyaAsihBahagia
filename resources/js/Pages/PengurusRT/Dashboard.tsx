import { Head } from '@inertiajs/react';
import PengurusRTLayout from '@/Layouts/PengurusRTLayout';
import { useEffect, useRef, useState } from 'react';
import { BarChart, DonutChart, RTData, UsiaData } from '@/Components/WargaCharts';

// --- Animated Number Component ---
function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(2, -10 * progress);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count.toLocaleString('id-ID')}</span>;
}

// --- Props Interface ---
interface DashboardProps {
    stats: {
        keluarga: number;
        warga: number;
        pria: number;
        wanita: number;
        balita: number;
        lansia: number;
        ibuMenyusui: number;
        ibuHamil: number;
    };
    charts: {
        dataPerRT: RTData[];
        dataKelompokUsia: UsiaData[];
        dataAgama: UsiaData[];
        dataPendidikan: UsiaData[];
        dataPekerjaan: UsiaData[];
    };
}

export default function Dashboard({ stats, charts }: DashboardProps) {
    const statsConfig = [
        {
            label: 'Keluarga',
            value: stats.keluarga || 0,
            icon: <img src="/images/icons/logokeluarga.png" alt="Keluarga" className="w-7 h-7 object-contain" />,
        },
        {
            label: 'Warga',
            value: stats.warga || 0,
            icon: (
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            label: 'Pria',
            value: stats.pria || 0,
            icon: <img src="/images/icons/logopria.png" alt="Pria" className="w-7 h-7 object-contain" />,
        },
        {
            label: 'Wanita',
            value: stats.wanita || 0,
            icon: <img src="/images/icons/logowanita.png" alt="Wanita" className="w-7 h-7 object-contain" />,
        },
        {
            label: 'Balita',
            sublabel: '0-5 tahun',
            value: stats.balita || 0,
            icon: <img src="/images/icons/logobalita.png" alt="Balita" className="w-10 h-10 object-contain" />,
        },
        {
            label: 'Lansia',
            sublabel: '>60 tahun',
            value: stats.lansia || 0,
            icon: <img src="/images/icons/logolansia.png" alt="Lansia" className="w-7 h-7 object-contain" />,
        },
        {
            label: 'Ibu Menyusui',
            sublabel: 'Asupan ASI',
            value: stats.ibuMenyusui || 0,
            icon: <img src="/images/icons/logoibumenyusui.png" alt="Ibu Menyusui" className="w-7 h-7 object-contain" />,
        },
        {
            label: 'Ibu Hamil',
            sublabel: 'Pra Melahirkan',
            value: stats.ibuHamil || 0,
            icon: <img src="/images/icons/logoibuhamil.png" alt="Ibu Hamil" className="w-7 h-7 object-contain" />,
        },
    ];

    return (
        <PengurusRTLayout title="Halaman Dashboard">
            <Head title="Halaman Dashboard" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                {statsConfig.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                {stat.icon}
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">{stat.label}</p>
                                {stat.sublabel && (
                                    <p className="text-[10px] text-gray-500">{stat.sublabel}</p>
                                )}
                            </div>
                        </div>
                        <p className="text-xl md:text-2xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={stat.value} />
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Bar Chart - Warga per RT */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Jumlah Warga per RT</h3>
                    <BarChart data={charts.dataPerRT} />
                </div>

                {/* Donut Chart - Kelompok Usia */}
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Kelompok Usia Warga</h3>
                    <DonutChart data={charts.dataKelompokUsia} />
                </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Agama</h3>
                    <DonutChart data={charts.dataAgama} />
                </div>

                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Pendidikan</h3>
                    <DonutChart data={charts.dataPendidikan} />
                </div>

                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Pekerjaan</h3>
                    <DonutChart data={charts.dataPekerjaan} />
                </div>
            </div>
        </PengurusRTLayout>
    );
}

