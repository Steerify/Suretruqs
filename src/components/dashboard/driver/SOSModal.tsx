import React from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

export const SOSModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 p-8 text-center animate-[scaleIn_0.2s_ease-out] border-4 border-red-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <AlertTriangle size={40} className="text-red-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">EMERGENCY</h2>
            <p className="text-slate-500 mb-8 font-medium">Are you sure you want to trigger an emergency alert? This will notify dispatch and local authorities.</p>
            
            <div className="space-y-3">
                <button onClick={() => { toast.success('Emergency Alert Sent!'); onClose(); }} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 text-lg transition-transform active:scale-95">
                    YES, SEND HELP
                </button>
                <button onClick={onClose} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    </div>
);
