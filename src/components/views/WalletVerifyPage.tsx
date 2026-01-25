import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const WalletVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    // Simulate verification delay for demo feeling
    const timer = setTimeout(() => {
        if (reference) {
            setStatus('success');
        } else {
            setStatus('failed');
        }
    }, 2000);
    return () => clearTimeout(timer);
  }, [reference]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center">
         {status === 'verifying' && (
             <div className="py-12">
                 <Loader2 size={48} className="animate-spin text-brand-primary mx-auto mb-6"/>
                 <h2 className="text-xl font-black text-slate-900">Verifying Payment</h2>
                 <p className="text-slate-500 font-medium mt-2">Securely communicating with bank...</p>
             </div>
         )}

         {status === 'success' && (
             <div className="py-8 animate-in zoom-in duration-300">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 size={40} strokeWidth={2.5}/>
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h2>
                 <p className="text-slate-500 font-medium mb-8">Your wallet has been credited.</p>
                 <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Transaction Reference</p>
                     <p className="text-sm font-bold text-slate-900 mt-1 font-mono">{reference}</p>
                 </div>
                 <Button onClick={() => window.close()} className="w-full rounded-xl font-bold">
                     Close Window
                 </Button>
             </div>
         )}

         {status === 'failed' && (
             <div className="py-8 animate-in zoom-in duration-300">
                 <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <XCircle size={40} strokeWidth={2.5}/>
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 mb-2">Verification Failed</h2>
                 <p className="text-slate-500 font-medium mb-8">Could not verify the transaction.</p>
                 <Button onClick={() => window.close()} variant="secondary" className="w-full rounded-xl font-bold">
                     Close Window
                 </Button>
             </div>
         )}
      </div>
    </div>
  );
};
