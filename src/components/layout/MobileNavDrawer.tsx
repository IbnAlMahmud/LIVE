import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { 
  Home, 
  LayoutGrid, 
  Sparkles, 
  MonitorPlay, 
  Tag, 
  Users, 
  Mail, 
  ArrowRight, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Works', path: '/work', icon: LayoutGrid },
  { label: 'Services', path: '/services', icon: Sparkles },
  { label: 'Demos', path: '/demos', icon: MonitorPlay },
  { label: 'Pricing', path: '/pricing', icon: Tag },
  { label: 'About Us', path: '/about', icon: Users },
  { label: 'Contact', path: '/contact', icon: Mail },
];

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);

  // 1. Lock page scroll safely without layout shifting or horizontal overflow
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isOpen]);

  // 2. Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Framer Motion Animation Variants
  const backdropVariants = {
    closed: { opacity: 0 },
    open: { 
      opacity: 1, 
      transition: { duration: shouldReduceMotion ? 0.05 : 0.25, ease: 'easeOut' } 
    }
  };

  const drawerVariants = {
    closed: { 
      x: '100%',
      opacity: 0.9,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.28,
        ease: [0.32, 0.72, 0, 1]
      }
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.32,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: shouldReduceMotion ? 0 : 0.035,
        delayChildren: shouldReduceMotion ? 0 : 0.06
      }
    }
  };

  const itemVariants = {
    closed: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : 14 
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: shouldReduceMotion ? 0.05 : 0.24, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Subtle translucent backdrop over remaining 40-48% of screen */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-text-main/10 backdrop-blur-[2px] transition-colors"
            aria-hidden="true"
          />

          {/* Half-Screen Right Side Navigation Drawer (approx 52–60% of viewport) */}
          <motion.div
            ref={drawerRef}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 z-10 w-[58vw] min-w-[210px] max-w-[280px] sm:w-[48vw] sm:max-w-[320px] bg-white border-l border-border-color shadow-[-16px_0_40px_rgba(15,23,42,0.08)] flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative visual accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-soft-blue via-fresh-green to-soft-green shrink-0" />

            {/* Header: [AureviaWeb Logo] [X] */}
            <div className="px-4 py-3.5 border-b border-border-color/80 flex items-center justify-between shrink-0 bg-white">
              <Link 
                to="/" 
                onClick={onClose}
                className="flex items-center gap-1.5 group min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green rounded-md"
                aria-label="AureviaWeb Home"
              >
                <span className="w-6 h-6 rounded-md bg-fresh-green text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm shadow-fresh-green/30 group-hover:scale-105 transition-transform">
                  Aw
                </span>
                <span className="font-bold text-xs sm:text-sm tracking-tight text-text-main truncate">
                  AureviaWeb<span className="text-fresh-green">.</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-text-main hover:bg-soft-white transition-colors border border-border-color/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green active:scale-95"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 overscroll-contain">
              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = item.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(item.path);

                  const Icon = item.icon;

                  return (
                    <motion.div key={item.path} variants={itemVariants}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          "group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-fresh-green",
                          isActive
                            ? "bg-soft-green text-elegant-green font-bold shadow-xs"
                            : "text-text-main hover:text-fresh-green hover:bg-soft-white"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Minimal icon container */}
                          <div 
                            className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110",
                              isActive
                                ? "bg-white text-fresh-green shadow-xs"
                                : "bg-soft-white text-text-muted group-hover:text-fresh-green group-hover:bg-soft-green/60"
                            )}
                          >
                            <Icon size={13} className="shrink-0" />
                          </div>

                          {/* Navigation Label */}
                          <span className="truncate transition-transform duration-200 group-hover:translate-x-0.5">
                            {item.label}
                          </span>
                        </div>

                        {/* Subtle animated indicator / arrow */}
                        <div className="flex items-center pl-1 shrink-0">
                          {isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-fresh-green" />
                          ) : (
                            <ArrowRight 
                              size={12} 
                              className="text-fresh-green opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" 
                            />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Section: Start a Project CTA & Compact Brand Panel */}
            <motion.div 
              variants={itemVariants} 
              className="p-3 border-t border-border-color/80 bg-gradient-to-b from-white to-soft-blue/20 shrink-0"
            >
              <Link
                to="/start-project"
                onClick={onClose}
                className="group relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-fresh-green text-white font-bold text-[11px] sm:text-xs tracking-wider uppercase shadow-md shadow-fresh-green/20 hover:bg-elegant-green hover:shadow-lg transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green"
              >
                <span>Start a Project</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Compact Miniature Brand Identity */}
              <div className="mt-2.5 pt-2 border-t border-border-color/50 text-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-elegant-green block">
                  AureviaWeb
                </span>
                <span className="text-[8.5px] text-text-muted mt-0.5 block leading-tight">
                  Digital Experiences, Beautifully Built.
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
