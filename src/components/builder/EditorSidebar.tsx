'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Blocks, Palette, Settings, Layers, PanelLeftClose,
  Sparkles, Search, Shield, Paintbrush, Play, Library,
  Users, Zap, History, Workflow, Image
} from 'lucide-react';
import { useEditorStore } from '@/stores';
import { BlockPanel } from './BlockPanel';
import { StylePanel } from './StylePanel';
import { SettingsPanel } from './SettingsPanel';
import { LayersPanel } from './LayersPanel';
import { AIContentPanel } from './AIContentPanel';
import { SEOPanel } from './SEOPanel';
import { AccessibilityPanel } from './AccessibilityPanel';
import { DesignTokensPanel } from './DesignTokensPanel';
import { AnimationEditor } from './AnimationEditor';
import { BlockTemplatesLibrary } from './BlockTemplatesLibrary';
import { CollaborationPanel } from './CollaborationPanel';
import { PerformancePanel } from './PerformancePanel';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { SmartWorkflowsPanel } from './SmartWorkflowsPanel';
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
const MemoizedAIContentPanel = memo(AIContentPanel);
const MemoizedSEOPanel = memo(SEOPanel);
const MemoizedAccessibilityPanel = memo(AccessibilityPanel);
const MemoizedDesignTokensPanel = memo(DesignTokensPanel);
const MemoizedAnimationEditor = memo(AnimationEditor);
const MemoizedBlockTemplatesLibrary = memo(BlockTemplatesLibrary);
const MemoizedCollaborationPanel = memo(CollaborationPanel);
const MemoizedPerformancePanel = memo(PerformancePanel);
const MemoizedVersionHistoryPanel = memo(VersionHistoryPanel);
const MemoizedSmartWorkflowsPanel = memo(SmartWorkflowsPanel);

export const EditorSidebar: React.FC<EditorSidebarProps> = ({ className }) => {
  const { isSidebarOpen, activeSidebarTab, setActiveSidebarTab, setSidebarOpen } = useEditorStore();

  const mainTabs = [
    { id: 'blocks', label: 'Blocks', icon: Blocks },
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const featureTabs = [
    { id: 'ai', label: 'AI Content', icon: Sparkles },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'accessibility', label: 'Accessibility', icon: Shield },
    { id: 'design-tokens', label: 'Design Tokens', icon: Paintbrush },
    { id: 'animation', label: 'Animation', icon: Play },
    { id: 'templates', label: 'Templates', icon: Library },
  ] as const;

  const advancedTabs = [
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'history', label: 'Version History', icon: History },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
  ] as const;

  const allTabs = [...mainTabs, ...featureTabs, ...advancedTabs];
  const currentTab = allTabs.find(t => t.id === activeSidebarTab);

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
            <div className="flex flex-col gap-2 p-3">
              {/* Main Tabs */}
              <div className="flex items-center justify-between">
                <div className="flex rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80">
                  {mainTabs.map((tab) => {
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

              {/* Feature Tabs */}
              <div className="flex rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80">
                {featureTabs.map((tab) => {
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

              {/* Advanced Tabs */}
              <div className="flex rounded-xl bg-gray-100/80 p-1 dark:bg-gray-800/80">
                {advancedTabs.map((tab) => {
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
            </div>

            {/* Active tab label */}
            <div className="px-4 pb-2">
              <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white">
                {currentTab?.label || 'Unknown'}
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

              {activeSidebarTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedAIContentPanel onApply={() => {}} contentType="headline" />
                </motion.div>
              )}

              {activeSidebarTab === 'seo' && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedSEOPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'accessibility' && (
                <motion.div
                  key="accessibility"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedAccessibilityPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'design-tokens' && (
                <motion.div
                  key="design-tokens"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedDesignTokensPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'animation' && (
                <motion.div
                  key="animation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedAnimationEditor />
                </motion.div>
              )}

              {activeSidebarTab === 'templates' && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedBlockTemplatesLibrary />
                </motion.div>
              )}

              {activeSidebarTab === 'collaboration' && (
                <motion.div
                  key="collaboration"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedCollaborationPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'performance' && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedPerformancePanel />
                </motion.div>
              )}

              {activeSidebarTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedVersionHistoryPanel />
                </motion.div>
              )}

              {activeSidebarTab === 'workflows' && (
                <motion.div
                  key="workflows"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  <MemoizedSmartWorkflowsPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
