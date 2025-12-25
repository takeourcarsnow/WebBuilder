'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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

  // Check if background is a gradient
  const isGradient = typeof style?.backgroundColor === 'string' && 
    style.backgroundColor.includes('gradient');

  return (
    <section
      className={cn('relative w-full overflow-hidden', paddingClass)}
      style={inlineStyles}
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/4 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-500/20 to-teal-500/20 blur-3xl"
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className={cn('relative z-10 mx-auto flex max-w-4xl flex-col px-6', alignmentClass)}>
        {/* Optional badge */}
        {content.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-soft border border-white/20">
              <Sparkles className="h-4 w-4" />
              {content.badge as string}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {/* Add gradient text effect for key words */}
          <span className="bg-gradient-to-r from-current to-current bg-clip-text">
            {content.headline as string}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 max-w-2xl text-lg opacity-80 sm:text-xl leading-relaxed"
        >
          {content.subheadline as string}
        </motion.p>

        {content.showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={content.buttonLink as string}
              className={cn(
                'group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300',
                isGradient 
                  ? 'bg-white text-gray-900 shadow-lg hover:shadow-xl' 
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
              )}
            >
              {content.buttonText as string}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            {content.secondaryButtonText && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={content.secondaryButtonLink as string || '#'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-current/20 px-8 py-4 text-base font-semibold backdrop-blur-sm transition-all duration-300 hover:border-current/40 hover:bg-white/5"
              >
                {content.secondaryButtonText as string}
              </motion.a>
            )}
          </motion.div>
        )}

        {/* Optional trust badges or stats */}
        {content.trustBadges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60"
          >
            {(content.trustBadges as string[]).map((badge, index) => (
              <span key={index} className="text-sm font-medium">
                {badge}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
});

HeroBlock.displayName = 'HeroBlock';
