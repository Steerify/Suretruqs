import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MoreHorizontal, Search, Filter, ArrowUpRight, ArrowDownRight, UserCheck, AlertTriangle } from 'lucide-react';
import { ShipmentStatus } from '../../types';
import gsap from 'gsap';

// Mock Data
const CHART_DATA = [
  { name: 'Mon', revenue: 400000, shipments: 12 },
  { name: 'Tue', revenue: 300000, shipments: 19 },
  { name: 'Wed', revenue: 200000, shipments: 15 },
  { name: 'Thu', revenue: 278000, shipments: 22 },
  { name: 'Fri', revenue: 189000, shipments: 18 },
  { name: 'Sat', revenue: 239000, shipments: 25 },
  { name: 'Sun', revenue: 349000, shipments: 30 },
];

const SHIPMENTS = [
  { id: 'SH001', customer: 'Dangote Cement', driver: 'Musa Ibrahim', status: ShipmentStatus.IN_TRANSIT, origin: 'Apapa Port', dest: 'Ibadan', price: '₦120,000' },
  { id: 'SH002', customer: 'Jumia Logistics', driver: 'Pending', status: ShipmentStatus.PENDING, origin: 'Ikeja', dest: 'Lekki Phase 1', price: '₦15,000' },
  { id: 'SH003', customer: 'Shoprite NG', driver: 'Chinedu Okeke', status: ShipmentStatus.DELIVERED, origin: 'Victoria Island', dest: 'Maryland', price: '₦45,000' },
  { id: 'SH004', customer: 'Construction Ltd', driver: 'Sunday Joseph', status: ShipmentStatus.PICKED_UP, origin: 'Epe', dest: 'Ibeju Lekki', price: '₦85,000' },
  { id: 'SH005', customer: 'Private Individual', driver: 'Ahmed Sani', status: ShipmentStatus.CANCELLED, origin: 'Surulere', dest: 'Yaba', price: '₦8,000' },
];

import { useStore } from '../../context/StoreContext';

export const AdminDashboard: React.FC = () => {
  const { logout } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple transition when tab changes
    const ctx = gsap.context(() => {
      gsap.fromTo(".page-content", 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
    const styles = {
      [ShipmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [ShipmentStatus.ASSIGNED]: 'bg-blue-100 text-blue-800',
      [ShipmentStatus.PICKED_UP]: 'bg-indigo-100 text-indigo-800',
      [ShipmentStatus.IN_TRANSIT]: 'bg-purple-100 text-purple-800',
      [ShipmentStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [ShipmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₦2.4M', change: '+12.5%', isPos: true },
          { label: 'Active Shipments', value: '45', change: '+3', isPos: true },
          { label: 'Active Drivers', value: '128', change: '-2', isPos: false },
          { label: 'Avg. Delivery Time', value: '4.2 hrs', change: '-15m', isPos: true },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <div className={`flex items-center text-xs font-semibold ${stat.isPos ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPos ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Revenue Overview</h3>
            <select className="text-sm border-slate-300 rounded-md focus:ring-brand-primary">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Action Needed */}
        <Card>
          <h3 className="font-bold text-slate-800 mb-4">Pending Actions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0">
                <div className="p-2 bg-orange-100 rounded-lg text-brand-orange shrink-0">
                   {i === 0 ? <UserCheck size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {i === 0 ? 'Driver Verification' : 'Shipment Issue'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {i === 0 ? 'New documentation uploaded by Driver #442' : 'Delay reported for Shipment #SH-992'}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2 text-brand-secondary p-0 h-auto hover:bg-transparent">Review &rarr;</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Shipments Table */}
      <Card noPadding>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Shipments</h3>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm"><Filter size={14} className="mr-2" /> Filter</Button>
            <Button variant="secondary" size="sm"><Search size={14} className="mr-2" /> Search</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Route</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Driver</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SHIPMENTS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{row.id}</td>
                  <td className="px-6 py-4">{row.customer}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">From: {row.origin}</span>
                      <span className="text-xs text-slate-500">To: {row.dest}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-6 py-4">{row.driver}</td>
                  <td className="px-6 py-4 font-medium">{row.price}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-brand-primary"><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50" ref={containerRef}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h2>
            <p className="text-slate-500 text-sm">Real-time platform overview</p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold">
                AD
             </div>
          </div>
        </header>

        <div className="page-content">
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab !== 'overview' && (
            <div className="flex items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
               Section Under Construction
            </div>
          )}
        </div>
      </main>
    </div>
  );
};