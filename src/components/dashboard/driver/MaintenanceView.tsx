import React from 'react';
import { ChevronRight, Wrench, AlertCircle, Droplet, Receipt } from 'lucide-react';
import { Button } from '../../ui/Button';

// Mock Expenses
const MOCK_EXPENSES = [
    { id: 1, category: 'Fuel', amount: 25000, date: 'Today, 8:30 AM', icon: Droplet },
    { id: 2, category: 'Maintenance', amount: 12500, date: 'Oct 24, 2023', icon: Wrench },
    { id: 3, category: 'Toll Fee', amount: 1500, date: 'Oct 22, 2023', icon: Receipt },
];

export const MaintenanceView = ({ setView }: { setView: (view: any) => void }) => (
     <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-[1920px] mx-auto">
        <button className="flex items-center space-x-2 mb-8 text-slate-500 hover:text-slate-900 transition-colors group" onClick={() => setView('profile')}>
           <div className="p-2 rounded-full bg-white border border-slate-200 group-hover:bg-slate-50"><ChevronRight className="rotate-180" size={16} /></div>
           <span className="text-sm font-bold">Back to Profile</span>
        </button>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center text-slate-900">
                <div className="bg-brand-orange p-2 rounded-xl mr-4 shadow-md shadow-orange-100">
                <Wrench className="text-white" size={24} /> 
                </div>
                Vehicle Maintenance
            </h2>
            <Button variant="secondary" className="rounded-xl font-bold">Log Service</Button>
        </div>

        {/* Simplified Maintenance for brevity */}
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-10 flex items-start shadow-sm max-w-3xl relative overflow-hidden">
            <div className="p-3 bg-white rounded-xl text-red-500 mr-6 shrink-0 shadow-sm relative z-10">
                <AlertCircle size={24} />
            </div>
            <div className="relative z-10">
               <h3 className="font-bold text-slate-900 text-xl mb-2">Service Due Soon</h3>
               <p className="text-slate-600 mb-6 leading-relaxed max-w-md">Your next scheduled oil change is in <span className="font-bold text-slate-900">14 days</span>.</p>
               <Button size="sm" className="bg-red-600 hover:bg-red-700 border-none text-white shadow-lg shadow-red-500/20 px-6 py-3 h-auto rounded-xl font-bold">Schedule Service</Button>
            </div>
        </div>

        <div className="max-w-3xl">
            <h3 className="font-bold text-xl text-slate-900 mb-6">Recent Expenses</h3>
            <div className="space-y-4">
                {MOCK_EXPENSES.map((exp) => (
                    <div key={exp.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                                <exp.icon size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{exp.category}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{exp.date}</p>
                            </div>
                        </div>
                        <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">₦{exp.amount.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
     </div>
);
