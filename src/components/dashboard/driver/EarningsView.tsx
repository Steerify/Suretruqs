import React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Building, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Transaction } from '../../../types';

export const EarningsView = ({ 
    payoutDetails, 
    setShowBankModal, 
    transactions,
    balance
}: { 
    payoutDetails: any, 
    setShowBankModal: (show: boolean) => void,
    transactions: Transaction[],
    balance: number
}) => (
    <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-[1920px] mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Earnings & Payouts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           <div className="lg:col-span-2">
               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg mb-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
                   <div className="relative z-10">
                       <div className="flex items-center gap-2 mb-2">
                           <div className="p-1.5 bg-orange-50 rounded-lg text-brand-orange"><Wallet size={16}/></div>
                           <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Total Available Earnings</p>
                       </div>
                       <h3 className="text-5xl font-bold mb-8 text-slate-900">₦{balance.toLocaleString()}<span className="text-2xl text-slate-400 font-normal">.00</span></h3>
                       <div className="flex gap-4">
                           <Button variant="cta" className="py-3 px-8 rounded-xl font-bold shadow-lg shadow-orange-500/20">
                               Cash Out Now
                           </Button>
                       </div>
                   </div>
               </div>
               <Card className="border border-slate-200 shadow-sm rounded-3xl">
                  <h3 className="font-bold text-slate-900 mb-6">Transaction History</h3>
                  <div className="space-y-4">
                      {transactions.length > 0 ? transactions.map((tx) => (
                         <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                             <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                                    {tx.type === 'CREDIT' ? <ArrowDownLeft size={20}/> : <ArrowUpRight size={20}/>}
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-900 text-sm">{tx.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                <p className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-900'}`}>
                                   {tx.type === 'CREDIT' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                                </p>
                             </div>
                         </div>
                      )) : (
                          <div className="text-center py-12 text-slate-400">No earnings history yet.</div>
                      )}
                  </div>
               </Card>
           </div>
           <div className="space-y-6">
              <Card className="border border-slate-200 shadow-sm rounded-3xl">
                  <h3 className="font-bold text-slate-900 mb-4">Payout Method</h3>
                  <div className="p-4 border border-green-200 bg-green-50/50 rounded-2xl flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl text-green-600 shadow-sm border border-green-100"><Building size={20}/></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">{payoutDetails.bankName} {payoutDetails.accountNumber}</p>
                           <p className="text-xs text-slate-500 font-medium">{payoutDetails.verified ? 'Verified Account' : 'Verification Pending'}</p>
                        </div>
                     </div>
                     {payoutDetails.verified && (
                         <div className="bg-white rounded-full p-1 text-green-600">
                            <CheckCircle2 size={16}/>
                         </div>
                     )}
                  </div>
                  <Button variant="secondary" className="w-full text-sm rounded-xl" onClick={() => setShowBankModal(true)}>Update Bank Details</Button>
              </Card>
           </div>
        </div>
    </div>
);
