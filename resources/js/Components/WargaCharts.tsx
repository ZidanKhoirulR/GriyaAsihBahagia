import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RTData = { rt: string; jumlah: number };
export type UsiaData = { label: string; jumlah: number; color: string };

// --- Bar Chart (SVG) ---
export function BarChart({ data }: { data: RTData[] }) {
    const maxVal = Math.max(...data.map(d => d.jumlah), 1);
    // Minimal max y adalah 750, dengan kelipatan 150
    const roundedMax = Math.max(750, Math.ceil(maxVal / 150) * 150);
    const barWidth = 36;
    const gap = 16;
    const chartHeight = 200;
    const leftPadding = 40;
    const chartWidth = data.length * (barWidth + gap);
    const svgRef = useRef<SVGSVGElement>(null);

    // Bikin yTicks dari 0, 150, 300, 450, 600, 750, ...
    const yTicks = Array.from({ length: (roundedMax / 150) + 1 }, (_, i) => i * 150);

    useEffect(() => {
        if (!svgRef.current) return;
        const bars = svgRef.current.querySelectorAll('.bar-rect');
        const labels = svgRef.current.querySelectorAll('.bar-label-top');

        gsap.fromTo(bars,
            { scaleY: 0, transformOrigin: 'bottom' },
            {
                scrollTrigger: {
                    trigger: svgRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
                scaleY: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power3.out',
            }
        );
        gsap.fromTo(labels,
            { opacity: 0, y: 10 },
            {
                scrollTrigger: {
                    trigger: svgRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 1, y: 0,
                duration: 0.5,
                stagger: 0.08,
                delay: 0.4,
            }
        );
    }, []);

    return (
        <div className="overflow-x-auto flex justify-center">
            <svg
                ref={svgRef}
                viewBox={`0 -15 ${chartWidth + leftPadding + 20} ${chartHeight + 65}`}
                className="w-full max-h-[250px]"
                preserveAspectRatio="xMidYMid meet"
            >
                {yTicks.map(tick => {
                    const yPos = chartHeight - (tick / roundedMax) * chartHeight;
                    return (
                        <g key={tick}>
                            <text x={leftPadding - 8} y={yPos + 4} textAnchor="end" fontSize="11" fill="#6b7280">{tick}</text>
                            <line x1={leftPadding - 4} y1={yPos} x2={chartWidth + leftPadding + 15} y2={yPos} stroke={tick === 0 ? "#d1d5db" : "#e5e7eb"} strokeWidth={tick === 0 ? "2" : "1"} strokeDasharray={tick === 0 ? "none" : "4 4"} />
                        </g>
                    );
                })}

                <line x1={leftPadding} y1="0" x2={leftPadding} y2={chartHeight} stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />

                {data.map((d, i) => {
                    const barH = Math.max((d.jumlah / roundedMax) * chartHeight, 2);
                    const x = i * (barWidth + gap) + leftPadding + 10;
                    const y = chartHeight - barH;
                    return (
                        <g key={d.rt}>
                            <rect className="bar-rect" x={x} y={y} width={barWidth} height={barH} rx={6} fill="url(#barGradient)" />
                            <text className="bar-label-top" x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#374151">{d.jumlah}</text>
                            <text x={x + barWidth / 2} y={chartHeight + 18} textAnchor="middle" fontSize="11" fill="#6b7280">{d.rt}</text>
                        </g>
                    );
                })}

                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// --- Donut Chart (SVG) ---
export function DonutChart({ data }: { data: UsiaData[] }) {
    const total = data.reduce((sum, d) => sum + d.jumlah, 0);
    const cx = 120, cy = 120, radius = 90, strokeWidth = 32;
    const circumference = 2 * Math.PI * radius;
    const svgRef = useRef<SVGSVGElement>(null);

    let cumulativeOffset = 0;

    useEffect(() => {
        if (!svgRef.current) return;
        const arcs = svgRef.current.querySelectorAll('.donut-arc');
        gsap.fromTo(arcs,
            { strokeDashoffset: circumference },
            {
                scrollTrigger: {
                    trigger: svgRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
                strokeDashoffset: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power2.out',
            }
        );
    }, []);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <svg ref={svgRef} viewBox="0 0 240 240" className="w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0">
                {total === 0 ? (
                    // Tampilkan lingkaran abu-abu jika data kosong
                    <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
                ) : (
                    data.map((d) => {
                        if (d.jumlah === 0) return null;
                        const segmentLength = (d.jumlah / total) * circumference;
                        const dashArray = `${segmentLength} ${circumference - segmentLength}`;
                        const rotation = (cumulativeOffset / total) * 360 - 90;
                        cumulativeOffset += d.jumlah;
                        return (
                            <circle
                                key={d.label}
                                className="donut-arc"
                                cx={cx} cy={cy} r={radius}
                                fill="none"
                                stroke={d.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={dashArray}
                                strokeLinecap="round"
                                transform={`rotate(${rotation} ${cx} ${cy})`}
                            />
                        );
                    })
                )}
                <text x={cx} y={cy - 8} textAnchor="middle" fontSize="26" fontWeight="700" fill="#1f2937">{total}</text>
                <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6b7280">Total Warga</text>
            </svg>

            {/* Legend — single column agar tidak tumpang tindih */}
            <div className="flex flex-col gap-2 min-w-0">
                {data.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-600 whitespace-nowrap">{d.label} ({d.jumlah})</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
