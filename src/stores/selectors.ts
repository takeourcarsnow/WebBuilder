import { shallow } from 'zustand/shallow';
import { useWebsiteStore } from './websiteStore';
import { useEditorStore } from './editorStore';
import type { Website, WebsiteBlock, WebsiteSettings, BlockType, BlockContent, BlockStyle } from '@/types';

// ============================================
// Website Store Selectors (Read-only)
// ============================================

/**
 * Select the current website (or null)
 */
export const useCurrentWebsite = () => 
  useWebsiteStore((state) => state.website);

/**
 * Select all websites
 */
export const useAllWebsites = () => 
  useWebsiteStore((state) => state.websites);

/**
 * Select website blocks with shallow comparison
 */
export const useWebsiteBlocks = () => 
  useWebsiteStore((state) => state.website?.blocks ?? [], shallow);

/**
 * Select sorted blocks
 */
export const useSortedBlocks = () => 
  useWebsiteStore((state) => {
    const blocks = state.website?.blocks ?? [];
    return [...blocks].sort((a, b) => a.order - b.order);
  }, shallow);

/**
 * Select a specific block by ID
 */
export const useBlock = (blockId: string | null) => 
  useWebsiteStore((state) => 
    blockId ? state.website?.blocks.find(b => b.id === blockId) : undefined
  );

/**
 * Select website settings
 */
export const useWebsiteSettings = () => 
  useWebsiteStore((state) => state.website?.settings);

/**
 * Select theme settings
 */
export const useThemeSettings = () => 
  useWebsiteStore((state) => state.website?.settings?.theme);

/**
 * Select font settings
 */
export const useFontSettings = () => 
  useWebsiteStore((state) => state.website?.settings?.fonts);

/**
 * Select website name
 */
export const useWebsiteName = () => 
  useWebsiteStore((state) => state.website?.name);

/**
 * Select block count
 */
export const useBlockCount = () => 
  useWebsiteStore((state) => state.website?.blocks.length ?? 0);

// ============================================
// Website Store Actions (Write-only)
// ============================================

/**
 * Get all website mutation actions
 */
export const useWebsiteActions = () => 
  useWebsiteStore((state) => ({
    createWebsite: state.createWebsite,
    updateWebsite: state.updateWebsite,
    deleteWebsite: state.deleteWebsite,
    loadWebsite: state.loadWebsite,
    setCurrentWebsite: state.setCurrentWebsite,
    addBlock: state.addBlock,
    updateBlock: state.updateBlock,
    updateBlockContent: state.updateBlockContent,
    updateBlockStyle: state.updateBlockStyle,
    deleteBlock: state.deleteBlock,
    duplicateBlock: state.duplicateBlock,
    moveBlock: state.moveBlock,
    reorderBlocks: state.reorderBlocks,
    updateSettings: state.updateSettings,
  }), shallow);

/**
 * Get block-specific actions
 */
export const useBlockActions = () => 
  useWebsiteStore((state) => ({
    addBlock: state.addBlock,
    updateBlock: state.updateBlock,
    updateBlockContent: state.updateBlockContent,
    updateBlockStyle: state.updateBlockStyle,
    deleteBlock: state.deleteBlock,
    duplicateBlock: state.duplicateBlock,
    moveBlock: state.moveBlock,
    reorderBlocks: state.reorderBlocks,
  }), shallow);

// ============================================
// Editor Store Selectors (Read-only)
// ============================================

/**
 * Select the selected block ID
 */
export const useSelectedBlockId = () => 
  useEditorStore((state) => state.selectedBlockId);

/**
 * Select preview mode state
 */
export const usePreviewMode = () => 
  useEditorStore((state) => state.isPreviewMode);

/**
 * Select mobile preview state
 */
export const useMobilePreview = () => 
  useEditorStore((state) => state.isMobilePreview);

/**
 * Select device preview mode (including tablet)
 */
export const useDevicePreview = () => 
  useEditorStore((state) => state.devicePreview);

/**
 * Select zoom level
 */
export const useZoom = () => 
  useEditorStore((state) => state.zoom);

/**
 * Select dragging state
 */
export const useIsDragging = () => 
  useEditorStore((state) => state.isDragging);

/**
 * Select sidebar state
 */
export const useSidebarState = () => 
  useEditorStore((state) => ({
    isOpen: state.isSidebarOpen,
    activeTab: state.activeSidebarTab,
  }), shallow);

/**
 * Select notifications
 */
export const useNotifications = () => 
  useEditorStore((state) => state.notifications, shallow);

/**
 * Select undo/redo availability
 */
export const useHistoryState = () => 
  useEditorStore((state) => ({
    canUndo: state.canUndo(),
    canRedo: state.canRedo(),
  }), shallow);

// ============================================
// Editor Store Actions (Write-only)
// ============================================

/**
 * Get all editor actions
 */
export const useEditorActions = () => 
  useEditorStore((state) => ({
    setSelectedBlock: state.setSelectedBlock,
    setPreviewMode: state.setPreviewMode,
    setMobilePreview: state.setMobilePreview,
    setDevicePreview: state.setDevicePreview,
    togglePreviewMode: state.togglePreviewMode,
    toggleMobilePreview: state.toggleMobilePreview,
    setDragging: state.setDragging,
    setZoom: state.setZoom,
    zoomIn: state.zoomIn,
    zoomOut: state.zoomOut,
    resetZoom: state.resetZoom,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    setSidebarOpen: state.setSidebarOpen,
    setActiveSidebarTab: state.setActiveSidebarTab,
    undo: state.undo,
    redo: state.redo,
    clearHistory: state.clearHistory,
  }), shallow);

/**
 * Get history actions only
 */
export const useHistoryActions = () => 
  useEditorStore((state) => ({
    undo: state.undo,
    redo: state.redo,
    clearHistory: state.clearHistory,
  }), shallow);

// ============================================
// Combined Selectors
// ============================================

/**
 * Get the currently selected block with its data
 */
export const useSelectedBlock = () => {
  const selectedBlockId = useSelectedBlockId();
  return useBlock(selectedBlockId);
};

/**
 * Get editor state needed for preview
 */
export const usePreviewState = () => 
  useEditorStore((state) => ({
    isPreviewMode: state.isPreviewMode,
    isMobilePreview: state.isMobilePreview,
    devicePreview: state.devicePreview,
    zoom: state.zoom,
  }), shallow);
