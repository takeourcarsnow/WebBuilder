'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layout, Palette, Briefcase, User, FileText } from 'lucide-react';
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-surface-dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card variant="elevated" padding="lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Sparkles className="h-8 w-8 text-primary-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Create Your Website
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Let&apos;s start by giving your website a name
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Website Name"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                placeholder="My Personal Website"
                autoFocus
              />

              <Button
                fullWidth
                onClick={() => setStep('template')}
                disabled={!websiteName.trim()}
              >
                Continue
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-dark">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Choose a Template
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Pick a starting point for your website, or start from scratch
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                onClick={() => handleSelectTemplate(template)}
              >
                <div
                  className="aspect-video w-full"
                  style={{
                    backgroundColor: template.settings.theme.backgroundColor,
                  }}
                >
                  <div className="flex h-full items-center justify-center p-4">
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
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-primary-500 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Back button */}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => setStep('name')}>
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
};
