import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { LayoutDashboard, Truck, Wallet, History, Settings } from 'lucide-react';

import { Shipment, ShipmentStatus } from '../../types';
import { useStore } from '../../context/StoreContext';

// Components
import { CustomerTopBar } from '../dashboard/customer/CustomerTopBar';
import { NotificationPanel } from '../dashboard/customer/NotificationPanel';
import { DashboardHome } from '../dashboard/customer/DashboardHome';
import { NewShipmentView } from '../dashboard/customer/NewShipmentView';
import { HistoryView } from '../dashboard/customer/HistoryView';
import { WalletView } from '../dashboard/customer/WalletView';
import { ProfileView } from '../dashboard/customer/ProfileView';

// Modals
import { DriverChatModal } from '../dashboard/customer/DriverChatModal';
import { RateDriverModal } from '../dashboard/customer/RateDriverModal';
import { ChangePasswordModal } from '../dashboard/customer/ChangePasswordModal';
import { SupportModal } from '../dashboard/common/SupportModal';
import { FullMapModal } from '../dashboard/common/FullMapModal';
import { InsuranceModal } from '../dashboard/customer/InsuranceModal';
import { HistoryDetailsModal } from '../dashboard/customer/HistoryDetailsModal';

// No mock chats

export const CustomerDashboard: React.FC = () => {
  const { currentUser, shipments, drivers, createShipment, rateDriver, logout } = useStore();
  const user = currentUser!; // Assumes routed here only if user exists

  const [view, setView] = useState<'dashboard' | 'new-shipment' | 'history' | 'wallet' | 'profile'>('dashboard');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // No card simulation

  // History View State
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<Shipment | null>(null);

  // Rating State
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingShipment, setRatingShipment] = useState<Shipment | null>(null);

  // Chat State
  const [showDriverChat, setShowDriverChat] = useState(false);

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

  // Removed simulated card handlers

  const handleOpenRateModal = (shipment: Shipment) => {
      setRatingShipment(shipment);
      setShowRateModal(true);
  };



  const handleCreateShipmentInternal = (data: Partial<Shipment>) => {
      createShipment(data);
      setView('dashboard');
      toast.success("Shipment request submitted! Our admin team will assign a driver.");
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
      {showFullMap && <FullMapModal shipmentId={activeShipment?.id} onClose={() => setShowFullMap(false)} />}
      {showInsuranceModal && <InsuranceModal onClose={() => setShowInsuranceModal(false)} />}
      {selectedHistoryItem && <HistoryDetailsModal shipment={selectedHistoryItem} onClose={() => setSelectedHistoryItem(null)} onOpenChat={() => setShowDriverChat(true)} onRate={() => handleOpenRateModal(selectedHistoryItem)} />}
      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showRateModal && <RateDriverModal onClose={() => setShowRateModal(false)} onRate={handleRateDriverInternal} driverName="Driver" trackingId={ratingShipment?.trackingId || ''} />}
      {showDriverChat && activeShipment && (
        <DriverChatModal 
          shipmentId={activeShipment.id}
          shipmentStatus={activeShipment.status}
          driverName={activeShipment.driverId ? drivers.find(d => d.id === activeShipment.driverId)?.name : undefined}
          onClose={() => setShowDriverChat(false)} 
        />
      )}
      
      <CustomerTopBar user={user} view={view} setView={setView} showNotifications={showNotifications} setShowNotifications={setShowNotifications} onLogout={logout} />
      {showNotifications && <NotificationPanel />}

      <main className="p-4 md:p-8 w-full max-w-[1920px] mx-auto pb-20">
        {view === 'dashboard' && <DashboardHome user={user} shipments={shipments} activeShipment={activeShipment} setView={setView} setShowDriverChat={setShowDriverChat} setSelectedHistoryItem={setSelectedHistoryItem} setShowFullMap={setShowFullMap} walletBalance={useStore().walletBalance} />}
        {view === 'new-shipment' && <NewShipmentView onBack={() => setView('dashboard')} onCreate={handleCreateShipmentInternal} />}
        {view === 'wallet' && <WalletView />}
        {view === 'history' && <HistoryView shipments={shipments} setSelectedHistoryItem={setSelectedHistoryItem} />}
        {view === 'profile' && <ProfileView user={user} setShowPasswordModal={setShowPasswordModal} />}
      </main>

      {/* Bottom Navigation - Mobile */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-around py-3 px-2 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-lg bg-white/95 pb-safe md:hidden">
         {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
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
