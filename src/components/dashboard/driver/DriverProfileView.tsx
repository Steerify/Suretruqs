import React from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Star, MapPin, Mail, Power, Info, ShieldCheck, FileText, Eye, AlertCircle, CheckCircle2, Camera } from 'lucide-react';
import { User, Shipment, ShipmentStatus } from '../../../types';

interface DriverProfileViewProps {
    user: User;
    isOnline: boolean;
    setIsOnline: (online: boolean) => void;
    jobHistory: Shipment[]; // used for stats
    setViewingDoc: (doc: { name: string; url?: string } | null) => void;
}

export const DriverProfileView = ({ user, isOnline, setIsOnline, jobHistory, setViewingDoc }: DriverProfileViewProps) => {
   // Get document URLs from user data - check multiple possible locations
   const userDocuments = (user as any)?.documents || 
                        (user as any)?.docs || 
                        (user as any)?.uploadedDocuments || 
                        {};
   
   return (
     <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-[1920px] mx-auto">
        <div className="fade-up w-full space-y-8 pb-20">
            {/* Header Profile Card - Light Modern layout */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                <div className="h-40 bg-gradient-to-r from-orange-50 to-amber-50 relative">
                   <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-slate-800 text-xs font-bold border border-slate-200 shadow-sm flex items-center">
                      <Star size={14} className="mr-1.5 text-yellow-500" fill="currentColor"/> Gold Partner
                   </div>
                </div>
                <div className="px-10 pb-10 flex flex-col md:flex-row items-start gap-8 -mt-16">
                   <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl flex items-center justify-center relative shrink-0">
                      <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-4xl border border-slate-200">
                        {user.name.charAt(0)}
                      </div>
                      <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2.5 rounded-xl border-4 border-white shadow-md hover:bg-slate-700 transition-colors">
                         <Camera size={16}/>
                      </button>
                   </div>
                   <div className="flex-1 pt-16 md:pt-20 w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                         <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">{user.name}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium">
                               <span className="flex items-center"><MapPin size={16} className="mr-1.5 text-slate-400"/> Lagos, Nigeria</span>
                               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                               <span className="flex items-center"><Mail size={16} className="mr-1.5 text-slate-400"/> {user.email}</span>
                            </div>
                         </div>
                         <div className="flex gap-3">
                             {/* Ensure NO red button here */}
                             <Button variant="secondary" className="bg-white hover:bg-slate-50 border-slate-300 rounded-xl px-6">Edit Profile</Button>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Availability & Status Card */}
                <Card className="border border-slate-200 shadow-sm rounded-3xl p-8">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center mb-6"><Power size={20} className="mr-2 text-brand-primary"/> Availability Settings</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="font-bold text-slate-900">Online Status</p>
                            <p className="text-xs text-slate-500 mt-1">Receive new job requests</p>
                        </div>
                        <button 
                            onClick={() => setIsOnline(!isOnline)}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${isOnline ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <Info size={18} className="text-brand-primary mt-0.5"/>
                        <p className="text-sm text-slate-600">You are visible to customers in Lagos and can receive incoming requests instantly.</p>
                    </div>
                </Card>

                {/* Performance Card */}
                <Card className="border border-slate-200 shadow-sm rounded-3xl p-8">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center"><Star size={20} className="mr-2 text-yellow-500"/> Performance</h3>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">Excellent</span>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Completed Trips</p>
                         <p className="text-2xl font-bold text-slate-900">
                            {jobHistory.filter(j => j.status === ShipmentStatus.DELIVERED).length}
                         </p>
                     </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Total Trips</p>
                         <p className="text-2xl font-bold text-slate-900">{jobHistory.length}</p>
                      </div>
                   </div>
                </Card>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
               <div className="flex justify-between items-end mb-8">
                  <div>
                     <h3 className="font-bold text-slate-900 text-lg flex items-center"><ShieldCheck size={20} className="mr-2 text-green-600"/> Documents & Verification</h3>
                     <p className="text-sm text-slate-500 mt-1">Keep your documents up to date to maintain your account status.</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                      { name: "Driver's License", key: "Driver's License", expiry: "Exp: 12/2025" },
                      { name: "Vehicle Registration", key: "Vehicle Registration", expiry: "Exp: 06/2024" },
                      { name: "Insurance Certificate", key: "Insurance Certificate", expiry: "Exp: Next Month" },
                      { name: "Proof of Ownership", key: "Proof of Ownership", expiry: "Permanent" },
                   ].map((doc, i) => {
                      const hasDocument = !!userDocuments[doc.key];
                      const isExpiringSoon = doc.expiry.includes("Next Month");
                      
                      return (
                      <div 
                        key={i} 
                        onClick={() => setViewingDoc({ name: doc.name, url: userDocuments[doc.key] })}
                        className={`border rounded-2xl p-5 flex flex-col justify-between h-36 transition-all hover:shadow-md cursor-pointer group ${
                           isExpiringSoon && hasDocument 
                              ? 'bg-orange-50 border-orange-200' 
                              : hasDocument 
                                 ? 'bg-white border-slate-200 hover:border-slate-300' 
                                 : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                         <div className="flex justify-between items-start">
                            <div className={`p-2.5 rounded-xl ${
                               isExpiringSoon && hasDocument 
                                  ? 'bg-orange-100 text-orange-600' 
                                  : hasDocument 
                                     ? 'bg-slate-50 text-slate-500' 
                                     : 'bg-slate-100 text-slate-400'
                            }`}>
                               <FileText size={20} />
                            </div>
                            {hasDocument ? (
                               isExpiringSoon ? (
                                  <AlertCircle size={20} className="text-orange-500"/>
                               ) : (
                                  <CheckCircle2 size={20} className="text-green-500"/>
                               )
                            ) : (
                               <AlertCircle size={20} className="text-slate-300"/>
                            )}
                         </div>
                         <div>
                            <div className="flex justify-between items-end">
                                <p className="font-bold text-slate-900 text-sm mb-1">{doc.name}</p>
                                {hasDocument && <Eye size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"/>}
                            </div>
                            <p className={`text-xs font-bold ${
                               isExpiringSoon && hasDocument 
                                  ? 'text-orange-600' 
                                  : hasDocument 
                                     ? 'text-slate-400' 
                                     : 'text-slate-300'
                            }`}>
                               {hasDocument ? doc.expiry : 'Not Uploaded'}
                            </p>
                         </div>
                      </div>
                   )})}
               </div>
            </div>
        </div>
     </div>
   );
};
