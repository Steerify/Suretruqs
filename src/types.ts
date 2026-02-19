
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum ShipmentStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  SCHEDULED = 'SCHEDULED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  ISSUE_REPORTED = 'ISSUE_REPORTED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  phone?: string;
  company?: string;
  registrationNumber?: string;
  address?: string;
  onboarded?: boolean;
  stats?: {
    bookingsCount: number;
    totalSpent: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  plateNumber: string;
  rating: number;
  availabilityStatus: 'ONLINE' | 'OFFLINE' | 'BUSY';
  location: string;
  trips: number;
  avatarColor: string;
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Shipment {
  id: string;
  trackingId: string;
  customerId: string; // Link to customer
  pickup: Location;
  dropoff: Location;
  status: ShipmentStatus;
  date: string;
  driverId?: string;
  vehicleType?: string;
  weight?: string;
  cargoType?: string;
  distance?: string;
  cargoImage?: string; // New field for cargo image
  instructions?: {
    customerNotes?: string;
    fragile?: boolean;
    priority?: 'LOW' | 'NORMAL' | 'HIGH';
  };
  rating?: number;
  review?: string;
  adminAssignedBy?: string; // Admin who assigned the driver
  adminNotes?: string; // Admin notes about the assignment
  assignedAt?: string;
  assignmentStatus?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  etaMinutes?: number;
  etaUpdatedAt?: string;
}

export interface DriverStats {
  completedJobs: number;
  rating: number;
  availabilityStatus: 'ONLINE' | 'OFFLINE' | 'BUSY';
  vehiclePlate?: string;
  vehicleModel?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  shipmentId: string;
  text: string;
  timestamp: string;
  isMe: boolean; // Helper for UI
}
export interface Notification {
  _id: string;
  userId: string;
  type: 'info' | 'success' | 'alert';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SavedLocation {
  _id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  isDefaultPickup?: boolean;
  isDefaultDropoff?: boolean;
}
