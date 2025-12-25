'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

interface GalleryBlockProps {
  block: WebsiteBlock;
}

export const GalleryBlock: React.FC<GalleryBlockProps> = ({ block }) => {
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

  const images = content.images as BlockContent[];
  const columns = (content.columns as number) || 3;

  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'sm:grid-cols-3';

  return (
    <section
      id="gallery"
      className={cn('w-full', paddingClass)}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      <div className={cn('mx-auto px-6', widthClass)}>
        {content.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {content.title as string}
            </h2>
          </motion.div>
        )}

        <div className={cn('grid gap-4', gridCols)}>
          {images?.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-ios-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                {image.src && (
                  <img
                    src={image.src as string}
                    alt={image.alt as string}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>
              {image.caption && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="p-4 text-sm font-medium text-white">
                    {image.caption as string}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
