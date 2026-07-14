import ApplicationLogo from '@/Components/ApplicationLogo';
import Navbar from '@/Components/Navbar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="relative flex flex-col h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Background Watermark */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
                <img 
                    src="/backgroundlogin.png" 
                    alt="Background Watermark" 
                    style={{ width: '110%', maxWidth: 'none', opacity: 0.45, marginTop: '15%' }}
                />
            </div>

            {/* Content (below navbar) */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
                {/* Form Container */}
                <div className="z-10 w-full sm:max-w-md bg-white/95 backdrop-blur-sm px-8 py-6 shadow-xl rounded-2xl border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
