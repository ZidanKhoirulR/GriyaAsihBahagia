import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const images = [
    '/images/slider1.png',
    '/images/slider2.png'
];

export default function HeroSlider() {
    return (
        <section id="beranda" className="relative w-full h-screen">
            {/* Background Image Slider */}
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet custom-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
                }}
                loop={true}
                speed={1200}
                allowTouchMove={false}
                className="absolute inset-0 w-full h-full z-0 hero-swiper"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                            <img
                                src={img}
                                alt="Perumahan Griya Asri Bahagia"
                                className="w-full h-full object-cover"
                            />
                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Static Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center h-full text-center px-4 pointer-events-none">
                <p className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2 animate-fade-in-up drop-shadow-lg">
                    Selamat Datang di
                </p>
                <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up drop-shadow-lg">
                    Griya Asri Bahagia
                </h2>
                <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed animate-fade-in-up">
                    RW 040 Babelan menghadirkan layanan informasi warga secara digital sehingga tercipta lingkungan RW yang lebih tertata dan harmonis
                </p>
            </div>
        </section>
    );
}
