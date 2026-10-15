import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Bell, Check, Trash2 } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
  type: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        setNotifications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Helmet><title>Notifications | Admin</title></Helmet>
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="text-modern-blue" /> Notifications
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : notifications.length === 0 ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-12 text-center text-gray-500">
             <Bell size={32} className="mx-auto mb-3 opacity-50" />
             <p className="font-medium text-gray-900 mb-1">No notifications</p>
             <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {notifications.map(n => (
                <div key={n.id} className={cn("p-5 flex gap-4 hover:bg-gray-50 transition-colors", !n.read ? "bg-blue-50/30" : "")}>
                  <div className={cn("mt-1 w-2.5 h-2.5 rounded-full shrink-0", !n.read ? "bg-modern-blue" : "bg-transparent")} />
                  <div className="flex-1">
                    <h4 className={cn("text-sm mb-1", !n.read ? "font-bold text-gray-900" : "font-semibold text-gray-700")}>{n.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{n.message}</p>
                    <p className="text-xs text-gray-400">{n.createdAt?.toDate?.()?.toLocaleString() || 'Recent'}</p>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 sm:opacity-100">
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="p-1.5 text-gray-400 hover:text-modern-blue bg-white border rounded shadow-sm hover:shadow" title="Mark as read">
                        <Check size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border rounded shadow-sm hover:shadow" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
