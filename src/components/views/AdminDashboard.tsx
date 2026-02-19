import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { 
    MoreHorizontal, Search, Filter, ArrowUpRight, ArrowDownRight, 
    UserCheck, AlertTriangle, Users, Truck, MessageSquare, 
    Bell, Settings, ExternalLink, ShieldCheck, Activity, LogOut,
    CheckCircle2, Clock, MapPin, Package, RefreshCcw, TrendingUp
} from 'lucide-react';
import { ShipmentStatus, Shipment, UserRole } from '../../types';
import gsap from 'gsap';
import { AdminDriverRequests } from '../dashboard/admin/AdminDriverRequests';
import { AdminChatModal } from '../dashboard/admin/AdminChatModal';
import { FullMapModal } from '../dashboard/common/FullMapModal';
import toast from 'react-hot-toast';
import { useStore } from '../../context/StoreContext';
import { AdminUsersView } from '../dashboard/admin/AdminUsersView';
import { AdminSupportView } from '../dashboard/admin/AdminSupportView';
import { AdminSettingsView } from '../dashboard/admin/AdminSettingsView';
import { AdminDriversView } from '../dashboard/admin/AdminDriversView';
import { AdminDriverReview } from '../dashboard/admin/AdminDriverReview';

export const AdminDashboard: React.FC = () => {
    const { 
        logout, shipments, drivers, customers, allUsers, currentUser, 
        assignDriverToShipment, adminNotifications, refreshData 
    } = useStore();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [timeFilter, setTimeFilter] = useState<'Day' | 'Week' | 'Month'>('Week');
    const [shipmentFilter, setShipmentFilter] = useState<'All' | 'Active'>('All');
    const [showGlobalMap, setShowGlobalMap] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [chatModal, setChatModal] = useState<{
        shipmentId: string;
        chatWith: 'customer' | 'driver';
        recipientName: string;
        recipientId: string;
    } | null>(null);

    // GSAP Animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".admin-tab-content", {
                opacity: 0,
                x: 20,
                duration: 0.4,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [activeTab]);

    // Data Aggregation
    const totalShipments = shipments?.length || 0;
    const deliveredCount = (shipments || []).filter(s => s.status === ShipmentStatus.DELIVERED).length;
    const pendingReviewCount = (shipments || []).filter(s => s.status === ShipmentStatus.PENDING_REVIEW).length;
    const activeCount = (shipments || []).filter(s => [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status)).length;
    const availableDrivers = (drivers || []).filter(d => d.availabilityStatus === 'ONLINE').length;
    const completionRate = totalShipments > 0 ? `${Math.round((deliveredCount / totalShipments) * 100)}%` : '0%';

    const stats = [
        { label: 'Pending Review', value: pendingReviewCount.toString(), icon: Clock, color: 'text-white', bg: 'bg-gradient-to-br from-brand-dark to-slate-800' },
        { label: 'Active Shipments', value: activeCount.toString(), icon: Package, color: 'text-brand-primary', bg: 'bg-white' },
        { label: 'Available Drivers', value: availableDrivers.toString(), icon: Truck, color: 'text-brand-orange', bg: 'bg-white' },
        { label: 'Completion Rate', value: completionRate, icon: Activity, color: 'text-brand-primary', bg: 'bg-blue-50' },
    ];

    const getChartData = () => {
        const sorted = [...shipments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const data: any[] = [];
        
        if (timeFilter === 'Day') {
            // Show last 24 hours or just today's hours
            for(let i = 0; i < 24; i++) {
                data.push({ name: `${i}:00`, count: 0 });
            }
            sorted.forEach(s => {
                const date = new Date(s.date);
                if (date.toDateString() === new Date().toDateString()) {
                    const hour = date.getHours();
                    data[hour].count += 1;
                }
            });
        } else if (timeFilter === 'Week') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            days.forEach(d => data.push({ name: d, count: 0 }));
            sorted.slice(-30).forEach(s => {
                const date = new Date(s.date);
                const dayName = days[date.getDay()];
                const entry = data.find(d => d.name === dayName);
                if (entry) entry.count += 1;
            });
        } else {
            // Month - last 30 days
            for(let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                data.push({ name: d.getDate().toString(), count: 0 });
            }
            sorted.forEach(s => {
                const date = new Date(s.date);
                const diff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                if (diff < 30) {
                    data[29 - diff].count += 1;
                }
            });
        }
        return data;
    };

    const chartData = getChartData();

    // --- Sub-Components for Tabs ---

    const OverviewTab = () => (
        <div className="space-y-8 admin-tab-content">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className={`p-6 border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative ${stat.bg}`}>
                        {i === 0 && <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl" />}
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`p-3 rounded-2xl ${i === 0 ? 'bg-white/10 text-white' : i === 1 ? 'bg-blue-50' : i === 2 ? 'bg-orange-50' : 'bg-white text-brand-primary'} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${i === 0 ? 'text-brand-orange bg-brand-orange/10' : 'text-slate-400 bg-slate-50'}`}>Live</span>
                        </div>
                        <div className="mt-4 relative z-10">
                            <p className={`text-sm font-bold ${i === 0 ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                            <h3 className={`text-3xl font-black mt-1 tracking-tight ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipment Chart */}
                <Card className="lg:col-span-2 p-8 border border-slate-100 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations Insight</h3>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Shipment Volume</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">Real-time shipment activity visualized</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right mr-4 hidden md:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</p>
                                <p className="text-lg font-black text-green-500">+12.5%</p>
                            </div>
                            <Button variant="ghost" className="h-12 px-6 text-brand-primary text-xs font-black uppercase tracking-widest bg-blue-50 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all border border-blue-100/50 rounded-2xl">
                                EXPAND REPORT
                            </Button>
                        </div>
                    </div>
                    <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} 
                                    dy={15} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} 
                                    tickFormatter={(v) => `${v}`} 
                                />
                                <Tooltip 
                                    contentStyle={{
                                        borderRadius: '24px', 
                                        border: '1px solid #f1f5f9', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', 
                                        padding: '16px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropBlur: '8px'
                                    }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                                    itemStyle={{fontWeight: 900, color: '#1e293b', fontSize: '14px'}}
                                    labelStyle={{fontWeight: 700, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em'}}
                                    formatter={(value: number) => [`${value.toLocaleString()}`, 'SHIPMENTS']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorShipments)" 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* System Activity */}
                <Card className="p-8">
                    <h3 className="text-xl font-black text-slate-900 mb-6 font-mono tracking-tighter uppercase">Health Log</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Server Status', status: 'Online', color: 'text-brand-primary' },
                            { label: 'Database Latency', status: '24ms', color: 'text-brand-secondary' },
                            { label: 'Active Sockets', status: '142', color: 'text-brand-orange' },
                            { label: 'Brevo Mailer', status: 'Standby', color: 'text-brand-primary' },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <span className="text-sm font-bold text-slate-500">{item.label}</span>
                                <span className={`text-xs font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                            </div>
                        ))}
                        <div className="mt-8 pt-8 border-t border-brand-orange/10 bg-brand-orange/[0.02] -mx-8 -mb-8 p-8 rounded-b-[2rem]">
                            <h4 className="text-xs font-black text-brand-orange uppercase tracking-[0.2em] mb-4">Pending Tasks</h4>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-brand-orange/10">
                                <AlertTriangle className="text-brand-orange" size={20} />
                                <div>
                                    <p className="text-xs font-black text-slate-900">{(shipments || []).filter(s => s.status === ShipmentStatus.PENDING_REVIEW).length} Pending Reviews</p>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Urgent driver allocation needed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const ShipmentsTab = () => {
        const filtered = (shipments || []).filter(s => {
            if (shipmentFilter === 'Active') {
                return [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT, ShipmentStatus.PENDING_REVIEW].includes(s.status);
            }
            return true;
        });

        return (
            <Card noPadding className="admin-tab-content overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 rounded-[2.5rem]">
            <div className="p-8 bg-white border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Global Logistics Pipeline</h3>
                    <p className="text-slate-500 font-medium mt-1">Monitoring {shipments.length} total shipments across the network</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="bg-slate-50 text-slate-600 hover:bg-slate-100 border-none rounded-xl" onClick={() => setShowGlobalMap(true)}>
                        <MapPin size={16} className="mr-2" /> Live Map
                    </Button>
                    <div className="bg-slate-100 p-1 rounded-xl flex">
                        <button 
                            onClick={() => setShipmentFilter('All')}
                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${shipmentFilter === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setShipmentFilter('Active')}
                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${shipmentFilter === 'Active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Active
                        </button>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                            <th className="px-8 py-5">Shipment</th>
                            <th className="px-8 py-5">Locations</th>
                            <th className="px-8 py-5">Priority</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                                            s.status === ShipmentStatus.PENDING_REVIEW ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'
                                        }`}>
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">#{s.trackingId}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.cargoType || 'Cargo'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0"/> 
                                            <span className="truncate max-w-[150px]">{s.pickup.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"/> 
                                            <span className="truncate max-w-[150px]">{s.dropoff.address}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <p className="font-black text-slate-900">{s.instructions?.priority || 'NORMAL'}</p>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                        s.status === ShipmentStatus.DELIVERED ? 'bg-blue-50 text-brand-primary border-blue-100' : 
                                        s.status === ShipmentStatus.PENDING_REVIEW ? 'bg-orange-50 text-brand-orange border-orange-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>
                                        {s.status === ShipmentStatus.PENDING_REVIEW && <Clock size={10} className="animate-pulse" />}
                                        {s.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors"
                                            onClick={() => setChatModal({ shipmentId: s.id, chatWith: 'customer', recipientName: 'Customer', recipientId: s.customerId })}
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-brand-secondary/10 overflow-hidden" ref={containerRef}>
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Professional Admin Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50 
                w-80 bg-gradient-to-b from-brand-dark to-slate-900 text-white flex flex-col p-8 border-r border-white/5
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center gap-3 mb-12">
                    <div className="bg-brand-orange p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
                        <Truck size={24} className="text-white" strokeWidth={3} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter">SureTruqs<span className="text-brand-orange">.</span></h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Master Control</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {[
                        { id: 'overview', label: 'Command Center', icon: Activity },
                        { id: 'shipments', label: 'Logistics Hub', icon: Package },
                        { id: 'driver-requests', label: 'Job Dispatch', icon: ArrowUpRight },
                        { id: 'drivers', label: 'Fleet', icon: Truck },
                        { id: 'verification-hub', label: 'Verification', icon: ShieldCheck },
                        { id: 'users', label: 'User Directory', icon: Users },
                        { id: 'support', label: 'Operations Chat', icon: MessageSquare },
                        { id: 'settings', label: 'Control Plane', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                                activeTab === item.id 
                                ? 'bg-brand-orange text-white shadow-xl shadow-orange-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-white/5">
                    <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center font-black text-white shadow-lg">
                            {currentUser?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black truncate">{currentUser?.name || 'Administrator'}</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Root Access</p>
                        </div>
                        <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500 px-2 leading-none">
                        <span>v2.5.0 Premium</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                            Secure
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Modern Header */}
                <header className="h-16 md:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-10 flex items-center justify-between sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Hamburger Menu Button - Mobile Only */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div>
                            <h2 className="text-lg md:text-2xl font-black text-slate-900 capitalize tracking-tighter">{activeTab === 'driver-requests' ? 'Job Dispatch' : activeTab.replace('-', ' ')}</h2>
                            <div className="hidden md:flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Environment: PROD</span>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{new Date().toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="hidden md:flex bg-slate-100 rounded-2xl p-1.5 gap-1">
                            {['Day', 'Week', 'Month'].map((t: any) => (
                                <button 
                                    key={t} 
                                    onClick={() => setTimeFilter(t)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${timeFilter === t ? 'bg-white text-slate-900 shadow-md transform scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all border ${adminNotifications.length > 0 ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-orange-500/20' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                            >
                                <Bell size={18} />
                                {adminNotifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-[9px] font-black border-2 border-white rounded-full flex items-center justify-center">
                                        {adminNotifications.length}
                                    </span>
                                )}
                            </button>

                            {/* Notification Flyout - Fixed glitch overlay */}
                            {showNotifications && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-[55] cursor-default" 
                                        onClick={() => setShowNotifications(false)}
                                    />
                                    <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in slide-in-from-top-4 duration-300">
                                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50">
                                            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                                <Bell size={16} className="text-brand-orange" />
                                                Live Notifications
                                            </h4>
                                            <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline">Clear all</button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {adminNotifications.length > 0 ? adminNotifications.map((n, i) => (
                                                <div key={i} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-brand-orange shrink-0">
                                                        <Activity size={18} />
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-black text-slate-900">{n.title}</p>
                                                        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{n.message}</p>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2">{new Date(n.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="py-12 text-center text-slate-400">
                                                    <Bell size={32} className="mx-auto mb-2 opacity-10" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">No New Alerts</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <button 
                            onClick={() => setActiveTab('settings')}
                            className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center transition-all border ${activeTab === 'settings' ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'}`}
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    <div className="max-w-[1600px] mx-auto">
                        {activeTab === 'overview' && <OverviewTab />}
                        {activeTab === 'shipments' && <ShipmentsTab />}
                        {activeTab === 'driver-requests' && (
                            <div className="admin-tab-content">
                                <AdminDriverRequests
                                    shipments={shipments}
                                    drivers={drivers}
                                    onAssignDriver={assignDriverToShipment}
                                    onMessageDriver={(sId, dId) => {
                                        const d = drivers.find(dr => dr.id === dId || (dr as any)._id === dId);
                                        setChatModal({ shipmentId: sId, chatWith: 'driver', recipientName: d?.name || 'Driver', recipientId: dId });
                                    }}
                                    onMessageCustomer={(sId) => {
                                        const s = shipments.find(sh => sh.id === sId);
                                        setChatModal({ shipmentId: sId, chatWith: 'customer', recipientName: 'Customer', recipientId: s?.customerId || '' });
                                    }}
                                />
                            </div>
                        )}
                        {activeTab === 'drivers' && (
                            <AdminDriversView 
                                drivers={drivers} 
                                shipments={shipments}
                                onMessageDriver={(dId, name) => {
                                    setChatModal({ shipmentId: 'ADMIN_DM', chatWith: 'driver', recipientName: name, recipientId: dId });
                                }}
                            />
                        )}
                        {activeTab === 'users' && (
                            <AdminUsersView 
                                users={allUsers} 
                                drivers={drivers} 
                                onDeleteUser={() => refreshData()} 
                            />
                        )}
                        {activeTab === 'verification-hub' && <AdminDriverReview />}
                        {activeTab === 'support' && (
                            <AdminSupportView 
                                onOpenChat={(sId, uId, uName, role) => setChatModal({ 
                                    shipmentId: sId, 
                                    chatWith: role, 
                                    recipientName: uName, 
                                    recipientId: uId 
                                })} 
                            />
                        )}
                        {activeTab === 'settings' && <AdminSettingsView />}
                        {['overview', 'shipments', 'driver-requests', 'drivers', 'users', 'verification-hub', 'support', 'settings'].indexOf(activeTab) === -1 && (
                            <div className="flex flex-col items-center justify-center h-[600px] text-slate-400 border-4 border-dashed border-slate-200 rounded-[3rem] bg-white group hover:border-brand-primary/20 transition-all duration-700">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] mb-6 group-hover:rotate-12 transition-transform duration-500">
                                    <Activity size={64} className="text-slate-200 group-hover:text-brand-primary/20" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Accessing Secure Module...</h3>
                                <p className="text-sm font-bold text-slate-500 mt-2">The {activeTab} control plane is currently under maintenance.</p>
                                <Button variant="secondary" className="mt-8 rounded-2xl bg-brand-primary text-white px-8 h-12 border-none">
                                    <RefreshCcw size={16} className="mr-2" /> Sync Module
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            {chatModal && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setChatModal(null)}
                >
                    <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <AdminChatModal
                            {...chatModal}
                            onClose={() => setChatModal(null)}
                        />
                    </div>
                </div>
            )}

            {showGlobalMap && (
                <div className="fixed inset-0 z-[110]">
                    <FullMapModal onClose={() => setShowGlobalMap(false)} />
                </div>
            )}
        </div>
    );
};
