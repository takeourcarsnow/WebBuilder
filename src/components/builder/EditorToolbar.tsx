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
} from 'lucide-react';
import { useEditorStore, useThemeStore, useWebsiteStore, useHistoryState } from '@/stores';
import { Button, Tooltip, TooltipProvider, Modal } from '@/components/ui';
import { getShortcutDescriptions } from '@/hooks';
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
    undo,
    redo,
  } = useEditorStore();

  const { canUndo, canRedo } = useHistoryState();
  const { isDark, toggleTheme } = useThemeStore();
  const { website } = useWebsiteStore();
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  const handleExport = () => {
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
      message: 'Website exported successfully',
    });
  };

  const handleSave = () => {
    addNotification({
      type: 'success',
      message: 'Changes saved automatically',
    });
  };

  const handleUndo = () => {
    undo();
    addNotification({ type: 'info', message: 'Undo', duration: 1500 });
  };

  const handleRedo = () => {
    redo();
    addNotification({ type: 'info', message: 'Redo', duration: 1500 });
  };

  const deviceButtons: { device: DevicePreview; icon: typeof Monitor; label: string }[] = [
    { device: 'desktop', icon: Monitor, label: 'Desktop view' },
    { device: 'tablet', icon: Tablet, label: 'Tablet view' },
    { device: 'mobile', icon: Smartphone, label: 'Mobile view' },
  ];

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

          <Tooltip content="Undo (Ctrl+Z)">
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

        {/* Center section - Website name */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-sm font-medium text-gray-900 dark:text-white">
            {website?.name || 'Untitled Website'}
          </h1>
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

          {/* Actions */}
          <Tooltip content="Export">
            <Button variant="ghost" size="icon-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </Tooltip>

          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts modal */}
      <Modal
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
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
    </TooltipProvider>
  );
};
