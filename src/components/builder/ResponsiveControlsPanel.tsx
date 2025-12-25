'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Plus,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  ChevronDown,
  ChevronUp,
  Ruler,
  SplitSquareVertical,
} from 'lucide-react';
import { useEditorStore, useWebsiteStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Button, Input, Switch, Select, Tooltip, TooltipProvider } from '@/components/ui';

interface Breakpoint {
  id: string;
  name: string;
  width: number;
  height?: number;
  icon: React.ReactNode;
  isCustom?: boolean;
}

const defaultBreakpoints: Breakpoint[] = [
  { id: 'desktop', name: 'Desktop', width: 1920, icon: <Monitor className="w-4 h-4" /> },
  { id: 'laptop', name: 'Laptop', width: 1440, icon: <Monitor className="w-4 h-4" /> },
  { id: 'tablet', name: 'Tablet', width: 768, height: 1024, icon: <Tablet className="w-4 h-4" /> },
  { id: 'mobile', name: 'Mobile', width: 375, height: 812, icon: <Smartphone className="w-4 h-4" /> },
];

export const ResponsiveControlsPanel: React.FC = () => {
  const {
    devicePreview,
    setDevicePreview,
    customBreakpoints,
    addCustomBreakpoint,
    removeCustomBreakpoint,
    sideBySidePreview,
    toggleSideBySidePreview,
    zoom,
    setZoom,
    resetZoom,
    selectedBlockId,
  } = useEditorStore();

  const { website, updateBlock } = useWebsiteStore();
  
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('breakpoints');

  const selectedBlock = website?.blocks.find((b) => b.id === selectedBlockId);

  const allBreakpoints: Breakpoint[] = [
    ...defaultBreakpoints,
    ...customBreakpoints.map((bp) => ({
      ...bp,
      icon: <Ruler className="w-4 h-4" />,
      isCustom: true,
    })),
  ];

  const handleAddCustomBreakpoint = () => {
    if (customName && customWidth) {
      addCustomBreakpoint({
        name: customName,
        width: parseInt(customWidth),
        height: customHeight ? parseInt(customHeight) : undefined,
      });
      setCustomName('');
      setCustomWidth('');
      setCustomHeight('');
      setShowCustomForm(false);
    }
  };

  const handleResponsiveStyleChange = (
    breakpoint: 'mobile' | 'tablet',
    property: string,
    value: string
  ) => {
    if (!selectedBlock) return;

    const currentResponsive = selectedBlock.responsiveStyles || {};
    const breakpointStyles = currentResponsive[breakpoint] || {};

    updateBlock(selectedBlock.id, {
      responsiveStyles: {
        ...currentResponsive,
        [breakpoint]: {
          ...breakpointStyles,
          [property]: value,
        },
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Device Preview Selector */}
        <section>
          <button
            onClick={() => toggleSection('breakpoints')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Device Breakpoints
            </h3>
            {expandedSection === 'breakpoints' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'breakpoints' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {/* Breakpoint Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {allBreakpoints.map((bp) => (
                    <TooltipProvider key={bp.id}>
                      <Tooltip content={`${bp.name} (${bp.width}px)`}>
                        <button
                          onClick={() => setDevicePreview(bp.id as any)}
                          className={cn(
                            'relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all',
                            devicePreview === bp.id
                              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300'
                          )}
                        >
                          {bp.icon}
                          <span className="text-xs">{bp.width}</span>
                          {bp.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCustomBreakpoint(bp.id);
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </button>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                {/* Add Custom Breakpoint */}
                {showCustomForm ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2"
                  >
                    <Input
                      placeholder="Name (e.g., Large Tablet)"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Width (px)"
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Height (px)"
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleAddCustomBreakpoint}
                        className="flex-1"
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCustomForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCustomForm(true)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Custom Breakpoint
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Preview Options */}
        <section>
          <button
            onClick={() => toggleSection('preview')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview Options
            </h3>
            {expandedSection === 'preview' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'preview' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {/* Side by Side Preview */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <SplitSquareVertical className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Side-by-Side Preview</span>
                  </div>
                  <Switch
                    checked={sideBySidePreview}
                    onCheckedChange={toggleSideBySidePreview}
                  />
                </div>

                {/* Zoom Control */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Zoom</span>
                    <span className="text-sm font-medium">{zoom}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="25"
                      max="200"
                      value={zoom}
                      onChange={(e) => setZoom(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Button size="sm" variant="ghost" onClick={resetZoom}>
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Responsive Styles for Selected Block */}
        {selectedBlock && (
          <section>
            <button
              onClick={() => toggleSection('responsive-styles')}
              className="w-full flex items-center justify-between mb-3"
            >
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Responsive Styles
              </h3>
              {expandedSection === 'responsive-styles' ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {expandedSection === 'responsive-styles' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Tablet Styles */}
                  <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Tablet className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Tablet (768px)</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Padding</label>
                        <Select
                          value={selectedBlock.responsiveStyles?.tablet?.padding || 'inherit'}
                          onValueChange={(val) => handleResponsiveStyleChange('tablet', 'padding', val)}
                          options={[
                            { value: 'inherit', label: 'Inherit' },
                            { value: 'none', label: 'None' },
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Width</label>
                        <Select
                          value={selectedBlock.responsiveStyles?.tablet?.width || 'inherit'}
                          onValueChange={(val) => handleResponsiveStyleChange('tablet', 'width', val)}
                          options={[
                            { value: 'inherit', label: 'Inherit' },
                            { value: 'narrow', label: 'Narrow' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'wide', label: 'Wide' },
                            { value: 'full', label: 'Full' },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Alignment</label>
                        <Select
                          value={selectedBlock.responsiveStyles?.tablet?.alignment || 'inherit'}
                          onValueChange={(val) => handleResponsiveStyleChange('tablet', 'alignment', val)}
                          options={[
                            { value: 'inherit', label: 'Inherit' },
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Styles */}
                  <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Mobile (375px)</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Padding</label>
                        <Select
                          value={selectedBlock.responsiveStyles?.mobile?.padding || 'inherit'}
                          onValueChange={(val) => handleResponsiveStyleChange('mobile', 'padding', val)}
                          options={[
                            { value: 'inherit', label: 'Inherit' },
                            { value: 'none', label: 'None' },
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Width</label>
                        <Select
                          value={selectedBlock.responsiveStyles?.mobile?.width || 'inherit'}
                          onValueChange={(val) => handleResponsiveStyleChange('mobile', 'width', val)}
                          options={[
                            { value: 'inherit', label: 'Inherit' },
                            { value: 'narrow', label: 'Narrow' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'wide', label: 'Wide' },
                            { value: 'full', label: 'Full' },
                          ]}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Alignment</label>
                        <Select
                          value={selectedBlock.responsiveStyles?.mobile?.alignment || 'inherit'}
                          onValueChange={(val) => handleResponsiveStyleChange('mobile', 'alignment', val)}
                          options={[
                            { value: 'inherit', label: 'Inherit' },
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Block Visibility per Breakpoint */}
                  <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium mb-3">Visibility</h4>
                    <div className="space-y-2">
                      {['Desktop', 'Tablet', 'Mobile'].map((device) => (
                        <div
                          key={device}
                          className="flex items-center justify-between py-1"
                        >
                          <span className="text-sm">{device}</span>
                          <button
                            className={cn(
                              'p-1.5 rounded-lg transition-colors',
                              'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            )}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Quick Tips */}
        <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            💡 Responsive Tips
          </h4>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Use the device selector to preview different screen sizes</li>
            <li>• Override styles per breakpoint for fine-tuned control</li>
            <li>• Toggle visibility to hide blocks on specific devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
