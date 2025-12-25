'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Github, Twitter, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'border-t border-slate-200 bg-white py-16',
        'dark:border-slate-800 dark:bg-surface-dark',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/25">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Webstax
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The most intuitive website builder for portfolios, landing pages, and personal sites. 
              Create beautiful websites without writing code.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/templates" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/builder" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                  Builder
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 sm:flex-row">
          <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            Made with <Heart className="h-4 w-4 fill-pink-500 text-pink-500" /> by Webstax
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} Webstax. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
