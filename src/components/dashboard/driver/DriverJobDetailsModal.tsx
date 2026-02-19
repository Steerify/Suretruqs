import React from 'react';
import { X, MapPin } from 'lucide-react';
import { Shipment } from '../../../types';

export const DriverJobDetailsModal = ({ job, onClose }: { job: Shipment, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-[scaleIn_0.25s_ease-out]">
                
                {/* Header */}
                <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Job Details</h2>
                        <p className="text-slate-500 text-sm font-medium mt-0.5">{job.trackingId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X size={24}/>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 bg-slate-50/50">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                job.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                                job.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-blue-50 text-brand-primary border-blue-200'
                            }`}>
                                {job.status.replace('_', ' ')}
                            </span>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Distance</p>
                                <p className="text-lg font-black text-slate-900">{job.distance || 'Calculated'}</p>
                            </div>
                        </div>

                        <div className="space-y-8 relative pl-2">
                            <div className="absolute left-[27px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
                            
                            <div className="flex gap-4 relative">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-sm text-slate-400">
                                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Pickup Location</p>
                                    <h4 className="font-bold text-slate-900 text-base leading-snug">{job.pickup.address}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(job.date).toLocaleDateString()} • {new Date(job.date).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative">
                                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center shrink-0 z-10 shadow-lg shadow-blue-500/20">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-primary font-bold uppercase tracking-wide mb-1">Dropoff Location</p>
                                    <h4 className="font-bold text-slate-900 text-base leading-snug">{job.dropoff.address}</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Cargo Type</p>
                            <p className="font-bold text-slate-900">{job.cargoType || 'General Cargo'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Weight</p>
                            <p className="font-bold text-slate-900">{job.weight || 'N/A'}</p>
                        </div>
                    </div>
                    
                    {job.cargoImage && (
                        <div className="mt-4">
                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">Proof of Delivery</p>
                            <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-200">
                                <img src={job.cargoImage} alt="POD" className="w-full h-full object-cover"/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
