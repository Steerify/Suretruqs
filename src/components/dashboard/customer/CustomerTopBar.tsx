import React from 'react';
import { Package, LayoutDashboard, Truck, History, Settings, Bell, ChevronRight, LogOut } from 'lucide-react';
import { User } from '../../../types';
import { useStore } from '../../../context/StoreContext';


interface CustomerTopBarProps {
    user: User;
    view: string;
    setView: (view: any) => void;
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    onLogout: () => void;
}

export const CustomerTopBar = ({ user, view, setView, showNotifications, setShowNotifications, onLogout }: CustomerTopBarProps) => {
    const { notifications } = useStore();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
         <div className="w-full max-w-[1920px] mx-auto flex justify-between items-center px-6 h-20">
             {/* Logo & Nav Group */}
             <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
                    <div className="bg-brand-orange text-white p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Package size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">SureTruqs<span className="text-brand-orange">.</span></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Customer</span>
                    </div>
                </div>
                
                {/* Desktop Navigation - Pill Style */}
                <div className="hidden md:flex items-center bg-slate-50 p-1.5 rounded-full border border-slate-100">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'history', label: 'History', icon: History },
                        { id: 'profile', label: 'Account', icon: Settings }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as any)}
                            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                view === item.id 
                                ? 'bg-white text-brand-primary shadow-sm ring-1 ring-slate-200 scale-100' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 scale-95 hover:scale-100'
                            }`}
                        >
                            <item.icon size={16} className={`mr-2.5 ${view === item.id ? 'text-brand-primary' : 'text-slate-400'} transition-colors`} strokeWidth={2.5} />
                            {item.label}
                        </button>
                    ))}
                </div>
             </div>

             {/* Right Actions */}
             <div className="flex items-center gap-3 lg:gap-5">
                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors border group ${showNotifications ? 'bg-blue-50 text-brand-primary border-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-200'}`}
                 >
                     <Bell size={20} strokeWidth={2} className="group-hover:animate-swing" />
                     {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold border-2 border-white rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                     )}
                 </button>
                 
                 <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>
                 
                 {/* User Profile Pill */}
                 <div 
                    onClick={() => setView('profile')} 
                    className="hidden md:flex items-center gap-3 pl-2 pr-2 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white group hover:shadow-sm"
                 >
                     <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 text-brand-primary flex items-center justify-center font-bold text-sm border border-white shadow-sm group-hover:scale-105 transition-transform">
                         {user.name.charAt(0)}
                     </div>
                     <div className="flex flex-col pr-1">
                        <span className="text-xs font-bold text-slate-800 leading-none">{user.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">{user.company || 'New Partner'}</span>
                     </div>
                     <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
                         <ChevronRight size={12} className="rotate-90" strokeWidth={3}/>
                     </div>
                 </div>

                 {/* Mobile Menu Trigger */}
                 <button onClick={onLogout} className="md:hidden p-2.5 text-slate-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-xl">
                    <LogOut size={24}/>
                 </button>
                 
                 <button onClick={onLogout} className="hidden md:flex p-2.5 text-slate-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-xl" title="Sign Out">
                    <LogOut size={20}/>
                 </button>
             </div>
         </div>
      </div>
    );
};
