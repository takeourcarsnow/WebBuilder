'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

interface SkillsBlockProps {
  block: WebsiteBlock;
}

export const SkillsBlock: React.FC<SkillsBlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-16',
    large: 'py-24',
  }[style.padding || 'large'];

  const widthClass = {
    narrow: 'max-w-md',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'max-w-6xl',
  }[style.width || 'medium'];

  const skills = content.skills as BlockContent[];
  const showPercentage = content.showPercentage as boolean;

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
          className="mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title as string}
          </h2>
        </motion.div>

        <div className="space-y-6">
          {skills?.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{skill.name as string}</span>
                {showPercentage && (
                  <span className="text-sm opacity-70">{skill.level as number}%</span>
                )}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level as number}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full rounded-full bg-primary-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
