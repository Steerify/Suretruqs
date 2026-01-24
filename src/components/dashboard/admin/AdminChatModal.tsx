import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Users, Paperclip, MoreVertical } from 'lucide-react';
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
  const headerGradient = isDriver 
    ? 'from-brand-orange to-orange-600' 
    : 'from-brand-primary to-blue-600';

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-end md:justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full md:max-w-md h-[95vh] md:h-[650px] md:rounded-[2rem] rounded-t-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
        {/* Header */}
        <div className={`bg-gradient-to-r ${headerGradient} p-6 flex items-center justify-between text-white shrink-0`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-base shadow-lg ring-1 ring-white/30">
              {recipientName.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight leading-tight">{recipientName}</h3>
              <div className="flex items-center gap-1.5 opacity-90">
                <div className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse`} />
                <span className="text-xs font-bold uppercase tracking-wider">{chatWith}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Admin Warning/Notice */}
        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-center border-b ${isDriver ? 'bg-orange-50 text-brand-orange border-orange-100' : 'bg-blue-50 text-brand-primary border-blue-100'}`}>
           <span className="opacity-70">Official Admin Support Channel</span> • #{shipmentId.slice(-8)}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
          {chatMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDriver ? 'bg-orange-100 text-brand-orange' : 'bg-blue-100 text-brand-primary'}`}>
                    <Users size={32} />
                </div>
              <p className="font-bold text-sm">Start conversation</p>
              <p className="text-xs">with {recipientName}</p>
            </div>
          )}
          
          {chatMessages.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'} group max-w-full`}>
              <div className={`max-w-[85%] px-5 py-3 text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                m.isMe 
                  ? 'bg-brand-primary text-white rounded-[1.25rem] rounded-br-none' 
                  : 'bg-white text-slate-700 rounded-[1.25rem] rounded-bl-none border border-slate-100'
              }`}>
                {!m.isMe && (
                  <p className={`text-[10px] font-black mb-1 uppercase tracking-wider ${isDriver ? 'text-brand-orange' : 'text-brand-primary'}`}>{chatWith}</p>
                )}
                <p className="leading-relaxed whitespace-pre-wrap break-words">{m.text}</p>
                <div className={`text-[9px] font-bold mt-1.5 flex items-center justify-end gap-1 ${m.isMe ? 'text-blue-100' : 'text-slate-300'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 shadow-sm border border-slate-100 items-center h-10">
                <div className="w-1.5 h-1.5 bg-brand-primary/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          )}
          <div ref={modalChatEndRef}></div>
        </div>

        {/* Footer */}
        <form onSubmit={sendMsg} className="p-4 bg-white border-t border-slate-100 flex items-end gap-3 shrink-0 pb-6 md:pb-4">
          <button type="button" className="p-3 text-slate-400 hover:text-brand-primary hover:bg-blue-50 rounded-xl transition-colors shrink-0">
             <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
              <input 
                type="text" 
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm font-medium transition-all placeholder:text-slate-400"
                placeholder="Type your message..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
              />
          </div>
          
          <button 
            type="submit" 
            disabled={!msgText.trim()} 
            className="w-12 h-12 bg-brand-primary text-white rounded-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <Send size={20} className={msgText.trim() ? 'ml-0.5' : ''}/>
          </button>
        </form>
      </div>
    </div>
  );
};
