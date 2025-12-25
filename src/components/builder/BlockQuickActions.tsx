'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MessageSquare,
  Palette,
  Settings2,
} from 'lucide-react';
import { useWebsiteStore, useEditorStore, useHistoryStore } from '@/stores';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';

interface BlockQuickActionsProps {
  block: WebsiteBlock;
  position?: 'top' | 'bottom' | { x: number; y: number };
  className?: string;
}

export const BlockQuickActions: React.FC<BlockQuickActionsProps> = ({
  block,
  position = 'top',
  className,
}) => {
  const { 
    deleteBlock, 
    duplicateBlock, 
    moveBlock, 
    toggleBlockLock, 
    toggleBlockVisibility,
    website,
  } = useWebsiteStore();
  const { 
    setSelectedBlock, 
    setActiveSidebarTab, 
    addNotification,
    hoveredBlockId,
  } = useEditorStore();
  const { pushState } = useHistoryStore();

  const isVisible = hoveredBlockId === block.id;
  const isLocked = block.isLocked === true;
  const isHidden = block.isVisible === false;
  const totalBlocks = website?.blocks.length || 0;
  
  // Determine position type
  const positionType = typeof position === 'object' ? 'custom' : position;

  const handleAction = (action: () => void, message?: string) => {
    if (website) {
      pushState(website, message || 'Block action');
    }
    action();
    if (message) {
      addNotification({ type: 'success', message, duration: 1500 });
    }
  };

  const actions = [
    {
      icon: ChevronUp,
      label: 'Move up',
      onClick: () => {
        if (block.order > 0) {
          handleAction(() => moveBlock(block.id, block.order - 1), 'Block moved up');
        }
      },
      disabled: block.order === 0,
      show: true,
    },
    {
      icon: ChevronDown,
      label: 'Move down',
      onClick: () => {
        if (block.order < totalBlocks - 1) {
          handleAction(() => moveBlock(block.id, block.order + 1), 'Block moved down');
        }
      },
      disabled: block.order === totalBlocks - 1,
      show: true,
    },
    { type: 'divider' },
    {
      icon: Copy,
      label: 'Duplicate',
      onClick: () => {
        const newBlock = duplicateBlock(block.id);
        if (newBlock) {
          setSelectedBlock(newBlock.id);
          addNotification({ type: 'success', message: 'Block duplicated', duration: 1500 });
        }
      },
      show: true,
    },
    {
      icon: isHidden ? EyeOff : Eye,
      label: isHidden ? 'Show' : 'Hide',
      onClick: () => handleAction(() => toggleBlockVisibility(block.id)),
      show: true,
      active: isHidden,
    },
    {
      icon: isLocked ? Lock : Unlock,
      label: isLocked ? 'Unlock' : 'Lock',
      onClick: () => handleAction(() => toggleBlockLock(block.id)),
      show: true,
      active: isLocked,
      activeColor: 'text-yellow-500',
    },
    { type: 'divider' },
    {
      icon: Palette,
      label: 'Style',
      onClick: () => {
        setSelectedBlock(block.id);
        setActiveSidebarTab('style');
      },
      show: true,
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => {
        handleAction(() => {
          deleteBlock(block.id);
          setSelectedBlock(null);
        }, 'Block deleted');
      },
      show: true,
      danger: true,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: positionType === 'top' ? -10 : 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: positionType === 'top' ? -10 : 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-20 flex items-center gap-0.5 p-1 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
            positionType === 'top' && '-top-14 left-1/2 -translate-x-1/2',
            positionType === 'bottom' && '-bottom-14 left-1/2 -translate-x-1/2',
            positionType === 'custom' && '-top-14 left-1/2 -translate-x-1/2',
            className
          )}
        >
          {actions.map((action, index) => {
            if (action.type === 'divider') {
              return (
                <div
                  key={`divider-${index}`}
                  className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"
                />
              );
            }

            if (!action.show) return null;

            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.();
                }}
                disabled={action.disabled}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  action.disabled && 'opacity-30 cursor-not-allowed',
                  action.danger && 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500',
                  action.active && action.activeColor,
                  !action.danger && !action.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
                title={action.label}
              >
                <Icon className={cn(
                  'w-4 h-4',
                  action.danger && 'text-red-500',
                  action.active && action.activeColor
                )} />
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
