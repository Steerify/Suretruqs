import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { UserRole, Shipment, User, ShipmentStatus, Driver, ChatMessage, Notification } from '../types';

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

// Initial State removed to ensure all data is live from backend.

interface StoreContextType {
  currentUser: User | null;
  isInitializing: boolean;
  shipments: Shipment[];
  drivers: Driver[];
  customers: User[];
  allUsers: User[];
  incomingJob: Shipment | null;
  messages: Record<string, ChatMessage[]>;
  isTyping: Record<string, boolean>; // shipmentId -> boolean
  shipmentLocations: Record<string, { lat: number, lng: number }>;
  adminNotifications: any[];
  notifications: Notification[];
  savedLocations: any[];

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  googleLogin: (token: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  completeOnboarding: (onboardingData: any) => Promise<void>;
  createShipment: (newShipmentData: Partial<Shipment>) => Promise<Shipment>;
  updateShipment: (id: string, data: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
  acceptJob: (shipmentId: string) => Promise<void>;
  rejectJob: (shipmentId: string) => Promise<void>;
  updateStatus: (shipmentId: string, newStatus: ShipmentStatus, meta?: { deliveryCode?: string; proofUrl?: string }) => Promise<void>;
  reportIssue: (shipmentId: string, reason: string, notes?: string) => Promise<void>;
  updateDriverProfile: (data: any) => Promise<void>;
  rateDriver: (shipmentId: string, rating: number, review: string) => Promise<void>;
  dismissJobAlert: () => void;
  setIncomingJob: (job: Shipment | null) => void;
  sendMessage: (shipmentId: string, text: string) => void;
  assignDriverToShipment: (shipmentId: string, driverId: string, adminId: string, notes?: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  getSettings: () => Promise<any>;
  updateSettings: (settings: any) => Promise<any>;
  refreshData: () => Promise<void>;
  fetchSavedLocations: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [incomingJob, setIncomingJob] = useState<Shipment | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [shipmentLocations, setShipmentLocations] = useState<Record<string, { lat: number, lng: number }>>({});
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [savedLocations, setSavedLocations] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchAllUserData = async () => {
    const token = localStorage.getItem('token');
    
    // If no token exists at all, just stop initializing and stay on current page (App.tsx handles routing)
    if (!token || token === 'undefined') {
      setIsInitializing(false);
      setCurrentUser(null);
      return;
    }

    try {
      // Step 1: Validate session identity
      const userRes = await api.get('/auth/me');
      const userData = userRes.data?.data || userRes.data;
      
      if (!userData || (!userData.id && !userData._id)) {
        throw new Error("Payload mismatch: No user identity found");
      }
      
      setCurrentUser(userData);
      
      // Step 2: Fetch non-critical dashboard data (Wrapped in safety block)
      try {
        const userId = userData.id || userData._id;
        let shipmentFilter = '';
        if (userData.role === UserRole.DRIVER) {
          shipmentFilter = `?driver_id=${userId}`;
        } else if (userData.role === UserRole.CUSTOMER) {
          shipmentFilter = `?customer_id=${userId}`;
        }
        
        // Execute fetches in parallel for speed
        const [shipmentsRes, driversRes] = await Promise.all([
           api.get(`/shipments${shipmentFilter}`).catch(() => ({ data: [] })),
           (userData.role === UserRole.CUSTOMER || userData.role === UserRole.ADMIN) 
              ? api.get('/users/drivers').catch(() => ({ data: [] }))
              : Promise.resolve({ data: [] })
        ]);

        const shipmentsData = (shipmentsRes as any).data?.data || (shipmentsRes as any).data;
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : []);

        const driversData = (driversRes as any).data?.data || (driversRes as any).data;
        setDrivers(Array.isArray(driversData) ? driversData : []);

        if (userData.role === UserRole.ADMIN) {
           const usersRes = await api.get('/users').catch(() => ({ data: [] })); 
           const usersData = usersRes.data?.data || usersRes.data;
           const finalUsers = Array.isArray(usersData) ? usersData : [];
           setAllUsers(finalUsers);
           setCustomers(finalUsers.filter((u: User) => u.role === UserRole.CUSTOMER));
        }

        fetchNotifications().catch(() => {});
        fetchSavedLocations().catch(() => {});
      } catch (secondaryError) {
        console.warn("Supplementary data failed to sync, but session is valid.");
      }
    } catch (error: any) {
      console.error("Session integrity check failed:", error.message);
      // Only clear if we are SURE the token is bad
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setCurrentUser(null);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Initialize Auth
  useEffect(() => {
    fetchAllUserData();
  }, []);

  // Initialize Socket when user is available
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token || !currentUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      timeout: 20000
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

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

    newSocket.on('new_notification', (data: any) => {
        setNotifications(prev => [data, ...prev].slice(0, 20));
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border border-slate-100`}>
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className={`p-2 rounded-full ${
                        data.type === 'info' ? 'bg-blue-100 text-brand-primary' :
                        data.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                    }`}>
                        {data.title.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-slate-900">{data.title}</p>
                    <p className="mt-1 text-xs text-slate-500 font-medium">{data.message}</p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-slate-100">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-xs font-bold text-brand-primary hover:text-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
        ), { duration: 4000 });
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
  }, [currentUser]);

  // Fetch historical messages for shipments (Optimized: Single API Call)
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentUser || shipments.length === 0) return;
      
      try {
        const res = await api.get('/chat/history/all');
        const chatData: Record<string, ChatMessage[]> = {};
        
        // Handle wrapped/unwrapped data
        const messagesArray = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        if (Array.isArray(messagesArray)) {
          messagesArray.forEach((m: any) => {
              const sId = m.shipmentId;
              if (!chatData[sId]) chatData[sId] = [];
              
              chatData[sId].unshift({
                  id: m._id,
                  senderId: m.senderId._id || m.senderId,
                  senderName: m.senderId.name || 'User',
                  shipmentId: m.shipmentId,
                  text: m.text,
                  timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isMe: (m.senderId._id || m.senderId) === (currentUser.id || (currentUser as any)._id)
              });
          });
        }

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
      const data = response.data?.data || response.data;
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user); // Set immediately
      await fetchAllUserData();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data?.data || response.data;
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user); // Set immediately for instant redirect
      await fetchAllUserData(); // Refresh all data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const googleLogin = async (token: string, role?: UserRole) => {
    try {
        const response = await api.post('/auth/google', { token, role });
        const data = response.data?.data || response.data;
        localStorage.setItem('token', data.token);
        setCurrentUser(data.user);
        await fetchAllUserData();
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Google Auth failed');
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

  const changePassword = async (data: any) => {
    try {
        await api.post('/auth/change-password', data);
        toast.success("Password updated successfully!");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update password');
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
    if (!currentUser) throw new Error('Not authenticated');
    try {
      const response = await api.post('/shipments', newShipmentData);
      const created = response.data?.data || response.data;
      setShipments(prev => [created, ...prev]);
      return created as Shipment;
    } catch (error: any) {
      console.error('Create Shipment Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create shipment');
    }
  };

  const updateShipment = async (id: string, data: Partial<Shipment>) => {
    try {
      const res = await api.patch(`/shipments/${id}`, data);
      const updated = res.data?.data || res.data;
      setShipments(prev => prev.map(s => s.id === id ? updated : s));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update shipment');
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      await api.delete(`/shipments/${id}`);
      setShipments(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete shipment');
    }
  };

  const acceptJob = async (shipmentId: string) => {
    if (!currentUser || currentUser.role !== UserRole.DRIVER) return;
    try {
      const response = await api.post(`/shipments/${shipmentId}/driver-response`, { action: 'ACCEPT' });
      const updated = response.data?.data || response.data;
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? updated : s
      ));
      setIncomingJob(null);
    } catch (error: any) {
      console.error('Accept Job Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to accept job');
    }
  };

  const rejectJob = async (shipmentId: string) => {
    if (!currentUser || currentUser.role !== UserRole.DRIVER) return;
    try {
      const response = await api.post(`/shipments/${shipmentId}/driver-response`, { action: 'REJECT' });
      const updated = response.data?.data || response.data;
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? updated : s
      ));
      setIncomingJob(null);
    } catch (error: any) {
      console.error('Reject Job Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reject job');
    }
  };

  const updateStatus = async (shipmentId: string, newStatus: ShipmentStatus, meta?: { deliveryCode?: string; proofUrl?: string }) => {
    try {
      const response = await api.patch(`/shipments/${shipmentId}/status`, { status: newStatus, ...meta });
      const updated = response.data?.data || response.data;
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? updated : s
      ));
    } catch (error: any) {
      console.error('Update Status Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const reportIssue = async (shipmentId: string, reason: string, notes?: string) => {
    try {
      const response = await api.post(`/shipments/${shipmentId}/report-issue`, { reason, notes });
      const updated = response.data?.data || response.data;
      setShipments(prev => prev.map(s => 
        s.id === shipmentId ? updated : s
      ));
    } catch (error: any) {
      console.error('Report Issue Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to report issue');
    }
  };

  const updateDriverProfile = async (data: any) => {
    try {
        const response = await api.patch('/drivers/status', data);
        if (currentUser && currentUser.role === UserRole.DRIVER) {
            setCurrentUser({
                ...currentUser,
                driverStats: {
                    ...currentUser.driverStats,
                    ...response.data
                }
            });
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
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
        s.id === shipmentId ? (response.data?.data || response.data) : s
      ));
    } catch (error: any) {
      console.error('Assign Driver Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to assign driver');
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const notificationsDataRaw = res.data?.data || res.data;
      setNotifications(Array.isArray(notificationsDataRaw) ? notificationsDataRaw : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const fetchSavedLocations = async () => {
    try {
      const res = await api.get('/saved-locations');
      const data = res.data?.data || res.data;
      setSavedLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching saved locations:', err);
    }
  };

  return (
    <StoreContext.Provider value={{
      currentUser,
      isInitializing,
      shipments,
      drivers,
      customers,
      allUsers,
      incomingJob,
      messages,
      isTyping,
      shipmentLocations,
      adminNotifications,
      notifications,
      savedLocations,
      login,
      signup,
      googleLogin,
      logout,
      forgotPassword,
      resetPassword,
      changePassword,
      completeOnboarding,
      createShipment,
      updateShipment,
      deleteShipment,
      acceptJob,
      rejectJob,
      updateStatus,
      reportIssue,
      updateDriverProfile,
      rateDriver,
      dismissJobAlert,
      setIncomingJob,
      sendMessage,
      assignDriverToShipment,
      fetchNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      getSettings: async () => {
          const res = await api.get('/admin/settings');
          return res.data?.data || res.data;
      },
      updateSettings: (settings: any) => {
          return api.put('/admin/settings', settings).then(res => {
              toast.success("System settings updated successfully");
              return res.data;
          });
      },
      fetchSavedLocations,
      refreshData: fetchAllUserData
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
