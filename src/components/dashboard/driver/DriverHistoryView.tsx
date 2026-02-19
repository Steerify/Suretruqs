import React from 'react';
import { Star, CheckCircle, XCircle, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Shipment } from '../../../types';

interface DriverHistoryViewProps {
    jobHistory: Shipment[];
    setSelectedHistoryItem: (job: Shipment) => void;
}

export const DriverHistoryView = ({ jobHistory, setSelectedHistoryItem }: DriverHistoryViewProps) => (
     <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-[1920px] mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Job History</h2>
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-2">Total Jobs</p>
              <p className="text-3xl font-bold text-slate-900">{jobHistory.length}</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-2">Completed</p>
              <p className="text-3xl font-bold text-slate-900">{jobHistory.length}</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-2">Hours Online</p>
              <p className="text-3xl font-bold text-slate-900">28.5</p>
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-2">Rating</p>
              <p className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-1">4.8 <Star size={18} className="text-yellow-400" fill="currentColor"/></p>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide ml-1 mb-4">Recent Jobs</h3>
            {jobHistory.map(job => (
               <div key={job.id} className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center group border border-slate-200 shadow-sm hover:shadow-md transition-all gap-4 md:gap-6">
                  <div className="flex items-start space-x-4 md:space-x-5 w-full md:w-auto">
                     <div className={`p-2.5 md:p-3 rounded-2xl shrink-0 ${job.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {job.status === 'DELIVERED' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                           <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{job.trackingId}</span>
                           <span className="hidden sm:inline text-xs text-slate-400">•</span>
                           <span className="text-xs text-slate-500 font-medium">{new Date(job.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-900 truncate">
                           <span className="truncate">{job.pickup.address.split(',')[0]}</span>
                           <span className="text-slate-300 shrink-0"><ArrowRight size={16}/></span>
                           <span className="truncate">{job.dropoff.address.split(',')[0]}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                     <div className="md:text-right">
                         <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase mb-0.5 md:mb-1">Status</p>
                         <p className="font-bold text-slate-900 text-base md:text-lg">{job.status}</p>
                     </div>
                     <Button onClick={() => setSelectedHistoryItem(job)} variant="secondary" size="sm" className="rounded-xl px-4 h-9">Details</Button>
                  </div>
               </div>
            ))}
           {jobHistory.length === 0 && (
               <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                       <Clock size={32} />
                   </div>
                   <p className="text-slate-500 font-medium">No job history found.</p>
               </div>
           )}
        </div>
     </div>
);
