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
  Layout,
  Megaphone,
  Smartphone,
  Video,
  Utensils,
  Wine,
  Cake,
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
  Layout,
  Megaphone,
  Smartphone,
  Video,
  Utensils,
  Wine,
  Cake,
};

// Gradient color pairs for icons
const gradientColors = [
  ['from-violet-500', 'to-purple-600'],
  ['from-pink-500', 'to-rose-600'],
  ['from-orange-400', 'to-amber-600'],
  ['from-emerald-500', 'to-teal-600'],
  ['from-blue-500', 'to-indigo-600'],
  ['from-cyan-400', 'to-blue-600'],
];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {content.title as string}
          </h2>
          {content.subtitle && (
            <p className="mx-auto max-w-2xl text-lg opacity-70">
              {content.subtitle as string}
            </p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features?.map((feature, index) => {
            const Icon = iconMap[feature.icon as string] || Sparkles;
            const [fromColor, toColor] = gradientColors[index % gradientColors.length];

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'group relative rounded-3xl p-8 transition-all duration-300',
                  'bg-white/60 backdrop-blur-sm',
                  'dark:bg-white/5 dark:backdrop-blur-xl',
                  'border border-gray-200/50 dark:border-white/10',
                  'hover:bg-white hover:shadow-xl hover:shadow-gray-200/40',
                  'dark:hover:bg-white/10 dark:hover:shadow-black/20'
                )}
              >
                {/* Gradient glow effect on hover */}
                <div 
                  className={cn(
                    'absolute -inset-px rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-50',
                    `bg-gradient-to-br ${fromColor} ${toColor}`
                  )}
                />

                <div className="relative">
                  {/* Icon with gradient background */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      'mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl',
                      `bg-gradient-to-br ${fromColor} ${toColor}`,
                      'shadow-lg'
                    )}
                    style={{
                      boxShadow: `0 8px 24px -4px rgba(var(--shadow-color, 0, 0, 0), 0.2)`,
                    }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </motion.div>

                  <h3 className="mb-3 text-xl font-semibold tracking-tight">
                    {feature.title as string}
                  </h3>
                  
                  <p className="text-base leading-relaxed opacity-70">
                    {feature.description as string}
                  </p>

                  {/* Learn more link */}
                  {feature.link && (
                    <motion.a
                      href={feature.link as string}
                      className={cn(
                        'mt-4 inline-flex items-center gap-1 text-sm font-medium',
                        `bg-gradient-to-r ${fromColor} ${toColor} bg-clip-text text-transparent`
                      )}
                      whileHover={{ x: 4 }}
                    >
                      Learn more →
                    </motion.a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
