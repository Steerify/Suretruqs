import React from 'react';
import { X, HelpCircle, Mail, Phone } from 'lucide-react';
import { Button } from '../../ui/Button';

export const SupportModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-[scaleIn_0.2s_ease-out]">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                 <div className="p-1.5 bg-blue-50 text-brand-primary rounded-lg"><HelpCircle size={18}/></div>
                 Contact Support
             </h3>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
          </div>
          <p className="text-slate-500 mb-6 text-sm">Our support team is available 24/7 to assist you with any issues.</p>
          <div className="space-y-4">
             <Button className="w-full justify-center" onClick={() => window.open('mailto:support@suretruqs.com')}><Mail className="mr-2" size={18}/> Email Support</Button>
             <Button variant="secondary" className="w-full justify-center" onClick={() => window.open('tel:+2348000000000')}><Phone className="mr-2" size={18}/> Call Us</Button>
             <Button variant="ghost" className="w-full justify-center" onClick={onClose}>Close</Button>
          </div>
       </div>
    </div>
);
