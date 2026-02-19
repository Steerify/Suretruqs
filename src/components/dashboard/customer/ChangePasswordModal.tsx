import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useStore } from '../../../context/StoreContext';

export const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const { changePassword } = useStore();
    const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passData.new !== passData.confirm) {
            toast.error("New passwords do not match!");
            return;
        }
        if (passData.new.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        setLoading(true);
        try {
            await changePassword({
                currentPassword: passData.current,
                newPassword: passData.new
            });
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const toggleShow = (field: keyof typeof showPass) => {
        setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-[scaleIn_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 text-brand-primary rounded-lg"><Lock size={18}/></div>
                      Change Password
                  </h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Current Password</label>
                      <div className="relative">
                          <input 
                              type={showPass.current ? "text" : "password"}
                              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900"
                              value={passData.current}
                              onChange={e => setPassData({...passData, current: e.target.value})}
                              required
                          />
                          <button type="button" onClick={() => toggleShow('current')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                              {showPass.current ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                      </div>
                  </div>
                  
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">New Password</label>
                      <div className="relative">
                          <input 
                              type={showPass.new ? "text" : "password"}
                              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900"
                              value={passData.new}
                              onChange={e => setPassData({...passData, new: e.target.value})}
                              required
                          />
                          <button type="button" onClick={() => toggleShow('new')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                              {showPass.new ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                      </div>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                      <div className="relative">
                          <input 
                              type={showPass.confirm ? "text" : "password"}
                              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900"
                              value={passData.confirm}
                              onChange={e => setPassData({...passData, confirm: e.target.value})}
                              required
                          />
                          <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                              {showPass.confirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                      </div>
                  </div>

                  <div className="pt-2">
                      <Button type="submit" className="w-full font-bold shadow-lg shadow-blue-500/20" isLoading={loading}>
                          Update Password
                      </Button>
                  </div>
              </form>
          </div>
      </div>
    );
};
