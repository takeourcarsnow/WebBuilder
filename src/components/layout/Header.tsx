'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Layers, Sun, Moon, Menu, X } from 'lucide-react';
import { useThemeStore } from '@/stores';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ className, showNav = true }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl',
        'dark:border-slate-700/50 dark:bg-surface-dark/80',
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/25">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            Webstax
          </span>
        </Link>

        {showNav && (
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Templates
            </Link>
            <Link
              href="/builder"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Builder
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={toggleTheme}
            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </motion.div>
          </Button>

          <Link href="/builder" className="hidden sm:block">
            <Button 
              size="sm"
              className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-700 hover:to-pink-700 shadow-md shadow-violet-500/20"
            >
              Start Building
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-700 dark:bg-surface-dark"
        >
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              href="/builder"
              className="text-sm font-medium text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Builder
            </Link>
            <Link href="/builder" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                fullWidth
                className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white"
              >
                Start Building
              </Button>
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
};
