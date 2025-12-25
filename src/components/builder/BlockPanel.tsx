'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useWebsiteStore, useEditorStore } from '@/stores';
import { blockDefinitions, getBlocksByCategory } from '@/lib/constants';
import type { BlockType } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui';

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

export const BlockPanel: React.FC<BlockPanelProps> = ({ className }) => {
  const { addBlock } = useWebsiteStore();
  const { addNotification, blockSearchQuery, setBlockSearchQuery } = useEditorStore();

  const handleAddBlock = (type: BlockType) => {
    addBlock(type);
    addNotification({
      type: 'success',
      message: 'Block added successfully',
      duration: 2000,
    });
  };

  const categories = [
    { id: 'layout', name: 'Layout' },
    { id: 'content', name: 'Content' },
    { id: 'media', name: 'Media' },
    { id: 'interactive', name: 'Interactive' },
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

  const hasResults = Object.values(filteredBlocksByCategory).some(
    blocks => blocks.length > 0
  );

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="mb-4 px-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Blocks
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click to add sections to your website
        </p>
      </div>

      {/* Search input */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search blocks..."
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
        {!hasResults ? (
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
            
            return (
              <div key={category.id} className="mb-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {category.name}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {blocks.map((block) => {
                    const Icon = iconMap[block.icon] || Layout;
                    return (
                      <motion.button
                        key={block.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddBlock(block.type)}
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
                          {block.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
