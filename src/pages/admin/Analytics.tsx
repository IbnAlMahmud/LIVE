import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Attempt to fetch custom event collection if it exists
        const q = query(collection(db, 'analytics'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          setHasData(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <>
      <Helmet><title>Analytics | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="text-modern-blue" /> Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track website traffic and conversion events.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
        ) : !hasData ? (
          <div className="flex-1 bg-white border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-12 text-center text-gray-500">
             <BarChart3 size={32} className="mx-auto mb-3 opacity-50" />
             <p className="font-medium text-gray-900 mb-1">No data yet</p>
             <p className="text-sm max-w-md mx-auto">Analytics tracking is active, but no events have been recorded yet. Data will appear here once visitors start interacting with the public website.</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl shadow-sm p-6 text-center">
            <h3 className="font-bold text-gray-900">Analytics Data</h3>
          </div>
        )}
      </div>
    </>
  );
}
