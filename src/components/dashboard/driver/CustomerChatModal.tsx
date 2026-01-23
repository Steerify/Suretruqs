import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Phone, Info } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export const CustomerChatModal = ({ shipmentId, onClose }: { shipmentId: string, onClose: () => void }) => {
    const { shipments, customers, messages, sendMessage, isTyping } = useStore();
    const [msgText, setMsgText] = useState('');
    const modalChatEndRef = useRef<HTMLDivElement>(null);

    // Look up shipment and customer
    const shipment = shipments.find(s => s.id === shipmentId);
    const customer = customers.find(c => c.id === shipment?.customerId);
    
    const customerName = customer?.name || 'Customer';
    const customerInitial = customerName.charAt(0);
    const customerCompany = customer?.company || 'Merchant';

    const chatMessages = messages[shipmentId] || [];
    const typing = isTyping[shipmentId] || false;

    useEffect(() => {
        modalChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, typing]);

    const sendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if(!msgText.trim()) return;
        sendMessage(shipmentId, msgText);
        setMsgText('');
    };

    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-end md:justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
          
          <div className="bg-white w-full md:max-w-md h-[85vh] md:h-[650px] md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-[slideUp_0.4s_ease-out] border border-white/20">
              
              {/* Header - Modern Uber/Premium Style */}
              <div className="bg-white p-6 pb-4 flex items-center justify-between border-b border-slate-100 shadow-sm relative z-20">
                  <div className="flex items-center gap-4">
                      <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/20">
                              {customerInitial}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                      </div>
                      <div>
                          <div className="flex items-center gap-2">
                             <h3 className="font-black text-slate-900 text-base tracking-tight">{customerName}</h3>
                             <Info size={14} className="text-slate-300 hover:text-slate-500 cursor-pointer" />
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{customerCompany}</p>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                      <button className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl transition-all active:scale-95 shadow-sm border border-slate-100">
                          <Phone size={18} fill="currentColor" className="opacity-80" />
                      </button>
                      <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                          <X size={20}/>
                      </button>
                  </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 scrollbar-hide">
                  {chatMessages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full opacity-30 select-none">
                          <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center mb-4">
                              <Send size={24} className="text-slate-400 -rotate-12" />
                          </div>
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                      </div>
                  )}
                  
                  {chatMessages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] px-5 py-3.5 text-sm font-medium shadow-sm leading-relaxed transition-all ${
                              m.isMe 
                              ? 'bg-brand-primary text-white rounded-[1.5rem] rounded-tr-none' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-[1.5rem] rounded-tl-none'
                          }`}>
                              <p className="break-words">{m.text}</p>
                          </div>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1.5 mx-2">
                              {m.timestamp}
                          </span>
                      </div>
                  ))}
                  
                  {typing && (
                      <div className="flex flex-col items-start animate-pulse">
                          <div className="bg-white border border-slate-100 px-5 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex gap-1.5">
                              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                          </div>
                      </div>
                  )}
                  <div ref={modalChatEndRef}></div>
              </div>

              {/* Input Footer */}
              <div className="p-6 bg-white border-t border-slate-50 relative z-20">
                  <form onSubmit={sendMsg} className="flex items-center gap-3">
                      <div className="flex-1 relative group">
                          <input 
                              type="text" 
                              className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-5 py-4 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none text-sm font-semibold transition-all transition-all shadow-inner"
                              placeholder="Type a message..."
                              value={msgText}
                              onChange={(e) => setMsgText(e.target.value)}
                          />
                      </div>
                      <button 
                          type="submit" 
                          disabled={!msgText.trim()} 
                          className="bg-brand-primary text-white w-14 h-14 rounded-2xl hover:bg-blue-600 disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center shadow-xl shadow-blue-500/20 active:scale-90"
                      >
                          <Send size={20} className={msgText.trim() ? 'animate-pulse' : ''} />
                      </button>
                  </form>
              </div>
          </div>
      </div>
    );
};
