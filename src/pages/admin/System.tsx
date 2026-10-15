import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';

export default function System() {
  return (
    <>
      <Helmet>
        <title>Admin Settings | AureviaWeb Admin</title>
      </Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-modern-blue" /> System Settings
            </h1>
          </div>
        </div>
        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-xl p-8">
           <h3 className="font-bold text-gray-900 mb-4">Authentication & Security</h3>
           <p className="text-sm text-gray-500 mb-6">User accounts and permissions are managed securely via Firebase Authentication.</p>
           
           <h3 className="font-bold text-gray-900 mb-4 pt-4 border-t border-gray-100">Database Rules</h3>
           <p className="text-sm text-gray-500 mb-6">Active Firestore security rules allow public reads for content and restrict writes to authenticated administrators.</p>
        </div>
      </div>
    </>
  );
}
