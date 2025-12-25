'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layout, Palette, Briefcase, User, FileText, ArrowRight, Zap } from 'lucide-react';
import { templates, getTemplatesByCategory } from '@/lib/templates';
import { useWebsiteStore } from '@/stores';
import type { Template, TemplateCategory } from '@/types';
import { Button, Input, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TemplateSelectionProps {
  onComplete: () => void;
}

const categoryInfo: Record<TemplateCategory, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  portfolio: { name: 'Portfolio', icon: Layout },
  personal: { name: 'Personal', icon: User },
  business: { name: 'Business', icon: Briefcase },
  creative: { name: 'Creative', icon: Palette },
  minimal: { name: 'Minimal', icon: Sparkles },
  blog: { name: 'Blog', icon: FileText },
};

export const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'name' | 'template'>('name');
  const [websiteName, setWebsiteName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const { createWebsite } = useWebsiteStore();

  const handleSelectTemplate = (template: Template) => {
    createWebsite(websiteName || 'My Website', {
      blocks: template.blocks.map((b, i) => ({ ...b, order: i })),
      settings: template.settings,
    });
    onComplete();
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : getTemplatesByCategory(selectedCategory);

  if (step === 'name') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 dark:from-surface-dark dark:via-gray-900 dark:to-surface-dark">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:24px_24px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <Card variant="elevated" padding="lg" className="border-0 shadow-2xl shadow-gray-200/50 dark:shadow-black/30">
            <div className="mb-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30"
              >
                <Zap className="h-10 w-10 text-white" />
              </motion.div>
              <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-white">
                Let's build something
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                What would you like to call your website?
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="My Awesome Website"
                  autoFocus
                  className={cn(
                    'w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-4 text-lg outline-none transition-all',
                    'focus:border-primary-500 focus:bg-white focus:shadow-lg focus:shadow-primary-500/10',
                    'dark:border-gray-700 dark:bg-gray-800/50 dark:focus:bg-gray-800',
                    'placeholder:text-gray-400'
                  )}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && websiteName.trim()) {
                      setStep('template');
                    }
                  }}
                />
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={() => setStep('template')}
                disabled={!websiteName.trim()}
                className="group"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-surface-dark dark:via-gray-900 dark:to-surface-dark">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:24px_24px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Sparkles className="h-4 w-4" />
            Templates
          </span>
          <h1 className="mb-3 font-display text-4xl font-bold text-gray-900 dark:text-white">
            Choose your starting point
          </h1>
          <p className="mx-auto max-w-lg text-lg text-gray-500 dark:text-gray-400">
            Pick a template that matches your vision, or start from scratch
          </p>
        </motion.div>

        {/* Category filters - pill style */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
              selectedCategory === 'all'
                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 dark:bg-white dark:text-gray-900'
                : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            All Templates
          </button>
          {(Object.keys(categoryInfo) as TemplateCategory[]).map((category) => {
            const info = categoryInfo[category];
            const Icon = info.icon;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                  selectedCategory === category
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 dark:bg-white dark:text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {info.name}
              </button>
            );
          })}
        </div>

        {/* Templates grid - bento-style */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => handleSelectTemplate(template)}
                className={cn(
                  'group relative w-full overflow-hidden rounded-2xl border-2 border-gray-200/60 bg-white text-left transition-all duration-300',
                  'hover:border-primary-300 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1',
                  'dark:border-gray-700/60 dark:bg-gray-800 dark:hover:border-primary-700 dark:hover:shadow-black/30',
                  template.id === 'blank' && 'border-dashed'
                )}
              >
                {/* Preview area */}
                <div
                  className="aspect-[4/3] w-full overflow-hidden"
                  style={{
                    backgroundColor: template.settings.theme.backgroundColor,
                  }}
                >
                  <div className="flex h-full items-center justify-center p-6">
                    {template.id === 'blank' ? (
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200/80 transition-transform group-hover:scale-110 dark:bg-gray-700">
                          <Layout className="h-7 w-7 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Start from scratch</p>
                      </div>
                    ) : (
                      <div className="w-full space-y-3 transition-transform group-hover:scale-[1.02]">
                        {/* Mock header */}
                        <div
                          className="h-10 w-3/4 rounded-lg"
                          style={{ backgroundColor: template.settings.theme.primaryColor }}
                        />
                        <div
                          className="h-5 w-1/2 rounded-lg opacity-40"
                          style={{ backgroundColor: template.settings.theme.textColor }}
                        />
                        {/* Mock content */}
                        <div className="flex gap-3 pt-2">
                          <div
                            className="h-20 flex-1 rounded-xl"
                            style={{ backgroundColor: template.settings.theme.primaryColor + '15' }}
                          />
                          <div
                            className="h-20 flex-1 rounded-xl"
                            style={{ backgroundColor: template.settings.theme.primaryColor + '15' }}
                          />
                          <div
                            className="h-20 flex-1 rounded-xl"
                            style={{ backgroundColor: template.settings.theme.primaryColor + '15' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-5">
                  <h3 className="mb-1 font-display text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 opacity-0 shadow-lg transition-all group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Back button */}
        <div className="mt-12 text-center">
          <Button variant="ghost" size="lg" onClick={() => setStep('name')}>
            ← Change website name
          </Button>
        </div>
      </div>
    </div>
  );
};
