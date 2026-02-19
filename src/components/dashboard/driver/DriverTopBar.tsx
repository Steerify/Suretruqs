import React from 'react';
import { Truck, Home, Clock, User as UserIcon, Power, Headphones, Bell, ChevronDown, LogOut } from 'lucide-react';
import { User } from '../../../types';

interface DriverTopBarProps {
    user: User;
    view: string;
    setView: (view: any) => void;
    availabilityStatus: 'ONLINE' | 'OFFLINE' | 'BUSY';
    setAvailabilityStatus: (status: 'ONLINE' | 'OFFLINE' | 'BUSY') => void;
    showNotifications: boolean;
    setShowNotifications: (show: boolean) => void;
    onLogout: () => void;
}

export const DriverTopBar = ({ user, view, setView, availabilityStatus, setAvailabilityStatus, showNotifications, setShowNotifications, onLogout }: DriverTopBarProps) => {
    return (
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
         <div className="w-full max-w-[1920px] mx-auto flex justify-between items-center px-6 h-20">
             {/* Logo & Nav Group */}
             <div className="flex items-center gap-8 lg:gap-12">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
                    <div className="bg-brand-orange text-white p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Truck size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">SureTruqs<span className="text-brand-orange">.</span></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Partner</span>
                    </div>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center bg-slate-50 p-1.5 rounded-full border border-slate-100">
                    {[
                        { id: 'home', label: 'Jobs', icon: Home },
                        { id: 'history', label: 'History', icon: Clock },
                        { id: 'profile', label: 'Profile', icon: UserIcon }
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
                            <item.icon size={16} className={`mr-2.5 ${
                                view === item.id 
                                ? 'text-brand-primary' 
                                : 'text-slate-400'
                            }`} strokeWidth={2.5} />
                            {item.label}
                        </button>
                    ))}
                </div>
             </div>

             {/* Right Actions */}
             <div className="flex items-center gap-3 lg:gap-5">
                 {/* Enhanced Online/Offline Toggle - Desktop */}
                 <button 
                   onClick={() => setAvailabilityStatus(availabilityStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}
                   disabled={availabilityStatus === 'BUSY'}
                   className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border shadow-sm ${
                       availabilityStatus === 'ONLINE' 
                       ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                       : availabilityStatus === 'BUSY'
                       ? 'bg-orange-50 text-orange-700 border-orange-200 cursor-not-allowed'
                       : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                   }`}
                 >
                    <Power size={14} className={availabilityStatus === 'ONLINE' ? 'text-green-600' : availabilityStatus === 'BUSY' ? 'text-orange-600' : 'text-slate-400'} />
                    {availabilityStatus === 'ONLINE' ? 'Available' : availabilityStatus === 'BUSY' ? 'On Job' : 'Offline'}
                    <div className={`w-2 h-2 rounded-full ml-1 ${
                        availabilityStatus === 'ONLINE' ? 'bg-green-500 animate-pulse' :
                        availabilityStatus === 'BUSY' ? 'bg-orange-500 animate-pulse' :
                        'bg-slate-400'
                    }`}></div>
                 </button>

                 <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

                 {/* Support Button */}
                 <button 
                    onClick={() => setView('support')}
                    className={`relative w-10 h-10 hidden md:flex items-center justify-center rounded-full transition-colors border group ${view === 'support' ? 'bg-orange-50 text-brand-orange border-orange-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-200'}`}
                    title="Dispatch Support"
                 >
                     <Headphones size={20} strokeWidth={2} className="group-hover:animate-swing" />
                 </button>

                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative w-10 h-10 hidden md:flex items-center justify-center rounded-full transition-colors border group ${showNotifications ? 'bg-blue-50 text-brand-primary border-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent hover:border-slate-200'}`}
                 >
                     <Bell size={20} strokeWidth={2} className="group-hover:animate-swing" />
                     <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                 </button>

                 {/* User Profile Pill */}
                 <div 
                    onClick={() => setView('profile')}
                    className="hidden md:flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 transition-all cursor-pointer bg-white group hover:shadow-sm"
                 >
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                         {user.name.charAt(0)}
                     </div>
                     <div className="flex flex-col pr-1 text-left">
                        <span className="text-sm font-bold text-slate-900 leading-tight">{user.name.split(' ')[0]}</span>
                        <span className="text-xs font-bold text-slate-400 leading-tight mt-0.5">Gold Partner</span>
                     </div>
                     <ChevronDown size={14} className="text-slate-400 ml-1 group-hover:text-slate-600" />
                 </div>

                 {/* Mobile Logout */}
                 <button onClick={onLogout} className="md:hidden p-2.5 text-slate-500 hover:text-red-600 transition-colors hover:bg-red-50 rounded-xl">
                    <LogOut size={24} />
                 </button>

                 <button onClick={onLogout} className="hidden md:flex p-2.5 text-slate-400 hover:text-red-600 transition-colors hover:bg-red-50 rounded-xl" title="Sign Out">
                    <LogOut size={20} />
                 </button>
             </div>
         </div>
      </div>
    );
};
