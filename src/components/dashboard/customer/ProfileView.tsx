import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Building, Mail, Package, Bell, Shield, ChevronRight, Save } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { User } from '../../../types';
import { ChangePasswordModal } from './ChangePasswordModal';
import { useStore } from '../../../context/StoreContext';

interface ProfileViewProps {
    user: any;
    setShowPasswordModal: (show: boolean) => void;
}

export const ProfileView = ({ user, setShowPasswordModal }: ProfileViewProps) => {
    const { completeOnboarding } = useStore();
    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
      companyName: user.company || '',
      regNumber: user.registrationNumber || '',
      address: user.address || ''
    });

    const [loading, setLoading] = useState(false);

    const handleProfileSave = async () => {
        setLoading(true);
        try {
            await completeOnboarding({
                company: profileData.companyName,
                registrationNumber: profileData.regNumber,
                address: profileData.address
            });
            setIsEditingProfile(false);
            toast.success("Profile details saved successfully!");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="fade-in w-full space-y-8">
               {/* Header Profile Banner - Replaced Dark with Light */}
               <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm">
                  <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50"></div>
                  <div className="relative z-10 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
                     <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-bold text-slate-400 border border-slate-200 overflow-hidden">
                           {user.avatar ? (
                             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                           ) : (
                             user.name.split(' ').map((n: string)=>n[0]).join('').substring(0,2)
                           )}
                        </div>
                     </div>
                     <div className="text-center md:text-left flex-1 mb-2">
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{user.name}</h2>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-slate-500 text-sm">
                           <span className="flex items-center"><Building size={14} className="mr-1.5"/> {user.company || 'Private Customer'}</span>
                           <span className="hidden md:inline">•</span>
                           <span className="flex items-center"><Mail size={14} className="mr-1.5"/> {user.email}</span>
                           <span className="hidden md:inline">•</span>
                           <span className={`px-2 py-0.5 rounded text-xs font-bold border ${user.onboarded ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                {user.onboarded ? 'Verified Business' : 'Pending Setup'}
                            </span>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="secondary" className="bg-white border-slate-300 text-slate-600 hover:bg-slate-50">Edit Profile</Button>
                     </div>
                  </div>
               </div>
          
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Navigation/Stats */}
                  <div className="space-y-6">
                     <Card noPadding className="overflow-hidden border border-slate-200 shadow-sm">
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                           <h3 className="font-bold text-slate-900">Account Overview</h3>
                        </div>
                        <div className="p-5 space-y-4">
                           <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-blue-50 rounded-lg text-brand-primary"><Package size={16}/></div>
                                 <span className="text-sm font-medium text-slate-600">Total Shipments</span>
                              </div>
                              <span className="font-bold text-slate-900 tabular-nums">{user.stats?.bookingsCount || 0}</span>
                           </div>
                           <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-orange-50 rounded-lg text-brand-orange"><Package size={16}/></div>
                                 <span className="text-sm font-medium text-slate-600">Bookings</span>
                              </div>
                              <span className="font-bold text-slate-900 tabular-nums">{user.stats?.bookingsCount || 0}</span>
                           </div>
                        </div>
                     </Card>
                     
                     <Card className="border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Bell size={18} className="mr-2 text-slate-400"/> Notifications</h3>
                        <div className="space-y-4">
                           {['Order Updates', 'Promotional Emails', 'Driver Messages'].map((item, i) => (
                              <div key={i} className="flex items-center justify-between">
                                 <span className="text-sm text-slate-600 font-medium">{item}</span>
                                 <div className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${i === 0 ? 'bg-brand-secondary' : 'bg-slate-200'}`}>
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${i === 0 ? 'left-5' : 'left-1'}`}></div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </Card>
 
                     <Card className="border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Shield size={18} className="mr-2 text-slate-400"/> Security</h3>
                         <Button 
                             variant="secondary" 
                             className="w-full text-left justify-between group mb-2 border-slate-200 hover:border-brand-secondary hover:text-brand-secondary"
                             onClick={() => setShowPasswordModal(true)}
                         >
                            <span>Change Password</span>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform"/>
                         </Button>
                         <Button variant="secondary" className="w-full text-left justify-between group border-slate-200">
                            <span>Two-Factor Auth</span>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">Enabled</span>
                         </Button>
                     </Card>
                  </div>
          
                  {/* Right Column - Forms */}
                  <div className="lg:col-span-2 space-y-6">
                     <Card className="border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center"><Building size={20} className="mr-2 text-brand-secondary"/> Company Details</h3>
                            {isEditingProfile ? (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditingProfile(false)} disabled={loading} className="text-sm text-slate-500 font-bold hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Cancel</button>
                                    <button onClick={handleProfileSave} disabled={loading} className="text-sm bg-brand-secondary text-white font-bold px-4 py-1.5 rounded-lg hover:bg-blue-600 shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50">
                                        {loading ? 'Saving...' : <><Save size={14}/> Save Changes</>}
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setIsEditingProfile(true)} className="text-sm text-brand-secondary font-bold hover:underline">Edit Details</button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Company Name</label>
                               <input 
                                 type="text" 
                                 className={`w-full px-4 py-3 border rounded-xl text-sm font-medium text-slate-900 transition-all ${isEditingProfile ? 'bg-white border-slate-200 focus:ring-2 focus:ring-brand-secondary' : 'bg-slate-50 border-transparent cursor-not-allowed text-slate-600'}`} 
                                 value={profileData.companyName}
                                 onChange={(e) => setProfileData({...profileData, companyName: e.target.value})}
                                 disabled={!isEditingProfile} 
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Registration Number</label>
                               <input 
                                 type="text" 
                                 className={`w-full px-4 py-3 border rounded-xl text-sm font-medium text-slate-900 transition-all ${isEditingProfile ? 'bg-white border-slate-200 focus:ring-2 focus:ring-brand-secondary' : 'bg-slate-50 border-transparent cursor-not-allowed text-slate-600'}`} 
                                 value={profileData.regNumber}
                                 onChange={(e) => setProfileData({...profileData, regNumber: e.target.value})}
                                 disabled={!isEditingProfile} 
                               />
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Office Address</label>
                               <input 
                                 type="text" 
                                 className={`w-full px-4 py-3 border rounded-xl text-sm font-medium text-slate-900 transition-all ${isEditingProfile ? 'bg-white border-slate-200 focus:ring-2 focus:ring-brand-secondary' : 'bg-slate-50 border-transparent cursor-not-allowed text-slate-600'}`} 
                                 value={profileData.address}
                                 onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                 disabled={!isEditingProfile} 
                               />
                            </div>
                        </div>
                     </Card>
 
                     <Card className="border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Package size={20} className="mr-2 text-blue-500"/> Shipment Tips</h3>
                         <div className="space-y-3 text-sm text-slate-600 font-medium">
                            <p>Need special handling? Add notes, fragile tags, and priority in your shipment instructions.</p>
                            <p>Assigned drivers are managed by our admin team for reliability and speed.</p>
                         </div>
                     </Card>
                  </div>
               </div>
            </div>
    );
};
