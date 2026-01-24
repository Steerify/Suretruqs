import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Plus, ArrowUpRight, Wallet, CreditCard, ArrowDownLeft, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { useStore } from '../../../context/StoreContext';
import { loadPaystackScript, initializePaystack } from '../../../utils/paystack';
import { WithdrawalModal } from './WithdrawalModal';
import { TopUpModal } from './TopUpModal';

export const WalletView = () => {
    const { walletBalance, transactions, currentUser } = useStore();
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    return (
    <div className="fade-in w-full">
      {showTopUpModal && <TopUpModal onClose={() => setShowTopUpModal(false)} />}
      {showWithdrawModal && <WithdrawalModal onClose={() => setShowWithdrawModal(false)} />}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Wallet</h2>
            <p className="text-slate-500 font-medium">Instantly fund your account and track spending.</p>
         </div>
          <Button variant="ghost" className="text-slate-500 hover:text-brand-primary">
             <Download size={18} className="mr-2"/> Statement
          </Button>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-slate-200 relative overflow-hidden flex flex-col justify-between">
             <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
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
                        onClick={() => setShowTopUpModal(true)} 
                        className="bg-brand-orange hover:bg-orange-600 text-white border-none py-3 px-8 rounded-xl shadow-lg shadow-orange-900/20 font-bold flex items-center"
                   >
                      <Plus size={18} className="mr-2"/> Top Up Wallet
                   </Button>
                   <Button 
                        variant="secondary" 
                        onClick={() => setShowWithdrawModal(true)}
                        className="bg-white/10 border-white/10 text-white hover:bg-white/20 py-3 px-8 rounded-xl backdrop-blur-md font-bold flex items-center"
                   >
                      <ArrowUpRight size={18} className="mr-2"/> Withdraw
                   </Button>
                </div>
             </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border border-slate-100 bg-white shadow-sm h-full flex flex-col p-8">
                <div className="mb-6">
                    <div className="p-3 bg-blue-50 text-brand-primary w-fit rounded-2xl mb-4">
                        <ShieldCheck size={28}/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Standard Payment</h3>
                    <p className="text-sm text-slate-500 mt-2">All transactions are processed securely via Paystack. No sensitive card data is stored on our servers.</p>
                </div>
                
                <div className="space-y-4 mt-auto">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Zap size={18} className="text-brand-orange"/>
                        <span className="text-xs font-bold text-slate-700">Instant Settlement</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <CreditCard size={18} className="text-brand-primary"/>
                        <span className="text-xs font-bold text-slate-700">Card & Bank Transfer</span>
                    </div>
                </div>
            </Card>
          </div>
      </div>
  
      {/* Recent Transactions */}
      <Card className="border border-slate-200 shadow-sm p-8 rounded-[2.5rem]">
         <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 text-xl tracking-tight">Recent Transactions</h3>
         </div>
         <div className="space-y-2">
            {transactions.length > 0 ? transactions.slice(0, 10).map((tx) => (
               <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl transition-all group cursor-default border-b border-slate-50 last:border-0 border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-5">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        tx.type === 'CREDIT' ? 'bg-green-50 text-green-600 group-hover:scale-110' : 'bg-slate-50 text-slate-500 group-hover:scale-110'
                     }`}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft size={20} strokeWidth={2.5}/> : <ArrowUpRight size={20} strokeWidth={2.5}/>}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 text-base">{tx.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{new Date(tx.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})} • {tx.reference}</p>
                     </div>
                  </div>
                  <div className="text-right">
                      <span className={`font-black tabular-nums text-lg block ${
                            tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-900'
                      }`}>
                         {tx.type === 'CREDIT' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'SUCCESS' ? 'text-green-600' : 'text-red-500'}`}>{tx.status}</span>
                  </div>
               </div>
            )) : (
                <div className="py-20 text-center text-slate-400">
                    <Wallet size={48} className="mx-auto mb-4 opacity-10"/>
                    <p className="font-bold">No transactions found</p>
                </div>
            )}
         </div>
      </Card>

      {showWithdrawModal && <WithdrawalModal onClose={() => setShowWithdrawModal(false)} />}
    </div>
    );
};
