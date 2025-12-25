'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote as QuoteIcon } from 'lucide-react';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

interface TestimonialsBlockProps {
  block: WebsiteBlock;
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ block }) => {
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
  }[style.width || 'medium'];

  const testimonials = content.testimonials as BlockContent[];

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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title as string}
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2">
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                'relative rounded-ios-xl p-8',
                'bg-gray-50 dark:bg-gray-800/50'
              )}
            >
              <QuoteIcon className="mb-4 h-8 w-8 text-primary-500/30" />
              <p className="mb-6 text-lg leading-relaxed">
                &ldquo;{testimonial.quote as string}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar as string}
                    alt={testimonial.author as string}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {(testimonial.author as string).charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{testimonial.author as string}</p>
                  <p className="text-sm opacity-70">{testimonial.role as string}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
