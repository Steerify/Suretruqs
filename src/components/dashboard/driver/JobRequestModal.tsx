import React from 'react';
import { Bell, XCircle, ImageIcon, Package, MapPin } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Shipment } from '../../../types';

export const JobRequestModal = ({ job, onAccept, onDecline }: { job: Shipment, onAccept: (id: string) => void, onDecline: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onDecline}></div>
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative z-10 overflow-hidden animate-[scaleIn_0.3s_ease-out]">
           {/* Header */}
           <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange rounded-full blur-3xl opacity-20 -translate-y-10 translate-x-10"></div>
               <div className="relative z-10 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md animate-pulse">
                           <Bell size={24} className="text-brand-orange" />
                       </div>
                       <div>
                           <h3 className="font-bold text-xl">New Job Request</h3>
                           <p className="text-slate-400 text-xs">Expires in 30s</p>
                       </div>
                   </div>
                   <button onClick={onDecline} className="text-slate-400 hover:text-white transition-colors"><XCircle size={24}/></button>
               </div>
           </div>

           <div className="p-6">
               {/* Goods Image Section */}
               {job.cargoImage ? (
                   <div className="w-full h-40 rounded-xl overflow-hidden mb-6 relative border border-slate-100 shadow-sm group">
                       <img src={job.cargoImage} alt="Cargo" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="text-white text-xs font-bold flex items-center gap-2"><ImageIcon size={14}/> Cargo Preview</span>
                       </div>
                   </div>
               ) : (
                  <div className="w-full h-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-6 text-slate-400">
                      <Package size={32} className="mb-2 opacity-50"/>
                      <span className="text-xs font-bold">No Image Provided</span>
                  </div>
               )}

               {/* Route Details */}
               <div className="space-y-6 relative mb-8">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                  <div className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center shrink-0 z-10">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Pickup</p>
                          <p className="font-bold text-slate-900 leading-tight">{job.pickup.address}</p>
                      </div>
                  </div>
                  <div className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-brand-light border-2 border-brand-secondary flex items-center justify-center shrink-0 z-10">
                          <MapPin size={16} className="text-brand-secondary"/>
                      </div>
                      <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Dropoff</p>
                          <p className="font-bold text-slate-900 leading-tight">{job.dropoff.address}</p>
                      </div>
                  </div>
               </div>

           <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-6 border border-slate-100">
               <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Assignment</p>
                   <p className="text-lg font-black text-slate-900">{job.trackingId}</p>
               </div>
               <div className="text-right">
                   <p className="text-xs text-slate-500 font-bold uppercase">Distance</p>
                   <p className="text-lg font-bold text-slate-900">{job.distance || 'Calculated'}</p>
               </div>
           </div>

               <div className="grid grid-cols-2 gap-4">
                   <Button variant="ghost" className="bg-red-50 text-red-600 hover:bg-red-100 font-bold py-4 h-auto rounded-xl border border-red-100" onClick={onDecline}>
                       Decline
                   </Button>
                   <Button variant="cta" className="font-bold py-4 h-auto rounded-xl shadow-lg shadow-orange-500/20" onClick={() => onAccept(job.id)}>
                       Accept Job
                   </Button>
               </div>
           </div>
        </div>
    </div>
);
