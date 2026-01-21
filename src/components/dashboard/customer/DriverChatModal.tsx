import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export const DriverChatModal = ({ driverName, shipmentId, onClose }: { driverName: string, shipmentId: string, onClose: () => void }) => {
    const { messages, sendMessage, isTyping } = useStore();
    const [msgText, setMsgText] = useState('');
    const modalChatEndRef = useRef<HTMLDivElement>(null);

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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
          <div className="bg-white w-full md:max-w-md h-[85vh] md:h-[600px] md:rounded-2xl rounded-t-2xl shadow-xl relative z-10 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
              {/* Header - Uber Style: Minimal, Clean */}
              <div className="bg-white p-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center font-semibold text-brand-primary text-sm">
                          {driverName.charAt(0)}
                      </div>
                      <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{driverName}</h3>
                          <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-slate-500">Online</span>
                          </div>
                      </div>
                  </div>
                  <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={20}/>
                  </button>
              </div>

              {/* Messages - Uber Style: Clean, Minimal Spacing */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                  {chatMessages.length === 0 && (
                      <div className="text-center text-slate-400 text-sm mt-20">
                          <p>No messages yet</p>
                      </div>
                  )}
                  {chatMessages.map((m) => (
                      <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                              m.isMe 
                              ? 'bg-brand-primary text-white rounded-2xl rounded-br-md' 
                              : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md'
                          }`}>
                              <p className="break-words">{m.text}</p>
                              <span className={`text-[10px] block mt-1 ${m.isMe ? 'text-blue-100' : 'text-slate-400'}`}>{m.timestamp}</span>
                          </div>
                      </div>
                  ))}
                  {typing && (
                      <div className="flex justify-start">
                          <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                          </div>
                      </div>
                  )}
                  <div ref={modalChatEndRef}></div>
              </div>

              {/* Footer - Uber Style: Minimal, Borderless */}
              <form onSubmit={sendMsg} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                  <input 
                      type="text" 
                      className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2.5 focus:bg-slate-100 outline-none text-sm transition-colors"
                      placeholder="Message..."
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                  />
                  <button 
                      type="submit" 
                      disabled={!msgText.trim()} 
                      className="bg-brand-primary text-white p-2.5 rounded-full hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                      <Send size={18}/>
                  </button>
              </form>
          </div>
      </div>
    );
};
