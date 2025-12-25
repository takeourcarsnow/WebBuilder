'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Undo,
  Redo,
  Eye,
  Download,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  Trash2,
  Copy,
  Clipboard,
  Layout,
  Type,
  Image,
  Video,
  Mail,
  Quote,
  Settings,
  Palette,
  Layers,
  Keyboard,
  Zap,
  Command,
  ArrowRight,
} from 'lucide-react';
import { useEditorStore, useThemeStore, useWebsiteStore, useCanUndo, useCanRedo, useHistoryStore, useClipboardStore, useHasClipboard } from '@/stores';
import { blockDefinitions } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { BlockType } from '@/types';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  category: 'action' | 'block' | 'navigation' | 'view';
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { 
    togglePreviewMode, 
    setDevicePreview, 
    setActiveSidebarTab,
    addNotification,
    setShowKeyboardShortcuts,
  } = useEditorStore();
  
  const { isDark, toggleTheme } = useThemeStore();
  const { addBlock, website, setCurrentWebsite, deleteBlock } = useWebsiteStore();
  const { undo: historyUndo, redo: historyRedo } = useHistoryStore();
  const { copyBlock, pasteBlock } = useClipboardStore();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const hasClipboard = useHasClipboard();

  // Build commands list
  const commands: CommandItem[] = useMemo(() => {
    const handleAddBlock = (type: BlockType) => {
      addBlock(type);
      addNotification({ type: 'success', message: `${type} block added`, duration: 1500 });
      setIsOpen(false);
    };

    const baseCommands: CommandItem[] = [
      // Actions
      {
        id: 'undo',
        title: 'Undo',
        icon: <Undo className="h-4 w-4" />,
        category: 'action',
        shortcut: '⌘Z',
        action: () => { historyUndo(); setIsOpen(false); },
        disabled: !canUndo,
      },
      {
        id: 'redo',
        title: 'Redo',
        icon: <Redo className="h-4 w-4" />,
        category: 'action',
        shortcut: '⌘⇧Z',
        action: () => { historyRedo(); setIsOpen(false); },
        disabled: !canRedo,
      },
      {
        id: 'preview',
        title: 'Toggle Preview Mode',
        icon: <Eye className="h-4 w-4" />,
        category: 'action',
        shortcut: '⌘P',
        action: () => { togglePreviewMode(); setIsOpen(false); },
      },
      {
        id: 'theme',
        title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        category: 'action',
        action: () => { toggleTheme(); setIsOpen(false); },
      },
      {
        id: 'shortcuts',
        title: 'Keyboard Shortcuts',
        icon: <Keyboard className="h-4 w-4" />,
        category: 'action',
        shortcut: '?',
        action: () => { setShowKeyboardShortcuts(true); setIsOpen(false); },
      },

      // View commands
      {
        id: 'desktop',
        title: 'Desktop View',
        icon: <Monitor className="h-4 w-4" />,
        category: 'view',
        action: () => { setDevicePreview('desktop'); setIsOpen(false); },
      },
      {
        id: 'tablet',
        title: 'Tablet View',
        icon: <Tablet className="h-4 w-4" />,
        category: 'view',
        action: () => { setDevicePreview('tablet'); setIsOpen(false); },
      },
      {
        id: 'mobile',
        title: 'Mobile View',
        icon: <Smartphone className="h-4 w-4" />,
        category: 'view',
        action: () => { setDevicePreview('mobile'); setIsOpen(false); },
      },

      // Navigation
      {
        id: 'nav-blocks',
        title: 'Go to Blocks Panel',
        icon: <Layout className="h-4 w-4" />,
        category: 'navigation',
        action: () => { setActiveSidebarTab('blocks'); setIsOpen(false); },
      },
      {
        id: 'nav-style',
        title: 'Go to Style Panel',
        icon: <Palette className="h-4 w-4" />,
        category: 'navigation',
        action: () => { setActiveSidebarTab('style'); setIsOpen(false); },
      },
      {
        id: 'nav-layers',
        title: 'Go to Layers Panel',
        icon: <Layers className="h-4 w-4" />,
        category: 'navigation',
        action: () => { setActiveSidebarTab('layers'); setIsOpen(false); },
      },
      {
        id: 'nav-settings',
        title: 'Go to Settings Panel',
        icon: <Settings className="h-4 w-4" />,
        category: 'navigation',
        action: () => { setActiveSidebarTab('settings'); setIsOpen(false); },
      },
    ];

    // Add block commands dynamically
    const blockCommands: CommandItem[] = blockDefinitions.map((block) => ({
      id: `add-${block.type}`,
      title: `Add ${block.name}`,
      description: block.description,
      icon: <Plus className="h-4 w-4" />,
      category: 'block' as const,
      action: () => handleAddBlock(block.type),
    }));

    return [...baseCommands, ...blockCommands];
  }, [
    addBlock, addNotification, canRedo, canUndo, historyRedo, historyUndo,
    isDark, setActiveSidebarTab, setDevicePreview, setShowKeyboardShortcuts,
    togglePreviewMode, toggleTheme
  ]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands.filter(c => !c.disabled);
    const query = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        !cmd.disabled &&
        (cmd.title.toLowerCase().includes(query) ||
          cmd.description?.toLowerCase().includes(query) ||
          cmd.category.toLowerCase().includes(query))
    );
  }, [commands, search]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      if (!isOpen) return;

      // Navigate with arrows
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }

      // Execute with Enter
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }

      // Close with Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Reset when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const categoryLabels: Record<CommandItem['category'], string> = {
    action: 'Actions',
    block: 'Add Blocks',
    navigation: 'Navigation',
    view: 'View',
  };

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2"
          >
            <div className="mx-4 overflow-hidden rounded-2xl border border-gray-200/50 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/95">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-gray-400 dark:text-white"
                  autoFocus
                />
                <kbd className="hidden rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 sm:block dark:bg-gray-800 dark:text-gray-400">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center">
                    <Zap className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No commands found
                    </p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category} className="mb-2">
                      <div className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                        {categoryLabels[category as CommandItem['category']]}
                      </div>
                      {cmds.map((cmd) => {
                        const globalIndex = filteredCommands.indexOf(cmd);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <button
                            key={cmd.id}
                            onClick={cmd.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                              isSelected
                                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                            )}
                          >
                            <div className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-lg',
                              isSelected
                                ? 'bg-primary-100 dark:bg-primary-900/30'
                                : 'bg-gray-100 dark:bg-gray-800'
                            )}>
                              {cmd.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{cmd.title}</div>
                              {cmd.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                            {cmd.shortcut && (
                              <kbd className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                {cmd.shortcut}
                              </kbd>
                            )}
                            {isSelected && (
                              <ArrowRight className="h-4 w-4 text-primary-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-400 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">↵</kbd>
                    select
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Command className="h-3 w-3" />
                  <span>K to toggle</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
