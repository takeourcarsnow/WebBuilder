'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';

interface AboutBlockProps {
  block: WebsiteBlock;
}

export const AboutBlock: React.FC<AboutBlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-16',
    large: 'py-24',
  }[style.padding || 'large'];

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
          {content.title && (
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title as string}
            </h2>
          )}

          <p className="text-lg leading-relaxed opacity-80">
            {content.description as string}
          </p>

          {content.showImage && content.image && (
            <div className="mt-8">
              <img
                src={content.image as string}
                alt="About"
                className="rounded-ios-xl shadow-ios-lg"
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
