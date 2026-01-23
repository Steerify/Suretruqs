import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { ShipmentStatus } from '../../../types';

interface DriverChatModalProps {
    shipmentId: string;
    onClose: () => void;
    shipmentStatus?: ShipmentStatus;
    driverName?: string;
}

export const DriverChatModal = ({ shipmentId, onClose, shipmentStatus, driverName }: DriverChatModalProps) => {
    const { messages, sendMessage, isTyping } = useStore();
    const [msgText, setMsgText] = useState('');
    const modalChatEndRef = useRef<HTMLDivElement>(null);

    const chatMessages = messages[shipmentId] || [];
    const typing = isTyping[shipmentId] || false;

    // Determine if driver is actively delivering (customer can chat with driver)
    const isActiveDelivery = shipmentStatus && [
        ShipmentStatus.ASSIGNED,
        ShipmentStatus.PICKED_UP,
        ShipmentStatus.IN_TRANSIT
    ].includes(shipmentStatus);

    const chatRecipient = isActiveDelivery && driverName ? driverName : 'Admin Support';
    const recipientInitials = isActiveDelivery && driverName ? driverName.charAt(0) : 'AS';
    const recipientStatus = isActiveDelivery ? 'On Delivery' : 'Available';

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
              {/* Header - Context-aware */}
              <div className={`p-4 flex items-center justify-between border-b ${
                  isActiveDelivery 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                      : 'bg-white border-slate-100'
              }`}>
                  <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm ${
                          isActiveDelivery 
                              ? 'bg-white/20 backdrop-blur text-white' 
                              : 'bg-blue-50 text-brand-primary'
                      }`}>
                          {recipientInitials}
                      </div>
                      <div>
                          <h3 className={`font-semibold text-sm ${isActiveDelivery ? 'text-white' : 'text-slate-900'}`}>
                              {chatRecipient}
                          </h3>
                          <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${isActiveDelivery ? 'bg-green-200' : 'bg-green-500'}`}></div>
                              <span className={`text-xs ${isActiveDelivery ? 'text-green-100' : 'text-slate-500'}`}>
                                  {recipientStatus}
                              </span>
                          </div>
                      </div>
                  </div>
                  <button 
                      onClick={onClose} 
                      className={`p-1.5 rounded-full transition-colors ${
                          isActiveDelivery 
                              ? 'hover:bg-white/20 text-white' 
                              : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                      }`}
                  >
                      <X size={20}/>
                  </button>
              </div>

              {/* Context Banner */}
              {isActiveDelivery ? (
                  <div className="bg-green-50 border-b border-green-100 px-4 py-2 text-xs text-green-800 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>🚚 Active delivery - You're chatting with your driver</span>
                  </div>
              ) : (
                  <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-xs text-blue-700 font-medium">
                      💬 General support - Ask us anything about your shipment
                  </div>
              )}

              {/* Messages - Uber Style: Clean, Minimal Spacing */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                  {chatMessages.length === 0 && (
                      <div className="text-center text-slate-400 text-sm mt-20">
                          <p>No messages yet</p>
                          {isActiveDelivery ? (
                              <p className="text-xs mt-1">Say hi to your driver!</p>
                          ) : (
                              <p className="text-xs mt-1">How can we help you today?</p>
                          )}
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
