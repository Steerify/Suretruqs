# Suretruqs Real-Time Logistics Tracking: System Architecture & Implementation Plan

This document outlines the architecture for a cost-optimized, high-performance real-time tracking system for Suretruqs using Mapbox GL JS and WebSockets.

---

## 1. System Architecture Overview

The system is designed to minimize Mapbox API costs while providing a premium, fluid experience for Drivers, Clients, and Admins.

### High-Level Flow
1.  **Drivers** report Geolocation every 3-5 seconds via WebSockets.
2.  **Backend** validates coordinates, updates the live location cache (Redis), and checks if rerouting is needed.
3.  **Clients/Admins** receive location updates via WebSocket rooms and update markers in real-time without reloading the map.
4.  **Routing** is handled exclusively by the backend, cached, and broadcasted to clients to avoid redundant Directions API calls.

---

## 2. Backend Routing & Caching Flow

To save costs, Mapbox Directions API calls are strictly controlled and cached.

### 🔄 The Logic Loop
1.  **Request**: Frontend requests a route: `GET /api/routes/:shipmentId`.
2.  **Cache Check**: Backend checks Redis for `route:{shipmentId}`.
3.  **API Call (Conditional)**: 
    - If cache exists, return it.
    - If no cache, call Mapbox Directions API with `traffic=true`.
4.  **Persistence**: Store the GeoJSON in Redis with a TTL (e.g., 1 hour or shipment duration).
5.  **Broadcast**: Emit the route to the WebSocket room associated with the shipment.

### 🛣️ Smart Re-routing Trigger
Rerouting is triggered ONLY when:
-   **Deviation**: `turf.js` calculates the distance between the driver's current point and the cached route line. If `distance > 100m`, trigger a recalculation.
-   **Destination Change**: If the admin or client updates the drop-off point.
-   **Manual Refresh**: Admin manually requests a traffic update (throttled).

---

## 3. Frontend Mapbox Integration Strategy

### 🏗️ Map Initialization (The Singleton Pattern)
To avoid excessive "Map Loads" (Mapbox billing unit), we initialize the map **once** per app session.
-   Use a `MapContext` to store the `mapboxgl.Map` instance.
-   Components use `map.setLayoutProperty('layer-id', 'visibility', 'visible/none')` to toggle views instead of remounting.

### 📍 Marker Management
-   **Clusters**: For the Admin view, use Mapbox Source clustering:
    ```javascript
    map.addSource('drivers', {
      type: 'geojson',
      data: driverGeoJson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
    ```
-   **Smooth Movement**: Use `marker.setLngLat()` with a basic interpolation helper to move markers between WebSocket pings, ensuring 60fps movement even with 5s updates.

---

## 4. Cost-Saving Decisions Explained

| Feature | Decision | Cost Impact |
| :--- | :--- | :--- |
| **Map Loads** | Singleton Map Instance | **Significant Reduction**: Users can navigate between dashboard views without triggering new "Map Load" charges. |
| **Directions API** | Backend Caching via Redis | **Massive Savings**: Multiple users tracking the same shipment trigger exactly **one** API call instead of $N$. |
| **ETA Updates** | Interpolated Logic | **Zero Cost**: Calculate progress locally between points instead of calling the Matrix API for every ping. |
| **Voice Nav** | Web Speech API | **Zero Cost**: Avoids expensive external Text-to-Speech (TTS) services. |
| **Data Storage** | Hot Data in Redis | **Performance**: Extremely fast WebSocket broadcasts without hitting the main DB for every ping. |

---

## 5. Implementation Pseudocode

### Backend: Route Cache & Reroute Logic (Node.js)
```typescript
async function getRoute(shipmentId, start, end) {
  const cacheKey = `route:${shipmentId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) return JSON.parse(cached);

  const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start};${end}`, {
    params: { access_token: MAPBOX_KEY, geometries: 'geojson', overview: 'full' }
  });

  const routeGeoJson = response.data.routes[0].geometry;
  await redis.setex(cacheKey, 3600, JSON.stringify(routeGeoJson));
  
  return routeGeoJson;
}

// WebSocket: On Location Update
socket.on('location_update', async (data) => {
  const { shipmentId, coords } = data;
  await redis.hset('live_locations', shipmentId, JSON.stringify(coords));
  
  // Calculate deviation using Turf.js
  const route = await redis.get(`route:${shipmentId}`);
  const distance = turf.pointToLineDistance(turf.point(coords), turf.lineString(route.coordinates));
  
  if (distance > 0.1) { // 100 meters
     await triggerReroute(shipmentId, coords, destination);
  }
  
  io.to(`shipment_${shipmentId}`).emit('position_update', coords);
});
```

### Frontend: Smooth Marker Interpolation
```javascript
let currentPos = [lng, lat];
let targetPos = [newLng, newLat];
let startTime = performance.now();
const DURATION = 3000; // Match WebSocket interval

function animate() {
  const elapsed = performance.now() - startTime;
  const t = Math.min(elapsed / DURATION, 1);
  
  const interpolated = [
    currentPos[0] + (targetPos[0] - currentPos[0]) * t,
    currentPos[1] + (targetPos[1] - currentPos[1]) * t
  ];
  
  marker.setLngLat(interpolated);
  
  if (t < 1) requestAnimationFrame(animate);
}
```

---

## 6. Real-World Scalability

-   **Horizontal Scaling**: Use Redis Pub/Sub for WebSockets to sync updates across multiple server instances.
-   **Throttling**: Drivers report every 3-5s. If the network is congested, the server discards intermediate updates to prioritize the latest "head" position.
-   **Security**: Mapbox tokens are restricted to the Suretruqs domain. Backend calls use a secret "private" token to prevent unauthorized billing.
