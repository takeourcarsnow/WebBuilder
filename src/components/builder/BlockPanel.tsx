'use client';

import React, { useMemo, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  User,
  Grid3X3,
  Image,
  Quote,
  Mail,
  MousePointerClick,
  Type,
  Video,
  MoveVertical,
  Minus,
  Share2,
  BarChart3,
  Clock,
  Briefcase,
  Search,
  X,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useWebsiteStore, useEditorStore, useHistoryStore } from '@/stores';
import { blockDefinitions, getBlocksByCategory, blockPresets, type BlockPreset } from '@/lib/constants';
import type { BlockType, WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layout,
  User,
  Grid3X3,
  Image,
  Quote,
  Mail,
  MousePointerClick,
  Type,
  Video,
  MoveVertical,
  Minus,
  Share2,
  BarChart3,
  Clock,
  Briefcase,
};

interface BlockPanelProps {
  className?: string;
}

// Memoized block button component
const BlockButton = memo<{
  type: BlockType;
  name: string;
  icon: string;
  onAdd: (type: BlockType) => void;
}>(({ type, name, icon, onAdd }) => {
  const Icon = iconMap[icon] || Layout;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onAdd(type)}
      className={cn(
        'flex flex-col items-center gap-2 rounded-ios-lg border border-gray-200 bg-white p-3 transition-all',
        'hover:border-primary-300 hover:bg-primary-50 hover:shadow-ios',
        'dark:border-gray-700 dark:bg-surface-dark-secondary',
        'dark:hover:border-primary-700 dark:hover:bg-primary-900/20'
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-ios bg-gray-100 dark:bg-surface-dark-elevated">
        <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </div>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
        {name}
      </span>
    </motion.button>
  );
});

BlockButton.displayName = 'BlockButton';

// Memoized preset button component
const PresetButton = memo<{
  preset: BlockPreset;
  onAdd: (preset: BlockPreset) => void;
}>(({ preset, onAdd }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onAdd(preset)}
      className={cn(
        'flex flex-col items-start gap-1 rounded-ios-lg border border-gray-200 bg-white p-3 transition-all text-left',
        'hover:border-primary-300 hover:bg-primary-50 hover:shadow-ios',
        'dark:border-gray-700 dark:bg-surface-dark-secondary',
        'dark:hover:border-primary-700 dark:hover:bg-primary-900/20'
      )}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {preset.name}
        </span>
      </div>
      <span className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
        {preset.description}
      </span>
      <span className={cn(
        'text-[10px] px-1.5 py-0.5 rounded-full mt-1',
        preset.category === 'professional' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        preset.category === 'creative' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        preset.category === 'minimal' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        preset.category === 'bold' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      )}>
        {preset.category}
      </span>
    </motion.button>
  );
});

PresetButton.displayName = 'PresetButton';

export const BlockPanel: React.FC<BlockPanelProps> = ({ className }) => {
  const { addBlock, website, setCurrentWebsite } = useWebsiteStore();
  const { addNotification, blockSearchQuery, setBlockSearchQuery, setSelectedBlock } = useEditorStore();
  const { pushState } = useHistoryStore();
  
  const [activeView, setActiveView] = useState<'blocks' | 'presets'>('blocks');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['layout', 'content']));

  const handleAddBlock = useCallback((type: BlockType) => {
    if (website) {
      pushState(website, `Add ${type} block`);
    }
    addBlock(type);
    addNotification({
      type: 'success',
      message: 'Block added',
      duration: 2000,
    });
  }, [website, addBlock, addNotification, pushState]);

  const handleAddPreset = useCallback((preset: BlockPreset) => {
    if (website) {
      pushState(website, `Add ${preset.name}`);
      
      // Create a new block from the preset
      const newBlock: WebsiteBlock = {
        id: generateId(),
        type: preset.type,
        content: { ...preset.content },
        style: { ...preset.style },
        order: website.blocks.length,
      };
      
      setCurrentWebsite({
        ...website,
        blocks: [...website.blocks, newBlock],
        updatedAt: new Date(),
      });
      
      setSelectedBlock(newBlock.id);
      addNotification({
        type: 'success',
        message: `${preset.name} added`,
        duration: 2000,
      });
    }
  }, [website, setCurrentWebsite, setSelectedBlock, addNotification, pushState]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const categories = [
    { id: 'layout', name: 'Layout' },
    { id: 'content', name: 'Content' },
    { id: 'media', name: 'Media' },
    { id: 'interactive', name: 'Interactive' },
  ] as const;

  const presetCategories = [
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'bold', name: 'Bold' },
  ] as const;

  // Filter blocks based on search query
  const filteredBlocksByCategory = useMemo(() => {
    const query = blockSearchQuery.toLowerCase().trim();
    if (!query) {
      return Object.fromEntries(
        categories.map(cat => [cat.id, getBlocksByCategory(cat.id)])
      );
    }
    
    return Object.fromEntries(
      categories.map(cat => [
        cat.id,
        getBlocksByCategory(cat.id).filter(
          block =>
            block.name.toLowerCase().includes(query) ||
            block.description.toLowerCase().includes(query) ||
            block.type.toLowerCase().includes(query)
        ),
      ])
    );
  }, [blockSearchQuery]);

  // Filter presets based on search query
  const filteredPresets = useMemo(() => {
    const query = blockSearchQuery.toLowerCase().trim();
    if (!query) return blockPresets;
    
    return blockPresets.filter(
      preset =>
        preset.name.toLowerCase().includes(query) ||
        preset.description.toLowerCase().includes(query) ||
        preset.type.toLowerCase().includes(query) ||
        preset.category.toLowerCase().includes(query)
    );
  }, [blockSearchQuery]);

  const hasBlockResults = Object.values(filteredBlocksByCategory).some(
    blocks => blocks.length > 0
  );

  const hasPresetResults = filteredPresets.length > 0;

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* View toggle */}
      <div className="px-4 mb-3 pt-2">
        <div className="flex rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80">
          <button
            onClick={() => setActiveView('blocks')}
            className={cn(
              'flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200',
              activeView === 'blocks'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            Basic Blocks
          </button>
          <button
            onClick={() => setActiveView('presets')}
            className={cn(
              'flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1',
              activeView === 'presets'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            <Sparkles className="h-3 w-3" />
            Presets
          </button>
        </div>
      </div>

      {/* Search input */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={activeView === 'blocks' ? 'Search blocks...' : 'Search presets...'}
            value={blockSearchQuery}
            onChange={(e) => setBlockSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-9 pr-8 py-2 text-sm rounded-ios-lg border border-gray-200',
              'bg-white dark:bg-surface-dark-secondary dark:border-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500'
            )}
          />
          {blockSearchQuery && (
            <button
              onClick={() => setBlockSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {activeView === 'blocks' ? (
            <motion.div
              key="blocks"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              {!hasBlockResults ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No blocks found for "{blockSearchQuery}"
                  </p>
                  <button
                    onClick={() => setBlockSearchQuery('')}
                    className="mt-2 text-sm text-primary-500 hover:text-primary-600"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                categories.map((category) => {
                  const blocks = filteredBlocksByCategory[category.id];
                  if (blocks.length === 0) return null;
                  
                  const isExpanded = expandedCategories.has(category.id);
                  
                  return (
                    <div key={category.id} className="mb-4">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center gap-2 mb-2 w-full text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        )}
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {category.name}
                        </h3>
                        <span className="text-xs text-gray-400">({blocks.length})</span>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {blocks.map((block) => (
                                <BlockButton
                                  key={block.type}
                                  type={block.type}
                                  name={block.name}
                                  icon={block.icon}
                                  onAdd={handleAddBlock}
                                />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="presets"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {!hasPresetResults ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No presets found for "{blockSearchQuery}"
                  </p>
                  <button
                    onClick={() => setBlockSearchQuery('')}
                    className="mt-2 text-sm text-primary-500 hover:text-primary-600"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                presetCategories.map((category) => {
                  const presets = filteredPresets.filter(p => p.category === category.id);
                  if (presets.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="mb-6">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        {category.name}
                      </h3>
                      <div className="space-y-2">
                        {presets.map((preset) => (
                          <PresetButton
                            key={preset.id}
                            preset={preset}
                            onAdd={handleAddPreset}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
