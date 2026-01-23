import React, { useState } from 'react';
import { X, Lock, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useStore } from '../../../context/StoreContext';
import gsap from 'gsap';

interface WithdrawalModalProps {
    onClose: () => void;
}

export const WithdrawalModal = ({ onClose }: WithdrawalModalProps) => {
    const { walletBalance, hasTransactionPin, setTransactionPin, withdrawFunds } = useStore();
    const [step, setStep] = useState< 'setup' | 'withdrawal' | 'success'>(hasTransactionPin ? 'withdrawal' : 'setup');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [amount, setAmount] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSetPin = async () => {
        if (pin.length !== 4) return setError("PIN must be 4 digits");
        if (pin !== confirmPin) return setError("PINs do not match");
        
        setIsProcessing(true);
        try {
            await setTransactionPin(pin);
            setStep('withdrawal');
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleWithdraw = async () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt < 1000) return setError("Minimum withdrawal is ₦1,000");
        if (amt > walletBalance) return setError("Insufficient balance");
        if (pin.length !== 4) return setError("Enter your 4-digit PIN");

        setIsProcessing(true);
        try {
            await withdrawFunds({
                amount: amt,
                pin,
                bankDetails: {
                    bankName,
                    accountNumber
                }
            });
            setStep('success');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Withdraw Funds</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-all p-2 bg-slate-50 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'setup' && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                <ShieldCheck className="text-brand-primary mb-3" size={32} />
                                <h4 className="font-bold text-slate-900">Secure Your Account</h4>
                                <p className="text-xs text-slate-500 font-medium mt-1">Set a 4-digit transaction PIN to authorize all future withdrawals from your SureTruqs wallet.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Create PIN</label>
                                    <input 
                                        type="password" 
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-brand-primary/20" 
                                        placeholder="••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm PIN</label>
                                    <input 
                                        type="password" 
                                        maxLength={4}
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] focus:ring-2 focus:ring-brand-primary/20" 
                                        placeholder="••••"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-xs font-bold text-red-500 flex items-center gap-2"><AlertCircle size={14}/> {error}</p>}

                            <Button onClick={handleSetPin} disabled={isProcessing} className="w-full py-4 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs">
                                {isProcessing ? 'Processing...' : 'Set Secure PIN'}
                            </Button>
                        </div>
                    )}

                    {step === 'withdrawal' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                                    <p className="text-2xl font-black text-slate-900 mt-1">₦{walletBalance.toLocaleString()}</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount to Withdraw (NGN)</label>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-slate-100 border-none rounded-2xl p-4 font-black text-lg focus:ring-2 focus:ring-brand-primary/20" 
                                        placeholder="Min ₦1,000"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Bank Name</label>
                                        <input 
                                            type="text" 
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            className="w-full bg-slate-100 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-brand-primary/20"
                                            placeholder="e.g. Zenith Bank"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Number</label>
                                        <input 
                                            type="text" 
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            className="w-full bg-slate-100 border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-brand-primary/20"
                                            placeholder="10 Digits"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">Enter Transaction PIN</label>
                                    <input 
                                        type="password" 
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-slate-900/5 border-none rounded-2xl p-5 text-center text-3xl font-black tracking-[0.5em] focus:ring-2 focus:ring-brand-primary/20" 
                                        placeholder="••••"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-xs font-bold text-red-500 flex items-center gap-2"><AlertCircle size={14}/> {error}</p>}

                            <Button onClick={handleWithdraw} disabled={isProcessing} className="w-full py-4 rounded-2xl bg-brand-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20">
                                {isProcessing ? 'Processing Transfer...' : 'Confim Withdrawal'}
                            </Button>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-500 mx-auto mb-6 shadow-lg shadow-green-500/10">
                                <CheckCircle2 size={48} strokeWidth={2.5}/>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Withdrawal Initiated</h3>
                            <p className="text-slate-500 font-medium mt-2 px-8 leading-relaxed text-sm">Your transfer of <span className="text-slate-900 font-black">₦{parseFloat(amount).toLocaleString()}</span> is being processed and will arrive in your bank account shortly.</p>
                            
                            <div className="mt-10 p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference Code</p>
                                    <p className="text-sm font-black text-slate-900">ST-WDR-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                                </div>
                                <Button variant="ghost" className="text-brand-primary font-black text-xs" onClick={onClose}>Done</Button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="bg-brand-primary/5 px-8 py-4 flex items-center justify-center gap-2">
                    <Lock size={12} className="text-slate-400"/>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted Transaction</span>
                </div>
            </div>
        </div>
    );
};
