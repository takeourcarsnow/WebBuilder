'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Github, Twitter, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'border-t border-gray-200 bg-gray-50 py-16',
        'dark:border-gray-800 dark:bg-surface-dark-elevated',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center border border-gray-300 bg-gray-900 dark:border-gray-700 dark:bg-white">
                <Terminal className="h-4 w-4 text-white dark:text-gray-900" />
              </div>
              <span className="font-mono text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Stacky
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-gray-600 dark:text-text-dark-secondary">
              Enterprise-grade web development platform. Build production-ready 
              applications with confidence.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-text-dark-secondary">
              <li>
                <Link href="/templates" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Architecture
                </Link>
              </li>
              <li>
                <Link href="/builder" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Build System
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Deployment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-text-dark-secondary">
              <li>
                <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-gray-900 dark:hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-text-dark-tertiary">
            © {new Date().getFullYear()} Stacky. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-600 dark:hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-600 dark:hover:text-white"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-600 dark:hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
