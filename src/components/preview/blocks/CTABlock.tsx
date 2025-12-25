'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';

interface CTABlockProps {
  block: WebsiteBlock;
}

export const CTABlock: React.FC<CTABlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-16',
    large: 'py-24',
  }[style.padding || 'large'];

  return (
    <section
      className={cn('w-full', paddingClass)}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {content.headline as string}
          </h2>
          <p className="mb-8 text-lg opacity-90">
            {content.description as string}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={content.primaryButtonLink as string}
              className={cn(
                'inline-flex items-center justify-center rounded-ios-lg px-8 py-3 text-base font-semibold transition-all',
                'bg-white text-gray-900 shadow-ios hover:shadow-ios-lg',
                'active:scale-[0.98]'
              )}
            >
              {content.primaryButtonText as string}
            </a>

            {content.showSecondaryButton && (
              <a
                href={content.secondaryButtonLink as string}
                className={cn(
                  'inline-flex items-center justify-center rounded-ios-lg px-8 py-3 text-base font-semibold transition-all',
                  'border-2 border-white/30 bg-transparent hover:bg-white/10',
                  'active:scale-[0.98]'
                )}
              >
                {content.secondaryButtonText as string}
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
