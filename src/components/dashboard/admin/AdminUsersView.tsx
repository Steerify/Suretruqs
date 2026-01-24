import React, { useState } from 'react';
import { User, UserRole, Driver } from '../../../types';
import { Card } from '../../ui/Card';
import { Search, Filter, MoreHorizontal, Shield, Truck, User as UserIcon, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '../../ui/Button'; // Assuming you have a Button component
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const getInitials = (name: string) => {
    return (name || 'User')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
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
                        <div className={`w-16 h-16 shrink-0 rounded-3xl flex items-center justify-center font-black text-2xl overflow-hidden ${user.role === 'DRIVER' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-secondary'}`}>
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
                                : 'bg-blue-50 text-brand-secondary border-blue-100'
                            }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 shrink-0">
                        <MoreHorizontal size={20}/>
                    </button>
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
                             <p className="text-2xl font-black text-slate-900">{user.walletBalance?.toLocaleString() || 0}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                             <p className="text-2xl font-black text-slate-900">{user.onboarded ? 'Yes' : 'No'}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified</p>
                         </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Button className="w-full" size="lg" onClick={onClose}>Close Profile</Button>
                </div>
            </div>
        </div>
    );
};

const UserCard: React.FC<{ user: any, onDelete: (id: string) => void, onView: (user: any) => void }> = ({ user, onDelete, onView }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <Card className="p-6 border border-slate-100 hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-sm tracking-wider overflow-hidden ${
                        user.role === 'DRIVER' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-secondary'
                    }`}>
                        {user.avatar && !imgError ? (
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-full h-full object-cover" 
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            getInitials(user.name)
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 truncate" title={user.name}>{user.name}</h3>
                        <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            user.role === 'DRIVER' 
                            ? 'bg-orange-50 text-brand-orange border-orange-100' 
                            : 'bg-blue-50 text-brand-secondary border-blue-100'
                        }`}>
                            {user.role}
                        </span>
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <span>{user.phone || 'N/A'}</span>
                </div>
                {user.role === 'DRIVER' && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Truck size={14} className="text-slate-400" />
                        <span>{(user as any).vehicleType || 'Vehicle N/A'} • {(user as any).plateNumber || 'No Plate'}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-50">
                <Button variant="secondary" className="flex-1 text-xs h-9" onClick={() => onView(user)}>
                    View Profile
                </Button>
                <button 
                    onClick={() => onDelete(user.id || (user as any)._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </Card>
    );
};

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ users, drivers, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'DRIVER' | 'ADMIN'>('ALL');
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // The 'users' prop now comes from 'allUsers' in store.
    const enrichedUsers = users.map(u => {
        if (u.role === 'DRIVER') {
            const driverInfo = drivers.find(d => d.id === u.id || (d as any)._id === (u as any)._id);
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

    const handleDelete = async (id: string) => {
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
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-secondary outline-none text-sm font-medium w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-slate-100 p-1 rounded-xl flex">
                        {['ALL', 'CUSTOMER', 'DRIVER'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role as any)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <UserCard 
                        key={user.id || (user as any)._id} 
                        user={user} 
                        onDelete={handleDelete}
                        onView={(u) => setSelectedUser(u)}
                    />
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
