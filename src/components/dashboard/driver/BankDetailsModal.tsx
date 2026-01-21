import React, { useState } from 'react';
import { Building, X, Info } from 'lucide-react';
import { Button } from '../../ui/Button';

export const BankDetailsModal = ({ onClose, onSave, userName }: { onClose: () => void, onSave: (data: {bank: string, accountNumber: string}) => void, userName: string }) => {
    const [bankData, setBankData] = useState({ bank: '', accountNumber: '' });
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            onSave(bankData);
        }, 1500);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-[scaleIn_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-orange-50 text-brand-orange rounded-lg"><Building size={18}/></div>
                      Update Bank Details
                  </h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Bank Name</label>
                      <select 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium"
                          value={bankData.bank}
                          onChange={e => setBankData({...bankData, bank: e.target.value})}
                          required
                      >
                          <option value="">Select Bank</option>
                          <option value="GTBank">Guaranty Trust Bank</option>
                          <option value="Zenith">Zenith Bank</option>
                          <option value="FirstBank">First Bank</option>
                          <option value="UBA">United Bank for Africa</option>
                          <option value="Access">Access Bank</option>
                          <option value="Kuda">Kuda Microfinance Bank</option>
                          <option value="OPay">OPay</option>
                      </select>
                  </div>
                  
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Account Number</label>
                      <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-medium"
                          placeholder="0123456789"
                          maxLength={10}
                          pattern="\d{10}"
                          title="Please enter a valid 10-digit account number"
                          value={bankData.accountNumber}
                          onChange={e => setBankData({...bankData, accountNumber: e.target.value})}
                          required
                      />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                      <Info size={18} className="text-brand-secondary shrink-0 mt-0.5"/>
                      <p className="text-xs text-slate-600 leading-relaxed">
                          Please ensure the account name matches your registered driver name <strong>{userName}</strong> to avoid payout delays.
                      </p>
                  </div>

                  <div className="pt-2">
                      <Button type="submit" variant="cta" className="w-full font-bold shadow-lg shadow-orange-500/20" isLoading={loading}>
                          Verify & Save
                      </Button>
                  </div>
              </form>
          </div>
      </div>
    );
};
