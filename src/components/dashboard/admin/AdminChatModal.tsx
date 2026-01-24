import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Users } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-end md:justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full md:max-w-md h-[85vh] md:h-[600px] md:rounded-2xl rounded-t-2xl shadow-xl relative z-10 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-secondary to-blue-700 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-semibold text-sm">
              {recipientName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-base">{recipientName}</h3>
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                <span className="text-xs capitalize">{chatWith}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Admin Notice */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-xs text-blue-700 font-medium">
          <span className="font-bold">Admin Mode:</span> Chatting with {chatWith}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {chatMessages.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-20">
              <p>No messages yet</p>
              <p className="text-xs mt-1">Start the conversation with the {chatWith}</p>
            </div>
          )}
          {chatMessages.map((m) => (
            <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.isMe 
                  ? 'bg-gradient-to-br from-brand-secondary to-blue-700 text-white rounded-2xl rounded-br-md' 
                  : 'bg-white text-slate-800 rounded-2xl rounded-bl-md border border-slate-200'
              }`}>
                {!m.isMe && (
                  <p className="text-xs font-bold mb-1 opacity-70 capitalize">{chatWith}</p>
                )}
                <p className="break-words">{m.text}</p>
                <span className={`text-[10px] block mt-1 ${m.isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md flex gap-1 shadow-sm border border-slate-200">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
            </div>
          )}
          <div ref={modalChatEndRef}></div>
        </div>

        {/* Footer */}
        <form onSubmit={sendMsg} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 focus:bg-white focus:border-brand-secondary outline-none text-sm transition-all"
            placeholder={`Message ${recipientName}...`}
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!msgText.trim()} 
            className="bg-gradient-to-r from-brand-secondary to-blue-700 text-white p-2.5 rounded-full hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            <Send size={18}/>
          </button>
        </form>
      </div>
    </div>
  );
};
