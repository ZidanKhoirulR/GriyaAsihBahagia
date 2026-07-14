export default function Footer() {
    return (
        <footer id="footer" className="bg-white text-gray-800 border-t border-gray-100 shadow-[0_-8px_30px_-5px_rgba(0,0,0,0.05)] relative z-10">
            {/* Responsive styles */}
            <style>{`
                .footer-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                @media (min-width: 768px) {
                    .footer-grid {
                        flex-direction: row;
                        gap: 3rem;
                    }
                    .footer-map-col {
                        flex: 1;
                    }
                    .footer-info-col {
                        flex: 1;
                    }
                }
                .footer-map-col {
                    width: 100%;
                }
                .footer-info-col {
                    width: 100%;
                }
            `}</style>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="footer-grid">

                    {/* Left: Google Maps Embed */}
                    <div className="footer-map-col space-y-4">
                        <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Lokasi
                        </h4>
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:border-brand-gold-400 transition-all duration-300" style={{ width: '100%', height: '256px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d247.89!2d107.0242583!3d-6.1734946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwMTAnMjQuNiJTIDEwN8KwMDEnMjcuMyJF!5e0!3m2!1sid!2sid!4v1720000000000!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Perumahan Griya Asri Bahagia"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right: Address & Social Media */}
                    <div className="footer-info-col space-y-6">
                        {/* Address */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Alamat
                            </h4>
                            <p className="text-gray-600 leading-relaxed pl-7">
                                Perumahan Griya Asri Bahagia, Kelurahan Bahagia, Kecamatan Babelan, Kabupaten Bekasi, Jawa Barat, Indonesia
                            </p>
                        </div>

                        {/* Social Media */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Sosial Media
                            </h4>
                            <div className="pl-7">
                                <a
                                    href="https://www.youtube.com/@griyaasribahagiakel.bahagi2761"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block text-gray-600 hover:text-red-600 transition-colors duration-300"
                                    aria-label="YouTube Channel Griya Asri Bahagia"
                                >
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Bar (Copyright) */}
            <div className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-center">
                        <p className="text-sm text-gray-500 text-center">
                            &copy; 2026 Perumahan Griya Asri Bahagia
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
