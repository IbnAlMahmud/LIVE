import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MobileMenuButton({ isOpen, onToggle, className }: MobileMenuButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-nav-drawer"
      className={cn(
        "relative w-10 h-10 rounded-full flex flex-col items-center justify-center gap-[5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fresh-green bg-white/90 border border-border-color shadow-xs hover:bg-soft-white active:scale-95 z-[110]",
        isOpen ? "border-fresh-green/40 bg-soft-green/30" : "",
        className
      )}
    >
      {/* Top bar */}
      <motion.span
        animate={
          isOpen
            ? { rotate: 45, y: 7 }
            : { rotate: 0, y: 0 }
        }
        transition={{
          duration: shouldReduceMotion ? 0.05 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-[18px] h-[2px] bg-text-main rounded-full origin-center block pointer-events-none"
      />

      {/* Middle bar */}
      <motion.span
        animate={
          isOpen
            ? { opacity: 0, scaleX: 0.2, x: 4 }
            : { opacity: 1, scaleX: 1, x: 0 }
        }
        transition={{
          duration: shouldReduceMotion ? 0.05 : 0.2,
          ease: 'easeInOut',
        }}
        className="w-[18px] h-[2px] bg-text-main rounded-full block pointer-events-none"
      />

      {/* Bottom bar */}
      <motion.span
        animate={
          isOpen
            ? { rotate: -45, y: -7 }
            : { rotate: 0, y: 0 }
        }
        transition={{
          duration: shouldReduceMotion ? 0.05 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-[18px] h-[2px] bg-text-main rounded-full origin-center block pointer-events-none"
      />
    </button>
  );
}
