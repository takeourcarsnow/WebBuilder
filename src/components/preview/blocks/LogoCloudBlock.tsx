'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface Logo {
  name: string;
  image: string;
  url?: string;
}

export interface LogoCloudBlockContent {
  title?: string;
  subtitle?: string;
  logos: Logo[];
  style: 'static' | 'scroll' | 'fade';
  grayscale: boolean;
  showNames: boolean;
}

interface LogoCloudBlockProps {
  content: LogoCloudBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

const defaultLogos: Logo[] = [
  { name: 'Company 1', image: 'https://via.placeholder.com/200x80?text=Logo+1' },
  { name: 'Company 2', image: 'https://via.placeholder.com/200x80?text=Logo+2' },
  { name: 'Company 3', image: 'https://via.placeholder.com/200x80?text=Logo+3' },
  { name: 'Company 4', image: 'https://via.placeholder.com/200x80?text=Logo+4' },
  { name: 'Company 5', image: 'https://via.placeholder.com/200x80?text=Logo+5' },
  { name: 'Company 6', image: 'https://via.placeholder.com/200x80?text=Logo+6' },
];

export const LogoCloudBlock: React.FC<LogoCloudBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title,
    subtitle,
    logos = defaultLogos,
    style: displayStyle = 'static',
    grayscale = true,
    showNames = false,
  } = content;

  const LogoItem = ({ logo, index }: { logo: Logo; index: number }) => {
    const imgContent = (
      <img
        src={logo.image}
        alt={logo.name}
        className={cn(
          'h-8 sm:h-10 w-auto object-contain transition-all duration-300',
          grayscale && 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
        )}
      />
    );

    const content = logo.url ? (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2"
      >
        {imgContent}
        {showNames && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{logo.name}</span>
        )}
      </a>
    ) : (
      <div className="flex flex-col items-center gap-2">
        {imgContent}
        {showNames && (
          <span className="text-xs text-gray-500 dark:text-gray-400">{logo.name}</span>
        )}
      </div>
    );

    return (
      <motion.div
        initial={isPreview ? { opacity: 0, y: 20 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="flex items-center justify-center px-8 py-4"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <section
      className={cn(
        BLOCK_STYLE_CLASSES.padding[blockStyle.padding || 'medium'],
        BLOCK_STYLE_CLASSES.width[blockStyle.width || 'wide'],
        'flex flex-col',
        BLOCK_STYLE_CLASSES.alignment[blockStyle.alignment || 'center']
      )}
      style={{
        backgroundColor: blockStyle.backgroundColor,
        color: blockStyle.textColor,
      }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <motion.h2
              initial={isPreview ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl font-semibold mb-2"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={isPreview ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-sm opacity-70"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}

      {/* Logos */}
      {displayStyle === 'scroll' ? (
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {[...logos, ...logos].map((logo, index) => (
              <LogoItem key={`${logo.name}-${index}`} logo={logo} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, index) => (
            <LogoItem key={logo.name + index} logo={logo} index={index} />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};
