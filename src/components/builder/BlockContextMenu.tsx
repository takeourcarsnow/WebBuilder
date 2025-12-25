'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Layers,
  Palette,
} from 'lucide-react';
import { useWebsiteStore, useEditorStore, useClipboardStore, useHasClipboard, useHistoryStore } from '@/stores';
import { cn } from '@/lib/utils';
import type { WebsiteBlock } from '@/types';

interface ContextMenuProps {
  block: WebsiteBlock;
  position: { x: number; y: number };
  onClose: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  shortcut,
  onClick,
  disabled,
  danger,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'flex w-full items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
      'hover:bg-gray-100 dark:hover:bg-surface-dark-secondary',
      disabled && 'opacity-40 cursor-not-allowed',
      danger && 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
    )}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {shortcut && (
      <span className="text-xs text-gray-400 dark:text-gray-500">{shortcut}</span>
    )}
  </button>
);

const MenuDivider: React.FC = () => (
  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
);

export const BlockContextMenu: React.FC<ContextMenuProps> = ({
  block,
  position,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { website, deleteBlock, duplicateBlock, moveBlock, setCurrentWebsite } = useWebsiteStore();
  const { setSelectedBlock, setActiveSidebarTab, addNotification } = useEditorStore();
  const { copyBlock, pasteBlock } = useClipboardStore();
  const hasClipboard = useHasClipboard();
  const { pushState } = useHistoryStore();

  const totalBlocks = website?.blocks.length || 0;
  const canMoveUp = block.order > 0;
  const canMoveDown = block.order < totalBlocks - 1;

  // Adjust menu position if it would overflow the viewport
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      // Adjust horizontal position
      if (position.x + rect.width > viewportWidth - 16) {
        x = viewportWidth - rect.width - 16;
      }

      // Adjust vertical position
      if (position.y + rect.height > viewportHeight - 16) {
        y = viewportHeight - rect.height - 16;
      }

      setAdjustedPosition({ x, y });
    }
  }, [position]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleCopy = useCallback(() => {
    copyBlock(block);
    addNotification({ type: 'success', message: 'Block copied', duration: 1500 });
    onClose();
  }, [block, copyBlock, addNotification, onClose]);

  const handleCut = useCallback(() => {
    if (website) {
      pushState(website, 'Cut block');
      copyBlock(block);
      deleteBlock(block.id);
      setSelectedBlock(null);
      addNotification({ type: 'success', message: 'Block cut', duration: 1500 });
    }
    onClose();
  }, [block, website, copyBlock, deleteBlock, setSelectedBlock, addNotification, pushState, onClose]);

  const handlePaste = useCallback(() => {
    if (hasClipboard && website) {
      pushState(website, 'Paste block');
      const pastedBlock = pasteBlock();
      if (pastedBlock) {
        pastedBlock.order = block.order + 1;
        const newBlocks = website.blocks.map(b => 
          b.order > block.order ? { ...b, order: b.order + 1 } : b
        );
        newBlocks.push(pastedBlock);
        newBlocks.sort((a, b) => a.order - b.order).forEach((b, i) => b.order = i);
        
        setCurrentWebsite({
          ...website,
          blocks: newBlocks,
          updatedAt: new Date(),
        });
        setSelectedBlock(pastedBlock.id);
        addNotification({ type: 'success', message: 'Block pasted', duration: 1500 });
      }
    }
    onClose();
  }, [block, website, hasClipboard, pasteBlock, setCurrentWebsite, setSelectedBlock, addNotification, pushState, onClose]);

  const handleDuplicate = useCallback(() => {
    if (website) {
      pushState(website, 'Duplicate block');
      const newBlock = duplicateBlock(block.id);
      if (newBlock) {
        setSelectedBlock(newBlock.id);
        addNotification({ type: 'success', message: 'Block duplicated', duration: 1500 });
      }
    }
    onClose();
  }, [block.id, website, duplicateBlock, setSelectedBlock, addNotification, pushState, onClose]);

  const handleMoveUp = useCallback(() => {
    if (canMoveUp && website) {
      pushState(website, 'Move block up');
      moveBlock(block.id, block.order - 1);
    }
    onClose();
  }, [block, website, canMoveUp, moveBlock, pushState, onClose]);

  const handleMoveDown = useCallback(() => {
    if (canMoveDown && website) {
      pushState(website, 'Move block down');
      moveBlock(block.id, block.order + 1);
    }
    onClose();
  }, [block, website, canMoveDown, moveBlock, pushState, onClose]);

  const handleDelete = useCallback(() => {
    if (website) {
      pushState(website, 'Delete block');
      deleteBlock(block.id);
      setSelectedBlock(null);
      addNotification({ type: 'success', message: 'Block deleted', duration: 1500 });
    }
    onClose();
  }, [block.id, website, deleteBlock, setSelectedBlock, addNotification, pushState, onClose]);

  const handleEditStyle = useCallback(() => {
    setSelectedBlock(block.id);
    setActiveSidebarTab('style');
    onClose();
  }, [block.id, setSelectedBlock, setActiveSidebarTab, onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={cn(
        'fixed z-50 min-w-[200px] p-1.5 rounded-ios-lg border bg-white shadow-ios-lg',
        'dark:bg-surface-dark-elevated dark:border-gray-700 dark:shadow-ios-dark'
      )}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      <MenuItem
        icon={<Palette className="h-4 w-4" />}
        label="Edit Style"
        onClick={handleEditStyle}
      />
      
      <MenuDivider />

      <MenuItem
        icon={<Copy className="h-4 w-4" />}
        label="Copy"
        shortcut="⌘C"
        onClick={handleCopy}
      />
      <MenuItem
        icon={<Scissors className="h-4 w-4" />}
        label="Cut"
        shortcut="⌘X"
        onClick={handleCut}
      />
      <MenuItem
        icon={<Clipboard className="h-4 w-4" />}
        label="Paste After"
        shortcut="⌘V"
        onClick={handlePaste}
        disabled={!hasClipboard}
      />
      <MenuItem
        icon={<Layers className="h-4 w-4" />}
        label="Duplicate"
        shortcut="⌘D"
        onClick={handleDuplicate}
      />

      <MenuDivider />

      <MenuItem
        icon={<ChevronUp className="h-4 w-4" />}
        label="Move Up"
        shortcut="⌥↑"
        onClick={handleMoveUp}
        disabled={!canMoveUp}
      />
      <MenuItem
        icon={<ChevronDown className="h-4 w-4" />}
        label="Move Down"
        shortcut="⌥↓"
        onClick={handleMoveDown}
        disabled={!canMoveDown}
      />

      <MenuDivider />

      <MenuItem
        icon={<Trash2 className="h-4 w-4" />}
        label="Delete"
        shortcut="⌫"
        onClick={handleDelete}
        danger
      />
    </motion.div>
  );
};

// Hook to manage context menu state
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    block: WebsiteBlock;
    position: { x: number; y: number };
  } | null>(null);

  const openContextMenu = useCallback(
    (event: React.MouseEvent, block: WebsiteBlock) => {
      event.preventDefault();
      event.stopPropagation();
      setContextMenu({
        block,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
}
