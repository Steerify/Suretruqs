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
        case ShipmentStatus.PENDING: return 'Pending Request';
        case ShipmentStatus.ASSIGNED: return 'Driver Assigned';
        case ShipmentStatus.PICKED_UP: return 'Cargo Picked Up';
        case ShipmentStatus.IN_TRANSIT: return 'In Transit';
        case ShipmentStatus.DELIVERED: return 'Delivered';
        case ShipmentStatus.CANCELLED: return 'Cancelled';
        default: return (status as string).replace('_', ' ');
    }
};

export const HistoryView = ({ shipments, setSelectedHistoryItem }: HistoryViewProps) => (
      <div className="fade-in space-y-6">
          <div className="flex justify-between items-center">
              <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shipment History</h2>
                  <p className="text-slate-500 font-medium">Track and manage your past orders.</p>
              </div>
               <div className="flex bg-slate-100 p-1 rounded-lg">
                   {['All', 'Active', 'Completed'].map(tab => (
                       <button key={tab} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm rounded-md transition-all">{tab}</button>
                   ))}
               </div>
          </div>
          <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking ID</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Route Details</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {shipments.map(s => (
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
                                  <td className="px-6 py-4 font-bold text-slate-900 text-sm text-right">₦{s.price.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-center">
                                      <button className="p-2 rounded-full text-slate-400 hover:bg-white hover:text-brand-primary hover:shadow-md transition-all">
                                          <ArrowRight size={18}/>
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {shipments.length === 0 && (
                      <div className="py-12 text-center text-slate-400">
                          <Package size={48} className="mx-auto mb-3 opacity-20"/>
                          <p>No shipment history found.</p>
                      </div>
                  )}
              </div>
          </Card>
      </div>
  );
