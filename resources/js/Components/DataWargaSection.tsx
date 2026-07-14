import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart, DonutChart, RTData, UsiaData } from '@/Components/WargaCharts';

gsap.registerPlugin(ScrollTrigger);

// --- Props Interface ---
interface DataWargaSectionProps {
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

// --- Komponen Angka Animasi ---
function AnimatedNumber({ target, duration = 2000 }: { target: number; duration?: number }) {
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
                        // easeOutExpo
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

// --- Komponen Utama ---
export default function DataWargaSection({ stats, charts }: DataWargaSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.datawarga-header > *',
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: '.datawarga-header',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.2,
                }
            );

            gsap.fromTo('.stat-card',
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    scrollTrigger: {
                        trigger: '.stats-row',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)',
                }
            );

            gsap.fromTo('.chart-card',
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: '.charts-row',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                    opacity: 1, y: 0,
                    duration: 0.8, stagger: 0.2, ease: 'power3.out',
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Stats dengan fallback 0 jika belum ada data
    const s = stats ?? {
        keluarga: 0, warga: 0, pria: 0, wanita: 0,
        balita: 0, lansia: 0, ibuMenyusui: 0, ibuHamil: 0,
    };

    // Charts dengan fallback kosong
    const c = charts ?? {
        dataPerRT: [],
        dataKelompokUsia: [],
        dataAgama: [],
        dataPendidikan: [],
        dataPekerjaan: [],
    };

    return (
        <section id="data-warga" className="py-24 bg-white overflow-hidden" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="datawarga-header text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Data Warga</h2>
                    <div className="w-24 h-1.5 bg-brand-gold-500 mx-auto rounded-full mb-6"></div>
                </div>

                {/* Stats Cards */}
                <div className="stats-row grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                    {/* Keluarga */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logokeluarga.png" alt="Keluarga" className="w-9 h-9 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Keluarga</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.keluarga} />
                        </p>
                    </div>

                    {/* Warga */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <svg className="w-9 h-9 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Warga</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.warga} />
                        </p>
                    </div>

                    {/* Pria */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logopria.png" alt="Pria" className="w-9 h-9 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Pria</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.pria} />
                        </p>
                    </div>

                    {/* Wanita */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logowanita.png" alt="Wanita" className="w-9 h-9 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Wanita</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.wanita} />
                        </p>
                    </div>

                    {/* Balita */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logobalita.png" alt="Balita" className="w-13 h-13 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Balita</p>
                                <p className="text-[10px] text-gray-500">0-5 tahun</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.balita} />
                        </p>
                    </div>

                    {/* Lansia */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logolansia.png" alt="Lansia" className="w-9 h-9 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Lansia</p>
                                <p className="text-[10px] text-gray-500">&gt;60 tahun</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.lansia} />
                        </p>
                    </div>

                    {/* Ibu Menyusui */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logoibumenyusui.png" alt="Ibu Menyusui" className="w-9 h-9 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Ibu Menyusui</p>
                                <p className="text-[10px] text-gray-500">Asupan ASI</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.ibuMenyusui} />
                        </p>
                    </div>

                    {/* Ibu Hamil */}
                    <div className="stat-card bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                                <img src="/images/icons/logoibuhamil.png" alt="Ibu Hamil" className="w-9 h-9 object-contain" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 leading-tight">Ibu Hamil</p>
                                <p className="text-[10px] text-gray-500">Pra Melahirkan</p>
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl text-gray-900 tracking-tight">
                            <AnimatedNumber target={s.ibuHamil} />
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="charts-row grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart - Warga per RT */}
                    <div className="chart-card bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Jumlah Warga per RT</h3>
                        <BarChart data={c.dataPerRT} />
                    </div>

                    {/* Donut Chart - Kelompok Usia */}
                    <div className="chart-card bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Kelompok Usia Warga</h3>
                        <DonutChart data={c.dataKelompokUsia} />
                    </div>
                </div>

            </div>
        </section>
    );
}
