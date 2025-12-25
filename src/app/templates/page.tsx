'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Layout, Palette, Briefcase, User, FileText, ArrowRight } from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { templates, getTemplatesByCategory } from '@/lib/templates';
import { useWebsiteStore } from '@/stores';
import type { Template, TemplateCategory } from '@/types';
import { cn } from '@/lib/utils';

const categoryInfo: Record<TemplateCategory, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  portfolio: { name: 'Portfolio', icon: Layout },
  personal: { name: 'Personal', icon: User },
  business: { name: 'Business', icon: Briefcase },
  creative: { name: 'Creative', icon: Palette },
  minimal: { name: 'Minimal', icon: Sparkles },
  blog: { name: 'Blog', icon: FileText },
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const { createWebsite } = useWebsiteStore();
  const router = useRouter();

  const handleSelectTemplate = (template: Template) => {
    createWebsite(template.name, {
      blocks: template.blocks.map((b, i) => ({ ...b, order: i })),
      settings: template.settings,
    });
    router.push('/builder');
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : getTemplatesByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      <Header />

      <main className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              System Architecture
              <span className="block text-accent-teal">Templates</span>
            </h1>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-text-dark-secondary">
              Production-ready architectural patterns. 
              Enterprise-tested configurations built for scale.
            </p>
          </motion.div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap gap-px border-b border-gray-200 dark:border-gray-800">
            <button
              className={cn(
                'border-b-2 px-6 py-3 text-sm font-medium transition-colors',
                selectedCategory === 'all'
                  ? 'border-accent-teal text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              )}
              onClick={() => setSelectedCategory('all')}
            >
              All Systems
            </button>
            {(Object.keys(categoryInfo) as TemplateCategory[]).map((category) => {
              const info = categoryInfo[category];
              const Icon = info.icon;
              return (
                <button
                  key={category}
                  className={cn(
                    'flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'border-accent-teal text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                  onClick={() => setSelectedCategory(category)}
                >
                  <Icon className="h-4 w-4" />
                  {info.name}
                </button>
              );
            })}
          </div>

          {/* Templates grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant="elevated"
                  padding="none"
                  className="group overflow-hidden border border-gray-200 transition-all hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                >
                  <div
                    className="aspect-video w-full border-b border-gray-200 dark:border-gray-800"
                    style={{
                      backgroundColor: template.settings.theme.backgroundColor,
                    }}
                  >
                    <div className="flex h-full items-center justify-center p-6">
                      {template.id === 'blank' ? (
                        <div className="text-center">
                          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-surface-dark-secondary">
                            <Layout className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">Empty Configuration</p>
                        </div>
                      ) : (
                        <div className="w-full space-y-2">
                          <div
                            className="h-8 w-3/4"
                            style={{ backgroundColor: template.settings.theme.primaryColor }}
                          />
                          <div
                            className="h-4 w-1/2 opacity-50"
                            style={{ backgroundColor: template.settings.theme.textColor }}
                          />
                          <div className="flex gap-2">
                            <div
                              className="h-16 w-1/3 border border-gray-200 dark:border-gray-700"
                              style={{ backgroundColor: template.settings.theme.primaryColor + '10' }}
                            />
                            <div
                              className="h-16 w-1/3 border border-gray-200 dark:border-gray-700"
                              style={{ backgroundColor: template.settings.theme.primaryColor + '10' }}
                            />
                            <div
                              className="h-16 w-1/3 border border-gray-200 dark:border-gray-700"
                              style={{ backgroundColor: template.settings.theme.primaryColor + '10' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 dark:text-text-dark-secondary">
                      {template.description}
                    </p>
                    <Button
                      fullWidth
                      size="sm"
                      onClick={() => handleSelectTemplate(template)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Deploy Configuration
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
