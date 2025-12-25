'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'border-t border-gray-200 bg-white py-12',
        'dark:border-gray-800 dark:bg-surface-dark',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-ios-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                WebBuilder
              </span>
            </Link>
            <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
              Create beautiful personal websites without any coding knowledge. 
              Our drag-and-drop builder makes it easy for anyone to build their online presence.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/templates" className="hover:text-primary-500">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/builder" className="hover:text-primary-500">
                  Builder
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} WebBuilder. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
