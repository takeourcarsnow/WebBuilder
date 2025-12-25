'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Terminal, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ className, showNav = true }) => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-gray-200 bg-white/60 backdrop-blur-xl',
        'dark:border-gray-800 dark:bg-surface-dark/60',
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center border border-gray-300 bg-gray-900 dark:border-gray-700 dark:bg-white">
            <Terminal className="h-4 w-4 text-white dark:text-gray-900" />
          </div>
          <span className="font-mono text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
            Stacky
          </span>
        </Link>

        {showNav && (
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-xs font-medium uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Platform
            </Link>
            <Link
              href="/templates"
              className="text-xs font-medium uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Architecture
            </Link>
            <Link
              href="/builder"
              className="text-xs font-medium uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Build
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={toggleTheme}
            className="hover:bg-gray-100 dark:hover:bg-surface-dark-secondary"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.div>
          </Button>

          <Link href="/builder">
            <Button 
              size="sm"
              className="border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Launch
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
