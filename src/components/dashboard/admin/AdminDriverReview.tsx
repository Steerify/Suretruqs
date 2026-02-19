import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { 
    ShieldCheck, UserCheck, UserX, FileText, Eye, 
    Download, Clock, CheckCircle2, AlertCircle, 
    Filter, Search, ArrowRight, User
} from 'lucide-react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

interface DriverReview {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    vehicleType: string;
    plateNumber: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    verificationDocs: Record<string, string>;
    createdAt: string;
}

export const AdminDriverReview: React.FC = () => {
    const [drivers, setDrivers] = useState<DriverReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState<DriverReview | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('PENDING');

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await api.get(`/admin/drivers/status/${filterStatus}`);
                setDrivers(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch drivers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, [filterStatus]);

    const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.post(`/admin/drivers/${id}/review`, { status });
            toast.success(`Driver registration ${status.toLowerCase()}`);
            setDrivers(prev => prev.filter(d => d._id !== id));
            setSelectedDriver(null);
        } catch (err) {
            toast.error("Failed to update driver status");
        }
    };

    const filteredDrivers = drivers.filter(d => 
        d.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Driver Verification Hub</h2>
                    <p className="text-slate-500 font-medium">Onboard and validate professional truck operators</p>
                </div>
                
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
                    {['PENDING', 'APPROVED', 'REJECTED'].map(status => (
                        <button 
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filterStatus === status 
                                    ? 'bg-slate-900 text-white shadow-lg' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* List Sidebar */}
                <Card className="lg:col-span-1 p-4 border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-250px)]">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search pending..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-center py-8 text-xs font-bold text-slate-400">Loading Fleet...</p>
                        ) : filteredDrivers.length === 0 ? (
                            <p className="text-center py-8 text-xs font-bold text-slate-400">No applications found</p>
                        ) : filteredDrivers.map(driver => (
                            <button 
                                key={driver._id}
                                onClick={() => setSelectedDriver(driver)}
                                className={`w-full p-4 rounded-2xl text-left transition-all border ${
                                    selectedDriver?._id === driver._id 
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-blue-500/20' 
                                        : 'bg-white border-slate-50 hover:border-slate-200 text-slate-700'
                                }`}
                            >
                                <p className="text-sm font-black truncate">{driver.userId.name}</p>
                                <p className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${selectedDriver?._id === driver._id ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {driver.vehicleType} • {driver.plateNumber}
                                </p>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Main Review Area */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedDriver ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                             <Card className="p-8 border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                    <ShieldCheck size={160} />
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-400">
                                            {selectedDriver.userId.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedDriver.userId.name}</h3>
                                            <p className="text-slate-500 font-medium">{selectedDriver.userId.email}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2.5 py-1 bg-blue-50 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                    {selectedDriver.vehicleType}
                                                </span>
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                                    PN: {selectedDriver.plateNumber}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {selectedDriver.verificationStatus === 'PENDING' && (
                                        <div className="flex gap-3">
                                            <Button 
                                                variant="ghost" 
                                                className="bg-red-50 text-red-600 h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-100"
                                                onClick={() => handleReview(selectedDriver._id, 'REJECTED')}
                                            >
                                                <UserX size={18} className="mr-2" /> Reject
                                            </Button>
                                            <Button 
                                                className="bg-brand-primary text-white h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20"
                                                onClick={() => handleReview(selectedDriver._id, 'APPROVED')}
                                            >
                                                <UserCheck size={18} className="mr-2" /> Approve Driver
                                            </Button>
                                        </div>
                                    )}
                                </div>
                             </Card>

                             <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                 <FileText size={16} className="text-brand-primary" /> Submitted Credentials
                             </h4>

                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                 {[
                                     { label: "Driver's License", key: 'license' },
                                     { label: "Vehicle Registration", key: 'registration' },
                                     { label: "Insurance Certificate", key: 'insurance' },
                                     { label: "NIN Confirmation", key: 'nin' }
                                 ].map(doc => {
                                     const hasDoc = selectedDriver.verificationDocs?.[doc.key];
                                     return (
                                         <Card key={doc.key} className="p-6 border-slate-100 hover:shadow-lg transition-all group overflow-hidden bg-slate-50/50">
                                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{doc.label}</p>
                                             {hasDoc ? (
                                                 <div className="space-y-4">
                                                     <div className="aspect-video bg-white rounded-2xl border border-slate-200 flex items-center justify-center relative group-hover:border-brand-primary transition-colors overflow-hidden">
                                                        <img 
                                                            src={hasDoc} 
                                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                                            alt={doc.label}
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                            <button className="p-2 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform"><Eye size={18}/></button>
                                                            <button className="p-2 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform"><Download size={18}/></button>
                                                        </div>
                                                     </div>
                                                     <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                                                         <CheckCircle2 size={12} /> FILE LOADED
                                                     </div>
                                                 </div>
                                             ) : (
                                                 <div className="h-28 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-300">
                                                     <AlertCircle size={24} />
                                                     <p className="text-[10px] font-black uppercase">Missing Doc</p>
                                                 </div>
                                             )}
                                         </Card>
                                     );
                                 })}
                             </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 mb-6 text-slate-200">
                                <User size={48} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Select an Applicant</h3>
                            <p className="text-sm text-slate-400 max-w-xs mt-2 font-medium">Select a driver from the left sidebar to begin the identity verification process.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
