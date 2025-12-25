'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

interface ExperienceBlockProps {
  block: WebsiteBlock;
}

export const ExperienceBlock: React.FC<ExperienceBlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-16',
    large: 'py-24',
  }[style.padding || 'large'];

  const widthClass = {
    narrow: 'max-w-md',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'max-w-6xl',
  }[style.width || 'medium'];

  const items = content.items as BlockContent[];

  return (
    <section
      className={cn('w-full', paddingClass)}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      <div className={cn('mx-auto px-6', widthClass)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title as string}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gray-200 dark:bg-gray-700 sm:left-1/2" />

          {items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative mb-8 flex flex-col sm:flex-row',
                index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
              )}
            >
              {/* Year badge */}
              <div className="absolute left-0 top-0 z-10 sm:left-1/2 sm:-translate-x-1/2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white shadow-ios">
                  {(item.year as string).slice(-2)}
                </div>
              </div>

              {/* Content */}
              <div className={cn('ml-12 sm:ml-0 sm:w-1/2', index % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12')}>
                <div className={cn(
                  'rounded-ios-lg p-6',
                  'bg-gray-50 dark:bg-gray-800/50'
                )}>
                  <span className="mb-1 block text-sm font-medium text-primary-500">
                    {item.year as string}
                  </span>
                  <h3 className="mb-1 text-lg font-semibold">
                    {item.title as string}
                  </h3>
                  <p className="mb-2 text-sm opacity-70">
                    {item.company as string}
                  </p>
                  <p className="text-sm opacity-60">
                    {item.description as string}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
