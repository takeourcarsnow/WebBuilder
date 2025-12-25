'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical, Copy, Trash2, ChevronUp, ChevronDown, Settings, MoreHorizontal } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWebsiteStore, useEditorStore, useHistoryStore } from '@/stores';
import { getBlockDefinition } from '@/lib/constants';
import { BlockContextMenu, useContextMenu } from './BlockContextMenu';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface BlockWrapperProps {
  block: WebsiteBlock;
  children: React.ReactNode;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, children }) => {
  const { deleteBlock, duplicateBlock, moveBlock, website } = useWebsiteStore();
  const { selectedBlockId, setSelectedBlock, isPreviewMode, setActiveSidebarTab, addNotification } = useEditorStore();
  const { pushState } = useHistoryStore();
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  const isSelected = selectedBlockId === block.id;
  const definition = getBlockDefinition(block.type);
  const totalBlocks = website?.blocks.length || 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSelect = () => {
    if (!isPreviewMode) {
      setSelectedBlock(block.id);
      setActiveSidebarTab('style');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (website) {
      pushState(website, 'Delete block');
      deleteBlock(block.id);
      setSelectedBlock(null);
      addNotification({ type: 'success', message: 'Block deleted', duration: 1500 });
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (website) {
      pushState(website, 'Duplicate block');
      const newBlock = duplicateBlock(block.id);
      if (newBlock) {
        setSelectedBlock(newBlock.id);
        addNotification({ type: 'success', message: 'Block duplicated', duration: 1500 });
      }
    }
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (block.order > 0 && website) {
      pushState(website, 'Move block up');
      moveBlock(block.id, block.order - 1);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (block.order < totalBlocks - 1 && website) {
      pushState(website, 'Move block down');
      moveBlock(block.id, block.order + 1);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isPreviewMode) {
      openContextMenu(e, block);
    }
  };

  if (isPreviewMode) {
    return <>{children}</>;
  }

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
        className={cn(
          'group relative transition-all duration-200',
          isDragging && 'opacity-50',
          isSelected && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900'
        )}
      >
        {/* Block toolbar */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'absolute -top-12 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-ios-lg border bg-white p-1 shadow-ios',
                'dark:border-gray-700 dark:bg-surface-dark-elevated dark:shadow-ios-dark'
              )}
            >
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-surface-dark-secondary active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-gray-500" />
              </div>

              <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

              <button
                onClick={handleMoveUp}
                disabled={block.order === 0}
                className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-surface-dark-secondary"
                title="Move up (Alt+↑)"
              >
                <ChevronUp className="h-4 w-4 text-gray-500" />
              </button>

              <button
                onClick={handleMoveDown}
                disabled={block.order === totalBlocks - 1}
                className="rounded-lg p-1.5 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-surface-dark-secondary"
                title="Move down (Alt+↓)"
              >
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

              <button
                onClick={handleDuplicate}
                className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-surface-dark-secondary"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Delete (Delete)"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>

              <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-700" />

              <button
                onClick={(e) => openContextMenu(e, block)}
                className="rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-surface-dark-secondary"
                title="More options"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Block type label */}
        <div
          className={cn(
            'absolute -left-1 top-2 z-10 rounded-r-lg bg-primary-500 px-2 py-0.5 text-xs font-medium text-white opacity-0 transition-opacity',
            'group-hover:opacity-100',
            isSelected && 'opacity-100'
          )}
        >
          {definition?.name || block.type}
        </div>

        {/* Block content */}
        <div
          className={cn(
            'transition-all duration-200',
            !isSelected && 'hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-800'
          )}
        >
          {children}
        </div>
      </motion.div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && contextMenu.block.id === block.id && (
          <BlockContextMenu
            block={contextMenu.block}
            position={contextMenu.position}
            onClose={closeContextMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
};
