import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { UserRole, Shipment, User, ShipmentStatus, Driver, ChatMessage, Transaction } from '../types';

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

// Initial State removed to ensure all data is live from backend.

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
  shipmentLocations: Record<string, { lat: number, lng: number }>;
  adminNotifications: any[];
  hasTransactionPin: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
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
  withdrawFunds: (data: any) => Promise<void>;
  setTransactionPin: (pin: string) => Promise<void>;
  assignDriverToShipment: (shipmentId: string, driverId: string, adminId: string, notes?: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [incomingJob, setIncomingJob] = useState<Shipment | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shipmentLocations, setShipmentLocations] = useState<Record<string, { lat: number, lng: number }>>({});
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [hasTransactionPin, setHasTransactionPin] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize Auth & Socket
  useEffect(() => {
    const initData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userRes = await api.get('/auth/me');
          setCurrentUser(userRes.data);
          setHasTransactionPin(!!userRes.data.transactionPin);
          
          // Fetch shipments for user
          let shipmentFilter = '';
          if (userRes.data.role === UserRole.DRIVER) {
            shipmentFilter = `?driver_id=${userRes.data.id || userRes.data._id}`;
          } else if (userRes.data.role === UserRole.CUSTOMER) {
            shipmentFilter = `?customer_id=${userRes.data.id || userRes.data._id}`;
          }
          
          const shipmentsRes = await api.get(`/shipments${shipmentFilter}`);
          setShipments(shipmentsRes.data);

          // Fetch available drivers (if customer or admin)
          if (userRes.data.role === UserRole.CUSTOMER || userRes.data.role === UserRole.ADMIN) {
            const driversRes = await api.get('/users/drivers');
            setDrivers(driversRes.data);
          }

          // Fetch customers (if admin)
          if (userRes.data.role === UserRole.ADMIN) {
             const customersRes = await api.get('/users'); // Assuming this returns all users or customers
             setCustomers(customersRes.data.filter((u: User) => u.role === UserRole.CUSTOMER));
          }

          // Fetch Wallet Data
          await fetchWalletData();
        } catch (error) {
          console.error("Initialization error:", error);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(SOCKET_URL, {
      auth: { token }
    });
    setSocket(newSocket);

    newSocket.on('new_message', (data: any) => {
      setMessages(prev => ({
        ...prev,
        [data.shipmentId]: [...(prev[data.shipmentId] || []), {
          id: data.id || Date.now().toString(),
          senderId: data.senderId,
          shipmentId: data.shipmentId,
          text: data.text,
          timestamp: new Date(data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: data.senderId === (currentUser?.id || (currentUser as any)?._id)
        }]
      }));
    });

    newSocket.on('user_typing', (data: any) => {
      setIsTyping(prev => ({ ...prev, [data.shipmentId]: data.isTyping }));
    });

    newSocket.on('location_updated', (data: any) => {
      setShipmentLocations(prev => ({
        ...prev,
        [data.shipmentId]: { lat: data.lat, lng: data.lng }
      }));
    });

    newSocket.on('global_location_updated', (data: any) => {
      setShipmentLocations(prev => ({
        ...prev,
        [data.shipmentId]: { lat: data.lat, lng: data.lng }
      }));
    });

    newSocket.on('wallet_updated', (data: any) => {
        setWalletBalance(data.balance);
        fetchWalletData(); // Refresh transaction history
        toast.success("Wallet updated!");
    });

    newSocket.on('admin_notification', (data: any) => {
        setAdminNotifications(prev => [data, ...prev].slice(0, 50));
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border border-brand-orange/20`}>
              <div className="flex-1 w-0 p-5">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="bg-brand-orange/10 p-2 rounded-xl text-brand-orange uppercase text-[10px] font-black tracking-widest">ADMIN</div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-black text-slate-900">{data.title}</p>
                    <p className="mt-1 text-sm text-slate-500 font-medium">{data.message}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-slate-100 p-2 items-center">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-xl p-2 flex items-center justify-center text-xs font-black text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
        ), { duration: 5000 });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser?.id]);

  // Fetch historical messages for shipments (Optimized: Single API Call)
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentUser || shipments.length === 0) return;
      
      try {
        const res = await api.get('/chat/history/all');
        const chatData: Record<string, ChatMessage[]> = {};
        
        res.data.forEach((m: any) => {
            const sId = m.shipmentId;
            if (!chatData[sId]) chatData[sId] = [];
            
            chatData[sId].unshift({
                id: m._id,
                senderId: m.senderId._id || m.senderId,
                shipmentId: m.shipmentId,
                text: m.text,
                timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: (m.senderId._id || m.senderId) === (currentUser.id || (currentUser as any)._id)
            });
        });

        setMessages(chatData);
      } catch (err) {
        console.error("Error fetching bulk chat history:", err);
      }
    };
    fetchChatHistory();
  }, [shipments.length, currentUser?.id]);

  // Join rooms for active shipments
  useEffect(() => {
    if (socket && currentUser) {
      shipments.forEach(s => {
        if (s.id && (s.customerId === (currentUser.id || (currentUser as any)._id) || s.driverId === (currentUser.id || (currentUser as any)._id))) {
          socket.emit('join_shipment_chat', s.id);
        }
      });

      if (currentUser.role === UserRole.ADMIN) {
        socket.emit('join_admin_tracking');
      }
    }
  }, [socket, shipments, currentUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      setCurrentUser(response.data.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
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

  const forgotPassword = async (email: string) => {
    try {
        await api.post('/auth/forgot-password', { email });
        toast.success("OTP sent to your email!");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const resetPassword = async (data: any) => {
    try {
        await api.post('/auth/reset-password', data);
        toast.success("Password reset successful!");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
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
      senderId: currentUser.id || (currentUser as any)._id,
      senderName: currentUser.name,
      text
    };

    // Emit to server - the server will now persist and broadcast it
    socket.emit('send_message', messageData);
  };

  const fetchWalletData = async () => {
    try {
      const balanceRes = await api.get('/wallet/balance');
      setWalletBalance(balanceRes.data.balance || 0);
      const historyRes = await api.get('/wallet/history');
      setTransactions(historyRes.data);
    } catch (err) {
      console.error('Wallet Fetch Error:', err);
    }
  };

  const topUpWallet = async (amount: number) => {
    try {
      const response = await api.post('/wallet/deposit/initiate', { amount });
      return response.data; // reference, amount
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Deposit initiation failed');
    }
  };

  const verifyWalletDeposit = async (reference: string) => {
    try {
      const response = await api.get(`/wallet/deposit/verify?reference=${reference}`);
      await fetchWalletData(); // Refresh UI
      return response.data;
    } catch (error: any) {
      console.error('Wallet Verification Error:', error);
      throw error;
    }
  };

  const withdrawFunds = async (data: any) => {
    try {
        const response = await api.post('/wallet/withdraw', data);
        setWalletBalance(response.data.balance);
        await fetchWalletData();
        toast.success("Withdrawal successful!");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  const setTransactionPin = async (pin: string) => {
    try {
        await api.post('/wallet/pin/set', { pin });
        setHasTransactionPin(true);
        toast.success("Transaction PIN set successfully!");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to set PIN');
    }
  };

  const assignDriverToShipment = async (shipmentId: string, driverId: string, adminId: string, notes?: string) => {
    try {
      const updateData = {
        driverId,
        status: ShipmentStatus.ASSIGNED,
        adminAssignedBy: adminId,
        adminNotes: notes
      };
      
      const response = await api.patch(`/shipments/${shipmentId}/assign-driver`, updateData);
      
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? response.data : s
      ));
    } catch (error: any) {
      console.error('Assign Driver Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to assign driver');
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
      shipmentLocations,
      adminNotifications,
      hasTransactionPin,
      login,
      signup,
      logout,
      forgotPassword,
      resetPassword,
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
      verifyWalletDeposit,
      withdrawFunds,
      setTransactionPin,
      assignDriverToShipment
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
