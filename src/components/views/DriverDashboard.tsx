import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Truck, Home, Wallet, Clock, User as UserIcon, Wrench } from 'lucide-react';
import { Shipment, ShipmentStatus, User } from '../../types';
import { useStore } from '../../context/StoreContext';

// Components
import { DriverTopBar } from '../dashboard/driver/DriverTopBar';
import { DriverDashboardHome } from '../dashboard/driver/DriverDashboardHome';
import { ActiveJobView } from '../dashboard/driver/ActiveJobView';
import { DriverOfflineView } from '../dashboard/driver/DriverOfflineView';
import { EarningsView } from '../dashboard/driver/EarningsView';
import { DriverHistoryView } from '../dashboard/driver/DriverHistoryView';
import { MaintenanceView } from '../dashboard/driver/MaintenanceView';
import { DriverProfileView } from '../dashboard/driver/DriverProfileView';
import { SupportView } from '../dashboard/driver/SupportView';
import { DriverNotificationPanel } from '../dashboard/driver/DriverNotificationPanel';

// Modals
import { JobRequestModal } from '../dashboard/driver/JobRequestModal';
import { DriverJobDetailsModal } from '../dashboard/driver/DriverJobDetailsModal';
import { DocumentModal } from '../dashboard/driver/DocumentModal';
import { BankDetailsModal } from '../dashboard/driver/BankDetailsModal';
import { CustomerChatModal } from '../dashboard/driver/CustomerChatModal';
import { SOSModal } from '../dashboard/driver/SOSModal';

// Mock Chat Messages (Dispatch)
const INITIAL_CHAT = [
    { id: 1, sender: 'Dispatch', text: 'Hello, please confirm when you arrive at the pickup point.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Me', text: 'I am 5 minutes away. Traffic is light.', time: '10:32 AM', isMe: true },
];

// Mock Customer Chat Messages
const INITIAL_CUSTOMER_CHAT = [
    { id: 1, sender: 'Customer', text: 'Hi! Please call me when you reach the gate.', time: '12:15 PM', isMe: false },
];

export const DriverDashboard: React.FC = () => {
  const { currentUser, shipments, incomingJob, acceptJob, updateStatus, dismissJobAlert, logout } = useStore();
  
  // Derived State from Store
  const user = currentUser!;
  const availableJobs = shipments.filter(s => s.status === ShipmentStatus.PENDING);
  const activeJob = shipments.find(s => s.driverId === user.id && [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status)) || null;
  const jobHistory = shipments.filter(s => s.status === ShipmentStatus.DELIVERED || s.status === ShipmentStatus.CANCELLED);

  const [view, setView] = useState<'home' | 'history' | 'profile' | 'maintenance' | 'wallet' | 'support'>('home');
  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<Shipment | null>(null);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  
  // Chat States
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT); // Dispatch Chat
  const [newMessage, setNewMessage] = useState('');
  
  // Customer Chat State
  const [showCustomerChat, setShowCustomerChat] = useState(false);
  const [customerMessages, setCustomerMessages] = useState(INITIAL_CUSTOMER_CHAT);
  const [customerTyping, setCustomerTyping] = useState(false);
  
  // SOS State
  const [showSOS, setShowSOS] = useState(false);

  // Payout Method State
  const [payoutDetails, setPayoutDetails] = useState({
      bankName: 'GTBank',
      accountNumber: '•••• 1234',
      verified: true
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [view, activeJob, isOnline]);

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      
      const msg = {
          id: Date.now(),
          sender: 'Me',
          text: newMessage,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isMe: true
      };
      
      setChatMessages([...chatMessages, msg]);
      setNewMessage('');
      
      // Mock Reply
      setTimeout(() => {
          setChatMessages(prev => [...prev, {
              id: Date.now() + 1,
              sender: 'Dispatch',
              text: 'Message received. We are looking into it.',
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              isMe: false
          }]);
      }, 2000);
  };

  const handleCustomerSendMessage = (text: string) => {
      const newMsg = {
          id: Date.now(),
          sender: 'Me',
          text: text,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isMe: true
      };
      setCustomerMessages(prev => [...prev, newMsg]);

      // Simulate Customer Reply
      setTimeout(() => {
          setCustomerTyping(true);
          setTimeout(() => {
              setCustomerTyping(false);
              const replies = [
                  "Okay, I'll be waiting.",
                  "Thanks for the update!",
                  "Please drive safely.",
                  "I'm at the warehouse entrance."
              ];
              const randomReply = replies[Math.floor(Math.random() * replies.length)];
              
              setCustomerMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  sender: 'Customer',
                  text: randomReply,
                  time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                  isMe: false
              }]);
          }, 1500);
      }, 1000);
  };

  const handleBankSave = (bankData: { bank: string, accountNumber: string }) => {
      setPayoutDetails({
          bankName: bankData.bank,
          accountNumber: '•••• ' + bankData.accountNumber.slice(-4),
          verified: true
      });
      setShowBankModal(false);
      alert("Bank details updated successfully!");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans w-full relative" ref={containerRef}>
      {showNotifications && <div className="fixed inset-0 z-[55]" onClick={() => setShowNotifications(false)}></div>}
      
      <DriverTopBar 
          user={user} 
          view={view} 
          setView={setView} 
          isOnline={isOnline} 
          setIsOnline={setIsOnline} 
          showNotifications={showNotifications} 
          setShowNotifications={setShowNotifications} 
          onLogout={logout} 
      />

      <main>
         {incomingJob && <JobRequestModal job={incomingJob} onAccept={acceptJob} onDecline={dismissJobAlert} />}
         {showNotifications && <DriverNotificationPanel />}
         {selectedHistoryItem && <DriverJobDetailsModal job={selectedHistoryItem} onClose={() => setSelectedHistoryItem(null)} />}
         {viewingDoc && <DocumentModal viewingDoc={viewingDoc} onClose={() => setViewingDoc(null)} />}
         {showBankModal && <BankDetailsModal onClose={() => setShowBankModal(false)} onSave={handleBankSave} userName={user.name} />}
         {showCustomerChat && activeJob && <CustomerChatModal shipmentId={activeJob.id} onClose={() => setShowCustomerChat(false)} />}
         {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}

         {view === 'home' && (
             !isOnline ? <DriverOfflineView setIsOnline={setIsOnline} /> :
             activeJob ? <ActiveJobView activeJob={activeJob} onUpdateStatus={updateStatus} setShowCustomerChat={setShowCustomerChat} setShowSOS={setShowSOS} /> :
             <DriverDashboardHome user={user} availableJobs={availableJobs} onAcceptJob={acceptJob} setView={setView} />
         )}

         {view === 'history' && <DriverHistoryView jobHistory={jobHistory} setSelectedHistoryItem={setSelectedHistoryItem} />}
         {view === 'wallet' && <EarningsView payoutDetails={payoutDetails} setShowBankModal={setShowBankModal} />}
         {view === 'profile' && <DriverProfileView user={user} isOnline={isOnline} setIsOnline={setIsOnline} jobHistory={jobHistory} setViewingDoc={setViewingDoc} />}
         {view === 'maintenance' && <MaintenanceView setView={setView} />}
         {view === 'support' && <SupportView chatMessages={chatMessages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />}
      </main>

      {/* Bottom Navigation - Hidden on Desktop */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-around py-3 px-2 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-lg bg-white/95 pb-safe md:hidden">
         {[
            { id: 'home', icon: Home, label: 'Jobs' },
            { id: 'wallet', icon: Wallet, label: 'Earnings' },
            { id: 'history', icon: Clock, label: 'History' },
            { id: 'profile', icon: UserIcon, label: 'Profile' },
            { id: 'maintenance', icon: Wrench, label: 'Service' }
         ].map((item) => (
            <button 
               key={item.id}
               type="button"
               onClick={() => setView(item.id as any)}
               className={`flex flex-1 flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                   view === item.id 
                   ? 'text-brand-primary bg-blue-50/80 scale-105' 
                   : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
               }`}
            >
               <item.icon size={22} strokeWidth={view === item.id ? 2.5 : 2} />
               <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </button>
         ))}
      </div>
    </div>
  );
};
