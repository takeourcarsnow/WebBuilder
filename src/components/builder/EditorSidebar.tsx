'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Blocks, Palette, Settings, Layers, PanelLeftClose } from 'lucide-react';
import { useEditorStore } from '@/stores';
import { BlockPanel } from './BlockPanel';
import { StylePanel } from './StylePanel';
import { SettingsPanel } from './SettingsPanel';
import { LayersPanel } from './LayersPanel';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider } from '@/components/ui';

interface EditorSidebarProps {
  className?: string;
}

// Memoized tab content to prevent unnecessary re-renders
const MemoizedBlockPanel = memo(BlockPanel);
const MemoizedStylePanel = memo(StylePanel);
const MemoizedSettingsPanel = memo(SettingsPanel);
const MemoizedLayersPanel = memo(LayersPanel);

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ className }) => {
  const { isSidebarOpen, activeSidebarTab, setActiveSidebarTab, setSidebarOpen } = useEditorStore();

  const tabs = [
    { id: 'blocks', label: 'Blocks', icon: Blocks },
    { id: 'layers', label: 'Layers', icon: Layers },
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
            'flex h-full w-80 flex-shrink-0 flex-col border-r border-gray-200/60 bg-white/80 backdrop-blur-xl',
            'dark:border-gray-800/60 dark:bg-surface-dark/80',
            className
          )}
        >
          <TooltipProvider>
            {/* Tab navigation - pill style */}
            <div className="flex items-center justify-between p-3">
              <div className="flex rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSidebarTab === tab.id;

                  return (
                    <Tooltip key={tab.id} content={tab.label}>
                      <button
                        onClick={() => setActiveSidebarTab(tab.id)}
                        className={cn(
                          'relative flex items-center justify-center rounded-lg p-2 transition-all duration-200',
                          isActive
                            ? 'bg-white text-primary-600 shadow-sm dark:bg-gray-700 dark:text-primary-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  );
                })}
              </div>
              
              {/* Collapse button */}
              <Tooltip content="Collapse sidebar">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>

            {/* Active tab label */}
            <div className="px-4 pb-2">
              <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
                {tabs.find(t => t.id === activeSidebarTab)?.label}
              </h2>
            </div>
          </TooltipProvider>

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
                  className="h-full"
                >
                  <MemoizedBlockPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'layers' && (
                <motion.div
                  key="layers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedLayersPanel />
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
