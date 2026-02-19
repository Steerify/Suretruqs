import React from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Shipment, ShipmentStatus } from '../../../types';

interface HistoryViewProps {
    shipments: Shipment[];
    setSelectedHistoryItem: (shipment: Shipment) => void;
}

const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
        case ShipmentStatus.PENDING_REVIEW: return 'Pending Review';
        case ShipmentStatus.ASSIGNED: return 'Driver Assigned';
        case ShipmentStatus.PICKED_UP: return 'Cargo Picked Up';
        case ShipmentStatus.IN_TRANSIT: return 'In Transit';
        case ShipmentStatus.DELIVERED: return 'Delivered';
        case ShipmentStatus.CANCELLED: return 'Cancelled';
        default: return (status as string).replace('_', ' ');
    }
};

export const HistoryView = ({ shipments, setSelectedHistoryItem }: HistoryViewProps) => {
    const [activeTab, setActiveTab] = React.useState<'All' | 'Active' | 'Completed'>('All');

    const filteredShipments = shipments.filter(s => {
        if (activeTab === 'Active') {
            return [ShipmentStatus.PENDING_REVIEW, ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status);
        }
        if (activeTab === 'Completed') {
            return s.status === ShipmentStatus.DELIVERED;
        }
        return true;
    });

    return (
      <div className="fade-in space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Shipment History</h2>
                  <p className="text-sm md:text-base text-slate-500 font-medium">Track and manage your past orders.</p>
              </div>
               <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                   {['All', 'Active', 'Completed'].map((tab: any) => (
                       <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 sm:flex-none px-4 md:px-6 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${
                                activeTab === tab 
                                ? 'bg-white text-brand-primary shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab}
                        </button>
                   ))}
               </div>
          </div>
          <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden bg-transparent border-0 md:bg-white md:border md:rounded-2xl">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking ID</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Route Details</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Priority</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {filteredShipments.map(s => (
                              <tr key={s.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors group" onClick={() => setSelectedHistoryItem(s)}>
                                  <td className="px-6 py-4">
                                      <span className="font-bold text-slate-900 text-sm font-mono bg-slate-100 px-2 py-1 rounded">{s.trackingId}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                              <div className="w-2 h-2 rounded-full bg-blue-500"></div> {s.pickup.address.split(',')[0]}
                                          </div>
                                          <div className="w-0.5 h-3 bg-slate-200 ml-1"></div>
                                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                                              <div className="w-2 h-2 rounded-full bg-orange-500"></div> {s.dropoff.address.split(',')[0]}
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{new Date(s.date).toLocaleDateString()}</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                          s.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                          s.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                          'bg-blue-50 text-brand-primary border-blue-200'
                                      }`}>{getStatusLabel(s.status)}</span>
                                  </td>
                                  <td className="px-6 py-4 font-bold text-slate-900 text-sm text-right uppercase tracking-wider">{s.instructions?.priority || 'NORMAL'}</td>
                                  <td className="px-6 py-4 text-center">
                                      <button className="p-2 rounded-full text-slate-400 hover:bg-white hover:text-brand-primary hover:shadow-md transition-all">
                                          <ArrowRight size={18}/>
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                  {filteredShipments.map(s => (
                      <div key={s.id} onClick={() => setSelectedHistoryItem(s)} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all">
                          <div className="flex justify-between items-start mb-4">
                              <span className="font-bold text-slate-900 text-xs font-mono bg-slate-100 px-2 py-1 rounded">{s.trackingId}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                                  s.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                  s.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-blue-50 text-brand-primary border-blue-200'
                              }`}>{getStatusLabel(s.status)}</span>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                  <span className="text-sm font-bold text-slate-800 truncate">{s.pickup.address.split(',')[0]}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-300 ml-1 border-l-2 border-slate-100 pl-4 py-1">
                                  <ArrowRight size={14} className="rotate-90"/>
                              </div>
                              <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></div>
                                  <span className="text-sm font-bold text-slate-800 truncate">{s.dropoff.address.split(',')[0]}</span>
                              </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                              <div className="text-[10px] text-slate-400 font-medium">
                                  {new Date(s.date).toLocaleDateString()}
                              </div>
                              <div className="font-black text-slate-900 text-xs uppercase tracking-wider">
                                  {s.instructions?.priority || 'NORMAL'}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              {filteredShipments.length === 0 && (
                  <div className="py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                      <Package size={48} className="mx-auto mb-3 opacity-20"/>
                      <p className="font-medium text-slate-500">No shipments found for this filter.</p>
                  </div>
              )}
          </Card>
      </div>
    );
};
