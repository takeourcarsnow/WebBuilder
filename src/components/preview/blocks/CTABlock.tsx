'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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

  // Check if background is a gradient
  const isGradient = typeof style?.backgroundColor === 'string' && 
    style.backgroundColor.includes('gradient');

  return (
    <section
      className={cn('relative w-full overflow-hidden', paddingClass)}
      style={{
        background: style.backgroundColor,
        color: style.textColor,
      }}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Animated sparkles */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-10 left-[10%]"
        >
          <Sparkles className="h-8 w-8 opacity-40" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-10 right-[15%]"
        >
          <Sparkles className="h-6 w-6 opacity-30" />
        </motion.div>

        {/* Gradient orbs */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {content.headline as string}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg opacity-90 leading-relaxed">
            {content.description as string}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={content.primaryButtonLink as string}
              className={cn(
                'group inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300',
                isGradient 
                  ? 'bg-white text-gray-900 shadow-lg hover:shadow-xl' 
                  : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
              )}
            >
              {content.primaryButtonText as string}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            {content.showSecondaryButton && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={content.secondaryButtonLink as string}
                className={cn(
                  'inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold transition-all duration-300',
                  'border-2 border-current/20 backdrop-blur-sm hover:border-current/40 hover:bg-white/5'
                )}
              >
                {content.secondaryButtonText as string}
              </motion.a>
            )}
          </div>

          {/* Optional subtext */}
          {content.subtext && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-sm opacity-60"
            >
              {content.subtext as string}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
