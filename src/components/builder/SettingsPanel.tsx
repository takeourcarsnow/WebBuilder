'use client';

import React from 'react';
import { useWebsiteStore } from '@/stores';
import { Input, Textarea, Select, ColorPicker } from '@/components/ui';
import { fonts } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  className?: string;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ className }) => {
  const { website, updateSettings, updateWebsite } = useWebsiteStore();

  if (!website) {
    return (
      <div className={cn('flex h-full items-center justify-center p-4', className)}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No website selected
        </p>
      </div>
    );
  }

  const settings = website.settings;

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Website Settings
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* General */}
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            General
          </h3>
          <div className="space-y-4">
            <Input
              label="Website Name"
              value={website.name}
              onChange={(e) => updateWebsite({ name: e.target.value })}
            />
            <Input
              label="Site Title"
              value={settings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              hint="Appears in browser tab"
            />
            <Textarea
              label="Description"
              value={settings.description}
              onChange={(e) => updateSettings({ description: e.target.value })}
              rows={3}
              hint="For SEO and social sharing"
            />
          </div>
        </section>

        {/* Theme */}
        <section className="mb-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Theme
          </h3>
          <div className="space-y-4">
            <Select
              label="Color Mode"
              value={settings.theme.mode}
              onValueChange={(value) =>
                updateSettings({
                  theme: { ...settings.theme, mode: value as 'light' | 'dark' | 'auto' },
                })
              }
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'Auto (System)' },
              ]}
            />

            <ColorPicker
              label="Primary Color"
              value={settings.theme.primaryColor}
              onChange={(color) =>
                updateSettings({
                  theme: { ...settings.theme, primaryColor: color },
                })
              }
            />

            <ColorPicker
              label="Background Color"
              value={settings.theme.backgroundColor}
              onChange={(color) =>
                updateSettings({
                  theme: { ...settings.theme, backgroundColor: color },
                })
              }
            />

            <ColorPicker
              label="Text Color"
              value={settings.theme.textColor}
              onChange={(color) =>
                updateSettings({
                  theme: { ...settings.theme, textColor: color },
                })
              }
            />
          </div>
        </section>

        {/* Typography */}
        <section className="mb-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Typography
          </h3>
          <div className="space-y-4">
            <Select
              label="Heading Font"
              value={settings.fonts.heading}
              onValueChange={(value) =>
                updateSettings({
                  fonts: { ...settings.fonts, heading: value },
                })
              }
              options={fonts.heading.map((f) => ({ value: f.value, label: f.name }))}
            />

            <Select
              label="Body Font"
              value={settings.fonts.body}
              onValueChange={(value) =>
                updateSettings({
                  fonts: { ...settings.fonts, body: value },
                })
              }
              options={fonts.body.map((f) => ({ value: f.value, label: f.name }))}
            />

            <Select
              label="Heading Size"
              value={settings.fonts.headingSize}
              onValueChange={(value) =>
                updateSettings({
                  fonts: { ...settings.fonts, headingSize: value as 'small' | 'medium' | 'large' },
                })
              }
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />

            <Select
              label="Body Size"
              value={settings.fonts.bodySize}
              onValueChange={(value) =>
                updateSettings({
                  fonts: { ...settings.fonts, bodySize: value as 'small' | 'medium' | 'large' },
                })
              }
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </div>
        </section>

        {/* SEO */}
        <section className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            SEO
          </h3>
          <div className="space-y-4">
            <Input
              label="Meta Title"
              value={settings.seo?.metaTitle || ''}
              onChange={(e) =>
                updateSettings({
                  seo: { ...settings.seo, metaTitle: e.target.value },
                })
              }
              hint="Override the site title for search engines"
            />
            <Textarea
              label="Meta Description"
              value={settings.seo?.metaDescription || ''}
              onChange={(e) =>
                updateSettings({
                  seo: { ...settings.seo, metaDescription: e.target.value },
                })
              }
              rows={3}
              hint="Appears in search results"
            />
            <Input
              label="Social Image URL"
              value={settings.seo?.ogImage || ''}
              onChange={(e) =>
                updateSettings({
                  seo: { ...settings.seo, ogImage: e.target.value },
                })
              }
              placeholder="https://..."
              hint="Image shown when shared on social media"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
