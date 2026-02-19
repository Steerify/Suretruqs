import React from 'react';
import { Info, CheckCircle2, AlertCircle, Bell } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { formatDistanceToNow } from 'date-fns';

export const NotificationPanel = () => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();

    return (
        <div className="absolute top-20 right-4 md:right-20 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-[fadeIn_0.2s_ease-out]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-bold text-brand-primary hover:underline"
                >
                    Mark all as read
                </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notif) => (
                            <div 
                                key={notif._id} 
                                onClick={() => markNotificationAsRead(notif._id)}
                                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    notif.type === 'info' ? 'bg-blue-100 text-brand-primary' :
                                    notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                    'bg-red-100 text-red-600'
                                }`}>
                                    {notif.type === 'info' && <Info size={16} />}
                                    {notif.type === 'success' && <CheckCircle2 size={16} />}
                                    {notif.type === 'alert' && <AlertCircle size={16} />}
                                </div>
                                <div>
                                    <h4 className={`text-sm font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-2">
                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                {!notif.read && <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0"></div>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No new notifications</p>
                    </div>
                )}
            </div>
            <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                <button className="text-xs font-bold text-slate-500 hover:text-brand-primary">View All History</button>
            </div>
        </div>
    );
};
