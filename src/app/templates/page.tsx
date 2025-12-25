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
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
              Website Templates
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Choose from our collection of professionally designed templates. 
              Each one is fully customizable to match your style.
            </p>
          </motion.div>

          {/* Category filters */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Templates
            </Button>
            {(Object.keys(categoryInfo) as TemplateCategory[]).map((category) => {
              const info = categoryInfo[category];
              const Icon = info.icon;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  <Icon className="h-4 w-4" />
                  {info.name}
                </Button>
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
                  hoverable
                  className="group overflow-hidden"
                >
                  <div
                    className="aspect-video w-full"
                    style={{
                      backgroundColor: template.settings.theme.backgroundColor,
                    }}
                  >
                    <div className="flex h-full items-center justify-center p-6">
                      {template.id === 'blank' ? (
                        <div className="text-center">
                          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <Layout className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">Blank Canvas</p>
                        </div>
                      ) : (
                        <div className="w-full space-y-2">
                          <div
                            className="h-8 w-3/4 rounded"
                            style={{ backgroundColor: template.settings.theme.primaryColor }}
                          />
                          <div
                            className="h-4 w-1/2 rounded opacity-50"
                            style={{ backgroundColor: template.settings.theme.textColor }}
                          />
                          <div className="flex gap-2">
                            <div
                              className="h-16 w-1/3 rounded"
                              style={{ backgroundColor: template.settings.theme.primaryColor + '20' }}
                            />
                            <div
                              className="h-16 w-1/3 rounded"
                              style={{ backgroundColor: template.settings.theme.primaryColor + '20' }}
                            />
                            <div
                              className="h-16 w-1/3 rounded"
                              style={{ backgroundColor: template.settings.theme.primaryColor + '20' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                    <Button
                      fullWidth
                      onClick={() => handleSelectTemplate(template)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Use Template
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
