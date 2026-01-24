import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
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
import { FullMapModal } from '../dashboard/common/FullMapModal';

// No mock chats

export const DriverDashboard: React.FC = () => {
  const { currentUser, shipments, incomingJob, acceptJob, updateStatus, dismissJobAlert, logout, walletBalance, transactions } = useStore();
  
  // Derived State from Store
  const user = currentUser!;
  const availableJobs = shipments.filter(s => s.status === ShipmentStatus.PENDING);
  const activeJob = shipments.find(s => s.driverId === user.id && [ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status)) || null;
  const jobHistory = shipments.filter(s => s.status === ShipmentStatus.DELIVERED || s.status === ShipmentStatus.CANCELLED);

  const [view, setView] = useState<'home' | 'history' | 'profile' | 'maintenance' | 'wallet' | 'support'>('home');
  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<Shipment | null>(null);
  const [viewingDoc, setViewingDoc] = useState<{ name: string; url?: string } | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  
  // Chat States
  const [chatMessages, setChatMessages] = useState<any[]>([]); // Support Chat
  const [newMessage, setNewMessage] = useState('');
  
  // Customer Chat State
  const [showCustomerChat, setShowCustomerChat] = useState(false);
  
  // SOS State
  const [showSOS, setShowSOS] = useState(false);

  // Map State
  const [showFullMap, setShowFullMap] = useState(false);

  // Payout Method State
  const [payoutDetails, setPayoutDetails] = useState({
      bankName: 'Not Set',
      accountNumber: '••••',
      verified: false
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
    };



  const handleBankSave = (bankData: { bank: string, accountNumber: string }) => {
      setPayoutDetails({
          bankName: bankData.bank,
          accountNumber: '•••• ' + bankData.accountNumber.slice(-4),
          verified: true
      });
      setShowBankModal(false);
      toast.success("Bank details updated successfully!");
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
         {showFullMap && activeJob && <FullMapModal shipmentId={activeJob.id} onClose={() => setShowFullMap(false)} />}

         {view === 'home' && (
             !isOnline ? <DriverOfflineView setIsOnline={setIsOnline} /> :
             activeJob ? <ActiveJobView activeJob={activeJob} onUpdateStatus={updateStatus} setShowCustomerChat={setShowCustomerChat} setShowSOS={setShowSOS} setShowFullMap={setShowFullMap} /> :
             <DriverDashboardHome user={user} availableJobs={availableJobs} shipments={shipments} onAcceptJob={acceptJob} setView={setView} />
         )}

         {view === 'history' && <DriverHistoryView jobHistory={jobHistory} setSelectedHistoryItem={setSelectedHistoryItem} />}
         {view === 'wallet' && <EarningsView payoutDetails={payoutDetails} setShowBankModal={setShowBankModal} transactions={transactions} balance={walletBalance} />}
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
