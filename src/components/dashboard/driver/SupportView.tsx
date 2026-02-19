import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../ui/Button';

interface SupportViewProps {
    chatMessages: any[];
    newMessage: string;
    setNewMessage: (msg: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
}

export const SupportView = ({ chatMessages, newMessage, setNewMessage, handleSendMessage }: SupportViewProps) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
      <div className="p-4 md:p-8 pb-24 fade-up w-full max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
              <div>
                  <h2 className="text-2xl font-bold text-slate-900">Support Chat</h2>
                  <p className="text-slate-500 text-sm">Direct line to dispatch & support.</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Online
              </div>
          </div>

          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Chat Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                  {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] md:max-w-[60%] rounded-2xl p-4 shadow-sm ${msg.isMe ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                              <p className={`text-[10px] mt-2 font-medium text-right ${msg.isMe ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                          </div>
                      </div>
                  ))}
                  <div ref={chatEndRef}></div>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
                  <input 
                      type="text" 
                      className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary outline-none"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" variant="cta" className="rounded-xl px-4" disabled={!newMessage.trim()}>
                      <Send size={20}/>
                  </Button>
              </form>
          </div>
      </div>
    );
};
