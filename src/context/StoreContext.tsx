import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../utils/api';
import walletApi from '../utils/walletApi';
import { UserRole, Shipment, User, ShipmentStatus, Driver, ChatMessage, Transaction } from '../types';

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

// Mock Initial Data
const INITIAL_SHIPMENTS: Shipment[] = [
  { 
    id: 'SH-INITIAL-01', 
    trackingId: 'TRK-DEMO-001', 
    customerId: 'CUST-001',
    pickup: { address: 'Apapa Wharf, Terminal B', lat: 0, lng: 0 }, 
    dropoff: { address: 'Trade Fair Complex, Ojo', lat: 0, lng: 0 }, 
    status: ShipmentStatus.PENDING, 
    price: 65000, 
    date: new Date(Date.now() - 86400000).toISOString(),
    cargoType: 'Container (20ft)',
    weight: '20 Tons',
    distance: '18.5 km'
  },
  { 
    id: 'SH-INITIAL-02', 
    trackingId: 'TRK-DEMO-002', 
    customerId: 'CUST-001',
    pickup: { address: 'Ikeja City Mall', lat: 0, lng: 0 }, 
    dropoff: { address: 'Magodo Phase 2', lat: 0, lng: 0 }, 
    status: ShipmentStatus.DELIVERED, 
    price: 22000, 
    date: new Date(Date.now() - 172800000).toISOString(), 
    driverId: 'DRV-001',
    cargoType: 'Electronics',
    weight: '50kg',
    distance: '6.2 km'
  }
];

const INITIAL_CUSTOMERS: User[] = [
  { id: 'CUST-001', name: 'Shoprite NG', role: UserRole.CUSTOMER, email: 'logistics@shoprite.ng', company: 'Shoprite Nigeria', onboarded: true },
  { id: 'CUST-002', name: 'Jumia Warehouse', role: UserRole.CUSTOMER, email: 'inbound@jumia.com', company: 'Jumia Nigeria', onboarded: true },
];

const INITIAL_DRIVERS: Driver[] = [
  { id: 'DRV-002', name: 'Musa Ibrahim', vehicleType: 'Flatbed Truck', plateNumber: 'KANO-882', rating: 4.8, isOnline: true, location: 'Apapa, Lagos', trips: 142, avatarColor: 'bg-blue-100 text-blue-600' },
  { id: 'DRV-003', name: 'Chinedu Okeke', vehicleType: 'Box Truck', plateNumber: 'LAG-551', rating: 4.9, isOnline: true, location: 'Ikeja, Lagos', trips: 89, avatarColor: 'bg-green-100 text-green-600' },
  { id: 'DRV-004', name: 'Sunday Joseph', vehicleType: 'Mini Van', plateNumber: 'ABJ-112', rating: 4.5, isOnline: false, location: 'Yaba, Lagos', trips: 34, avatarColor: 'bg-orange-100 text-orange-600' },
  { id: 'DRV-005', name: 'Emmanuel Taiwo', vehicleType: 'Box Truck', plateNumber: 'OG-221', rating: 4.7, isOnline: true, location: 'Lekki, Lagos', trips: 210, avatarColor: 'bg-purple-100 text-purple-600' },
];

interface StoreContextType {
  currentUser: User | null;
  shipments: Shipment[];
  drivers: Driver[];
  customers: User[];
  incomingJob: Shipment | null;
  messages: Record<string, ChatMessage[]>;
  isTyping: Record<string, boolean>; // shipmentId -> boolean
  walletBalance: number;
  transactions: Transaction[];

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  completeOnboarding: (onboardingData: any) => Promise<void>;
  createShipment: (newShipmentData: Partial<Shipment>) => void;
  acceptJob: (shipmentId: string) => void;
  updateStatus: (shipmentId: string, newStatus: ShipmentStatus) => void;
  rateDriver: (shipmentId: string, rating: number, review: string) => void;
  dismissJobAlert: () => void;
  setIncomingJob: (job: Shipment | null) => void;
  sendMessage: (shipmentId: string, text: string) => void;
  fetchWalletData: () => Promise<void>;
  topUpWallet: (amount: number) => Promise<any>;
  verifyWalletDeposit: (reference: string, amount: number) => Promise<any>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [customers] = useState<User[]>(INITIAL_CUSTOMERS);
  const [incomingJob, setIncomingJob] = useState<Shipment | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize Auth & Socket
  useEffect(() => {
    const initData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userRes = await api.get('/auth/me');
          setCurrentUser(userRes.data);
          
          // Fetch shipments for user
          const shipmentFilter = userRes.data.role === UserRole.DRIVER 
            ? `?driver_id=${userRes.data.id}` 
            : `?customer_id=${userRes.data.id}`;
          const shipmentsRes = await api.get(`/shipments${shipmentFilter}`);
          setShipments(shipmentsRes.data);

          // Fetch available drivers (if customer)
          if (userRes.data.role === UserRole.CUSTOMER) {
            const driversRes = await api.get('/users/drivers');
            setDrivers(driversRes.data);
          }

          // Fetch Wallet Data
          await fetchWalletData();
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('new_message', (data: any) => {
      setMessages(prev => ({
        ...prev,
        [data.shipmentId]: [...(prev[data.shipmentId] || []), {
          id: Date.now().toString(),
          senderId: data.senderId,
          shipmentId: data.shipmentId,
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: data.senderId === currentUser?.id
        }]
      }));
    });

    newSocket.on('user_typing', (data: any) => {
      setIsTyping(prev => ({ ...prev, [data.shipmentId]: data.isTyping }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?.id]);

  // Join rooms for active shipments
  useEffect(() => {
    if (socket && currentUser) {
      shipments.forEach(s => {
        if (s.id && (s.customerId === currentUser.id || s.driverId === currentUser.id)) {
          socket.emit('join_shipment_chat', s.id);
        }
      });
    }
  }, [socket, shipments, currentUser?.id]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const completeOnboarding = async (onboardingData: any) => {
    try {
      const response = await api.post('/users/onboard', onboardingData);
      
      if (currentUser) {
        setCurrentUser({ 
          ...currentUser, 
          ...response.data.user,
          onboarded: true
        });
      }
    } catch (error) {
      console.error('Onboarding Error:', error);
      throw error;
    }
  };

  const createShipment = async (newShipmentData: Partial<Shipment>) => {
    if (!currentUser) return;
    try {
      const response = await api.post('/shipments', newShipmentData);
      setShipments(prev => [response.data, ...prev]);
    } catch (error: any) {
      console.error('Create Shipment Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create shipment');
    }
  };

  const acceptJob = async (shipmentId: string) => {
    if (!currentUser || currentUser.role !== UserRole.DRIVER) return;
    try {
      const response = await api.patch(`/shipments/${shipmentId}/status`, { status: ShipmentStatus.ASSIGNED });
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? response.data : s
      ));
      setIncomingJob(null);
    } catch (error: any) {
      console.error('Accept Job Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to accept job');
    }
  };

  const updateStatus = async (shipmentId: string, newStatus: ShipmentStatus) => {
    try {
      const response = await api.patch(`/shipments/${shipmentId}/status`, { status: newStatus });
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? response.data : s
      ));
    } catch (error: any) {
      console.error('Update Status Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const rateDriver = async (shipmentId: string, rating: number, review: string) => {
    try {
      await api.post(`/shipments/${shipmentId}/rate`, { rating, reviewText: review });
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? { ...s, rating, review } : s
      ));
    } catch (error: any) {
      console.error('Rate Driver Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to rate driver');
    }
  };

  const dismissJobAlert = () => {
    setIncomingJob(null);
  };

  const sendMessage = (shipmentId: string, text: string) => {
    if (!currentUser || !socket) return;

    const messageData = {
      shipmentId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text
    };

    // Emit to server
    socket.emit('send_message', messageData);
  };

  const fetchWalletData = async () => {
    try {
      const balanceRes = await walletApi.get('/wallet/');
      setWalletBalance(balanceRes.data.balance || 0);

      const historyRes = await walletApi.get('/wallet/history/');
      setTransactions(historyRes.data);
    } catch (error) {
      console.error('Wallet Fetch Error:', error);
      // Fallback to suretruqs backend if safewallet fails
      try {
        const balanceRes = await api.get('/wallet/balance');
        setWalletBalance(balanceRes.data.balance || 0);
        const historyRes = await api.get('/wallet/history');
        setTransactions(historyRes.data);
      } catch (err) {
        console.error('SureTruqs Wallet Fetch Error:', err);
      }
    }
  };

  const topUpWallet = async (amount: number) => {
    try {
      const response = await walletApi.post('/wallet/deposit/initiate/', { amount });
      return response.data; // reference, authorization_url, etc.
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Deposit initiation failed');
    }
  };

  const verifyWalletDeposit = async (reference: string, amount: number) => {
    try {
      // 1. Verify in SafeWallet
      const safeWalletRes = await walletApi.get(`/wallet/deposit/verify/?reference=${reference}`);
      
      // 2. Log in SureTruqs Backend (As requested: saved in both)
      await api.post('/wallet/transaction', {
        type: 'CREDIT',
        amount: amount,
        description: 'Wallet Top-up (Paystack)',
        reference: reference
      });

      await fetchWalletData();
      return safeWalletRes.data;
    } catch (error: any) {
      console.error('Verification Error:', error);
      throw new Error('Payment verification failed');
    }
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      shipments,
      drivers,
      customers,
      incomingJob,
      messages,
      isTyping,
      walletBalance,
      transactions,
      login,
      signup,
      logout,
      completeOnboarding,
      createShipment,
      acceptJob,
      updateStatus,
      rateDriver,
      dismissJobAlert,
      setIncomingJob,
      sendMessage,
      fetchWalletData,
      topUpWallet,
      verifyWalletDeposit
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
