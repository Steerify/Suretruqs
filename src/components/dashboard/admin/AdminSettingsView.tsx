import React, { useState } from 'react';
import { 
    User, Mail, Phone, Shield, Bell, Lock, Save, 
    Settings as SettingsIcon, Globe, CreditCard, Monitor,
    ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useStore } from '../../../context/StoreContext';
import toast from 'react-hot-toast';
import { ChangePasswordModal } from '../customer/ChangePasswordModal';

export const AdminSettingsView: React.FC = () => {
    const { currentUser, completeOnboarding, getSettings, updateSettings } = useStore();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState<'profile' | 'system' | 'notifications'>('profile');

    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
    });

    const [systemSettings, setSystemSettings] = useState({
        maintenanceMode: false,
        platformFee: 10,
        currency: 'NGN',
        language: 'English'
    });

    // Fetch live settings on mount
    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                setSystemSettings({
                    maintenanceMode: data.maintenanceMode,
                    platformFee: data.platformFee,
                    currency: data.currency,
                    language: data.language
                });
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await completeOnboarding({
                name: profileData.name,
                phone: profileData.phone,
            });
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSystemSave = async () => {
        setLoading(true);
        try {
            await updateSettings(systemSettings);
        } catch (err) {
            toast.error("Failed to update system settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 admin-tab-content pb-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <Card className="md:w-72 h-fit p-4 shrink-0 border-slate-100 shadow-sm">
                    <div className="space-y-1">
                        {[
                            { id: 'profile', label: 'Administrative Profile', icon: User },
                            { id: 'system', label: 'System Configuration', icon: SettingsIcon },
                            { id: 'notifications', label: 'Alert Preferences', icon: Bell },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as any)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                                    activeSection === item.id 
                                    ? 'bg-brand-primary text-white shadow-lg shadow-blue-500/20' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Content Area */}
                <div className="flex-1 space-y-8">
                    {activeSection === 'profile' && (
                        <Card className="p-8 border-slate-100 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                        {currentUser?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Admin Account</h3>
                                        <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-widest">Master Identity Management</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text" 
                                                value={profileData.name}
                                                onChange={e => setProfileData({...profileData, name: e.target.value})}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all text-sm font-bold text-slate-900" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="email" 
                                                value={profileData.email}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl cursor-not-allowed text-sm font-bold text-slate-500" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="tel" 
                                                value={profileData.phone}
                                                onChange={e => setProfileData({...profileData, phone: e.target.value})}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all text-sm font-bold text-slate-900" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text" 
                                                value="SUPER ADMIN" 
                                                disabled
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl cursor-not-allowed text-sm font-black text-brand-primary" 
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 pt-4 flex justify-between items-center">
                                        <Button 
                                            type="button"
                                            variant="ghost" 
                                            onClick={() => setShowPasswordModal(true)}
                                            className="text-brand-orange text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-50 rounded-xl px-4"
                                        >
                                            <Lock size={14} /> Change Security Key
                                        </Button>
                                        <Button 
                                            type="submit"
                                            isLoading={loading}
                                            className="h-14 px-8 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20"
                                        >
                                            <Save size={16} className="mr-2" /> Sync Profile
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    )}

                    {activeSection === 'system' && (
                        <Card className="p-8 border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">Control Plane</h3>
                                    <p className="text-sm text-slate-500 font-medium">Global platform variables and state</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${systemSettings.maintenanceMode ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    <div className={`w-2 h-2 rounded-full ${systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-green-600'} animate-pulse`} />
                                    {systemSettings.maintenanceMode ? 'Maintenance Mode Active' : 'System Optimized'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-white rounded-xl text-brand-primary shadow-sm"><Monitor size={20} /></div>
                                            <span className="text-sm font-black text-slate-900">Platform Status</span>
                                        </div>
                                        <button 
                                            onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${systemSettings.maintenanceMode ? 'bg-red-500' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${systemSettings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">Toggle to enable site-wide maintenance mode. This will restrict all non-admin access.</p>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-white rounded-xl text-brand-orange shadow-sm"><CreditCard size={20} /></div>
                                        <span className="text-sm font-black text-slate-900">Commission Rate</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="50" 
                                            value={systemSettings.platformFee}
                                            onChange={e => setSystemSettings({...systemSettings, platformFee: parseInt(e.target.value)})}
                                            className="flex-1 accent-brand-orange"
                                        />
                                        <span className="text-lg font-black text-slate-900 tabular-nums">{systemSettings.platformFee}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-2">Set the standard platform percentage for every successful delivery.</p>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-white rounded-xl text-blue-500 shadow-sm"><Globe size={20} /></div>
                                        <span className="text-sm font-black text-slate-900">Localization</span>
                                    </div>
                                    <select 
                                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none"
                                        value={systemSettings.language}
                                        onChange={e => setSystemSettings({...systemSettings, language: e.target.value})}
                                    >
                                        <option>English (Universal)</option>
                                        <option>French</option>
                                        <option>Yoruba</option>
                                        <option>Hausa</option>
                                        <option>Igbo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-end">
                                <Button 
                                    onClick={handleSystemSave}
                                    isLoading={loading}
                                    className="px-10 h-12 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all"
                                >
                                    DEPLOY CONFIGURATIONS
                                </Button>
                            </div>
                        </Card>
                    )}

                    {activeSection === 'notifications' && (
                        <Card className="p-8 border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8">Alert Frequency</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Critical System Failures', value: true, color: 'text-red-600' },
                                    { label: 'New Driver Registration Requests', value: true, color: 'text-brand-primary' },
                                    { label: 'High-Value Shipment Alerts', value: true, color: 'text-brand-orange' },
                                    { label: 'Daily Financial Summaries', value: false, color: 'text-slate-600' },
                                    { label: 'Customer Support Tickets', value: true, color: 'text-blue-500' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-2 rounded-full ${item.value ? 'bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-200'}`} />
                                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                        </div>
                                        <button className={`w-12 h-6 rounded-full transition-colors relative ${item.value ? 'bg-brand-primary' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-6 bg-blue-50 rounded-[2rem] border border-blue-100/50 flex items-start gap-4">
                                <AlertCircle className="text-brand-primary shrink-0" size={24} />
                                <div>
                                    <p className="text-sm font-black text-brand-primary uppercase tracking-widest mb-1">Administrative Note</p>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">Notification settings only apply to your active session. Global administrative broadcast settings can be modified in the Communication Hub.</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
        </div>
    );
};
