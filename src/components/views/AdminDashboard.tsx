import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { 
    MoreHorizontal, Search, Filter, ArrowUpRight, ArrowDownRight, 
    UserCheck, AlertTriangle, Users, Truck, Wallet, MessageSquare, 
    Bell, Settings, ExternalLink, ShieldCheck, Activity, LogOut,
    CheckCircle2, Clock, MapPin, Package, RefreshCcw
} from 'lucide-react';
import { ShipmentStatus, Shipment, UserRole } from '../../types';
import gsap from 'gsap';
import { AdminDriverRequests } from '../dashboard/admin/AdminDriverRequests';
import { AdminChatModal } from '../dashboard/admin/AdminChatModal';
import { FullMapModal } from '../dashboard/common/FullMapModal';
import toast from 'react-hot-toast';
import { useStore } from '../../context/StoreContext';
import { AdminUsersView } from '../dashboard/admin/AdminUsersView';
import { AdminFinancesView } from '../dashboard/admin/AdminFinancesView';
import { AdminSupportView } from '../dashboard/admin/AdminSupportView';

export const AdminDashboard: React.FC = () => {
    const { 
        logout, shipments, drivers, customers, allUsers, currentUser, 
        assignDriverToShipment, adminNotifications, refreshData 
    } = useStore();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [showGlobalMap, setShowGlobalMap] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
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
    const stats = [
        { label: 'Total Revenue', value: `₦${(shipments.reduce((acc, s) => acc + (s.price || 0), 0)).toLocaleString()}`, icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Users', value: customers.length.toString(), icon: Users, color: 'text-brand-primary', bg: 'bg-blue-50' },
        { label: 'Fleet Status', value: drivers.length.toString(), icon: Truck, color: 'text-brand-orange', bg: 'bg-orange-50' },
        { label: 'Completion Rate', value: '94%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const chartData = shipments.reduce((acc: any[], s) => {
        const date = new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' });
        const existing = acc.find(d => d.name === date);
        if (existing) {
            existing.revenue += s.price || 0;
            existing.count += 1;
        } else {
            acc.push({ name: date, revenue: s.price || 0, count: 1 });
        }
        return acc;
    }, []).slice(-7);

    // --- Sub-Components for Tabs ---

    const OverviewTab = () => (
        <div className="space-y-8 admin-tab-content">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Live</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <Card className="lg:col-span-2 p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Revenue Stream</h3>
                            <p className="text-sm text-slate-500 font-medium">Weekly financial performance overview</p>
                        </div>
                        <Button variant="ghost" className="text-brand-secondary text-xs font-black uppercase tracking-widest">VIEW REPORT</Button>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
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
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* System Activity */}
                <Card className="p-8">
                    <h3 className="text-xl font-black text-slate-900 mb-6 font-mono tracking-tighter uppercase">Health Log</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Server Status', status: 'Online', color: 'text-green-500' },
                            { label: 'Database Latency', status: '24ms', color: 'text-blue-500' },
                            { label: 'Active Sockets', status: '142', color: 'text-purple-500' },
                            { label: 'Brevo Mailer', status: 'Standby', color: 'text-green-500' },
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
                                    <p className="text-xs font-black text-slate-900">{shipments.filter(s => s.status === ShipmentStatus.PENDING).length} Re-assignments</p>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">Urgent driver allocation needed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const ShipmentsTab = () => (
        <Card noPadding className="admin-tab-content overflow-hidden border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
            <div className="p-8 bg-brand-dark text-white flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black tracking-tight">Global Logistics Pipeline</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Monitoring {shipments.length} total shipments across the network</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" className="bg-white/10 border-white/10 text-white hover:bg-white/20 px-6 rounded-2xl" onClick={() => setShowGlobalMap(true)}>
                        <MapPin size={16} className="mr-2" /> Live Map
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                            <th className="px-8 py-5">Shipment</th>
                            <th className="px-8 py-5">Locations</th>
                            <th className="px-8 py-5">Price</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {shipments.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50/80 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">#{s.trackingId}</p>
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{s.cargoType || 'Cargo'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="max-w-[200px] space-y-1">
                                        <p className="text-xs font-bold text-slate-600 truncate flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500"/> {s.pickup.address}</p>
                                        <p className="text-xs font-bold text-slate-600 truncate flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500"/> {s.dropoff.address}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-black text-slate-900">₦{s.price.toLocaleString()}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${
                                        s.status === ShipmentStatus.DELIVERED ? 'bg-green-50 text-green-700 border-green-100' : 
                                        s.status === ShipmentStatus.PENDING ? 'bg-orange-50 text-orange-700 border-orange-100 animate-pulse' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" className="rounded-lg hover:bg-slate-100" onClick={() => setChatModal({ shipmentId: s.id, chatWith: 'customer', recipientName: 'Customer', recipientId: s.customerId })}>
                                            <MessageSquare size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="rounded-lg hover:bg-slate-100">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-brand-secondary/10 overflow-hidden" ref={containerRef}>
            {/* Professional Admin Sidebar - Switched to brand-dark for better contrast and pallet consistency */}
            <div className="w-80 bg-brand-dark text-white flex flex-col p-8 border-r border-white/5 relative z-20">
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
                        { id: 'users', label: 'User Directory', icon: Users },
                        { id: 'finances', label: 'Treasury', icon: Wallet },
                        { id: 'support', label: 'Operations Chat', icon: MessageSquare },
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
                        <span>v2.4.0 Stable</span>
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
                <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tighter">{activeTab.replace('-', ' ')}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Environment: PROD</span>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{new Date().toLocaleDateString(undefined, {month:'long', day:'numeric', year:'numeric'})}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 rounded-2xl p-1.5 flex gap-1">
                            {['Day', 'Week', 'Month'].map(t => (
                                <button key={t} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${t === 'Week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                            ))}
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${adminNotifications.length > 0 ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-orange-500/20' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                            >
                                <Bell size={20} />
                                {adminNotifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 text-white text-[9px] font-black border-2 border-white rounded-full flex items-center justify-center">
                                        {adminNotifications.length}
                                    </span>
                                )}
                            </button>

                            {/* Notification Flyout */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in slide-in-from-top-4 duration-300">
                                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50">
                                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                            <Bell size={16} className="text-brand-orange" />
                                            Live Notifications
                                        </h4>
                                        <button className="text-[10px] font-black text-brand-secondary uppercase tracking-widest hover:underline">Clear all</button>
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
                            )}
                        </div>

                        <button className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all border border-transparent">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10">
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
                        {activeTab === 'users' && (
                            <AdminUsersView 
                                users={allUsers} 
                                drivers={drivers} 
                                onDeleteUser={() => refreshData()} 
                            />
                        )}
                        {activeTab === 'finances' && <AdminFinancesView />}
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
                        {['overview', 'shipments', 'driver-requests', 'users', 'finances', 'support'].indexOf(activeTab) === -1 && (
                            <div className="flex flex-col items-center justify-center h-[600px] text-slate-400 border-4 border-dashed border-slate-200 rounded-[3rem] bg-white group hover:border-brand-secondary/20 transition-all duration-700">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] mb-6 group-hover:rotate-12 transition-transform duration-500">
                                    <Activity size={64} className="text-slate-200 group-hover:text-brand-secondary/20" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Accessing Secure Module...</h3>
                                <p className="text-sm font-bold text-slate-500 mt-2">The {activeTab} control plane is currently under maintenance.</p>
                                <Button variant="secondary" className="mt-8 rounded-2xl bg-brand-secondary text-white px-8 h-12 border-none">
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