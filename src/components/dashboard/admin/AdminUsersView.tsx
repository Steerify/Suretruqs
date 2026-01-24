import React, { useState } from 'react';
import { User, UserRole, Driver } from '../../../types';
import { Card } from '../../ui/Card';
import { Search, Filter, MoreHorizontal, Shield, Truck, User as UserIcon, Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '../../ui/Button'; // Assuming you have a Button component
import toast from 'react-hot-toast';
import api from '../../../utils/api';

interface AdminUsersViewProps {
    users: User[];
    drivers: Driver[];
    onDeleteUser: (userId: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ users, drivers, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'DRIVER' | 'ADMIN'>('ALL');

    // Combine users and drivers lists carefully if they are separate, 
    // but typically 'users' contains all users including basic driver info.
    // However, keeping consistent with props.
    
    // Merge or select list based on how StoreContext provides them. 
    // StoreContext provides 'customers' (User[]) and 'drivers' (Driver[]).
    // Let's combine them for display if 'users' prop isn't the master list.
    // Actually AdminDashboard passes `customers` and `drivers`.
    // Let's standardize on a single list for the table or handle them.
    
    const allUsers = [...users, ...drivers].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id || (t as any)._id === (v as any)._id))===i);

    const filteredUsers = allUsers.filter(user => {
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
                    <Card key={user.id || (user as any)._id} className="p-6 border border-slate-100 hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                    user.role === 'DRIVER' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-secondary'
                                }`}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        user.name?.charAt(0)
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{user.name}</h3>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                        user.role === 'DRIVER' 
                                        ? 'bg-orange-50 text-brand-orange border-orange-100' 
                                        : 'bg-blue-50 text-brand-secondary border-blue-100'
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    <span>{(user as Driver).vehicleType || 'Vehicle N/A'} • {(user as Driver).plateNumber || 'No Plate'}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-slate-50">
                            <Button variant="secondary" className="flex-1 text-xs h-9" onClick={() => {}}>
                                View Profile
                            </Button>
                            <button 
                                onClick={() => handleDelete(user.id || (user as any)._id)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
