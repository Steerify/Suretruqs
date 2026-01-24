import React, { useEffect, useState } from 'react';
import { Card } from '../../ui/Card';
import { Transaction } from '../../../types';
import { 
    Wallet, ArrowUpRight, ArrowDownLeft, Download, Filter, Search, 
    MoreHorizontal, TrendingUp, DollarSign, Receipt, X, Calendar,
    ChevronDown, Eye, RefreshCcw, Activity
} from 'lucide-react';
import api from '../../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AdminFinancesView: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
    const [showFilters, setShowFilters] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'WEEK' | 'MONTH'>('WEEK');

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

    const totalDeposits = transactions
        .filter(t => t.type === 'CREDIT')
        .reduce((acc, c) => acc + c.amount, 0);

    const successfulTransactions = transactions.filter(t => t.status === 'SUCCESS').length;
    const successRate = transactions.length > 0 ? ((successfulTransactions / transactions.length) * 100).toFixed(1) : 0;

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = searchQuery === '' || 
            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((t.userId as any)?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.reference || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = filterType === 'ALL' || t.type === filterType;
        const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
        
        return matchesSearch && matchesType && matchesStatus;
    });

    const getChartData = () => {
        const limit = timeFilter === 'WEEK' ? 7 : 30;
        return transactions.reduce((acc: any[], t) => {
            const date = new Date(t.createdAt || t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const existing = acc.find(d => d.name === date);
            if (existing) {
                if (t.type === 'CREDIT') {
                    existing.credit += t.amount;
                } else {
                    existing.debit += t.amount;
                }
                existing.total += t.amount;
            } else {
                acc.push({ 
                    name: date, 
                    total: t.amount,
                    credit: t.type === 'CREDIT' ? t.amount : 0,
                    debit: t.type === 'DEBIT' ? t.amount : 0
                });
            }
            return acc;
        }, []).slice(-limit);
    };

    const chartData = getChartData();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Premium Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-brand-dark via-slate-900 to-slate-800 text-white border-none shadow-2xl shadow-slate-900/20 group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl group-hover:bg-brand-orange/20 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
                                <DollarSign size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-2 py-1 rounded-full">Live</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Revenue</p>
                        <h3 className="text-3xl md:text-4xl font-black tracking-tight">₦{totalRevenue.toLocaleString()}</h3>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1 text-brand-orange">
                                <TrendingUp size={14} />
                                <span className="text-xs font-black">+12.5%</span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">vs last month</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white border border-slate-100 hover:shadow-xl hover:shadow-brand-orange/10 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-brand-orange to-orange-600 rounded-2xl shadow-lg shadow-brand-orange/20 group-hover:scale-110 transition-transform">
                            <ArrowDownLeft size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <Receipt size={16} className="text-slate-300 group-hover:text-brand-orange transition-colors" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Deposits</p>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        ₦{totalDeposits.toLocaleString()}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-3">Active revenue stream</p>
                </Card>

                <Card className="p-6 bg-white border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-brand-primary to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <ArrowUpRight size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <Wallet size={16} className="text-slate-300 group-hover:text-brand-primary transition-colors" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Transaction Volume</p>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{transactions.length}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-3">Total processed</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gradient-to-br from-brand-primary to-blue-700 rounded-2xl shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary bg-blue-100 px-2 py-1 rounded-full">Rate</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Success Rate</p>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{successRate}%</h3>
                    <p className="text-xs text-slate-400 font-medium mt-3">{successfulTransactions} successful</p>
                </Card>
            </div>

            {/* Advanced Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 md:p-8 border border-slate-100 shadow-lg bg-gradient-to-br from-white to-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Financial Trends</h3>
                            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">Weekly transaction flow analytics</p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setTimeFilter('WEEK')}
                                className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-colors ${timeFilter === 'WEEK' ? 'text-brand-secondary bg-brand-secondary/10' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                            >
                                Week
                            </button>
                            <button 
                                onClick={() => setTimeFilter('MONTH')}
                                className={`px-3 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-colors ${timeFilter === 'MONTH' ? 'text-brand-secondary bg-brand-secondary/10' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                            >
                                Month
                            </button>
                            <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                                <Download size={14} className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                    <div className="h-72 md:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.3}/>
                                    </linearGradient>
                                    <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 11, fill: '#64748b', fontWeight: 700}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 11, fill: '#64748b', fontWeight: 700}} 
                                    tickFormatter={(v) => `₦${v/1000}k`}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                                        padding: '12px',
                                        backgroundColor: 'white'
                                    }}
                                    itemStyle={{fontWeight: 800, fontSize: 12}}
                                    cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                                />
                                <Bar dataKey="credit" fill="url(#colorCredit)" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="debit" fill="url(#colorDebit)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-orange"></div>
                            <span className="text-xs font-bold text-slate-600">Credits</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                            <span className="text-xs font-bold text-slate-600">Debits</span>
                        </div>
                    </div>
                </Card>

                {/* Quick Stats Sidebar */}
                <Card className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-100">
                    <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="text-brand-orange" size={20} />
                        Quick Stats
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Avg. Transaction', value: `₦${transactions.length > 0 ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toLocaleString() : 0}`, color: 'text-brand-primary', bg: 'bg-blue-50' },
                            { label: 'Pending Amount', value: `₦${transactions.filter(t => t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`, color: 'text-brand-orange', bg: 'bg-orange-50' },
                            { label: 'Failed Transactions', value: transactions.filter(t => t.status === 'FAILED').length.toString(), color: 'text-slate-600', bg: 'bg-slate-50' },
                            { label: 'Today\'s Revenue', value: `₦${transactions.filter(t => new Date(t.createdAt || t.date).toDateString() === new Date().toDateString()).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`, color: 'text-brand-dark', bg: 'bg-slate-100' },
                        ].map((stat, i) => (
                            <div key={i} className={`p-4 rounded-2xl ${stat.bg} border border-${stat.color}/20 hover:scale-[1.02] transition-transform`}>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card className="w-full border border-slate-100 overflow-hidden shadow-lg" noPadding>
                <div className="p-4 md:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
                                <Receipt size={20} className="text-brand-orange" />
                                All Transactions
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                {filteredTransactions.length} of {transactions.length} transactions
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 sm:flex-initial">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search transactions..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none bg-white"
                                />
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                                    showFilters 
                                        ? 'bg-brand-primary text-white' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Filter size={16} />
                                Filters
                                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Type</label>
                                <select 
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none"
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="CREDIT">Credit</option>
                                    <option value="DEBIT">Debit</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Status</label>
                                <select 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-primary outline-none"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="SUCCESS">Success</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                            </div>
                            <button 
                                onClick={() => {
                                    setFilterType('ALL');
                                    setFilterStatus('ALL');
                                    setSearchQuery('');
                                }}
                                className="sm:col-span-2 lg:col-span-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors self-end"
                            >
                                <RefreshCcw size={14} />
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-slate-100">
                    {filteredTransactions.map((t) => (
                        <div 
                            key={t._id || t.id}
                            className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => setSelectedTransaction(t)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${
                                        t.type === 'CREDIT' 
                                            ? 'bg-gradient-to-br from-brand-orange to-orange-600' 
                                            : 'bg-gradient-to-br from-brand-primary to-blue-600'
                                    } flex items-center justify-center text-white shadow-lg`}>
                                        {t.type === 'CREDIT' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{(t.userId as any)?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-slate-500 font-medium">#{((t._id || t.id) as string).slice(-8)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">₦{t.amount.toLocaleString()}</p>
                                    <span className={`text-[10px] font-black uppercase ${
                                        t.status === 'SUCCESS' ? 'text-brand-primary' : 
                                        t.status === 'PENDING' ? 'text-brand-orange' : 'text-slate-500'
                                    }`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mb-2">{t.description}</p>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400 font-medium">
                                    {new Date(t.createdAt || t.date).toLocaleDateString()} at {new Date(t.createdAt || t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <Eye size={14} className="text-slate-400" />
                            </div>
                        </div>
                    ))}
                    {filteredTransactions.length === 0 && (
                        <div className="py-12 text-center text-slate-400">
                            <Wallet size={40} className="mx-auto mb-3 opacity-10" />
                            <p className="text-sm font-bold">No transactions found</p>
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-4 py-4">Date & Time</th>
                                <th className="px-4 py-4">User Details</th>
                                <th className="px-4 py-4">Description</th>
                                <th className="px-4 py-4">Type</th>
                                <th className="px-4 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredTransactions.map((t) => (
                                <tr 
                                    key={t._id || t.id} 
                                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                                    onClick={() => setSelectedTransaction(t)}
                                >
                                    <td className="px-6 py-5 font-mono text-xs text-slate-500">#{((t._id || t.id) as string).slice(-8)}</td>
                                    <td className="px-4 py-5">
                                        <p className="text-slate-700 font-bold text-xs">{new Date(t.createdAt || t.date).toLocaleDateString()}</p>
                                        <p className="text-slate-400 text-[10px] font-medium">{new Date(t.createdAt || t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </td>
                                    <td className="px-4 py-5">
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
                                    <td className="px-4 py-5 text-slate-600 font-medium max-w-xs truncate">{t.description}</td>
                                    <td className="px-4 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                            t.type === 'CREDIT' ? 'bg-orange-50 text-brand-orange border-orange-100' : 'bg-blue-50 text-brand-primary border-blue-100'
                                        }`}>
                                            {t.type === 'CREDIT' ? <ArrowDownLeft size={10}/> : <ArrowUpRight size={10}/>}
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                            t.status === 'SUCCESS' ? 'bg-blue-50 text-brand-primary border-blue-100' : 
                                            t.status === 'PENDING' ? 'bg-orange-50 text-brand-orange border-orange-100' : 
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <p className="font-black text-slate-900">₦{t.amount.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{t.reference}</p>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-16 text-center text-slate-400">
                                        <Wallet size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="text-sm font-bold uppercase tracking-widest">No transactions found</p>
                                        <p className="text-xs font-medium mt-2">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Enhanced Transaction Detail Modal */}
            {selectedTransaction && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setSelectedTransaction(null)}
                >
                    <div className="bg-white w-full max-w-3xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white z-10 p-6 md:p-8 border-b border-slate-100 rounded-t-[2rem] md:rounded-t-[2.5rem]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <Receipt size={24} className="text-brand-orange" />
                                        Transaction Details
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">Complete payment information</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedTransaction(null)}
                                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X size={20}/>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">
                            {/* User Information */}
                            <div className="p-6 bg-gradient-to-br from-brand-secondary/5 via-blue-50/50 to-transparent rounded-2xl border border-brand-secondary/10">
                                <p className="text-xs font-black text-brand-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-secondary"></div>
                                    User Information
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-secondary to-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                                            {(selectedTransaction.userId as any)?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900 text-lg">{(selectedTransaction.userId as any)?.name || 'Unknown User'}</p>
                                            <p className="text-sm text-slate-600 font-medium">{(selectedTransaction.userId as any)?.email || 'No email provided'}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-brand-secondary/10">
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
                                        <div className="flex items-center gap-2 text-sm text-slate-600 sm:col-span-2">
                                            <span className="font-bold">User ID:</span> 
                                            <code className="font-mono text-xs bg-white px-2 py-1 rounded border border-slate-200">
                                                {(selectedTransaction.userId as any)?._id || 'N/A'}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Information Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Receipt size={10} />
                                        Transaction ID
                                    </p>
                                    <p className="font-mono text-xs font-bold text-slate-900">#{((selectedTransaction._id || selectedTransaction.id) as string).slice(-12)}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reference</p>
                                    <p className="font-mono text-xs font-bold text-slate-900 truncate">{selectedTransaction.reference}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Calendar size={10} />
                                        Date & Time
                                    </p>
                                    <p className="text-xs font-bold text-slate-900">
                                        {new Date(selectedTransaction.createdAt || selectedTransaction.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status</p>
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                        selectedTransaction.status === 'SUCCESS' ? 'bg-blue-100 text-brand-primary border-blue-200' : 
                                        selectedTransaction.status === 'PENDING' ? 'bg-orange-100 text-brand-orange border-orange-200' : 
                                        'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Description</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedTransaction.description}</p>
                            </div>

                            <div className="p-6 md:p-8 bg-gradient-to-br from-brand-orange/10 via-orange-50 to-brand-orange/5 rounded-2xl border border-brand-orange/20">
                                <p className="text-xs font-black text-brand-orange uppercase tracking-wider mb-3">Transaction Amount</p>
                                <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">₦{selectedTransaction.amount.toLocaleString()}</p>
                                <div className="flex items-center gap-2 mt-4">
                                    {selectedTransaction.type === 'CREDIT' ? (
                                        <div className="flex items-center gap-2 text-brand-orange">
                                            <ArrowDownLeft size={16} />
                                            <span className="text-sm font-bold">Credited to wallet</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-brand-primary">
                                            <ArrowUpRight size={16} />
                                            <span className="text-sm font-bold">Debited from wallet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white p-6 md:p-8 border-t border-slate-100 rounded-b-[2rem] md:rounded-b-[2.5rem] flex flex-col sm:flex-row gap-3">
                            <button 
                                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-black rounded-xl hover:bg-slate-200 transition-colors"
                                onClick={() => setSelectedTransaction(null)}
                            >
                                Close
                            </button>
                            <button className="flex-1 px-6 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Download size={16} /> Export Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
