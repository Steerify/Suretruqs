# Admin-Mediated Driver Assignment Flow

## Overview
The application flow has been updated so that customers no longer communicate directly with drivers. Instead, all driver assignments and communications are managed through an admin/business owner intermediary.

## New Flow

### 1. Customer Requests a Driver
- **Before**: Customer could browse available drivers and directly select one to book
- **After**: Customer creates a shipment request with NO visibility into drivers initially
- **Before Assignment**: 
  - Customers **cannot see** any driver information
  - Customers **cannot browse** or select drivers
  - When creating a shipment, customers click "Request Driver Assignment"
  - The shipment is marked with `driverRequestedAt` timestamp
  - A message confirms: "Our admin team will assign an available driver to your shipment"
  - Customers chat with "Admin Support" for questions

- **During Active Delivery** (ASSIGNED/PICKED_UP/IN_TRANSIT):
  - ✅ Customer can see driver is "En Route"
  - ✅ Customer can **chat directly with driver**
  - ✅ Customer can see **real-time location** on map (Track Live button)
  - ✅ Customer sees "Driver has arrived" notification (when PICKED_UP)
  - ✅ Customer sees estimated arrival time
  - ✅ Customer can track package in real-time
  
- **After Delivery** (DELIVERED/CANCELLED):
  - ❌ Driver info hidden again
  - Chat switches back to "Admin Support"

### 2. Admin Reviews Requests
- Admin logs into the admin dashboard
- Navigates to the "Driver Requests" section in the sidebar
- Views all pending customer requests that need driver assignment
- Can filter between:
  - **Pending Requests**: Shipments waiting for driver assignment
  - **Assigned**: Shipments with drivers already assigned
  - **All Shipments**: Complete view

### 3. Admin Assigns Driver
For each pending request, admin can:
- View shipment details (pickup, dropoff, cargo type, weight, vehicle type)
- See a list of available online drivers
- Select a driver from the dropdown
- Add optional notes/instructions for the driver
- Click "Assign & Notify Driver" to complete the assignment

The system tracks:
- `driverId`: The assigned driver
- `adminAssignedBy`: Which admin made the assignment
- `adminNotes`: Any special instructions
- `status`: Updated to ASSIGNED

### 4. Communication Flow
**Customer ↔ Admin**:
- Customers have a chat interface that connects them to "Admin Support"
- No longer shows driver name - shows "Admin Support" instead
- Customers can ask questions about their shipment

**Admin ↔ Driver**:
- Admin can message drivers about specific shipments
- Admin can coordinate pickup/delivery details
- Admin can provide special instructions
- Driver can ONLY contact customer during active delivery
- Driver can contact Admin via Support View

**Admin ↔ Customer**:
- Admin can message customers to clarify shipment details
- Admin can provide updates on driver assignment
- Admin handles customer support queries

## Updated Components

### New Components
1. **AdminDriverRequests.tsx** - Interface for managing driver assignment requests
   - Shows pending requests
   - Driver selection dropdown
   - Assignment with notes
   - Chat buttons for customer and driver

2. **AdminChatModal.tsx** - Admin chat interface
   - Can chat with either customers or drivers
   - Visual indication of who admin is chatting with
   - Separate conversations per shipment

### Modified Components
1. **types.ts**
   - Added `ADMIN` to `UserRole` enum
   - Added `adminAssignedBy`, `driverRequestedAt`, `adminNotes` to `Shipment` interface

2. **NewShipmentView.tsx**
   - Removed direct driver selection UI
   - Updated button text to "Request Driver Assignment"
   - Added `driverRequestedAt` when creating shipment

3. **DriverChatModal.tsx**
   - Changed from driver chat to admin support chat
   - Shows "Admin Support" instead of driver name
   - Removed `driverName` prop

4. **AdminDashboard.tsx**
   - Integrated AdminDriverRequests component
   - Added admin chat modal
   - New "Driver Requests" tab in navigation
   - Updated Overview to use **REAL** shipment data

5. **Sidebar.tsx**
   - Added "Driver Requests" menu item

6. **StoreContext.tsx**
   - Added `assignDriverToShipment` function
   - Handles driver assignment with admin tracking

7. **CustomerDashboard.tsx**
   - **Removed** `AvailableDriversView` component
   - **Removed** "Find Drivers" navigation button
   - **Removed** driver selection state and functions
   - **Removed** all driver props from DashboardHome

8. **DashboardHome.tsx**
   - **Removed** "Active Drivers" card showing driver list
   - **Removed** driver booking buttons
   - **Replaced** with "Quick Actions" card
   - Added informational message about admin driver assignment
   - Changed driver communication to admin support
   - Added "Track Live" button for realtime map

9. **ActiveJobView.tsx** (Driver)
   - Confirmed as the ONLY place for Customer contact
   - Ensures driver can only chat during active delivery status

## Removed Customer Features

The following features were **completely removed** from the customer interface:

1. ❌ **Browse Available Drivers** - Customers can no longer see a list of drivers
2. ❌ **View Driver Profiles** - No driver information visible to customers
3. ❌ **Direct Driver Selection** - Cannot choose specific drivers
4. ❌ **Driver Ratings Display** - Ratings only visible to admin
5. ❌ **Find Drivers View** - Entire page/view removed
6. ❌ **Driver Chat** - Changed to admin support chat only
7. ❌ **Driver Contact Buttons** - All direct driver contact removed

## Benefits of This Approach

1. **Quality Control**: Admin can verify all requests before driver assignment
2. **Better Matching**: Admin can match the best available driver for each job
3. **Customer Support**: Centralized communication channel for customer questions
4. **Driver Management**: Admin can coordinate multiple drivers efficiently
5. **Accountability**: All assignments are tracked with admin ID and notes
6. **Flexibility**: Admin can add special instructions or handle exceptions

## API Endpoints (Backend Implementation Needed)

The frontend now expects these endpoints:

```
PATCH /api/shipments/:id/assign-driver
Body: {
  driverId: string,
  status: ShipmentStatus,
  adminAssignedBy: string,
  adminNotes?: string
}
```

## User Types

1. **CUSTOMER**: Creates shipment requests, chats with admin
2. **DRIVER**: Receives assignments from admin, delivers shipments
3. **ADMIN**: Manages driver assignments, communicates with both customers and drivers
4. **GUEST**: Not logged in

## Next Steps

To complete the implementation:
1. Backend API endpoint for driver assignment
2. Real-time notifications when admin assigns a driver
3. Driver notification system for new assignments
4. Customer notification when driver is assigned
5. Enhanced admin analytics and reporting
