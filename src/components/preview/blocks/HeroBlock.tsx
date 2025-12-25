'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles, useBlockInlineStyles } from '@/hooks';
import { cn } from '@/lib/utils';

interface HeroBlockProps {
  block: WebsiteBlock;
}

export const HeroBlock: React.FC<HeroBlockProps> = memo(({ block }) => {
  const { content, style } = block;
  const { paddingClass, alignmentClass } = useBlockStyles(style);
  const inlineStyles = useBlockInlineStyles(style);

  return (
    <section
      className={cn('relative w-full', paddingClass)}
      style={inlineStyles}
    >
      <div className={cn('mx-auto flex max-w-4xl flex-col px-6', alignmentClass)}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          {content.headline as string}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 max-w-2xl text-lg opacity-90 sm:text-xl"
        >
          {content.subheadline as string}
        </motion.p>

        {content.showButton && (
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            href={content.buttonLink as string}
            className={cn(
              'inline-flex items-center justify-center rounded-ios-lg px-8 py-3 text-base font-semibold transition-all',
              'bg-white text-gray-900 shadow-ios hover:shadow-ios-lg',
              'active:scale-[0.98]'
            )}
          >
            {content.buttonText as string}
          </motion.a>
        )}
      </div>
    </section>
  );
});

HeroBlock.displayName = 'HeroBlock';
