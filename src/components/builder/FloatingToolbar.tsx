'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Palette,
  Settings2,
  MoreHorizontal,
  Eye,
  EyeOff,
  Maximize2,
} from 'lucide-react';
import { useEditorStore, useWebsiteStore, useClipboardStore, useHistoryStore } from '@/stores';
import { Tooltip, TooltipProvider } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { WebsiteBlock } from '@/types';

interface FloatingToolbarProps {
  block: WebsiteBlock;
  containerRef?: React.RefObject<HTMLElement>;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ block, containerRef }) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [isCompact, setIsCompact] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const { selectedBlockId, setSelectedBlock, addNotification, setActiveSidebarTab, isPreviewMode } = useEditorStore();
  const { website, setCurrentWebsite, deleteBlock } = useWebsiteStore();
  const { copyBlock } = useClipboardStore();
  const { pushState } = useHistoryStore();

  const isSelected = selectedBlockId === block.id;

  // Update position when block is selected
  useEffect(() => {
    if (!isSelected || isPreviewMode) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const blockElement = document.querySelector(`[data-block-id="${block.id}"]`);
      if (!blockElement) return;

      const rect = blockElement.getBoundingClientRect();
      const toolbarHeight = 48;
      const padding = 8;

      // Position above the block
      let top = rect.top - toolbarHeight - padding;
      let left = rect.left + rect.width / 2;

      // If toolbar would go above viewport, position below
      if (top < padding) {
        top = rect.bottom + padding;
      }

      // Check if we need compact mode (narrow blocks)
      setIsCompact(rect.width < 300);

      setPosition({ top, left });
    };

    updatePosition();

    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isSelected, block.id, isPreviewMode]);

  const handleCopy = useCallback(() => {
    copyBlock(block);
    addNotification({ type: 'success', message: 'Block copied', duration: 1500 });
  }, [block, copyBlock, addNotification]);

  const handleDelete = useCallback(() => {
    if (website) {
      pushState(website, `Delete ${block.type} block`);
    }
    deleteBlock(block.id);
    setSelectedBlock(null);
    addNotification({ type: 'info', message: 'Block deleted', duration: 1500 });
  }, [block, website, deleteBlock, setSelectedBlock, addNotification, pushState]);

  const handleMoveUp = useCallback(() => {
    if (!website) return;
    const blocks = [...website.blocks].sort((a, b) => a.order - b.order);
    const currentIndex = blocks.findIndex(b => b.id === block.id);
    if (currentIndex <= 0) return;

    pushState(website, 'Move block up');
    
    // Swap orders
    const prevBlock = blocks[currentIndex - 1];
    const updatedBlocks = blocks.map(b => {
      if (b.id === block.id) return { ...b, order: prevBlock.order };
      if (b.id === prevBlock.id) return { ...b, order: block.order };
      return b;
    });

    setCurrentWebsite({ ...website, blocks: updatedBlocks, updatedAt: new Date() });
  }, [block, website, setCurrentWebsite, pushState]);

  const handleMoveDown = useCallback(() => {
    if (!website) return;
    const blocks = [...website.blocks].sort((a, b) => a.order - b.order);
    const currentIndex = blocks.findIndex(b => b.id === block.id);
    if (currentIndex >= blocks.length - 1) return;

    pushState(website, 'Move block down');
    
    // Swap orders
    const nextBlock = blocks[currentIndex + 1];
    const updatedBlocks = blocks.map(b => {
      if (b.id === block.id) return { ...b, order: nextBlock.order };
      if (b.id === nextBlock.id) return { ...b, order: block.order };
      return b;
    });

    setCurrentWebsite({ ...website, blocks: updatedBlocks, updatedAt: new Date() });
  }, [block, website, setCurrentWebsite, pushState]);

  const handleEditStyle = useCallback(() => {
    setActiveSidebarTab('style');
  }, [setActiveSidebarTab]);

  if (!position || !isSelected || isPreviewMode) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)',
          zIndex: 100,
        }}
        className="pointer-events-auto"
      >
        <TooltipProvider>
          <div className={cn(
            'flex items-center gap-0.5 rounded-xl border border-gray-200/80 bg-white/95 p-1 shadow-lg backdrop-blur-xl',
            'dark:border-gray-700/80 dark:bg-gray-900/95'
          )}>
            {/* Drag handle indicator */}
            <div className="flex h-8 items-center px-2 text-gray-400">
              <GripVertical className="h-4 w-4" />
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Move controls */}
            <Tooltip content="Move up">
              <button
                onClick={handleMoveUp}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </Tooltip>

            <Tooltip content="Move down">
              <button
                onClick={handleMoveDown}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </Tooltip>

            {!isCompact && (
              <>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                {/* Style shortcut */}
                <Tooltip content="Edit style">
                  <button
                    onClick={handleEditStyle}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <Palette className="h-4 w-4" />
                  </button>
                </Tooltip>
              </>
            )}

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Copy */}
            <Tooltip content="Copy block">
              <button
                onClick={handleCopy}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </button>
            </Tooltip>

            {/* Delete */}
            <Tooltip content="Delete block">
              <button
                onClick={handleDelete}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>
  );
};
