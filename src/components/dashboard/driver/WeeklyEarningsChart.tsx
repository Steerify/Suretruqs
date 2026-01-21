import React from 'react';

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

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Weekly Earnings</h4>
            <div className="flex items-end justify-between gap-2 h-48">
                {data.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="relative w-full flex items-end justify-center">
                            <div 
                                className="w-full bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-all duration-500"
                                style={{ height: `${(item.amount / maxAmount) * 100}%` }}
                            >
                                <div 
                                    className="absolute bottom-0 w-full bg-brand-primary rounded-lg transition-all duration-700 delay-100"
                                    style={{ height: '0' }} // Initial state for animation
                                    data-height={`${(item.amount / maxAmount) * 100}%`}
                                ></div>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl pointer-events-none">
                                ₦{item.amount.toLocaleString()}
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                    </div>
                ))}
            </div>
            {/* Real Animation Script Hook */}
            <script dangerouslySetInnerHTML={{ __html: `
                setTimeout(() => {
                    document.querySelectorAll('[data-height]').forEach(el => {
                        el.style.height = el.getAttribute('data-height');
                    });
                }, 100);
            `}} />
        </div>
    );
};
