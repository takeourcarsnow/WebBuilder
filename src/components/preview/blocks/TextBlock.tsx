'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';

interface TextBlockProps {
  block: WebsiteBlock;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-12',
    large: 'py-16',
  }[style.padding || 'medium'];

  const widthClass = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
  }[style.width || 'medium'];

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }[style.alignment || 'left'];

  return (
    <section
      className={cn('w-full', paddingClass)}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      <div className={cn('px-6', widthClass, alignmentClass)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {content.showHeading && content.heading && (
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {content.heading as string}
            </h2>
          )}
          <p className="whitespace-pre-line text-lg leading-relaxed opacity-80">
            {content.body as string}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
