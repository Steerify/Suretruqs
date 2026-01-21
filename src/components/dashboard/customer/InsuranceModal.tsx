import React from 'react';
import { X, ShieldCheck, Info } from 'lucide-react';
import { Button } from '../../ui/Button';

export const InsuranceModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={18}/></div>
                    Cargo Insurance
                </h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
            </div>
            
            <div className="space-y-4 mb-6">
                <div className="p-4 border border-slate-200 rounded-xl hover:border-brand-primary cursor-pointer transition-colors bg-white hover:shadow-md group">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors">Basic Cover</h4>
                        <span className="text-slate-900 font-bold">₦2,000</span>
                    </div>
                    <p className="text-xs text-slate-500">Coverage up to ₦500,000. Theft & Damage protection.</p>
                </div>
                
                <div className="p-4 border-2 border-brand-primary bg-blue-50/30 rounded-xl cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">RECOMMENDED</div>
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-brand-primary">Premium Cover</h4>
                        <span className="text-brand-primary font-bold">₦5,000</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Full coverage up to ₦5,000,000. Includes delay & accident protection.</p>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg flex gap-2 items-start mb-6">
                <Info size={16} className="text-slate-400 mt-0.5 shrink-0"/>
                <p className="text-xs text-slate-500 leading-relaxed">Insurance policies are provided by AXA Mansard. Terms and conditions apply.</p>
            </div>

            <Button className="w-full font-bold shadow-lg shadow-brand-primary/20" onClick={onClose}>
                Select Coverage
            </Button>
        </div>
    </div>
);
