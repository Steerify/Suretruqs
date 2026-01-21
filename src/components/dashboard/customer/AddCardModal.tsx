import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/Button';

export interface PaymentMethod {
  id: string;
  type: 'VISA' | 'MASTERCARD' | 'VERVE';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export const AddCardModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (card: PaymentMethod) => void }) => {
    const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const type = cardData.number.startsWith('4') ? 'VISA' : cardData.number.startsWith('5') ? 'MASTERCARD' : 'VERVE';
            const last4 = cardData.number.slice(-4);
            onAdd({
                id: `PM-${Date.now()}`,
                type,
                last4,
                expiry: cardData.expiry,
                isDefault: false // Logic handled by parent or default to false
            });
            setLoading(false);
        }, 1500);
    };

    const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 16) val = val.slice(0, 16);
        setCardData({ ...cardData, number: val });
    };

    const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2, 4);
        }
        setCardData({ ...cardData, expiry: val });
    };

    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 p-6 animate-[scaleIn_0.2s_ease-out]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                      Add New Card
                  </h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
              </div>

              {/* Card Preview */}
              <div className="mb-8 relative h-48 w-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                          <div className="w-12 h-8 bg-yellow-500/20 rounded-md border border-yellow-500/50"></div>
                          <span className="font-mono text-lg font-bold italic opacity-80">
                              {cardData.number.startsWith('4') ? 'VISA' : cardData.number.startsWith('5') ? 'Mastercard' : 'Verve'}
                          </span>
                      </div>
                      <div>
                          <p className="font-mono text-xl tracking-widest mb-4">
                              {cardData.number ? cardData.number.match(/.{1,4}/g)?.join(' ') : '•••• •••• •••• ••••'}
                          </p>
                          <div className="flex justify-between text-xs uppercase tracking-wider opacity-80">
                              <span>{cardData.name || 'CARD HOLDER'}</span>
                              <span>{cardData.expiry || 'MM/YY'}</span>
                          </div>
                      </div>
                  </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Card Number</label>
                      <div className="relative">
                          <CreditCard className="absolute left-3 top-3 text-slate-400" size={18}/>
                          <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 font-mono"
                              placeholder="0000 0000 0000 0000"
                              value={cardData.number}
                              onChange={handleCardInput}
                              required
                          />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cardholder Name</label>
                      <input 
                          type="text" 
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900"
                          placeholder="e.g. John Doe"
                          value={cardData.name}
                          onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                          required
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Expiry Date</label>
                          <input 
                              type="text" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 text-center"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardData.expiry}
                              onChange={handleExpiryInput}
                              required
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">CVV</label>
                          <input 
                              type="password" 
                              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all text-slate-900 text-center"
                              placeholder="123"
                              maxLength={3}
                              value={cardData.cvv}
                              onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                              required
                          />
                      </div>
                  </div>

                  <div className="pt-4">
                      <Button variant="cta" className="w-full shadow-lg shadow-orange-500/20 py-3 text-base font-bold" type="submit" isLoading={loading}>
                          Save Card
                      </Button>
                  </div>
              </form>
          </div>
      </div>
    );
};
