'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Code,
  Rocket,
  TrendingUp,
  Users,
  Target,
  Star,
  Heart,
  Zap,
  Shield,
  Globe,
  Sparkles,
} from 'lucide-react';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette,
  Code,
  Rocket,
  TrendingUp,
  Users,
  Target,
  Star,
  Heart,
  Zap,
  Shield,
  Globe,
  Sparkles,
};

interface FeaturesBlockProps {
  block: WebsiteBlock;
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ block }) => {
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
    full: 'max-w-7xl',
  }[style.width || 'wide'];

  const features = content.features as BlockContent[];

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
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title as string}
          </h2>
          {content.subtitle && (
            <p className="text-lg opacity-70">{content.subtitle as string}</p>
          )}
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features?.map((feature, index) => {
            const Icon = iconMap[feature.icon as string] || Sparkles;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'group rounded-ios-xl p-6 transition-all',
                  'bg-white/50 backdrop-blur-sm dark:bg-white/5',
                  'hover:bg-white hover:shadow-ios dark:hover:bg-white/10'
                )}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-ios-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  {feature.title as string}
                </h3>
                <p className="opacity-70">{feature.description as string}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
