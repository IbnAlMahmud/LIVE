import { Outlet, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileMenuButton } from './MobileMenuButton';
import { MobileNavDrawer } from './MobileNavDrawer';

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Work', path: '/work' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white selection:bg-fresh-green selection:text-white">
      {/* Desktop Header */}
      <header className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 border-b",
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-border-color shadow-sm py-4" 
          : "bg-transparent py-6 border-transparent"
      )}>
        <div className="mx-auto flex items-center justify-between px-6 sm:px-8 lg:px-12 max-w-[1440px]">
          <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-2 text-text-main">
            <span className="w-8 h-8 rounded-lg bg-fresh-green text-white flex items-center justify-center text-sm font-bold leading-none">Aw</span>
            AureviaWeb<span className="text-fresh-green">.</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all",
                  location.pathname.startsWith(link.path) 
                    ? "bg-soft-green text-elegant-green" 
                    : "text-text-muted hover:text-text-main hover:bg-soft-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link to="/start-project" className="hidden md:inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-all bg-fresh-green text-white hover:bg-elegant-green shadow-lg shadow-fresh-green/20 hover:-translate-y-0.5">
              Start Project <ArrowRight size={16} />
            </Link>
            
            {/* Interactive Animated Hamburger / X Menu Button */}
            <div className="lg:hidden">
              <MobileMenuButton 
                isOpen={isMobileMenuOpen} 
                onToggle={() => setIsMobileMenuOpen(prev => !prev)} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Premium Side Navigation Drawer (Half-screen: ~52-60% viewport width) */}
      <MobileNavDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Premium Light Footer */}
      <footer className="bg-soft-white text-text-main pt-24 pb-16 mt-0 border-t border-border-color relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-soft-green rounded-full blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-soft-blue rounded-full blur-[100px] opacity-40 translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
            <div className="md:col-span-5 lg:col-span-4">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-fresh-green text-white flex items-center justify-center text-lg font-bold leading-none">Aw</span>
                AureviaWeb.
              </h2>
              <p className="text-text-muted max-w-sm text-lg leading-relaxed mb-8">
                A premium digital studio crafting world-class websites for modern businesses, brands, and entrepreneurs.
              </p>
              <div className="flex gap-4">
                <Link to="/start-project" className="inline-flex items-center justify-center rounded-full bg-fresh-green px-6 py-3 text-sm font-bold text-white shadow-md shadow-fresh-green/20 hover:bg-elegant-green transition-colors">
                  Start Project
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-white border border-border-color px-6 py-3 text-sm font-bold text-text-main hover:bg-gray-50 transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-elegant-green mb-6">Platform</h3>
                <ul className="space-y-4 text-text-muted font-medium text-sm">
                  <li><Link to="/work" className="hover:text-fresh-green transition-colors">Selected Work</Link></li>
                  <li><Link to="/services" className="hover:text-fresh-green transition-colors">Our Services</Link></li>
                  <li><Link to="/solutions" className="hover:text-fresh-green transition-colors">Industries</Link></li>
                  <li><Link to="/pricing" className="hover:text-fresh-green transition-colors">Pricing Packages</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-elegant-green mb-6">Company</h3>
                <ul className="space-y-4 text-text-muted font-medium text-sm">
                  <li><Link to="/about" className="hover:text-fresh-green transition-colors">About Us</Link></li>
                  <li><Link to="/process" className="hover:text-fresh-green transition-colors">Our Process</Link></li>
                  <li><Link to="/insights" className="hover:text-fresh-green transition-colors">Insights & Articles</Link></li>
                  <li><Link to="/faq" className="hover:text-fresh-green transition-colors">FAQ</Link></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-elegant-green mb-6">Connect</h3>
                <ul className="space-y-4 text-text-muted font-medium text-sm">
                  <li><a href="mailto:hello@aureviaweb.dev" className="hover:text-fresh-green transition-colors">hello@aureviaweb.dev</a></li>
                  <li><a href="tel:+8801402884798" className="hover:text-fresh-green transition-colors">+880 1402-884798</a></li>
                  <li><a href="https://wa.me/8801402884798" target="_blank" rel="noreferrer" className="text-text-main hover:text-fresh-green transition-colors flex items-center gap-2">WhatsApp Us <ArrowRight size={14}/></a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border-color pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-text-muted font-medium">
            <p>&copy; {new Date().getFullYear()} AureviaWeb Studio. All rights reserved.</p>
            <div className="flex flex-wrap gap-6 mt-4 md:mt-0 justify-center">
               <Link to="/privacy" className="hover:text-fresh-green transition-colors">Privacy Policy</Link>
               <Link to="/terms" className="hover:text-fresh-green transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
