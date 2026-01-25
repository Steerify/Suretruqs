import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Users, Paperclip, MoreVertical, Shield, Truck, User } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface AdminChatModalProps {
  shipmentId: string;
  chatWith: 'customer' | 'driver';
  recipientName: string;
  recipientId: string;
  onClose: () => void;
}

export const AdminChatModal: React.FC<AdminChatModalProps> = ({
  shipmentId,
  chatWith,
  recipientName,
  recipientId,
  onClose
}) => {
  const { messages, sendMessage, isTyping } = useStore();
  const [msgText, setMsgText] = useState('');
  const modalChatEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for this specific conversation
  const chatMessages = (messages[shipmentId] || []).filter(msg => 
    msg.senderId === recipientId || msg.isMe
  );
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

  const isDriver = chatWith === 'driver';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-lg h-[650px] rounded-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Modern Header - Clean & Professional */}
        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 relative z-20 gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md overflow-hidden ${isDriver ? 'bg-gradient-to-br from-brand-orange to-orange-600' : 'bg-gradient-to-br from-brand-primary to-blue-600'}`}>
                    <span className="font-black text-lg select-none">
                        {(() => {
                            const parts = (recipientName || '').split(' ');
                            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
                            return (parts[0]?.[0] || '').toUpperCase();
                        })()}
                    </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full"></div>
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 max-w-full">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
                      {recipientName}
                  </h3>
                  {isDriver ? (
                      <span className="shrink-0 bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-orange-100 flex items-center gap-1"><Truck size={10}/> Driver</span>
                  ) : (
                      <span className="shrink-0 bg-blue-50 text-brand-primary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-blue-100 flex items-center gap-1"><User size={10}/> Customer</span>
                  )}
              </div>
              <p className="text-xs text-slate-500 font-bold truncate">Shipment #{shipmentId.slice(-8)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
             <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                 <MoreVertical size={20} />
             </button>
             <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                 <X size={20} />
             </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] space-y-6 scroll-smooth">
          {chatMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-60">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <MessageSquareIcon isDriver={isDriver} />
                </div>
                <p className="text-slate-900 font-bold text-sm">No messages yet</p>
                <p className="text-slate-400 text-xs mt-1">Start the conversation with {recipientName}</p>
                <div className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                    <Shield size={12}/> Secure Admin Channel
                </div>
            </div>
          )}
          
          {chatMessages.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'} group`}>
                <div className={`max-w-[80%] relative ${m.isMe ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                    <div className={`px-5 py-3 shadow-sm text-[13px] font-medium leading-relaxed break-words whitespace-pre-wrap transition-all hover:shadow-md ${
                        m.isMe 
                        ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-200'
                    }`}>
                        {m.text}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-1.5 px-1">{m.timestamp}</span>
                </div>
            </div>
          ))}
          
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm border border-slate-100 items-center h-10 w-fit">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          )}
          <div ref={modalChatEndRef}></div>
        </div>

        {/* Input Area - Floating Clean Look */}
        <div className="p-5 bg-white border-t border-slate-100 relative z-20">
            <form onSubmit={sendMsg} className="flex gap-3 items-end">
                <button 
                    type="button" 
                    className="p-3.5 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                    <Paperclip size={20} />
                </button>
                <div className="flex-1 bg-slate-50 rounded-xl border border-transparent focus-within:border-brand-primary/30 focus-within:bg-white focus-within:shadow-sm transition-all focus-within:ring-4 focus-within:ring-brand-primary/5 flex items-center pr-2">
                    <input 
                        className="w-full bg-transparent border-none px-4 py-3.5 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-500"
                        placeholder="Type your message..."
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={!msgText.trim()} 
                    className={`p-3.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed ${
                        isDriver 
                        ? 'bg-brand-orange hover:bg-orange-600 shadow-orange-500/20 text-white' 
                        : 'bg-brand-primary hover:bg-blue-700 shadow-blue-500/20 text-white'
                    }`}
                >
                    <Send size={20} className={msgText.trim() ? 'ml-0.5' : ''}/>
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

const MessageSquareIcon = ({ isDriver }: { isDriver: boolean }) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isDriver ? "text-brand-orange/40" : "text-brand-primary/40"}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);
