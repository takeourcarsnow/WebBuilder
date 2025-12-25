'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Tablet,
  Sun,
  Moon,
  Download,
  Undo,
  Redo,
  Menu,
  X,
  ZoomIn,
  ZoomOut,
  Save,
  Keyboard,
  FileCode,
  Copy,
  Clipboard,
  Clock,
  RotateCcw,
  Columns,
  Camera,
  Code,
  Globe,
  Cloud,
} from 'lucide-react';
import { useEditorStore, useThemeStore, useWebsiteStore, useCanUndo, useCanRedo, useHistoryStore, useClipboardStore, useHasClipboard } from '@/stores';
import { Button, Tooltip, TooltipProvider, Modal } from '@/components/ui';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { DeploymentModal } from './DeploymentModal';
import { getShortcutDescriptions } from '@/hooks';
import { downloadHtmlFile } from '@/lib/utils/exportHtml';
import { downloadReactFile } from '@/lib/utils/exportReact';
import { downloadTailwindFile } from '@/lib/utils/exportTailwind';
import { downloadPWAFiles } from '@/lib/utils/exportPWA';
import { cn } from '@/lib/utils';
import type { DevicePreview } from '@/stores/editorStore';

interface EditorToolbarProps {
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ className }) => {
  const {
    isPreviewMode,
    devicePreview,
    togglePreviewMode,
    setDevicePreview,
    zoom,
    zoomIn,
    zoomOut,
    resetZoom,
    isSidebarOpen,
    setSidebarOpen,
    addNotification,
    selectedBlockId,
    setSelectedBlock,
    sideBySidePreview,
    toggleSideBySidePreview,
    isLandscapeMode,
    toggleLandscapeMode,
    showKeyboardShortcuts,
    setShowKeyboardShortcuts,
  } = useEditorStore();

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const { undo: historyUndo, redo: historyRedo, getHistoryInfo } = useHistoryStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { website, setCurrentWebsite, deleteBlock } = useWebsiteStore();
  const { copyBlock, pasteBlock } = useClipboardStore();
  const hasClipboard = useHasClipboard();
  
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const [showDeploymentModal, setShowDeploymentModal] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date>(new Date());
  const [isSaving, setIsSaving] = React.useState(false);

  // Update last saved when website changes
  React.useEffect(() => {
    if (website?.updatedAt) {
      setLastSaved(new Date(website.updatedAt));
    }
  }, [website?.updatedAt]);

  const handleExportJson = () => {
    if (!website) return;

    const data = JSON.stringify(website, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.slug || 'website'}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      message: 'Website exported as JSON',
    });
    setShowExportMenu(false);
  };

  const handleExportHtml = () => {
    if (!website) return;

    downloadHtmlFile(website);
    addNotification({
      type: 'success',
      message: 'Website exported as HTML',
    });
    setShowExportMenu(false);
  };

  const handleExportReact = () => {
    if (!website) return;

    downloadReactFile(website);
    addNotification({
      type: 'success',
      message: 'Website exported as React component',
    });
    setShowExportMenu(false);
  };

  const handleExportTailwind = () => {
    if (!website) return;

    downloadTailwindFile(website);
    addNotification({
      type: 'success',
      message: 'Website exported as Tailwind HTML',
    });
    setShowExportMenu(false);
  };

  const handleExportPWA = () => {
    if (!website) return;

    downloadPWAFiles(website);
    addNotification({
      type: 'success',
      message: 'PWA files exported (manifest, service worker, offline page)',
    });
    setShowExportMenu(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setLastSaved(new Date());
      setIsSaving(false);
      addNotification({
        type: 'success',
        message: 'Changes saved',
      });
    }, 500);
  };

  const handleUndo = () => {
    if (canUndo) {
      const previousState = historyUndo();
      if (previousState) {
        setCurrentWebsite(previousState);
        addNotification({ type: 'info', message: 'Undo', duration: 1500 });
      }
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      const nextState = historyRedo();
      if (nextState) {
        setCurrentWebsite(nextState);
        addNotification({ type: 'info', message: 'Redo', duration: 1500 });
      }
    }
  };

  const handleCopy = () => {
    if (selectedBlockId && website) {
      const block = website.blocks.find(b => b.id === selectedBlockId);
      if (block) {
        copyBlock(block);
        addNotification({ type: 'success', message: 'Block copied', duration: 1500 });
      }
    }
  };

  const handlePaste = () => {
    if (hasClipboard && website) {
      const pastedBlock = pasteBlock();
      if (pastedBlock) {
        pastedBlock.order = website.blocks.length;
        setCurrentWebsite({
          ...website,
          blocks: [...website.blocks, pastedBlock],
          updatedAt: new Date(),
        });
        setSelectedBlock(pastedBlock.id);
        addNotification({ type: 'success', message: 'Block pasted', duration: 1500 });
      }
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const deviceButtons: { device: DevicePreview; icon: typeof Monitor; label: string }[] = [
    { device: 'desktop', icon: Monitor, label: 'Desktop view' },
    { device: 'tablet', icon: Tablet, label: 'Tablet view' },
    { device: 'mobile', icon: Smartphone, label: 'Mobile view' },
  ];

  const historyInfo = getHistoryInfo();

  // Sync with store's keyboard shortcuts state
  React.useEffect(() => {
    if (showKeyboardShortcuts !== showShortcuts) {
      setShowShortcuts(showKeyboardShortcuts);
    }
  }, [showKeyboardShortcuts]);

  const handleShowShortcuts = (show: boolean) => {
    setShowShortcuts(show);
    setShowKeyboardShortcuts(show);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          'flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4',
          'dark:border-gray-800 dark:bg-surface-dark',
          className
        )}
      >
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Tooltip content={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <Tooltip content={`Undo (Ctrl+Z)${historyInfo.lastAction ? ` - ${historyInfo.lastAction}` : ''}`}>
            <Button 
              variant="ghost" 
              size="icon-sm" 
              disabled={!canUndo}
              onClick={handleUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Redo (Ctrl+Y)">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              disabled={!canRedo}
              onClick={handleRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Copy/Paste buttons */}
          <Tooltip content="Copy block (Ctrl+C)">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              disabled={!selectedBlockId}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Tooltip content="Paste block (Ctrl+V)">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handlePaste}
              disabled={!hasClipboard}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <Tooltip content="Keyboard shortcuts">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowShortcuts(true)}
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>

        {/* Center section - Website name + save status */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <h1 className="text-sm font-medium text-gray-900 dark:text-white">
            {website?.name || 'Untitled Website'}
          </h1>
          <AutoSaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-ios bg-gray-100 p-1 dark:bg-surface-dark-secondary">
            <Tooltip content="Zoom out">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={zoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </Tooltip>

            <button
              onClick={resetZoom}
              className="min-w-[3rem] px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {zoom}%
            </button>

            <Tooltip content="Zoom in">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={zoomIn}
                disabled={zoom >= 150}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Device preview controls */}
          <div className="flex items-center gap-1 rounded-ios bg-gray-100 p-1 dark:bg-surface-dark-secondary">
            {deviceButtons.map(({ device, icon: Icon, label }) => (
              <Tooltip key={device} content={label}>
                <Button
                  variant={devicePreview === device ? 'primary' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setDevicePreview(device)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </Tooltip>
            ))}
            
            {/* Landscape mode toggle for mobile/tablet */}
            {(devicePreview === 'mobile' || devicePreview === 'tablet') && (
              <Tooltip content={isLandscapeMode ? 'Portrait mode' : 'Landscape mode'}>
                <Button
                  variant={isLandscapeMode ? 'secondary' : 'ghost'}
                  size="icon-sm"
                  onClick={toggleLandscapeMode}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </Tooltip>
            )}
            
            {/* Side by side preview */}
            <Tooltip content={sideBySidePreview ? 'Single view' : 'Side-by-side preview'}>
              <Button
                variant={sideBySidePreview ? 'secondary' : 'ghost'}
                size="icon-sm"
                onClick={toggleSideBySidePreview}
              >
                <Columns className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>

          <Tooltip content={isPreviewMode ? 'Exit preview (Ctrl+P)' : 'Preview (Ctrl+P)'}>
            <Button
              variant={isPreviewMode ? 'primary' : 'secondary'}
              size="icon-sm"
              onClick={togglePreviewMode}
            >
              {isPreviewMode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Theme toggle */}
          <Tooltip content={isDark ? 'Light mode' : 'Dark mode'}>
            <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.div>
            </Button>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Export dropdown */}
          <div className="relative">
            <Tooltip content="Export website">
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)} 
                />
                <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-ios-lg border border-gray-200 bg-white p-1 shadow-ios dark:border-gray-700 dark:bg-surface-dark-elevated">
                  <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Export</p>
                  <button
                    onClick={handleExportJson}
                    className="flex w-full items-center gap-2 rounded-ios px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-dark-secondary"
                  >
                    <Download className="h-4 w-4" />
                    JSON (Data backup)
                  </button>
                  <button
                    onClick={handleExportHtml}
                    className="flex w-full items-center gap-2 rounded-ios px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-dark-secondary"
                  >
                    <FileCode className="h-4 w-4" />
                    HTML (Static site)
                  </button>
                  <button
                    onClick={handleExportTailwind}
                    className="flex w-full items-center gap-2 rounded-ios px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-dark-secondary"
                  >
                    <Code className="h-4 w-4" />
                    Tailwind HTML
                  </button>
                  <button
                    onClick={handleExportReact}
                    className="flex w-full items-center gap-2 rounded-ios px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-dark-secondary"
                  >
                    <Code className="h-4 w-4" />
                    React Component
                  </button>
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={handleExportPWA}
                    className="flex w-full items-center gap-2 rounded-ios px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-dark-secondary"
                  >
                    <Globe className="h-4 w-4" />
                    PWA Files
                  </button>
                  <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      setShowDeploymentModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-ios px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-500/10"
                  >
                    <Cloud className="h-4 w-4" />
                    Deploy to Web
                  </button>
                </div>
              </>
            )}
          </div>

          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts modal */}
      <Modal
        open={showShortcuts}
        onOpenChange={handleShowShortcuts}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-3">
          {getShortcutDescriptions().map(({ keys, description }) => (
            <div key={keys} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </span>
              <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {keys}
              </kbd>
            </div>
          ))}
        </div>
      </Modal>

      {/* Deployment modal */}
      <DeploymentModal
        isOpen={showDeploymentModal}
        onClose={() => setShowDeploymentModal(false)}
      />
    </TooltipProvider>
  );
};
