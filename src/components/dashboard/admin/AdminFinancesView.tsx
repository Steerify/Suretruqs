import React, { useEffect, useState } from 'react';
import { Card } from '../../ui/Card';
import { Transaction } from '../../../types';
import { Wallet, ArrowUpRight, ArrowDownLeft, Download, Filter, Search, MoreHorizontal } from 'lucide-react';
import api from '../../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminFinancesView: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get('/admin/transactions');
                setTransactions(res.data);
            } catch (err) {
                console.error("Failed to fetch admin transactions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const totalRevenue = transactions
        .filter(t => t.type === 'DEBIT' && (t.description.includes('Shipment') || t.description.includes('Payment')))
        .reduce((acc, curr) => acc + curr.amount, 0);

    const chartData = transactions.reduce((acc: any[], t) => {
        const date = new Date(t.createdAt || t.date).toLocaleDateString();
        const existing = acc.find(d => d.name === date);
        if (existing) {
            existing.amount += t.amount;
        } else {
            acc.push({ name: date, amount: t.amount });
        }
        return acc;
    }, []).slice(-7);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-brand-dark text-white border-none shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <Wallet size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Revenue</span>
                    </div>
                    <h3 className="text-3xl font-black">₦{totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-slate-400 mt-2 font-medium">+12.5% from last month</p>
                </Card>
                <Card className="p-6 border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <ArrowDownLeft size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Deposits</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">
                        ₦{transactions.filter(t => t.type === 'CREDIT').reduce((acc, c) => acc + c.amount, 0).toLocaleString()}
                    </h3>
                </Card>
                <Card className="p-6 border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-brand-secondary rounded-xl">
                            <ArrowUpRight size={24} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Transaction Volume</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">{transactions.length}</h3>
                </Card>
            </div>

            <Card className="p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl text-slate-900">Financial Overview</h3>
                    <button className="text-xs font-black text-brand-secondary uppercase tracking-widest flex items-center gap-2">
                        <Download size={14} /> Export Report
                    </button>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 800}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 800}} tickFormatter={(v) => `₦${v/1000}k`} />
                            <Tooltip 
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                                itemStyle={{fontWeight: 800, color: '#0f172a'}}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFin)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="w-full border border-slate-100 overflow-hidden" noPadding>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">All Transactions</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Full history of payments and wallet activity</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search transactions..." className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl w-64 focus:ring-2 focus:ring-brand-secondary outline-none"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="px-8 py-4">ID</th>
                                <th className="px-5 py-4">Date & Time</th>
                                <th className="px-5 py-4">User Details</th>
                                <th className="px-5 py-4">Description</th>
                                <th className="px-5 py-4">Type</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {transactions.map((t) => (
                                <tr 
                                    key={t._id || t.id} 
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                    onClick={() => setSelectedTransaction(t)}
                                >
                                    <td className="px-8 py-5 font-mono text-xs text-slate-500">#{((t._id || t.id) as string).slice(-8)}</td>
                                    <td className="px-5 py-5">
                                        <p className="text-slate-700 font-bold text-xs">{new Date(t.createdAt || t.date).toLocaleDateString()}</p>
                                        <p className="text-slate-400 text-[10px] font-medium">{new Date(t.createdAt || t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-secondary to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                                                {(t.userId as any)?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 text-xs truncate">{(t.userId as any)?.name || 'Unknown User'}</p>
                                                <p className="text-slate-500 text-[10px] font-medium truncate">{(t.userId as any)?.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 text-slate-600 font-medium max-w-xs truncate">{t.description}</td>
                                    <td className="px-5 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                            t.type === 'CREDIT' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                                        }`}>
                                            {t.type === 'CREDIT' ? <ArrowDownLeft size={10}/> : <ArrowUpRight size={10}/>}
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-5">
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                                            t.status === 'SUCCESS' ? 'text-green-500' : 
                                            t.status === 'PENDING' ? 'text-orange-500' : 'text-red-500'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <p className="font-black text-slate-900">₦{t.amount.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{t.reference}</p>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400">
                                        <Wallet size={32} className="mx-auto mb-2 opacity-10" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No transactions found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Transaction Detail Modal */}
            {selectedTransaction && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setSelectedTransaction(null)}
                >
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Transaction Details</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Complete information about this payment</p>
                            </div>
                            <button 
                                onClick={() => setSelectedTransaction(null)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                            >
                                <MoreHorizontal size={20}/>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* User Information */}
                            <div className="p-6 bg-gradient-to-br from-brand-secondary/5 to-blue-50/50 rounded-2xl border border-brand-secondary/10">
                                <p className="text-xs font-black text-brand-secondary uppercase tracking-wider mb-4">User Information</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-secondary to-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
                                            {(selectedTransaction.userId as any)?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">{(selectedTransaction.userId as any)?.name || 'Unknown User'}</p>
                                            <p className="text-sm text-slate-600 font-medium">{(selectedTransaction.userId as any)?.email || 'No email provided'}</p>
                                        </div>
                                    </div>
                                    {(selectedTransaction.userId as any)?.phone && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="font-bold">Phone:</span> {(selectedTransaction.userId as any).phone}
                                        </div>
                                    )}
                                    {(selectedTransaction.userId as any)?.company && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="font-bold">Company:</span> {(selectedTransaction.userId as any).company}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="font-bold">User ID:</span> 
                                        <code className="font-mono text-xs bg-white px-2 py-1 rounded">
                                            {(selectedTransaction.userId as any)?._id || 'N/A'}
                                        </code>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction ID</p>
                                    <p className="font-mono text-xs font-bold text-slate-900">#{((selectedTransaction._id || selectedTransaction.id) as string).slice(-12)}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reference</p>
                                    <p className="font-mono text-xs font-bold text-slate-900 truncate">{selectedTransaction.reference}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Date & Time</p>
                                    <p className="text-xs font-bold text-slate-900">
                                        {new Date(selectedTransaction.createdAt || selectedTransaction.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                        selectedTransaction.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                                        selectedTransaction.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</p>
                                <p className="text-sm font-medium text-slate-700">{selectedTransaction.description}</p>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-brand-orange/10 to-orange-50 rounded-2xl border border-brand-orange/20">
                                <p className="text-xs font-black text-brand-orange uppercase tracking-wider mb-2">Amount</p>
                                <p className="text-4xl font-black text-slate-900">₦{selectedTransaction.amount.toLocaleString()}</p>
                                <p className="text-xs text-slate-600 font-bold mt-2">
                                    {selectedTransaction.type === 'CREDIT' ? 'Credited to wallet' : 'Debited from wallet'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-black rounded-xl hover:bg-slate-200 transition-colors"
                                onClick={() => setSelectedTransaction(null)}
                            >
                                Close
                            </button>
                            <button className="flex-1 px-6 py-3 bg-brand-secondary text-white font-black rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                                <Download size={16} /> Export Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
