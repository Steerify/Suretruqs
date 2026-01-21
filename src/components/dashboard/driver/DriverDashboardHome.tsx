import React, { useState } from 'react';
import { Wallet, Filter, ChevronDown, Package, Clock, Star } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Shipment, User } from '../../../types';

interface DriverDashboardHomeProps {
    user: User;
    availableJobs: Shipment[];
    onAcceptJob: (id: string) => void;
    setView: (view: any) => void;
}

export const DriverDashboardHome = ({ user, availableJobs, onAcceptJob, setView }: DriverDashboardHomeProps) => {
    const [jobFilter, setJobFilter] = useState('All');
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const toggleJobExpansion = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedJobId(prev => prev === id ? null : id);
    };

    // Filter Logic
    const filteredJobs = availableJobs.filter(job => {
        if (jobFilter === 'High Pay') return job.price >= 50000;
        if (jobFilter === 'Short Trips') return parseInt(job.distance || '100') < 10;
        return true;
    });

    return (
        <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-[1920px] mx-auto">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                 <p className="text-slate-500 font-medium">Good morning, {user.name.split(' ')[0]}.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
               <div className="lg:col-span-3 space-y-10">
                   {/* Earnings Card */}
                   <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden shadow-lg group hover:shadow-xl transition-all">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
                       <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50/50 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>

                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                           <div>
                               <div className="flex items-center gap-2 mb-2">
                                   <div className="p-1.5 bg-green-50 rounded-lg text-green-600"><Wallet size={16}/></div>
                                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Available Earnings</p>
                               </div>
                               <h3 className="text-5xl font-bold tracking-tight mb-2 text-slate-900">₦75,000<span className="text-2xl text-slate-400 font-normal">.00</span></h3>
                               <p className="text-slate-500 text-sm font-medium">Last payout: <span className="text-slate-900 font-bold">2 days ago</span></p>
                           </div>
                           <div className="flex gap-3 w-full md:w-auto">
                               <Button className="bg-brand-primary hover:bg-blue-800 text-white border-none py-3 px-6 shadow-lg shadow-blue-500/20 rounded-xl font-bold" onClick={() => setView('wallet')}>Cash Out</Button>
                               <Button variant="secondary" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 py-3 px-6 rounded-xl" onClick={() => setView('wallet')}>History</Button>
                           </div>
                       </div>
                   </div>

                   <div>
                       <div className="flex items-center justify-between mb-6">
                           <h3 className="font-bold text-xl text-slate-900">Available Jobs Nearby</h3>
                           {/* Filter Pills */}
                           <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
                               {['All', 'High Pay', 'Short Trips'].map(filter => (
                                   <button 
                                       key={filter} 
                                       onClick={() => setJobFilter(filter)}
                                       className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${jobFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                                   >
                                       {filter}
                                   </button>
                               ))}
                           </div>
                       </div>
                       
                       {filteredJobs.length > 0 ? (
                           <div className="flex flex-col gap-6">
                               {filteredJobs.map((job) => {
                                   const isExpanded = expandedJobId === job.id;
                                   return (
                                   <div 
                                       key={job.id} 
                                       className={`bg-white rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 ease-in-out cursor-pointer relative overflow-hidden ${isExpanded ? 'ring-2 ring-brand-secondary/10 shadow-xl scale-[1.01]' : 'hover:shadow-lg active:scale-[0.99] hover:border-brand-secondary/30'}`}
                                       onClick={(e) => toggleJobExpansion(job.id, e)}
                                   >
                                       <div className="p-6">
                                           <div className="flex justify-between items-start mb-6">
                                               <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide border border-slate-200">
                                               {job.cargoType || 'Cargo'}
                                               </span>
                                               <span className="font-bold text-2xl text-brand-orange">₦{job.price.toLocaleString()}</span>
                                           </div>
                                           <div className="space-y-6">
                                               <div className="flex gap-4 group/item">
                                                   <div className="mt-1 relative">
                                                       <div className="w-3 h-3 rounded-full bg-white border-[3px] border-slate-300 z-10 relative"></div>
                                                       <div className="absolute top-3 left-1.5 w-0.5 h-full bg-slate-100 -z-0"></div>
                                                   </div>
                                                   <div>
                                                       <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Pickup • {job.distance || '10 km'}</p>
                                                       <p className="text-base font-bold text-slate-900 leading-snug">{job.pickup.address}</p>
                                                   </div>
                                               </div>
                                               <div className="flex gap-4 group/item">
                                                   <div className="mt-1 relative">
                                                       <div className="w-3 h-3 rounded-full bg-white border-[3px] border-brand-secondary z-10 relative"></div>
                                                   </div>
                                                   <div>
                                                       <p className="text-xs text-brand-secondary font-bold uppercase tracking-wider mb-1">Dropoff</p>
                                                       <p className="text-base font-bold text-slate-900 leading-snug">{job.dropoff.address}</p>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                       {/* EXPANDED CONTENT */}
                                       <div 
                                           className={`transition-all duration-500 ease-in-out overflow-hidden bg-slate-50/50 border-t border-slate-100 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                       >
                                           <div className="p-6 pt-6">
                                               <div className="grid grid-cols-2 gap-4 mb-6">
                                                   <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                                                       <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-bold uppercase">
                                                           <Package size={14} /> Cargo Weight
                                                       </div>
                                                       <span className="font-bold text-slate-900 text-lg">{job.weight || 'N/A'}</span>
                                                   </div>
                                                   <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                                                       <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-bold uppercase">
                                                           <Clock size={14} /> Est. Time
                                                       </div>
                                                       <span className="font-bold text-slate-900 text-lg">45 mins</span>
                                                   </div>
                                               </div>
                                               {job.cargoImage && (
                                                   <div className="mb-6">
                                                       <p className="text-xs text-slate-400 font-bold uppercase mb-2">Cargo Image</p>
                                                       <img src={job.cargoImage} alt="Cargo" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                                                   </div>
                                               )}
                                               <Button 
                                                   className="w-full py-4 text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 rounded-xl font-bold" 
                                                   onClick={(e) => { e.stopPropagation(); onAcceptJob(job.id); }}
                                               >
                                                   Accept Job
                                               </Button>
                                           </div>
                                       </div>
                                       {!isExpanded && (
                                           <div className="px-6 pb-4 flex justify-center">
                                               <div className="text-xs text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full group-hover:bg-slate-100 transition-colors">
                                                   Tap to view details <ChevronDown size={14} />
                                               </div>
                                           </div>
                                       )}
                                   </div>
                                   );
                               })}
                           </div>
                       ) : (
                           <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                   <Filter size={32} />
                               </div>
                               <h3 className="font-bold text-slate-900 text-lg mb-1">No Jobs Found</h3>
                               <p className="text-slate-500 font-medium">Try changing your filters.</p>
                               <button onClick={() => setJobFilter('All')} className="mt-4 text-brand-primary font-bold hover:underline">Reset Filters</button>
                           </div>
                       )}
                   </div>
               </div>
               
               {/* Sidebar Stats */}
               <div className="space-y-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold border border-slate-200 text-xl">
                               {user.name.charAt(0)}
                           </div>
                           <div>
                               <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                               <div className="flex items-center gap-1.5 mt-1">
                                   <Star size={14} className="text-yellow-500" fill="currentColor"/>
                                   <span className="text-sm font-bold text-slate-700">4.8</span>
                                   <span className="text-xs text-slate-400">• Gold Partner</span>
                               </div>
                           </div>
                       </div>
                       <div className="space-y-4">
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                               <span className="text-slate-500 font-medium text-sm">Acceptance Rate</span>
                               <span className="font-bold text-slate-900">92%</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                               <span className="text-slate-500 font-medium text-sm">Completion Rate</span>
                               <span className="font-bold text-slate-900">98%</span>
                           </div>
                       </div>
                    </div>
               </div>
           </div>
        </div>
    );
};
