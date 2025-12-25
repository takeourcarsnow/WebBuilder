'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { WebsiteBlock, BlockContent } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectsBlockProps {
  block: WebsiteBlock;
}

export const ProjectsBlock: React.FC<ProjectsBlockProps> = ({ block }) => {
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

  const projects = content.projects as BlockContent[];

  return (
    <section
      id="projects"
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
          {projects?.map((project, index) => {
            const tags = project.tags as string[];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <a
                  href={(project.link as string) || '#'}
                  className={cn(
                    'block overflow-hidden rounded-ios-xl transition-all',
                    'bg-gray-100 dark:bg-gray-800',
                    'hover:shadow-ios-lg dark:hover:shadow-ios-dark-lg'
                  )}
                >
                  <div className="aspect-video w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                    {project.image && (
                      <img
                        src={project.image as string}
                        alt={project.title as string}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold group-hover:text-primary-500">
                      {project.title as string}
                    </h3>
                    <p className="mb-4 text-sm opacity-70">
                      {project.description as string}
                    </p>
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium dark:bg-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
