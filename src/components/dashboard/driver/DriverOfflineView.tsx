import React from 'react';
import { Truck, Power } from 'lucide-react';

export const DriverOfflineView = ({ setIsOnline }: { setIsOnline: (online: boolean) => void }) => {
   return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 fade-up text-center w-full">
        <div className="relative mb-8">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 relative z-10">
                <Truck size={48} />
            </div>
            <div className="absolute top-0 right-0 p-2 bg-slate-200 rounded-full border-4 border-white z-20">
                <Power size={24} className="text-slate-500" />
            </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">You are currently Offline</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed text-lg">
          You won't receive any new job requests while you're offline. Ready to work?
        </p>
        <button 
          type="button"
          onClick={() => setIsOnline(true)}
          className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-transform hover:bg-blue-800 flex items-center gap-3"
        >
          <Power size={20} /> Go Online Now
        </button>
     </div>
   );
};
