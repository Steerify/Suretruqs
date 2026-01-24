import React, { useState, useMemo } from 'react';
import { Card } from '../../ui/Card';
import { useStore } from '../../../context/StoreContext';
import { MessageSquare, User, Clock, Search, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ChatMessage } from '../../../types';

interface AdminSupportViewProps {
    onOpenChat: (shipmentId: string, userId: string, userName: string, role: 'customer' | 'driver') => void;
}

interface ChatThread {
    shipmentId: string;
    lastMessage: ChatMessage;
    unreadCount: number; // Placeholder, assuming all fetched are read or derived
    participants: { name: string, role: string, id: string }[];
}

export const AdminSupportView: React.FC<AdminSupportViewProps> = ({ onOpenChat }) => {
    const { messages, shipments, currentUser } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const threads: ChatThread[] = useMemo(() => {
        if (!messages) return [];
        
        return Object.keys(messages).map(shipmentId => {
            const msgs = messages[shipmentId];
            if (!msgs || msgs.length === 0) return null;

            const lastMsg = msgs[msgs.length - 1]; // Assuming messages are sorted chrono
            const shipment = shipments.find(s => s.id === shipmentId);
            
            // Derive participant (usually the one who isn't the admin, or just the customer)
            // In admin view, we want to chat with whoever sent the last message if it wasn't us,
            // or default to customer.
            let targetUser = { name: 'Unknown User', role: 'customer', id: '' };
            
            if (shipment) {
               // This is simplistic; in a real app we'd fetch user details properly
               // For now, let's use the shipment customer data if available in store
               // Since we don't have full user lists here easily without passing them down, 
               // we'll rely on the message sender info or shipment metadata.
               
               // Note: 'messages' in store are simplified. 
               // Let's try to infer from the last message sender.
               if (lastMsg.senderId !== currentUser?.id) {
                   // If last message was from someone else, that's who we are talking to.
                   // We need to guess if they are driver or customer.
                   // Usually customer unless we check IDs.
                   const isDriver = shipment.driverId === lastMsg.senderId;
                   targetUser = { 
                       name: lastMsg.senderName || 'User', 
                       role: isDriver ? 'driver' : 'customer', 
                       id: lastMsg.senderId 
                   };
               } else {
                   // If we sent the last one, reply to the other party (customer default)
                   targetUser = { name: 'Customer', role: 'customer', id: shipment.customerId };
               }
            }

            return {
                shipmentId,
                lastMessage: lastMsg,
                unreadCount: 0,
                participants: [targetUser]
            };
        }).filter(Boolean) as ChatThread[];
    }, [messages, shipments, currentUser]);

    const filteredThreads = threads.filter(t => 
        t.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.participants[0].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.shipmentId.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Operations Chat</h2>
                    <p className="text-slate-500 font-medium">Real-time support and logistics coordination</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search conversations..." 
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none text-sm font-medium w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Active Threads List */}
                <Card className="lg:col-span-1 border border-slate-100 p-0 overflow-hidden flex flex-col shadow-lg shadow-slate-200/50">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Active Threads</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredThreads.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-xs">No active conversations</p>
                            </div>
                        ) : (
                            filteredThreads.map(thread => (
                                <button
                                    key={thread.shipmentId}
                                    onClick={() => onOpenChat(
                                        thread.shipmentId, 
                                        thread.participants[0].id, 
                                        thread.participants[0].name,
                                        thread.participants[0].role as 'customer' | 'driver'
                                    )}
                                    className="w-full p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md ${thread.participants[0].role === 'driver' ? 'bg-brand-orange' : 'bg-brand-primary'}`}>
                                                {thread.participants[0].name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none">{thread.participants[0].name}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium flex items-center gap-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${thread.participants[0].role === 'driver' ? 'bg-brand-orange' : 'bg-brand-primary'}`} />
                                                    #{thread.shipmentId.slice(-6)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 pl-12 mt-1 border-l-2 border-transparent group-hover:border-slate-200 transition-all">
                                        {thread.lastMessage.isMe ? <span className="text-brand-primary font-bold">You: </span> : ''}{thread.lastMessage.text}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </Card>

                {/* Quick Actions / Featured Context */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8 border border-slate-100 flex flex-col items-center justify-center text-center h-full bg-slate-50/50 shadow-inner">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl mb-6 text-brand-primary ring-4 ring-slate-50">
                            <MessageSquare size={36} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Select a Conversation</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                            Choose a thread from the list to view message history, manage support tickets, or coordinate with drivers and customers directly.
                        </p>
                        <div className="flex gap-3">
                            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-slate-500 border border-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-primary"></span> Customers
                            </div>
                            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-slate-500 border border-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-orange"></span> Drivers
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
