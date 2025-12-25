'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Github,
  Youtube,
  Globe,
} from 'lucide-react';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  website: Globe,
  dribbble: Globe,
  behance: Globe,
  medium: Globe,
  tiktok: Globe,
};

const platformColors: Record<string, string> = {
  twitter: 'hover:bg-[#1DA1F2] hover:text-white',
  instagram: 'hover:bg-[#E4405F] hover:text-white',
  facebook: 'hover:bg-[#1877F2] hover:text-white',
  linkedin: 'hover:bg-[#0A66C2] hover:text-white',
  github: 'hover:bg-[#181717] hover:text-white dark:hover:bg-white dark:hover:text-black',
  youtube: 'hover:bg-[#FF0000] hover:text-white',
  website: 'hover:bg-primary-500 hover:text-white',
  dribbble: 'hover:bg-[#EA4C89] hover:text-white',
  behance: 'hover:bg-[#1769FF] hover:text-white',
  medium: 'hover:bg-[#000000] hover:text-white',
  tiktok: 'hover:bg-[#000000] hover:text-white',
};

interface SocialLinksBlockProps {
  block: WebsiteBlock;
}

export const SocialLinksBlock: React.FC<SocialLinksBlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-8',
    medium: 'py-12',
    large: 'py-16',
  }[style.padding || 'medium'];

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[style.alignment || 'center'];

  const links = content.links as BlockContent[];
  const showLabels = content.showLabels as boolean;

  return (
    <section
      className={cn('w-full', paddingClass)}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      <div className="mx-auto max-w-4xl px-6">
        {content.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-center text-2xl font-bold"
          >
            {content.title as string}
          </motion.h2>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn('flex flex-wrap gap-4', alignmentClass)}
        >
          {links?.map((link, index) => {
            const platform = link.platform as string;
            const Icon = platformIcons[platform] || Globe;
            const colorClass = platformColors[platform] || 'hover:bg-primary-500 hover:text-white';

            return (
              <a
                key={index}
                href={link.url as string}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 rounded-ios-lg px-4 py-2 transition-all',
                  'bg-gray-100 dark:bg-gray-800',
                  colorClass
                )}
              >
                <Icon className="h-5 w-5" />
                {showLabels && (
                  <span className="text-sm font-medium capitalize">{platform}</span>
                )}
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
