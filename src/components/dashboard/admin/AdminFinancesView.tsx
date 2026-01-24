import React, { useEffect, useState } from 'react';
import { Card } from '../../ui/Card';
import { Transaction } from '../../../types';
import { Wallet, ArrowUpRight, ArrowDownLeft, Download, Filter, Search } from 'lucide-react';
import api from '../../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminFinancesView: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

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
        const date = new Date(t.createdAt).toLocaleDateString();
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xl text-slate-900">Financial Overview</h3>
                        <button className="text-xs font-black text-brand-secondary uppercase tracking-widest flex items-center gap-2">
                            <Download size={14} /> Export Report
                        </button>
                    </div>
                    <div className="h-80 w-full">
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

                <Card className="p-0 overflow-hidden border border-slate-100">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="font-black text-lg text-slate-900">Recent Activity</h3>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                        {transactions.slice(0, 8).map((t) => (
                            <div key={t._id || t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {t.type === 'CREDIT' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{t.description}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(t.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-black ${t.type === 'CREDIT' ? 'text-green-600' : 'text-slate-900'}`}>
                                    {t.type === 'CREDIT' ? '+' : '-'}₦{t.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
