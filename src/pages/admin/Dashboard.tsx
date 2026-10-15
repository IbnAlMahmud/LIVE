import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Layout, MonitorPlay, Eye, Bell, FileText, Image as ImageIcon, Plus, ArrowRight, MessageSquare } from 'lucide-react';
import { useDemos, useProjects } from '@/hooks/useContent';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { demos } = useDemos();
  const { projects } = useProjects();
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
        const leadsSnapshot = await getDocs(leadsQuery);
        const leadsData = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentLeads(leadsData);
        
        // Count total leads
        const allLeadsQuery = query(collection(db, 'leads'));
        const allLeadsSnapshot = await getDocs(allLeadsQuery);
        setTotalLeads(allLeadsSnapshot.size);
        
        // Count new leads
        const newLeadsQuery = query(collection(db, 'leads'), where('status', '==', 'New'));
        const newLeadsSnapshot = await getDocs(newLeadsQuery);
        setNewLeads(newLeadsSnapshot.size);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const publishedDemos = demos.filter(d => d.published !== false).length;
  const draftDemos = demos.length - publishedDemos;

  const publishedProjects = projects.filter(p => p.published !== false).length;

  return (
    <>
      <Helmet>
        <title>Dashboard | AureviaWeb Admin</title>
      </Helmet>
      
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your business and content metrics.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
             <Link to="/admin/projects" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gray-50 rounded-lg transition-colors">
               <Plus size={16} /> Project
             </Link>
             <div className="w-px h-4 bg-gray-200"></div>
             <Link to="/admin/demos" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gray-50 rounded-lg transition-colors">
               <Plus size={16} /> Demo
             </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { name: 'Total Projects', stat: publishedProjects, icon: Layout, color: 'text-modern-blue', bg: 'bg-blue-50', link: '/admin/projects' },
            { name: 'Published Demos', stat: publishedDemos, secondary: `${draftDemos} Drafts`, icon: MonitorPlay, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/demos' },
            { name: 'New Leads', stat: newLeads, secondary: `${totalLeads} Total`, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/leads' },
            { name: 'Unread Notifications', stat: 0, icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50', link: '/admin/notifications' },
          ].map((item) => (
            <Link key={item.name} to={item.link} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">{item.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{item.stat}</p>
                  {item.secondary && (
                    <p className="text-xs font-medium text-gray-400 mt-2">{item.secondary}</p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area: Recent Leads & Projects */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Recent Leads */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[400px]">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Users size={18} className="text-modern-blue" />
                  Recent Inquiries
                </h3>
                <Link to="/admin/leads" className="text-sm font-semibold text-modern-blue hover:text-deep-blue flex items-center gap-1">
                  View all <ArrowRight size={16} />
                </Link>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm font-medium">Loading leads...</div>
                ) : recentLeads.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="p-5 hover:bg-gray-50/80 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-bold text-sm text-gray-900">{lead.name}</div>
                          <span className={`px-2 py-0.5 inline-flex text-[11px] font-bold rounded-md uppercase tracking-wider ${
                            lead.status === 'New' ? 'bg-amber-100 text-amber-800' :
                            lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Closed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status || 'New'}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-gray-500 mb-2">{lead.businessName} • {lead.websiteType}</div>
                        <div className="text-sm text-gray-600 line-clamp-2 bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                          "{lead.message}"
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                    <MessageSquare size={32} className="mb-3 opacity-50" />
                    <p className="text-sm font-medium">No recent leads.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Showcase Management */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-base font-bold text-gray-900">Featured Showcase</h2>
                 <Link to="/admin/homepage" className="text-sm text-modern-blue font-semibold hover:underline">Manage Homepage</Link>
              </div>
              
              {demos.filter(d => d.featured).length === 0 && projects.filter(p => p.featured).length === 0 ? (
                <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center">
                  <p className="text-sm font-medium text-gray-500">No items featured on the homepage.</p>
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                   {/* We can show featured demos and projects here */}
                   {demos.filter(d => d.featured).map((demo) => (
                     <div key={demo.id} className="min-w-[200px] w-[200px] aspect-video rounded-xl overflow-hidden relative shadow-sm border border-gray-200 group">
                       <img src={demo.thumbnail || undefined} alt={demo.title} className="w-full h-full object-cover object-top" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <span className="bg-modern-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded self-start mb-1 uppercase tracking-wider">Demo</span>
                          <span className="text-white text-xs font-semibold truncate leading-tight">{demo.title}</span>
                       </div>
                     </div>
                   ))}
                   {projects.filter(p => p.featured).map((project) => (
                     <div key={project.id} className="min-w-[200px] w-[200px] aspect-video rounded-xl overflow-hidden relative shadow-sm border border-gray-200 group">
                       <img src={project.thumbnail || undefined} alt={project.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                          <span className="bg-charcoal text-white text-[10px] font-bold px-1.5 py-0.5 rounded self-start mb-1 uppercase tracking-wider">Project</span>
                          <span className="text-white text-xs font-semibold truncate leading-tight">{project.title}</span>
                       </div>
                     </div>
                   ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Sidebar Area: Notifications & Quick Actions */}
          <div className="flex flex-col gap-8">
            
            {/* Quick Actions */}
            <div className="bg-charcoal rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg mb-4 relative z-10">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <Link to="/admin/projects" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex flex-col gap-2 items-center text-center">
                  <Layout size={20} />
                  <span className="text-xs font-semibold">Add Project</span>
                </Link>
                <Link to="/admin/demos" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex flex-col gap-2 items-center text-center">
                  <MonitorPlay size={20} />
                  <span className="text-xs font-semibold">Add Demo</span>
                </Link>
                <Link to="/admin/media" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex flex-col gap-2 items-center text-center">
                  <ImageIcon size={20} />
                  <span className="text-xs font-semibold">Upload Media</span>
                </Link>
                <Link to="/admin/settings" className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex flex-col gap-2 items-center text-center">
                  <Users size={20} />
                  <span className="text-xs font-semibold">Site Settings</span>
                </Link>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[350px]">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={18} className="text-rose-500" />
                  Notifications
                </h3>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <Bell size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium text-gray-900 mb-1">All caught up!</p>
                <p className="text-xs text-gray-500">You have no new notifications.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
