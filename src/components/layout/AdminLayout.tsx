import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Menu, X, Home, FolderOpen, MonitorPlay, Image as ImageIcon, 
  MessageSquare, Settings, LineChart, Bell, FileText, HelpCircle, 
  Star, CreditCard, Briefcase, Layout, MenuSquare, Search, Activity, 
  Shield, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navigationGroups = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin', icon: Home, exact: true },
      { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
      { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    ]
  },
  {
    name: 'Content',
    items: [
      { name: 'Projects', path: '/admin/projects', icon: FolderOpen },
      { name: 'Demo Websites', path: '/admin/demos', icon: MonitorPlay },
      { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
      { name: 'Blog / Insights', path: '/admin/blog', icon: FileText },
      { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
      { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    ]
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Leads', path: '/admin/leads', icon: MessageSquare },
      { name: 'Pricing', path: '/admin/pricing', icon: CreditCard },
      { name: 'Services', path: '/admin/services', icon: Briefcase },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { name: 'Homepage', path: '/admin/homepage', icon: Layout },
      { name: 'Navigation', path: '/admin/navigation', icon: MenuSquare },
    ]
  },
  {
    name: 'Settings',
    items: [
      { name: 'Site Settings', path: '/admin/settings', icon: Settings },
      { name: 'SEO', path: '/admin/seo', icon: Search },
      { name: 'Meta Pixel', path: '/admin/pixel', icon: Activity },
      { name: 'Admin Settings', path: '/admin/system', icon: Shield },
    ]
  }
];

export function AdminLayout() {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading admin...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <Link to="/admin" className="text-xl font-bold text-charcoal">AureviaWeb</Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-charcoal transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {navigationGroups.map((group) => (
            <div key={group.name}>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {group.name}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = item.exact 
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                        isActive 
                          ? "bg-blue-50 text-modern-blue" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-charcoal"
                      )}
                    >
                      <item.icon size={18} className={cn("flex-shrink-0", isActive ? "text-modern-blue" : "text-gray-400")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
           <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full">
             <LogOut size={18} className="text-gray-400 group-hover:text-red-600" />
             Sign Out
           </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center">
            {/* Search could go here */}
          </div>

          <div className="flex items-center gap-6 ml-auto">
            <Link to="/" target="_blank" className="text-sm font-medium text-gray-500 hover:text-modern-blue transition-colors flex items-center gap-2">
              View Website
            </Link>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-modern-blue/10 flex items-center justify-center text-modern-blue font-bold text-sm">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-charcoal hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
