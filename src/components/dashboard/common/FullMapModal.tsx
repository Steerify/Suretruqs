import React from 'react';
import { Button } from '../../ui/Button';
import { ArrowDownLeft } from 'lucide-react';
import AdminLiveTracking from '../admin/AdminLiveTracking';

export const FullMapModal = ({ onClose }: { onClose: () => void, shipmentId?: string }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Real-Time Fleet Intelligence</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Global Cluster View • Live Telemetry</p>
                </div>
                <Button variant="secondary" onClick={onClose} className="bg-slate-50 text-slate-600 hover:bg-slate-100 border-none rounded-xl">
                    <ArrowDownLeft className="mr-2 rotate-45"/> Return to Dashboard
                </Button>
            </header>
            
            <div className="flex-1 relative">
                <AdminLiveTracking />
            </div>
        </div>
    );
};
