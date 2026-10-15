import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Mail, Clock, Search, ExternalLink, Phone, MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  useEffect(() => {
    const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(leadsQuery, (snapshot) => {
      setLeads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status: newStatus });
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.businessName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || (lead.status || 'New') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-700';
      case 'Contacted': return 'bg-yellow-50 text-yellow-700';
      case 'Qualified': return 'bg-purple-50 text-purple-700';
      case 'Proposal Sent': return 'bg-orange-50 text-orange-700';
      case 'Won': return 'bg-green-50 text-green-700';
      case 'Lost': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <>
      <Helmet><title>Leads Management | Admin</title></Helmet>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Leads & Inquiries</h1>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search name, business, email, phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-modern-blue focus:border-transparent text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-4 border-gray-200 border-t-modern-blue rounded-full animate-spin"></div></div>
          ) : filteredLeads.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold">Lead Details</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.businessName || 'No Business'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{lead.websiteType}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{lead.createdAt?.toDate().toLocaleDateString() || 'Recent'}</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold", getStatusColor(lead.status || 'New'))}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-modern-blue font-medium text-sm hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Mail size={32} className="mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
            </div>
          )}
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-[60] flex justify-end">
          <div className="absolute inset-0" onClick={() => setSelectedLead(null)}></div>
          <div className="bg-white w-full max-w-lg h-full shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Contact</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex"><span className="w-24 text-gray-500">Name</span><span className="font-semibold">{selectedLead.name}</span></div>
                  <div className="flex"><span className="w-24 text-gray-500">Business</span><span className="font-semibold">{selectedLead.businessName || '-'}</span></div>
                  <div className="flex"><span className="w-24 text-gray-500">Email</span><a href={`mailto:${selectedLead.email}`} className="text-modern-blue hover:underline flex items-center gap-1">{selectedLead.email} <ExternalLink size={12}/></a></div>
                  <div className="flex"><span className="w-24 text-gray-500">Phone</span><a href={`tel:${selectedLead.phone}`} className="text-modern-blue hover:underline">{selectedLead.phone || '-'}</a></div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Project Requirements</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex"><span className="w-24 text-gray-500">Service</span><span className="font-semibold bg-gray-100 px-2 py-0.5 rounded">{selectedLead.websiteType}</span></div>
                  <div className="flex"><span className="w-24 text-gray-500">Budget</span><span className="font-semibold">{selectedLead.budget}</span></div>
                  <div className="flex"><span className="w-24 text-gray-500">Reference URL</span>
                    {selectedLead.currentWebsite ? (
                      <a href={selectedLead.currentWebsite} target="_blank" rel="noopener noreferrer" className="text-modern-blue hover:underline flex items-center gap-1">
                        {selectedLead.currentWebsite} <ExternalLink size={12}/>
                      </a>
                    ) : '-'}
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-2">Message</span>
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap border border-gray-100">
                      {selectedLead.message}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Status & Actions</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-gray-500">Current Status</span>
                    <select 
                      value={selectedLead.status || 'New'}
                      onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                      className={cn("font-semibold border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2", getStatusColor(selectedLead.status || 'New'))}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div className="flex"><span className="w-24 text-gray-500">Submitted</span><span>{selectedLead.createdAt?.toDate().toLocaleString()}</span></div>
                </div>
              </section>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3 flex-shrink-0">
              <a href={`mailto:${selectedLead.email}`} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Mail size={16}/> Email
              </a>
              {selectedLead.phone && (
                <a href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2">
                  <MessageCircle size={16}/> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
