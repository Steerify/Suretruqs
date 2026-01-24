import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';
import toast from 'react-hot-toast';
import { useStore } from '../../../context/StoreContext';
import { loadPaystackScript, initializePaystack } from '../../../utils/paystack';

interface TopUpModalProps {
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { topUpWallet, verifyWalletDeposit, currentUser } = useStore();

  const handlePay = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      return toast.error('Minimum amount is ₦100');
    }

    setIsProcessing(true);
    try {
      const isLoaded = await loadPaystackScript();
      if (!isLoaded) throw new Error("Paystack failed to load");

      const initiateData = await topUpWallet(numAmount);
      
      initializePaystack({
        email: currentUser?.email,
        amount: numAmount,
        reference: initiateData.reference,
        callback: async (response: any) => {
          try {
            await verifyWalletDeposit(response.reference);
            toast.success("Wallet credited successfully!");
            onClose();
          } catch (err) {
            console.error("Verification error:", err);
            toast.success("Payment successful, updating your balance...");
            onClose();
          }
        },
        onClose: () => {
          setIsProcessing(false);
        }
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-4 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Up Wallet</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={20} />
            </button>
        </div>

        <div className="p-8 pt-4 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <ShieldCheck className="text-brand-primary shrink-0" size={20}/>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Payments are handled securely by **Paystack**. Your card details are never stored on our servers.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Enter Amount (NGN)</label>
                <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">₦</span>
                    <input 
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black text-slate-900 focus:border-brand-primary focus:bg-white outline-none transition-all placeholder:text-slate-200"
                        autoFocus
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {[1000, 5000, 10000].map(val => (
                    <button 
                        key={val}
                        onClick={() => setAmount(val.toString())}
                        className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50 transition-all"
                    >
                        +₦{val.toLocaleString()}
                    </button>
                ))}
            </div>

            <Button 
                onClick={handlePay}
                isLoading={isProcessing}
                className="w-full py-5 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20"
            >
                <CreditCard size={20} className="mr-3"/> Pay Now
            </Button>

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Powered by Paystack</p>
        </div>
      </div>
    </div>
  );
};
