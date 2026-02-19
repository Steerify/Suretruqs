import React from 'react';
import { Fuel, Battery, Gauge, AlertCircle } from 'lucide-react';

export const VehicleHealthCard = () => {
    const stats = [
        { label: 'Fuel level', value: 75, icon: Fuel, color: 'bg-orange-500' },
        { label: 'Battery charge', value: 92, icon: Battery, color: 'bg-green-500' },
        { label: 'Tire Pressure', value: 88, icon: Gauge, color: 'bg-blue-500' },
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Vehicle Health</h4>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-700 uppercase">Excellent</span>
                </div>
            </div>

            <div className="space-y-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                            <div className="flex items-center gap-2 text-slate-600">
                                <stat.icon size={14} className="text-slate-400" />
                                {stat.label}
                            </div>
                            <span className="text-slate-900">{stat.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${stat.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${stat.value}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="p-2 bg-blue-100 rounded-xl text-brand-primary">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">Next Service Due</p>
                        <p className="text-[10px] text-slate-500 font-medium">In 1,240 km • 2 weeks</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
