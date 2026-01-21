# SureTruqs - Logistics Management Platform

SureTruqs is a modern, responsive web application designed to streamline logistics operations. It connects customers, drivers, and administrators in a unified ecosystem for managing shipments, tracking delivers, and handling payments.

## 🚀 Key Features

*   **Role-Based Dashboards**: tailored experiences for Customers, Drivers, and Administrators.
*   **Real-time Tracking**: Monitor shipment status from pickup to delivery.
*   **Driver Management**: Verified driver profiles, vehicle details, and document management.
*   **Shipment Creation**: Easy booking flow for new deliveries.
*   **Wallet System**: Integrated earnings and payment management.
*   **Responsive Design**: Built with a "mobile-first" approach using Tailwind CSS.
*   **Premium UI**: Glassmorphism effects, smooth animations (GSAP), and polished components.

## 🛠️ Technology Stack

*   **Frontend Framework**: React (with TypeScript)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS, Vanilla CSS (for custom animations)
*   **Icons**: Lucide React
*   **Animations**: GSAP (GreenSock Animation Platform)
*   **Routing**: React Router DOM
*   **State Management**: React Context API (`StoreContext`)
*   **Charts**: Recharts

## 📂 Project Structure

```
suretruqs/
├── public/              # Static assets and scripts
│   └── scripts/         # External configurations (e.g., Tailwind config)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── dashboard/   # Dashboard-specific components (Customer, Driver, Common)
│   │   ├── layout/      # Layout components (Sidebar, Topbars)
│   │   ├── ui/          # Generic UI elements (Buttons, Cards, Inputs)
│   │   └── views/       # Main page views (Dashboards, Landing, Auth)
│   ├── context/         # Global state management (StoreContext)
│   ├── types.ts         # TypeScript definitions
│   ├── App.tsx          # Main application component & Routing
│   ├── index.css        # Global styles & custom animations
│   └── index.tsx        # Application entry point
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## ⚡ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd suretruqs
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🎨 Customization

*   **Tailwind Config**: The Tailwind configuration is located in `public/scripts/tailwind-config.js`. You can customize colors, fonts, and theme extensions there.
*   **Global Styles**: Custom CSS animations and utilities are defined in `src/index.css`.

## 🤝 Contributing

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
