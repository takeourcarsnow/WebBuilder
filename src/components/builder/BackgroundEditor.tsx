'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Palette,
  Grid3X3,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  Link,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Select, Slider, ColorPicker, Switch } from '@/components/ui';
import { useWebsiteStore, useEditorStore } from '@/stores';

interface GradientStop {
  id: string;
  color: string;
  position: number;
}

interface BackgroundSettings {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'video';
  solidColor: string;
  gradient: {
    type: 'linear' | 'radial' | 'conic';
    angle: number;
    stops: GradientStop[];
  };
  image: {
    url: string;
    position: string;
    size: 'cover' | 'contain' | 'auto' | 'custom';
    customSize?: string;
    repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    attachment: 'scroll' | 'fixed';
    overlay?: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
  pattern: {
    type: string;
    color: string;
    backgroundColor: string;
    size: number;
    opacity: number;
  };
  video: {
    url: string;
    overlay?: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
}

const patternPresets = [
  { id: 'dots', name: 'Dots', svg: 'radial-gradient(circle, currentColor 1px, transparent 1px)' },
  { id: 'grid', name: 'Grid', svg: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px)' },
  { id: 'diagonal', name: 'Diagonal Lines', svg: 'repeating-linear-gradient(45deg, currentColor, currentColor 1px, transparent 1px, transparent 10px)' },
  { id: 'zigzag', name: 'Zigzag', svg: 'linear-gradient(135deg, currentColor 25%, transparent 25%), linear-gradient(225deg, currentColor 25%, transparent 25%)' },
  { id: 'waves', name: 'Waves', svg: 'radial-gradient(ellipse at 50% 0%, currentColor 30%, transparent 30%)' },
  { id: 'cross', name: 'Cross', svg: 'linear-gradient(currentColor 2px, transparent 2px), linear-gradient(90deg, currentColor 2px, transparent 2px)' },
];

const gradientPresets = [
  { name: 'Sunset', stops: [{ color: '#f97316', position: 0 }, { color: '#ec4899', position: 100 }] },
  { name: 'Ocean', stops: [{ color: '#06b6d4', position: 0 }, { color: '#3b82f6', position: 100 }] },
  { name: 'Forest', stops: [{ color: '#22c55e', position: 0 }, { color: '#14b8a6', position: 100 }] },
  { name: 'Grape', stops: [{ color: '#8b5cf6', position: 0 }, { color: '#ec4899', position: 100 }] },
  { name: 'Fire', stops: [{ color: '#ef4444', position: 0 }, { color: '#f59e0b', position: 100 }] },
  { name: 'Night', stops: [{ color: '#1e293b', position: 0 }, { color: '#0f172a', position: 100 }] },
  { name: 'Aurora', stops: [{ color: '#06b6d4', position: 0 }, { color: '#8b5cf6', position: 50 }, { color: '#ec4899', position: 100 }] },
  { name: 'Twilight', stops: [{ color: '#6366f1', position: 0 }, { color: '#a855f7', position: 50 }, { color: '#ec4899', position: 100 }] },
];

const unsplashCollections = [
  { id: 'abstract', name: 'Abstract', query: 'abstract background' },
  { id: 'nature', name: 'Nature', query: 'nature landscape' },
  { id: 'minimal', name: 'Minimal', query: 'minimal background' },
  { id: 'texture', name: 'Textures', query: 'texture pattern' },
  { id: 'gradient', name: 'Gradients', query: 'gradient blur' },
];

export const BackgroundEditor: React.FC = () => {
  const { website, updateBlock } = useWebsiteStore();
  const { selectedBlockId } = useEditorStore();
  const selectedBlock = website?.blocks.find((b) => b.id === selectedBlockId);

  const [expandedSection, setExpandedSection] = useState<string>('type');
  const [settings, setSettings] = useState<BackgroundSettings>({
    type: 'solid',
    solidColor: selectedBlock?.style.backgroundColor || '#ffffff',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#6366f1', position: 0 },
        { id: '2', color: '#ec4899', position: 100 },
      ],
    },
    image: {
      url: '',
      position: 'center',
      size: 'cover',
      repeat: 'no-repeat',
      attachment: 'scroll',
      overlay: {
        enabled: false,
        color: '#000000',
        opacity: 50,
      },
    },
    pattern: {
      type: 'dots',
      color: '#e5e7eb',
      backgroundColor: '#ffffff',
      size: 20,
      opacity: 100,
    },
    video: {
      url: '',
      overlay: {
        enabled: true,
        color: '#000000',
        opacity: 50,
      },
    },
  });

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const addGradientStop = () => {
    const newStop: GradientStop = {
      id: generateId(),
      color: '#ffffff',
      position: 50,
    };
    setSettings({
      ...settings,
      gradient: {
        ...settings.gradient,
        stops: [...settings.gradient.stops, newStop].sort((a, b) => a.position - b.position),
      },
    });
  };

  const updateGradientStop = (id: string, updates: Partial<GradientStop>) => {
    setSettings({
      ...settings,
      gradient: {
        ...settings.gradient,
        stops: settings.gradient.stops
          .map((stop) => (stop.id === id ? { ...stop, ...updates } : stop))
          .sort((a, b) => a.position - b.position),
      },
    });
  };

  const removeGradientStop = (id: string) => {
    if (settings.gradient.stops.length <= 2) return;
    setSettings({
      ...settings,
      gradient: {
        ...settings.gradient,
        stops: settings.gradient.stops.filter((stop) => stop.id !== id),
      },
    });
  };

  const applyGradientPreset = (preset: typeof gradientPresets[0]) => {
    setSettings({
      ...settings,
      gradient: {
        ...settings.gradient,
        stops: preset.stops.map((s, i) => ({ id: generateId(), ...s })),
      },
    });
  };

  const generateBackgroundCSS = (): string => {
    switch (settings.type) {
      case 'solid':
        return settings.solidColor;
      case 'gradient': {
        const { type, angle, stops } = settings.gradient;
        const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(', ');
        if (type === 'linear') {
          return `linear-gradient(${angle}deg, ${stopsStr})`;
        } else if (type === 'radial') {
          return `radial-gradient(circle, ${stopsStr})`;
        } else {
          return `conic-gradient(from ${angle}deg, ${stopsStr})`;
        }
      }
      case 'image':
        return settings.image.url ? `url(${settings.image.url})` : 'transparent';
      case 'pattern':
        return settings.pattern.backgroundColor;
      default:
        return 'transparent';
    }
  };

  const applyBackground = () => {
    if (!selectedBlock) return;

    const bgCSS = generateBackgroundCSS();
    
    // For now, just update the background color
    // In a full implementation, you'd also handle custom CSS for gradients, images, etc.
    updateBlock(selectedBlock.id, {
      style: {
        ...selectedBlock.style,
        backgroundColor: settings.type === 'solid' ? settings.solidColor : undefined,
      },
      customCSS: settings.type !== 'solid' ? `background: ${bgCSS};` : undefined,
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Background Type */}
        <section>
          <button
            onClick={() => toggleSection('type')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Type
            </h3>
            {expandedSection === 'type' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'type' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-4 gap-2 overflow-hidden"
              >
                {[
                  { type: 'solid', icon: <Palette className="w-4 h-4" />, label: 'Solid' },
                  { type: 'gradient', icon: <Layers className="w-4 h-4" />, label: 'Gradient' },
                  { type: 'image', icon: <Image className="w-4 h-4" />, label: 'Image' },
                  { type: 'pattern', icon: <Grid3X3 className="w-4 h-4" />, label: 'Pattern' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setSettings({ ...settings, type: item.type as any })}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                      settings.type === item.type
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    )}
                  >
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Solid Color */}
        {settings.type === 'solid' && (
          <section className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Solid Color
            </h3>
            <ColorPicker
              value={settings.solidColor}
              onChange={(color) => setSettings({ ...settings, solidColor: color })}
            />
          </section>
        )}

        {/* Gradient Editor */}
        {settings.type === 'gradient' && (
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gradient Settings
            </h3>

            {/* Gradient Type */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Type</label>
              <div className="flex gap-2">
                {['linear', 'radial', 'conic'].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        gradient: { ...settings.gradient, type: type as any },
                      })
                    }
                    className={cn(
                      'flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors',
                      settings.gradient.type === type
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    )}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle */}
            {(settings.gradient.type === 'linear' || settings.gradient.type === 'conic') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-gray-500">Angle</label>
                  <span className="text-xs font-mono">{settings.gradient.angle}°</span>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  value={[settings.gradient.angle]}
                  onValueChange={([val]) =>
                    setSettings({
                      ...settings,
                      gradient: { ...settings.gradient, angle: val },
                    })
                  }
                />
              </div>
            )}

            {/* Color Stops */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500">Color Stops</label>
                <Button size="sm" variant="ghost" onClick={addGradientStop}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {settings.gradient.stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <ColorPicker
                      value={stop.color}
                      onChange={(color) => updateGradientStop(stop.id, { color })}
                    />
                    <div className="flex-1">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[stop.position]}
                        onValueChange={([val]) => updateGradientStop(stop.id, { position: val })}
                      />
                    </div>
                    <span className="text-xs font-mono w-8">{stop.position}%</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGradientStop(stop.id)}
                      disabled={settings.gradient.stops.length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Presets */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Presets</label>
              <div className="grid grid-cols-4 gap-2">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyGradientPreset(preset)}
                    className="aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${preset.stops
                        .map((s) => `${s.color} ${s.position}%`)
                        .join(', ')})`,
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Image Background */}
        {settings.type === 'image' && (
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Image
            </h3>

            {/* Image URL */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Image URL</label>
              <div className="flex gap-2">
                <Input
                  value={settings.image.url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      image: { ...settings.image, url: e.target.value },
                    })
                  }
                  placeholder="https://..."
                />
                <Button variant="outline">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Images from Unsplash */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Quick Select</label>
              <div className="flex flex-wrap gap-2">
                {unsplashCollections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        image: {
                          ...settings.image,
                          url: `https://source.unsplash.com/1600x900/?${col.query}`,
                        },
                      })
                    }
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Position */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Position</label>
              <Select
                value={settings.image.position}
                onValueChange={(val) =>
                  setSettings({
                    ...settings,
                    image: { ...settings.image, position: val },
                  })
                }
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            </div>

            {/* Image Size */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Size</label>
              <Select
                value={settings.image.size}
                onValueChange={(val: any) =>
                  setSettings({
                    ...settings,
                    image: { ...settings.image, size: val },
                  })
                }
                options={[
                  { value: 'cover', label: 'Cover' },
                  { value: 'contain', label: 'Contain' },
                  { value: 'auto', label: 'Auto' },
                ]}
              />
            </div>

            {/* Fixed/Scroll */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Fixed Background</span>
              <Switch
                checked={settings.image.attachment === 'fixed'}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    image: {
                      ...settings.image,
                      attachment: checked ? 'fixed' : 'scroll',
                    },
                  })
                }
              />
            </div>

            {/* Overlay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Color Overlay</span>
                <Switch
                  checked={settings.image.overlay?.enabled || false}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      image: {
                        ...settings.image,
                        overlay: {
                          ...settings.image.overlay!,
                          enabled: checked,
                        },
                      },
                    })
                  }
                />
              </div>
              {settings.image.overlay?.enabled && (
                <div className="space-y-2 pl-4">
                  <ColorPicker
                    value={settings.image.overlay.color}
                    onChange={(color) =>
                      setSettings({
                        ...settings,
                        image: {
                          ...settings.image,
                          overlay: { ...settings.image.overlay!, color },
                        },
                      })
                    }
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Opacity</span>
                    <span className="text-xs font-mono">{settings.image.overlay.opacity}%</span>
                  </div>
                  <Slider
                    min={0}
                    max={100}
                    value={[settings.image.overlay.opacity]}
                    onValueChange={([val]) =>
                      setSettings({
                        ...settings,
                        image: {
                          ...settings.image,
                          overlay: { ...settings.image.overlay!, opacity: val },
                        },
                      })
                    }
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Pattern Background */}
        {settings.type === 'pattern' && (
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pattern Settings
            </h3>

            <div>
              <label className="text-xs text-gray-500 mb-2 block">Pattern Type</label>
              <div className="grid grid-cols-3 gap-2">
                {patternPresets.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() =>
                      setSettings({
                        ...settings,
                        pattern: { ...settings.pattern, type: pattern.id },
                      })
                    }
                    className={cn(
                      'aspect-square rounded-lg border transition-all p-2',
                      settings.pattern.type === pattern.id
                        ? 'border-primary-500'
                        : 'border-gray-200 dark:border-gray-700'
                    )}
                    style={{
                      background: pattern.svg,
                      backgroundSize: `${settings.pattern.size}px ${settings.pattern.size}px`,
                    }}
                    title={pattern.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pattern Color</label>
              <ColorPicker
                value={settings.pattern.color}
                onChange={(color) =>
                  setSettings({
                    ...settings,
                    pattern: { ...settings.pattern, color },
                  })
                }
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Background Color</label>
              <ColorPicker
                value={settings.pattern.backgroundColor}
                onChange={(color) =>
                  setSettings({
                    ...settings,
                    pattern: { ...settings.pattern, backgroundColor: color },
                  })
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500">Pattern Size</label>
                <span className="text-xs font-mono">{settings.pattern.size}px</span>
              </div>
              <Slider
                min={10}
                max={100}
                value={[settings.pattern.size]}
                onValueChange={([val]) =>
                  setSettings({
                    ...settings,
                    pattern: { ...settings.pattern, size: val },
                  })
                }
              />
            </div>
          </section>
        )}

        {/* Preview */}
        <section className="mt-4">
          <label className="text-xs text-gray-500 mb-2 block">Preview</label>
          <div
            className="h-32 rounded-xl border border-gray-200 dark:border-gray-700"
            style={{
              background: generateBackgroundCSS(),
              backgroundSize: settings.type === 'image' ? settings.image.size : undefined,
              backgroundPosition: settings.type === 'image' ? settings.image.position : undefined,
              backgroundRepeat: settings.type === 'image' ? settings.image.repeat : undefined,
              backgroundAttachment: settings.type === 'image' ? settings.image.attachment : undefined,
            }}
          />
        </section>

        {/* Apply Button */}
        <Button onClick={applyBackground} className="w-full">
          Apply Background
        </Button>
      </div>
    </div>
  );
};
