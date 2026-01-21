import React, { useState } from 'react';
import { Download, Plus, ArrowUpRight, Wallet, CreditCard, CheckCircle2, Trash2, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Transaction } from '../../../types';
import { PaymentMethod } from './AddCardModal'; // We can share the interface, or move it to types.ts. For now importing it.

// Mock Transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-001', type: 'DEBIT', amount: 45000, date: '2023-10-25', description: 'Shipment Payment #TRK-8821', status: 'SUCCESS', reference: 'PAY-8821' },
  { id: 'TX-002', type: 'CREDIT', amount: 100000, date: '2023-10-20', description: 'Wallet Top-up (Paystack)', status: 'SUCCESS', reference: 'TOP-9912' },
  { id: 'TX-003', type: 'DEBIT', amount: 22500, date: '2023-10-18', description: 'Shipment Payment #TRK-7712', status: 'SUCCESS', reference: 'PAY-7712' },
  { id: 'TX-004', type: 'DEBIT', amount: 15000, date: '2023-10-15', description: 'Shipment Payment #TRK-1123', status: 'FAILED', reference: 'PAY-1123' },
];

interface WalletViewProps {
    paymentMethods: PaymentMethod[];
    setShowAddCardModal: (show: boolean) => void;
    handleRemoveCard: (id: string) => void;
}

export const WalletView = ({ paymentMethods, setShowAddCardModal, handleRemoveCard }: WalletViewProps) => (
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
                           ₦85,000<span className="text-2xl text-slate-500 font-medium">.00</span>
                        </h1>
                    </div>
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                        <Wallet size={32} className="text-brand-orange"/>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-auto">
                   <Button className="bg-brand-orange hover:bg-orange-600 text-white border-none py-3 px-6 rounded-xl shadow-lg shadow-orange-900/20 font-bold flex items-center">
                      <Plus size={18} className="mr-2"/> Top Up Wallet
                   </Button>
                   <Button variant="secondary" className="bg-white/10 border-white/10 text-white hover:bg-white/20 py-3 px-6 rounded-xl backdrop-blur-md font-bold flex items-center">
                      <ArrowUpRight size={18} className="mr-2"/> Withdraw Funds
                   </Button>
                </div>
             </div>
          </div>

          {/* Payment Methods / Quick Card - 1 Column */}
          <div className="space-y-6">
             <Card className="border border-slate-200 shadow-sm p-6 rounded-3xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 text-lg">Payment Methods</h3>
                    <button onClick={() => setShowAddCardModal(true)} className="text-brand-secondary hover:bg-blue-50 p-2 rounded-full transition-colors"><Plus size={20}/></button>
                </div>
                
                <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-1">
                   {paymentMethods.length > 0 ? paymentMethods.map((pm) => (
                       <div key={pm.id} className="p-4 border border-slate-100 bg-white rounded-2xl flex items-center justify-between group hover:bg-slate-50 transition-colors relative">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-7 bg-slate-100 border border-slate-200 rounded flex items-center justify-center">
                                 <span className="text-[8px] font-bold text-slate-500">{pm.type}</span>
                             </div>
                             <div>
                                <p className="font-bold text-slate-900 text-sm">•••• {pm.last4}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Expires {pm.expiry}</p>
                             </div>
                          </div>
                          {pm.isDefault ? (
                              <CheckCircle2 size={16} className="text-brand-primary"/>
                          ) : (
                              <button onClick={() => handleRemoveCard(pm.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                  <Trash2 size={16} />
                              </button>
                          )}
                       </div>
                   )) : (
                       <div className="text-center py-8 text-slate-400">
                           <CreditCard size={32} className="mx-auto mb-2 opacity-50"/>
                           <p className="text-sm">No cards added</p>
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
            {MOCK_TRANSACTIONS.map((tx) => (
               <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-default border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'
                     }`}>
                        {tx.type === 'CREDIT' ? <ArrowDownLeft size={18} strokeWidth={2.5}/> : <ArrowUpRight size={18} strokeWidth={2.5}/>}
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 text-sm">{tx.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{tx.date} • <span className="font-mono">{tx.reference}</span></p>
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
            ))}
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
