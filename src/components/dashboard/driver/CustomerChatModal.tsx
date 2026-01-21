import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

export const CustomerChatModal = ({ messages, onClose, onSendMessage, isTyping }: { messages: any[], onClose: () => void, onSendMessage: (text: string) => void, isTyping: boolean }) => {
    const [msgText, setMsgText] = useState('');
    const modalChatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        modalChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMsg = (e: React.FormEvent) => {
        e.preventDefault();
        if(!msgText.trim()) return;
        onSendMessage(msgText);
        setMsgText('');
    };

    return (
      <div className="fixed inset-0 z-[120] flex flex-col items-center justify-end md:justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
          <div className="bg-slate-50 w-full md:max-w-md h-[85vh] md:h-[600px] md:rounded-3xl rounded-t-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
              {/* Header */}
              <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm z-20">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                          C
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-900 text-sm">Shoprite NG</h3>
                          <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">Online</span>
                          </div>
                      </div>
                  </div>
                  <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20}/></button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed relative ${
                              m.isMe 
                              ? 'bg-brand-primary text-white rounded-tr-none' 
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                          }`}>
                              {m.text}
                              <span className={`text-[10px] block text-right mt-1 ${m.isMe ? 'text-blue-200' : 'text-slate-400'}`}>{m.time}</span>
                          </div>
                      </div>
                  ))}
                  {isTyping && (
                      <div className="flex justify-start animate-pulse">
                          <div className="bg-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                      </div>
                  )}
                  <div ref={modalChatEndRef}></div>
              </div>

              {/* Footer */}
              <form onSubmit={sendMsg} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                  <input 
                      type="text" 
                      className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary outline-none text-sm font-medium"
                      placeholder="Type a message..."
                      value={msgText}
                      onChange={(e) => setMsgText(e.target.value)}
                  />
                  <button type="submit" disabled={!msgText.trim()} className="bg-brand-primary text-white p-3 rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20">
                      <Send size={20}/>
                  </button>
              </form>
          </div>
      </div>
    );
};
