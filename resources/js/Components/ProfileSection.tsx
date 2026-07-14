import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProfileSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(".profile-header > *", 
                { opacity: 0, y: 40 },
                {
                    scrollTrigger: {
                        trigger: ".profile-header",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    stagger: 0.2
                }
            );

            gsap.fromTo(".profile-img", 
                { opacity: 0, x: -60 },
                {
                    scrollTrigger: {
                        trigger: ".profile-img",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    x: 0,
                    duration: 0.8
                }
            );

            gsap.fromTo(".profile-text > *", 
                { opacity: 0, x: 60 },
                {
                    scrollTrigger: {
                        trigger: ".profile-text",
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.2
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="profile" className="py-24 bg-white overflow-hidden" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="profile-header text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Profile
                    </h2>
                    <div className="w-24 h-1.5 bg-brand-gold-500 mx-auto rounded-full mb-6"></div>
                </div>

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Side */}
                    <div className="profile-img w-full lg:w-1/2 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold-500/20 to-transparent mix-blend-multiply z-10"></div>
                            <img
                                src="/images/profile.png"
                                alt="Profile"
                                className="w-full h-full object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="profile-text w-full lg:w-1/2 space-y-6">
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            Wujudkan Rumah Impian di <span className="text-brand-gold-500">Griya Asri Bahagia</span>
                        </h3>
                        <div className="w-20 h-1.5 bg-gradient-to-r from-brand-gold-500 to-brand-green-500 rounded-full"></div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Perumahan Griya Asri Bahagia yang berlokasi di RW 040, Kelurahan Bahagia, Kecamatan Babelan, Kabupaten Bekasi hadir sebagai solusi hunian modern yang mengutamakan kenyamanan, keamanan, dan keharmonisan lingkungan.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Kami berkomitmen untuk membangun bukan hanya sekadar bangunan rumah, tetapi juga sebuah komunitas yang saling mendukung di tengah lingkungan yang asri dan hijau.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
