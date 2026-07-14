import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PengumumanSection({ pengumuman }: { pengumuman: any[] }) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".pengumuman-header", 
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: ".pengumuman-header",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                }
            );

            gsap.fromTo(".pengumuman-card", 
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: ".pengumuman-grid",
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="pengumuman" className="py-20 bg-gray-50 border-t border-b border-gray-100" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pengumuman-header text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pengumuman
                    </h2>
                    <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full"></div>
                </div>

                {(!pengumuman || pengumuman.length === 0) ? (
                    <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        Belum ada pengumuman saat ini.
                    </div>
                ) : (
                    <div className="pengumuman-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pengumuman.map((item) => (
                            <div key={item.id} className="pengumuman-card bg-white rounded-xl shadow-md shadow-gray-200/40 p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-3 bg-amber-50 inline-block px-2.5 py-1 rounded-full">
                                    Informasi Warga
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.judul}</h3>
                                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed mb-4">
                                    {item.isi_pengumuman}
                                </p>
                                {item.tanggal_berlaku && (
                                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Berlaku s/d: {new Date(item.tanggal_berlaku).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
