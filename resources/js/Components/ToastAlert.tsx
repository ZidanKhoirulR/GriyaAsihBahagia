import { useEffect, useState } from 'react';

interface ToastAlertProps {
    message: string;
    type?: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
    onClose?: () => void;
}

export default function ToastAlert({ message, type = 'success', duration = 4000, onClose }: ToastAlertProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            setIsLeaving(false);

            const timer = setTimeout(() => {
                setIsLeaving(true);
                setTimeout(() => {
                    setIsVisible(false);
                    onClose?.();
                }, 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    if (!isVisible || !message) return null;

    const styles: Record<string, { bg: string; border: string; icon: JSX.Element }> = {
        success: {
            bg: 'bg-green-100',
            border: 'border-green-300',
            icon: (
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        info: {
            bg: 'bg-blue-100',
            border: 'border-blue-300',
            icon: (
                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        warning: {
            bg: 'bg-yellow-100',
            border: 'border-yellow-300',
            icon: (
                <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
        error: {
            bg: 'bg-red-100',
            border: 'border-red-300',
            icon: (
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    };

    const s = styles[type];

    return (
        <div className="fixed top-6 right-6 z-[9999]">
            <div
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-lg min-w-[320px] max-w-[420px] ${s.bg} ${s.border} transition-all duration-300 ${isLeaving ? 'opacity-0 translate-x-6' : 'opacity-100 translate-x-0'}`}
                style={{ animation: isLeaving ? undefined : 'slideInRight 0.3s ease-out' }}
            >
                <div className="flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 capitalize">{type}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsLeaving(true);
                        setTimeout(() => {
                            setIsVisible(false);
                            onClose?.();
                        }, 300);
                    }}
                    className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
