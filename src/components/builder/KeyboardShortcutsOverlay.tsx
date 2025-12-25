'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { useEditorStore } from '@/stores';
import { cn } from '@/lib/utils';

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'general' | 'blocks' | 'editing' | 'view';
}

const shortcuts: ShortcutItem[] = [
  // General
  { keys: ['Ctrl', 'S'], description: 'Save (auto-saved)', category: 'general' },
  { keys: ['Ctrl', 'Z'], description: 'Undo', category: 'general' },
  { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo', category: 'general' },
  { keys: ['Ctrl', 'Y'], description: 'Redo (alternative)', category: 'general' },
  { keys: ['?'], description: 'Toggle this overlay', category: 'general' },
  { keys: ['Esc'], description: 'Deselect / Close modal', category: 'general' },
  
  // Blocks
  { keys: ['Ctrl', 'C'], description: 'Copy selected block', category: 'blocks' },
  { keys: ['Ctrl', 'X'], description: 'Cut selected block', category: 'blocks' },
  { keys: ['Ctrl', 'V'], description: 'Paste block', category: 'blocks' },
  { keys: ['Ctrl', 'D'], description: 'Duplicate block', category: 'blocks' },
  { keys: ['Delete'], description: 'Delete selected block', category: 'blocks' },
  { keys: ['Backspace'], description: 'Delete selected block', category: 'blocks' },
  { keys: ['Alt', '↑'], description: 'Move block up', category: 'blocks' },
  { keys: ['Alt', '↓'], description: 'Move block down', category: 'blocks' },
  
  // Editing
  { keys: ['Ctrl', 'B'], description: 'Open blocks panel', category: 'editing' },
  { keys: ['Ctrl', 'L'], description: 'Toggle lock on selected', category: 'editing' },
  { keys: ['Ctrl', 'H'], description: 'Toggle visibility', category: 'editing' },
  
  // View
  { keys: ['Ctrl', 'P'], description: 'Toggle preview mode', category: 'view' },
  { keys: ['Ctrl', '+'], description: 'Zoom in', category: 'view' },
  { keys: ['Ctrl', '-'], description: 'Zoom out', category: 'view' },
  { keys: ['Ctrl', '0'], description: 'Reset zoom', category: 'view' },
];

const categoryLabels: Record<string, string> = {
  general: 'General',
  blocks: 'Block Operations',
  editing: 'Editing',
  view: 'View',
};

const KeyBadge: React.FC<{ children: string }> = ({ children }) => (
  <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-sm">
    {children}
  </kbd>
);

interface KeyboardShortcutsOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const KeyboardShortcutsOverlay: React.FC<KeyboardShortcutsOverlayProps> = ({ 
  isOpen: propIsOpen,
  onClose 
}) => {
  const { showShortcutsOverlay, toggleShortcutsOverlay } = useEditorStore();
  
  // Use prop if provided, otherwise use store state
  const isOpen = propIsOpen !== undefined ? propIsOpen : showShortcutsOverlay;
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      toggleShortcutsOverlay();
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          if (isOpen) {
            handleClose();
          } else {
            toggleShortcutsOverlay();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleShortcutsOverlay]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[640px] md:max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Press <KeyBadge>?</KeyBadge> anytime to toggle
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(groupedShortcuts).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {categoryLabels[category]}
                    </h3>
                    <div className="space-y-2">
                      {items.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                <KeyBadge>{key}</KeyBadge>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-gray-400 text-xs">+</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Tip: Use <KeyBadge>Shift</KeyBadge> + Click to multi-select blocks
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
