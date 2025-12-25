'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Blocks, Palette, Settings } from 'lucide-react';
import { useEditorStore } from '@/stores';
import { BlockPanel } from './BlockPanel';
import { StylePanel } from './StylePanel';
import { SettingsPanel } from './SettingsPanel';
import { cn } from '@/lib/utils';

interface EditorSidebarProps {
  className?: string;
}

// Memoized tab content to prevent unnecessary re-renders
const MemoizedBlockPanel = memo(BlockPanel);
const MemoizedStylePanel = memo(StylePanel);
const MemoizedSettingsPanel = memo(SettingsPanel);

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ className }) => {
  const { isSidebarOpen, activeSidebarTab, setActiveSidebarTab } = useEditorStore();

  const tabs = [
    { id: 'blocks', label: 'Blocks', icon: Blocks },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <AnimatePresence mode="popLayout">
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className={cn(
            'flex h-full w-80 flex-shrink-0 flex-col border-r border-gray-200 bg-white',
            'dark:border-gray-800 dark:bg-surface-dark',
            className
          )}
        >
          {/* Tab navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id)}
                  className={cn(
                    'relative flex flex-1 flex-col items-center gap-1 px-3 py-3 transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-surface-dark-secondary',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content - optimized with mode="popLayout" */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {activeSidebarTab === 'blocks' && (
                <motion.div
                  key="blocks"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full pt-4"
                >
                  <MemoizedBlockPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'style' && (
                <motion.div
                  key="style"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedStylePanel />
                </motion.div>
              )}

              {activeSidebarTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedSettingsPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
