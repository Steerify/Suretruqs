import React, { useEffect } from 'react';

export const WeeklyEarningsChart = () => {
    const data = [
        { day: 'Mon', amount: 12000 },
        { day: 'Tue', amount: 18000 },
        { day: 'Wed', amount: 15000 },
        { day: 'Thu', amount: 22000 },
        { day: 'Fri', amount: 25000 },
        { day: 'Sat', amount: 30000 },
        { day: 'Sun', amount: 10000 },
    ];

    const maxAmount = Math.max(...data.map(d => d.amount));

    useEffect(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll<HTMLElement>('[data-height]').forEach(el => {
                el.style.height = el.dataset.height!;
            });
        });
    }, []);

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Weekly Earnings
            </h4>

            <div className="flex items-end justify-between gap-2 h-48">
                {data.map((item, idx) => {
                    const height = `${(item.amount / maxAmount) * 100}%`;

                    return (
                        <div
                            key={idx}
                            className="flex-1 flex flex-col items-center gap-2 group"
                        >
                            {/* THIS div owns the height */}
                            <div className="relative w-full h-full flex items-end">
                                <div className="w-full bg-blue-50 rounded-lg overflow-hidden">
                                    <div
                                        data-height={height}
                                        className="w-full bg-brand-primary rounded-lg transition-all duration-700 ease-out"
                                        style={{ height: '0%' }}
                                    />
                                </div>

                                {/* Tooltip */}
                                <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none">
                                    ₦{item.amount.toLocaleString()}
                                </div>
                            </div>

                            <span className="text-[10px] font-bold text-slate-400">
                                {item.day}
                            </span>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};
