import React, { useEffect } from 'react';
import { Shipment, ShipmentStatus } from '../../../types';

interface WeeklyEarningsChartProps {
    shipments: Shipment[];
}

export const WeeklyEarningsChart = ({ shipments }: WeeklyEarningsChartProps) => {
    // Generate last 7 days including today
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            dateStr: d.toDateString(),
            dayLabel: days[d.getDay()],
            amount: 0
        };
    });

    // Aggregate earnings from shipments
    shipments.forEach(s => {
        if (s.status === ShipmentStatus.DELIVERED) {
            const sDate = new Date(s.date).toDateString();
            const dayEntry = last7Days.find(d => d.dateStr === sDate);
            if (dayEntry) {
                dayEntry.amount += (s.price || 0);
            }
        }
    });

    const maxAmount = Math.max(...last7Days.map(d => d.amount), 1000); // 1000 as min scale

    useEffect(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll<HTMLElement>('[data-height]').forEach(el => {
                if (el.dataset.height) {
                    el.style.height = el.dataset.height!;
                }
            });
        });
    }, [shipments]);

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Weekly Earnings (₦)
            </h4>

            <div className="flex items-end justify-between gap-2 h-48">
                {last7Days.map((item, idx) => {
                    const height = `${(item.amount / maxAmount) * 100}%`;

                    return (
                        <div
                            key={idx}
                            className="flex-1 flex flex-col items-center gap-2 group"
                        >
                            <div className="relative w-full h-full flex items-end">
                                <div className="w-full bg-blue-50 rounded-lg overflow-hidden">
                                    <div
                                        data-height={height}
                                        className="w-full bg-brand-primary rounded-lg transition-all duration-700 ease-out"
                                        style={{ height: '0%' }}
                                    />
                                </div>

                                <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                                    ₦{item.amount.toLocaleString()}
                                </div>
                            </div>

                            <span className="text-[10px] font-bold text-slate-400">
                                {item.dayLabel}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
