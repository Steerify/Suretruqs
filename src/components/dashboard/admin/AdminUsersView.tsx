import React, { useState } from 'react';
import { User, UserRole, Driver } from '../../../types';
import { Card } from '../../ui/Card';
import { Search, Filter, MoreHorizontal, Shield, Truck, User as UserIcon, Trash2, Mail, Phone, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const getInitials = (name: string) => {
    const parts = (name || 'User').split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
};

interface AdminUsersViewProps {
    users: User[];
    drivers: Driver[];
    onDeleteUser: (userId: string) => void;
}

const AdminUserModal = ({ user, onClose }: { user: any, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center font-black text-2xl overflow-hidden ${user.role === 'DRIVER' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'}`}>
                             {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                             ) : (
                                getInitials(user.name)
                             )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-black text-slate-900 truncate" title={user.name}>{user.name}</h3>
                            <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
                                user.role === 'DRIVER' 
                                ? 'bg-orange-50 text-brand-orange border-orange-100' 
                                : 'bg-blue-50 text-brand-primary border-blue-100'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Information</p>
                        <div className="space-y-3">
                             <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <Mail size={16} className="text-slate-400"/> {user.email}
                             </div>
                             <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                <Phone size={16} className="text-slate-400"/> {user.phone || 'No phone provided'}
                             </div>
                        </div>
                    </div>

                    {user.role === 'DRIVER' && (
                        <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                            <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-3">Vehicle Details</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Type</p>
                                    <p className="font-bold text-slate-900">{user.vehicleType || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Plate Number</p>
                                    <p className="font-bold text-slate-900">{user.plateNumber || 'Pending'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                             <p className="text-2xl font-black text-slate-900">{user.role}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                             <div className="flex items-center justify-center gap-2 mb-1">
                                <span className="text-2xl font-black text-slate-900">{user.onboarded ? 'Yes' : 'No'}</span>
                                {user.onboarded && <CheckCircle2 size={16} className="text-brand-primary" />}
                             </div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
                         </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Button className="w-full bg-brand-primary hover:bg-blue-700 text-white border-none py-4 rounded-xl font-black" size="lg" onClick={onClose}>Close Profile</Button>
                </div>
            </div>
        </div>
    );
};

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ users, drivers, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'DRIVER' | 'ADMIN'>('ALL');
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const enrichedUsers = (users || []).map(u => {
        if (u.role === 'DRIVER') {
            const driverInfo = (drivers || []).find(d => d.id === u.id || (d as any)._id === (u as any)._id);
            return driverInfo ? { ...u, ...driverInfo } : u;
        }
        return u;
    });

    const filteredUsers = enrichedUsers.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                onDeleteUser(id);
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Directory</h2>
                    <p className="text-slate-500 font-medium">Manage customer and driver accounts</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none text-sm font-medium w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-100 p-1.5 rounded-xl flex overflow-x-auto no-scrollbar">
                        {['ALL', 'CUSTOMER', 'DRIVER'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role as any)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                    roleFilter === role 
                                    ? 'bg-white text-brand-dark shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                            <th className="px-8 py-5">User</th>
                            <th className="px-8 py-5">Role</th>
                            <th className="px-8 py-5">Contact</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id || (user as any)._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedUser(user)}>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm overflow-hidden ${
                                            user.role === 'DRIVER' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'
                                        }`}>
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                getInitials(user.name)
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Joined {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                        user.role === 'DRIVER' 
                                        ? 'bg-orange-50 text-brand-orange border-orange-100' 
                                        : 'bg-blue-50 text-brand-primary border-blue-100'
                                    }`}>
                                        {user.role === 'DRIVER' ? <Truck size={10} /> : <UserIcon size={10} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                            <Mail size={12} className="text-slate-400" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                                            <Phone size={12} className="text-slate-400" /> {user.phone || 'N/A'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        user.onboarded ? 'text-brand-primary bg-blue-50' : 'text-slate-400 bg-slate-100'
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.onboarded ? 'bg-brand-primary' : 'bg-slate-400'}`} />
                                        {user.onboarded ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => {e.stopPropagation(); setSelectedUser(user)}} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={(e) => handleDelete(user.id || (user as any)._id, e)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Grid View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUsers.map(user => (
                    <div 
                        key={user.id || (user as any)._id}
                        onClick={() => setSelectedUser(user)}
                        className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm overflow-hidden ${
                                    user.role === 'DRIVER' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-primary'
                                }`}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                                    <span className={`inline-block mt-0.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                        user.role === 'DRIVER' 
                                        ? 'bg-orange-50 text-brand-orange border-orange-100' 
                                        : 'bg-blue-50 text-brand-primary border-blue-100'
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => handleDelete(user.id || (user as any)._id, e)}
                                className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        <div className="space-y-2 mb-4 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <Mail size={14} className="text-slate-400" /> {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <Phone size={14} className="text-slate-400" /> {user.phone || 'N/A'}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${user.onboarded ? 'text-brand-primary' : 'text-slate-400'}`}>
                                {user.onboarded ? '● Verified Account' : '● Unverified'}
                            </span>
                            <div className="px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-bold text-slate-600">
                                View
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedUser && (
                <AdminUserModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                />
            )}
        </div>
    );
};
