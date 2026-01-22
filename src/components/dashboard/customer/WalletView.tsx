import React, { useState } from 'react';
import { Download, Plus, ArrowUpRight, Wallet, CreditCard, CheckCircle2, Trash2, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Transaction } from '../../../types';
import { useStore } from '../../../context/StoreContext';
import { loadPaystackScript, initializePaystack } from '../../../utils/paystack';
import { PaymentMethod } from './AddCardModal';

// MOCK_TRANSACTIONS removed, using store data

interface WalletViewProps {
    paymentMethods: PaymentMethod[];
    setShowAddCardModal: (show: boolean) => void;
    handleRemoveCard: (id: string) => void;
}

export const WalletView = ({ paymentMethods, setShowAddCardModal, handleRemoveCard }: WalletViewProps) => {
    const { walletBalance, transactions, topUpWallet, verifyWalletDeposit, currentUser, fetchWalletData } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleTopUp = async () => {
        const amountStr = prompt("Enter amount to top up (NGN):", "5000");
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return alert("Invalid amount");

        setIsProcessing(true);
        try {
            const isLoaded = await loadPaystackScript();
            if (!isLoaded) throw new Error("Could not load Paystack");

            const initiateData = await topUpWallet(amount);
            
            initializePaystack({
                email: currentUser?.email,
                amount: amount,
                reference: initiateData.reference,
                callback: async (response: any) => {
                    try {
                        await verifyWalletDeposit(response.reference, amount);
                        alert("Wallet topped up successfully!");
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("Payment verification pending.");
                    }
                },
                onClose: () => {
                    setIsProcessing(false);
                }
            });
        } catch (err: any) {
            alert(err.message || "Failed to initiate payment");
            setIsProcessing(false);
        }
    };

    return (
    <div className="fade-in w-full">
      {/* Header / Title - Left Aligned */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Wallet</h2>
            <p className="text-slate-500 font-medium">Manage your funds and payment methods.</p>
         </div>
          <Button variant="ghost" className="text-slate-500 hover:text-brand-primary">
             <Download size={18} className="mr-2"/> Statement
          </Button>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Balance Card - Takes up 2 columns */}
          <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-slate-200 relative overflow-hidden flex flex-col justify-between">
             {/* Background decorations */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Balance</p>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                           ₦{walletBalance.toLocaleString()}<span className="text-2xl text-slate-500 font-medium">.00</span>
                        </h1>
                    </div>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <Wallet size={32} className="text-brand-orange"/>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-auto">
                   <Button 
                        onClick={handleTopUp} 
                        disabled={isProcessing}
                        className="bg-brand-orange hover:bg-orange-600 text-white border-none py-3 px-6 rounded-xl shadow-lg shadow-orange-900/20 font-bold flex items-center"
                   >
                      <Plus size={18} className="mr-2"/> {isProcessing ? 'Processing...' : 'Top Up Wallet'}
                   </Button>
                   <Button variant="secondary" className="bg-white/10 border-white/10 text-white hover:bg-white/20 py-3 px-6 rounded-xl backdrop-blur-md font-bold flex items-center">
                      <ArrowUpRight size={18} className="mr-2"/> Withdraw Funds
                   </Button>
                </div>
             </div>
          </div>

          {/* Payment Methods / Quick Card - 1 Column */}
          <div className="space-y-6">
            <Card className="rounded-3xl border border-slate-100 bg-white shadow-sm h-full flex flex-col">
               
               {/* Header */}
               <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                     <div>
                        <h3 className="text-base font-semibold text-slate-900">
                           Payment methods
                        </h3>
                        <p className="text-xs text-slate-500">
                           Manage your saved cards
                        </p>
                     </div>

                     <button
                        onClick={() => setShowAddCardModal(true)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-secondary hover:text-brand-primary transition-colors"
                     >
                        <Plus size={16} />
                        Add
                     </button>
               </div>

               {/* Content */}
               <div className="flex-1 overflow-y-auto max-h-[320px] px-6 py-4 space-y-3">
                     {paymentMethods.length > 0 ? (
                        paymentMethods.map(pm => (
                           <div
                                 key={pm.id}
                                 className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 hover:bg-slate-100 transition-colors"
                           >
                                 <div className="flex items-center gap-4">
                                    
                                    {/* Card type */}
                                    <div className="w-11 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center">
                                       <span className="text-[9px] font-semibold text-slate-500 uppercase">
                                             {pm.type}
                                       </span>
                                    </div>

                                    {/* Card info */}
                                    <div className="leading-tight">
                                       <p className="text-sm font-semibold text-slate-900">
                                             •••• {pm.last4}
                                       </p>
                                       <p className="text-[11px] text-slate-500">
                                             Expires {pm.expiry}
                                       </p>
                                    </div>
                                 </div>

                                 {/* Actions */}
                                 {pm.isDefault ? (
                                    <span className="text-[11px] font-semibold text-brand-primary bg-blue-50 px-2.5 py-1 rounded-full">
                                       Default
                                    </span>
                                 ) : (
                                    <button
                                       onClick={() => handleRemoveCard(pm.id)}
                                       className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 )}
                           </div>
                        ))
                     ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                           <CreditCard size={28} className="mb-3 opacity-40" />
                           <p className="text-sm">No payment methods yet</p>
                           <p className="text-xs mt-1">Add a card to get started</p>
                        </div>
                     )}
               </div>
            </Card>
         </div>

      </div>
  
      {/* Recent Transactions */}
      <Card className="border border-slate-200 shadow-sm p-6 rounded-3xl">
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Recent Transactions</h3>
            <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">All</button>
                 <button className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors">Credits</button>
                 <button className="px-3 py-1.5 rounded-lg bg-white text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors">Debits</button>
            </div>
         </div>
         <div className="space-y-1">
            {transactions.length > 0 ? transactions.slice(0, 10).map((tx) => (
               <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-default border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'
                     }`}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft size={18} strokeWidth={2.5}/> : <ArrowUpRight size={18} strokeWidth={2.5}/>}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 text-sm">{tx.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{new Date(tx.date).toLocaleDateString()} • <span className="font-mono">{tx.reference}</span></p>
                     </div>
                  </div>
                  <div className="text-right">
                      <span className={`font-bold tabular-nums text-sm block ${
                            tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-900'
                      }`}>
                         {tx.type === 'CREDIT' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase ${tx.status === 'SUCCESS' ? 'text-green-600' : 'text-red-500'}`}>{tx.status}</span>
                  </div>
               </div>
            )) : (
                <div className="py-8 text-center text-slate-400">No transactions found.</div>
            )}
         </div>
         <div className="mt-4 pt-4 border-t border-slate-100 text-center">
             <button className="text-brand-primary text-sm font-bold hover:underline">View All History</button>
         </div>
      </Card>
      
      {/* Security Banner */}
      <div className="mt-8 bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                 <ShieldCheck size={20}/>
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-900">Secure Payments</p>
                 <p className="text-xs text-slate-500">All transactions are encrypted and secured.</p>
              </div>
           </div>
           <button className="text-xs font-bold text-slate-500 hover:text-slate-800">Learn more</button>
      </div>
    </div>
    );
};
