'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush,
  Palette,
  Type,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  Copy,
  Plus,
  Trash2,
  Save,
  Upload,
} from 'lucide-react';
import { useWebsiteStore } from '@/stores';
import { ColorPicker, GradientPicker, Slider, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
    letterSpacing: {
      tight: string;
      normal: string;
      wide: string;
    };
  };
}

const defaultTokens: DesignTokens = {
  colors: {
    primary: '#0ea5e9',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  typography: {
    fontFamily: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },
};

// Predefined design system presets
const designPresets = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary',
    colors: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Elegant dark theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#94a3b8',
      accent: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Earthy and organic',
    colors: {
      primary: '#059669',
      secondary: '#78716c',
      accent: '#eab308',
      background: '#fefce8',
      surface: '#ecfccb',
      text: '#1c1917',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional and trustworthy',
    colors: {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#0891b2',
      background: '#ffffff',
      surface: '#f1f5f9',
      text: '#1e293b',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Fun and energetic',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#fdf4ff',
      surface: '#fae8ff',
      text: '#581c87',
    },
  },
];

interface DesignTokensPanelProps {
  className?: string;
}

export const DesignTokensPanel: React.FC<DesignTokensPanelProps> = ({ className }) => {
  const { website, updateSettings } = useWebsiteStore();
  const [tokens, setTokens] = useState<DesignTokens>(defaultTokens);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['colors']));
  const [savedPresets, setSavedPresets] = useState<Array<{ id: string; name: string; tokens: DesignTokens }>>([]);
  const [presetName, setPresetName] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const updateToken = useCallback(<K extends keyof DesignTokens>(
    category: K,
    key: keyof DesignTokens[K],
    value: string
  ) => {
    setTokens(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }, []);

  const applyPreset = (preset: typeof designPresets[0]) => {
    setTokens(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...preset.colors,
        textMuted: preset.colors.secondary,
        border: preset.colors.secondary + '40',
      },
    }));
  };

  const applyTokensToTheme = () => {
    if (!website) return;
    
    updateSettings({
      theme: {
        ...website.settings.theme,
        primaryColor: tokens.colors.primary,
        secondaryColor: tokens.colors.secondary,
        backgroundColor: tokens.colors.background,
        textColor: tokens.colors.text,
        accentColor: tokens.colors.accent,
      },
    });
  };

  const savePreset = () => {
    if (!presetName.trim()) return;
    
    setSavedPresets(prev => [
      ...prev,
      { id: Date.now().toString(), name: presetName, tokens },
    ]);
    setPresetName('');
  };

  const exportTokens = () => {
    const cssVariables = `
:root {
  /* Colors */
  --color-primary: ${tokens.colors.primary};
  --color-secondary: ${tokens.colors.secondary};
  --color-accent: ${tokens.colors.accent};
  --color-background: ${tokens.colors.background};
  --color-surface: ${tokens.colors.surface};
  --color-text: ${tokens.colors.text};
  --color-text-muted: ${tokens.colors.textMuted};
  --color-border: ${tokens.colors.border};
  --color-success: ${tokens.colors.success};
  --color-warning: ${tokens.colors.warning};
  --color-error: ${tokens.colors.error};
  
  /* Spacing */
  --spacing-xs: ${tokens.spacing.xs};
  --spacing-sm: ${tokens.spacing.sm};
  --spacing-md: ${tokens.spacing.md};
  --spacing-lg: ${tokens.spacing.lg};
  --spacing-xl: ${tokens.spacing.xl};
  --spacing-2xl: ${tokens.spacing['2xl']};
  
  /* Border Radius */
  --radius-none: ${tokens.borderRadius.none};
  --radius-sm: ${tokens.borderRadius.sm};
  --radius-md: ${tokens.borderRadius.md};
  --radius-lg: ${tokens.borderRadius.lg};
  --radius-xl: ${tokens.borderRadius.xl};
  --radius-full: ${tokens.borderRadius.full};
  
  /* Typography */
  --font-heading: ${tokens.typography.fontFamily.heading};
  --font-body: ${tokens.typography.fontFamily.body};
  --font-mono: ${tokens.typography.fontFamily.mono};
}`.trim();

    const blob = new Blob([cssVariables], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    {
      id: 'colors',
      title: 'Colors',
      icon: Palette,
      content: (
        <div className="space-y-4">
          {/* Quick Presets */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Quick Presets</p>
            <div className="grid grid-cols-2 gap-2">
              {designPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex -space-x-1">
                    {Object.values(preset.colors).slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{preset.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Tokens */}
          <div className="space-y-3">
            {Object.entries(tokens.colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <ColorPicker
                  label=""
                  value={value}
                  onChange={(color) => updateToken('colors', key as keyof DesignTokens['colors'], color)}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize flex-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <code className="text-xs text-gray-500 font-mono">{value}</code>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'typography',
      title: 'Typography',
      icon: Type,
      content: (
        <div className="space-y-4">
          {/* Font Family */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">Font Families</p>
            {Object.entries(tokens.typography.fontFamily).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">{key}</label>
                <select
                  value={value}
                  onChange={(e) => {
                    setTokens(prev => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        fontFamily: {
                          ...prev.typography.fontFamily,
                          [key]: e.target.value,
                        },
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Montserrat, sans-serif">Montserrat</option>
                  <option value="Playfair Display, serif">Playfair Display</option>
                  <option value="Lora, serif">Lora</option>
                  <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                  <option value="-apple-system, BlinkMacSystemFont, sans-serif">System</option>
                </select>
              </div>
            ))}
          </div>

          {/* Font Sizes Preview */}
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 font-medium">Font Sizes Preview</p>
            <div className="space-y-2">
              {Object.entries(tokens.typography.fontSize).map(([key, value]) => (
                <div key={key} className="flex items-baseline justify-between">
                  <span style={{ fontSize: value }} className="text-gray-900 dark:text-white">
                    {key.toUpperCase()}
                  </span>
                  <code className="text-xs text-gray-500 font-mono">{value}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'spacing',
      title: 'Spacing',
      icon: Layers,
      content: (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-medium">Spacing Scale</p>
          <div className="space-y-3">
            {Object.entries(tokens.spacing).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className="h-6 bg-primary-500 rounded"
                  style={{ width: `calc(${value} * 4)` }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 w-8">{key}</span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateToken('spacing', key as keyof DesignTokens['spacing'], e.target.value)}
                  className="flex-1 px-2 py-1 text-xs font-mono rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'effects',
      title: 'Effects',
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          {/* Border Radius */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-medium">Border Radius</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(tokens.borderRadius).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 bg-gray-200 dark:bg-gray-700"
                    style={{ borderRadius: value }}
                  />
                  <span className="text-xs text-gray-500">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shadows */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 font-medium">Shadows</p>
            <div className="space-y-3">
              {Object.entries(tokens.shadows).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-16 h-10 bg-white dark:bg-gray-800 rounded-lg"
                    style={{ boxShadow: value }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Design Tokens
        </h2>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={applyTokensToTheme}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
        >
          <Check className="w-4 h-4" />
          Apply to Theme
        </button>
        <button
          onClick={exportTokens}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div key={section.id} className="border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                  {section.title}
                </span>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Save Preset */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-medium mb-2">Save as Preset</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <button
              onClick={savePreset}
              disabled={!presetName.trim()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
          
          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div className="mt-3 space-y-2">
              {savedPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{preset.name}</span>
                  <button
                    onClick={() => setTokens(preset.tokens)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setSavedPresets(prev => prev.filter(p => p.id !== preset.id))}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
