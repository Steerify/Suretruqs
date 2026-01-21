import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { LayoutDashboard, Truck, Wallet, History, Settings } from 'lucide-react';

import { Shipment, ShipmentStatus, Driver } from '../../types';
import { useStore } from '../../context/StoreContext';

// Components
import { CustomerTopBar } from '../dashboard/customer/CustomerTopBar';
import { NotificationPanel } from '../dashboard/customer/NotificationPanel';
import { DashboardHome } from '../dashboard/customer/DashboardHome';
import { NewShipmentView } from '../dashboard/customer/NewShipmentView';
import { AvailableDriversView } from '../dashboard/customer/AvailableDriversView';
import { HistoryView } from '../dashboard/customer/HistoryView';
import { WalletView } from '../dashboard/customer/WalletView';
import { ProfileView } from '../dashboard/customer/ProfileView';

// Modals
import { DriverChatModal } from '../dashboard/customer/DriverChatModal';
import { AddCardModal, PaymentMethod } from '../dashboard/customer/AddCardModal';
import { RateDriverModal } from '../dashboard/customer/RateDriverModal';
import { ChangePasswordModal } from '../dashboard/customer/ChangePasswordModal';
import { SupportModal } from '../dashboard/common/SupportModal';
import { FullMapModal } from '../dashboard/common/FullMapModal';
import { InsuranceModal } from '../dashboard/customer/InsuranceModal';
import { HistoryDetailsModal } from '../dashboard/customer/HistoryDetailsModal';

// Mock Driver Chat
const INITIAL_DRIVER_CHAT = [
    { id: 1, sender: 'Driver', text: 'Hello! I am on my way to the pickup location.', time: '10:30 AM', isMe: false },
];

export const CustomerDashboard: React.FC = () => {
  const { currentUser, shipments, drivers, createShipment, rateDriver, logout } = useStore();
  const user = currentUser!; // Assumes routed here only if user exists

  const [view, setView] = useState<'dashboard' | 'new-shipment' | 'find-drivers' | 'history' | 'wallet' | 'profile'>('dashboard');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [selectedDriverForBooking, setSelectedDriverForBooking] = useState<Driver | null>(null);
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Payment Methods State
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'PM-1', type: 'MASTERCARD', last4: '8829', expiry: '12/25', isDefault: true },
    { id: 'PM-2', type: 'VISA', last4: '4242', expiry: '09/26', isDefault: false }
  ]);

  // History View State
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<Shipment | null>(null);

  // Rating State
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingShipment, setRatingShipment] = useState<Shipment | null>(null);

  // Chat State
  const [showDriverChat, setShowDriverChat] = useState(false);
  const [driverChatMessages, setDriverChatMessages] = useState(INITIAL_DRIVER_CHAT);
  const [driverTyping, setDriverTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Derive active shipment (Most recent active one)
  const activeShipment = shipments.find(s => 
    [ShipmentStatus.PENDING, ShipmentStatus.ASSIGNED, ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT].includes(s.status)
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-in", {
        y: 15,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, [view]);

  // Handle Driver Selection
  const handleSelectDriver = (driver: Driver) => {
      setSelectedDriverForBooking(driver);
      setView('new-shipment');
  };

  const handleAddCard = (card: PaymentMethod) => {
      setPaymentMethods([...paymentMethods, card]);
      setShowAddCardModal(false);
  };

  const handleRemoveCard = (id: string) => {
      if (confirm('Are you sure you want to remove this card?')) {
          setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      }
  };

  const handleOpenRateModal = (shipment: Shipment) => {
      setRatingShipment(shipment);
      setShowRateModal(true);
  };

  const handleDriverSendMessage = (text: string) => {
      const newMsg = {
          id: Date.now(),
          sender: 'Me',
          text: text,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          isMe: true
      };
      setDriverChatMessages(prev => [...prev, newMsg]);

      // Simulate Driver Reply
      setTimeout(() => {
          setDriverTyping(true);
          setTimeout(() => {
              setDriverTyping(false);
              const replies = [
                  "Got it, thanks!",
                  "I'm stuck in a bit of traffic, will be there shortly.",
                  "Can you confirm the gate number?",
                  "Almost there!"
              ];
              const randomReply = replies[Math.floor(Math.random() * replies.length)];
              
              setDriverChatMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  sender: 'Driver',
                  text: randomReply,
                  time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                  isMe: false
              }]);
          }, 1500);
      }, 1000);
  };

  const handleCreateShipmentInternal = (data: Partial<Shipment>) => {
      createShipment(data);
      setSelectedDriverForBooking(null);
      setView('dashboard');
      alert("Shipment created successfully!");
  };

  const handleRateDriverInternal = (rating: number, review: string) => {
      if (ratingShipment) {
          rateDriver(ratingShipment.id, rating, review);
          if (selectedHistoryItem && selectedHistoryItem.id === ratingShipment.id) {
              setSelectedHistoryItem({ ...ratingShipment, rating, review });
          }
          setShowRateModal(false);
          setRatingShipment(null);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50" ref={containerRef}>
      {showNotifications && <div className="fixed inset-0 z-[55]" onClick={() => setShowNotifications(false)}></div>}
      {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}
      {showFullMap && <FullMapModal onClose={() => setShowFullMap(false)} />}
      {showInsuranceModal && <InsuranceModal onClose={() => setShowInsuranceModal(false)} />}
      {selectedHistoryItem && <HistoryDetailsModal shipment={selectedHistoryItem} onClose={() => setSelectedHistoryItem(null)} onOpenChat={() => setShowDriverChat(true)} onRate={() => handleOpenRateModal(selectedHistoryItem)} />}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showRateModal && <RateDriverModal onClose={() => setShowRateModal(false)} onRate={handleRateDriverInternal} driverName={drivers.find(d => d.id === ratingShipment?.driverId)?.name || 'Driver'} trackingId={ratingShipment?.trackingId || ''} />}
      {showAddCardModal && <AddCardModal onClose={() => setShowAddCardModal(false)} onAdd={handleAddCard} />}
      {showDriverChat && <DriverChatModal driverName={activeShipment && activeShipment.driverId ? drivers.find(d => d.id === activeShipment.driverId)?.name || 'Driver' : 'Musa Ibrahim'} messages={driverChatMessages} onClose={() => setShowDriverChat(false)} onSendMessage={handleDriverSendMessage} isTyping={driverTyping} />}
      
      <CustomerTopBar user={user} view={view} setView={setView} showNotifications={showNotifications} setShowNotifications={setShowNotifications} onLogout={logout} />
      {showNotifications && <NotificationPanel />}

      <main className="p-4 md:p-8 w-full max-w-[1920px] mx-auto pb-20">
        {view === 'dashboard' && <DashboardHome user={user} shipments={shipments} drivers={drivers} activeShipment={activeShipment} setView={setView} setShowDriverChat={setShowDriverChat} handleSelectDriver={handleSelectDriver} setSelectedHistoryItem={setSelectedHistoryItem} />}
        {view === 'new-shipment' && <NewShipmentView onBack={() => setView('dashboard')} onCreate={handleCreateShipmentInternal} selectedDriver={selectedDriverForBooking} onRemoveDriver={() => setSelectedDriverForBooking(null)} />}
        {view === 'find-drivers' && <AvailableDriversView drivers={drivers} handleSelectDriver={handleSelectDriver} />}
        {view === 'wallet' && <WalletView paymentMethods={paymentMethods} setShowAddCardModal={setShowAddCardModal} handleRemoveCard={handleRemoveCard} />}
        {view === 'history' && <HistoryView shipments={shipments} setSelectedHistoryItem={setSelectedHistoryItem} />}
        {view === 'profile' && <ProfileView user={user} setShowPasswordModal={setShowPasswordModal} />}
      </main>

      {/* Bottom Navigation - Mobile */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-around py-3 px-2 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-lg bg-white/95 pb-safe md:hidden">
         {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'find-drivers', icon: Truck, label: 'Drivers' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'profile', icon: Settings, label: 'Account' }
         ].map((item) => (
            <button 
               key={item.id}
               type="button"
               onClick={() => setView(item.id as any)}
               className={`flex flex-1 flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${view === item.id ? 'text-brand-primary bg-blue-50/80 scale-105' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
               <item.icon size={22} strokeWidth={view === item.id ? 2.5 : 2} />
               <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </button>
         ))}
      </div>
    </div>
  );
};
