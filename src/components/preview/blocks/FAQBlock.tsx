'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBlockProps {
  block: WebsiteBlock;
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);

  const title = content.title as string || 'Frequently Asked Questions';
  const subtitle = content.subtitle as string || '';
  const items = (content.items as unknown as FAQItem[]) || [];
  const allowMultiple = content.allowMultiple as boolean ?? false;

  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className={containerClass} style={containerStyle}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className={cn('mb-10', style.alignment === 'center' && 'text-center')}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg opacity-70">{subtitle}</p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openItems.has(index);
            return (
              <div
                key={index}
                className={cn(
                  'border rounded-xl overflow-hidden transition-all duration-200',
                  isOpen ? 'bg-black/5 dark:bg-white/5' : 'bg-transparent',
                  'border-black/10 dark:border-white/10'
                )}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold pr-4">{item.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 opacity-50" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5">
                        <p className="opacity-70 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
