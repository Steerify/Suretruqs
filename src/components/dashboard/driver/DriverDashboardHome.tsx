import React from 'react';
import { Package, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Shipment, User, ShipmentStatus } from '../../../types';
import { Button } from '../../ui/Button';

interface DriverDashboardHomeProps {
    user: User;
    availableJobs: Shipment[];
    shipments: Shipment[];
    onAcceptJob: (id: string) => void;
    setView: (view: any) => void;
}

export const DriverDashboardHome = ({ user, availableJobs, shipments, onAcceptJob }: DriverDashboardHomeProps) => {
    const completed = shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length;
    const pendingAssignments = availableJobs;

    return (
        <div className="p-4 md:p-8 pb-32 fade-up w-full max-w-[1920px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Driver Console</h1>
                    <p className="text-slate-500 font-medium">Welcome back, {user.name.split(' ')[0]}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Package size={16} className="text-brand-primary" />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Assignments</p>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900">{pendingAssignments.length}</h3>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed</p>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900">{completed}</h3>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={16} className="text-slate-500" />
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Status</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700">Waiting for admin assignments</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-slate-900">Assignments Awaiting Response</h3>
                </div>

                {pendingAssignments.length > 0 ? (
                    <div className="space-y-4">
                        {pendingAssignments.map(job => (
                            <div key={job.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                            <MapPin size={14} /> Pickup
                                        </div>
                                        <p className="font-bold text-slate-900">{job.pickup.address}</p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                            <MapPin size={14} /> Dropoff
                                        </div>
                                        <p className="font-bold text-slate-900">{job.dropoff.address}</p>
                                        <p className="text-xs text-slate-500 font-medium">Tracking: {job.trackingId}</p>
                                    </div>
                                    <Button className="h-10 px-5 font-bold" onClick={() => onAcceptJob(job.id)}>
                                        Accept
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400">
                        No pending assignments. You will be notified when an admin assigns a shipment.
                    </div>
                )}
            </div>
        </div>
    );
};
