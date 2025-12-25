'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Sun, Moon } from 'lucide-react';
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
        'sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-ios',
        'dark:border-gray-800 dark:bg-surface-dark/80',
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-ios-lg bg-gradient-to-br from-primary-500 to-primary-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            WebBuilder
          </span>
        </Link>

        {showNav && (
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Templates
            </Link>
            <Link
              href="/builder"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Builder
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </Button>

          <Link href="/builder">
            <Button size="sm">Start Building</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
