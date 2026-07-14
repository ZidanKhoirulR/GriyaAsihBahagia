import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VisiMisiSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const visi = "Menjadi kawasan perumahan yang asri, aman, dan nyaman, serta membangun komunitas warga yang harmonis, peduli lingkungan, dan sejahtera di wilayah Babelan, Bekasi.";

    const misi = [
        "Menciptakan lingkungan hunian yang hijau, bersih, dan sehat untuk seluruh warga.",
        "Mengelola sistem keamanan yang responsif dan terpercaya selama 24 jam.",
        "Meningkatkan kerukunan antar warga melalui kegiatan sosial dan kebersamaan.",
        "Menyediakan dan merawat fasilitas umum yang layak dan nyaman digunakan bersama.",
        "Membangun tata kelola lingkungan (RW/RT) yang transparan, adil, dan melayani."
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".visimisi-header > *",
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: ".visimisi-header",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1, y: 0, duration: 0.7, stagger: 0.2
                }
            );

            gsap.fromTo(".visi-card",
                { opacity: 0, x: -50 },
                {
                    scrollTrigger: {
                        trigger: ".visimisi-grid",
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1, x: 0, duration: 0.9, ease: "power3.out"
                }
            );

            gsap.fromTo(".misi-card",
                { opacity: 0, x: 50 },
                {
                    scrollTrigger: {
                        trigger: ".visimisi-grid",
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1, x: 0, duration: 0.9, ease: "power3.out"
                }
            );

            gsap.fromTo(".misi-item",
                { opacity: 0, x: 30 },
                {
                    scrollTrigger: {
                        trigger: ".misi-card",
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "power2.out"
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="visi-misi" className="py-24 bg-gray-50 overflow-hidden" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="visimisi-header text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visi &amp; Misi</h2>
                    <div className="w-24 h-1.5 bg-brand-gold-500 mx-auto rounded-full mb-6"></div>
                </div>

                {/* Cards */}
                <div className="visimisi-grid grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Visi */}
                    <div className="visi-card md:col-span-5 bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-brand-gold-100 flex flex-col justify-center hover:-translate-y-2 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
                        <div className="w-12 h-1 bg-brand-gold-400 rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-brand-gold-400 pl-5 italic">
                            {visi}
                        </p>
                    </div>

                    {/* Misi */}
                    <div className="misi-card md:col-span-7 bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-brand-green-100 hover:-translate-y-2 transition-transform duration-500">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
                        <div className="w-12 h-1 bg-brand-green-500 rounded-full mb-6"></div>
                        <ul className="space-y-4">
                            {misi.map((item, index) => (
                                <li key={index} className="misi-item flex items-start gap-4">
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-green-50 border border-brand-green-200 flex items-center justify-center mt-0.5">
                                        <span className="text-brand-green-600 font-bold text-xs">{index + 1}</span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}
