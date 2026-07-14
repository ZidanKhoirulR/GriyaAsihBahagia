import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BeritaSection({ berita }: { berita: any[] }) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".berita-header", 
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: ".berita-header",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.7
                }
            );

            gsap.fromTo(".berita-card", 
                { opacity: 0, y: 50 },
                {
                    scrollTrigger: {
                        trigger: ".berita-grid",
                        start: "top 70%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.2
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="berita" className="py-24 bg-white overflow-hidden" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="berita-header text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Berita Terkini
                    </h2>
                    <div className="w-24 h-1.5 bg-brand-gold-500 mx-auto rounded-full mb-6"></div>
                </div>

                <div className="berita-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {berita.map((item) => (
                        <div key={item.id} className="berita-card bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                {item.gambar ? (
                                    <img 
                                        src={`/storage/${item.gambar}`} 
                                        alt={item.judul} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(item.tanggal_upload).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-gold-600 transition-colors line-clamp-2">
                                    <a href="#" className="focus:outline-none cursor-default">
                                        <span className="absolute inset-0" aria-hidden="true"></span>
                                        {item.judul}
                                    </a>
                                </h3>
                                <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                                    {item.isi_kalimat}
                                </p>
                                <div className="mt-auto">
                                    <span className="text-brand-green-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Baca Selengkapnya
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a href="#" className="inline-flex items-center text-gray-600 hover:text-brand-gold-600 font-medium hover:underline transition-all group">
                        lihat semua berita 
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
