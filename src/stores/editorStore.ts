import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorState, Notification } from '@/types';
import type { BlockType } from '@/types/website';

export type DevicePreview = 'desktop' | 'tablet' | 'mobile' | 'mobile-landscape';

// Custom device breakpoint
export interface CustomBreakpoint {
  id: string;
  name: string;
  width: number;
  height?: number;
}

interface HistoryEntry {
  timestamp: number;
  action: string;
  data?: unknown;
}

interface EditorStore extends EditorState {
  // Selection
  setSelectedBlock: (blockId: string | null) => void;
  
  // Multi-select
  selectedBlockIds: string[];
  addToSelection: (blockId: string) => void;
  removeFromSelection: (blockId: string) => void;
  toggleSelection: (blockId: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  isMultiSelectMode: boolean;
  setMultiSelectMode: (enabled: boolean) => void;
  
  // Preview
  setPreviewMode: (isPreview: boolean) => void;
  setMobilePreview: (isMobile: boolean) => void;
  togglePreviewMode: () => void;
  toggleMobilePreview: () => void;
  
  // Device preview (desktop, tablet, mobile, mobile-landscape)
  devicePreview: DevicePreview;
  setDevicePreview: (device: DevicePreview) => void;
  
  // Custom breakpoints
  customBreakpoints: CustomBreakpoint[];
  addCustomBreakpoint: (breakpoint: Omit<CustomBreakpoint, 'id'>) => void;
  removeCustomBreakpoint: (id: string) => void;
  activeCustomBreakpoint: string | null;
  setActiveCustomBreakpoint: (id: string | null) => void;
  
  // Side-by-side preview
  sideBySidePreview: boolean;
  toggleSideBySidePreview: () => void;
  
  // Drag state
  setDragging: (isDragging: boolean) => void;
  
  // Zoom
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  activeSidebarTab: 'blocks' | 'style' | 'settings' | 'layers' | 'ai' | 'seo' | 'accessibility' | 'design-tokens' | 'animation' | 'templates' | 'collaboration' | 'performance' | 'history' | 'workflows';
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveSidebarTab: (tab: 'blocks' | 'style' | 'settings' | 'layers' | 'ai' | 'seo' | 'accessibility' | 'design-tokens' | 'animation' | 'templates' | 'collaboration' | 'performance' | 'history' | 'workflows') => void;
  
  // Undo/Redo
  historyStack: HistoryEntry[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  pushHistory: (action: string, data?: unknown) => void;
  clearHistory: () => void;
  
  // Block search
  blockSearchQuery: string;
  setBlockSearchQuery: (query: string) => void;
  
  // Recent blocks
  recentBlockTypes: BlockType[];
  addRecentBlockType: (type: BlockType) => void;
  
  // Layers panel
  layersPanelCollapsed: Record<string, boolean>;
  toggleLayerCollapsed: (groupId: string) => void;
  
  // Keyboard shortcuts overlay
  showShortcutsOverlay: boolean;
  toggleShortcutsOverlay: () => void;
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
  
  // Landscape mode
  isLandscapeMode: boolean;
  toggleLandscapeMode: () => void;
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  currentOnboardingStep: number;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  setCurrentOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Inline editing
  inlineEditingBlockId: string | null;
  inlineEditingField: string | null;
  setInlineEditing: (blockId: string | null, field: string | null) => void;
  
  // Auto-save indicator
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  
  // Block quick actions hover
  hoveredBlockId: string | null;
  setHoveredBlockId: (blockId: string | null) => void;
}

const MAX_HISTORY = 50;
const MAX_RECENT_BLOCKS = 5;

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      selectedBlockId: null,
      selectedBlockIds: [],
      isMultiSelectMode: false,
      isPreviewMode: false,
      isMobilePreview: false,
      devicePreview: 'desktop',
      customBreakpoints: [],
      activeCustomBreakpoint: null,
      sideBySidePreview: false,
      undoStack: [],
      redoStack: [],
      isDragging: false,
      zoom: 100,
      notifications: [],
      isSidebarOpen: true,
      activeSidebarTab: 'blocks',
      historyStack: [],
      historyIndex: -1,
      blockSearchQuery: '',
      recentBlockTypes: [],
      layersPanelCollapsed: {},
      showShortcutsOverlay: false,
      showKeyboardShortcuts: false,
      isLandscapeMode: false,
      hasCompletedOnboarding: false,
      currentOnboardingStep: 0,
      showOnboarding: false,
      inlineEditingBlockId: null,
      inlineEditingField: null,
      lastSavedAt: null,
      isSaving: false,
      hoveredBlockId: null,

      setSelectedBlock: (blockId) => set({ 
        selectedBlockId: blockId,
        selectedBlockIds: blockId ? [blockId] : [],
      }),
      
      // Multi-select
      addToSelection: (blockId) => set((state) => ({
        selectedBlockIds: [...state.selectedBlockIds, blockId],
        selectedBlockId: blockId,
      })),
      
      removeFromSelection: (blockId) => set((state) => {
        const newSelection = state.selectedBlockIds.filter(id => id !== blockId);
        return {
          selectedBlockIds: newSelection,
          selectedBlockId: newSelection.length > 0 ? newSelection[newSelection.length - 1] : null,
        };
      }),
      
      toggleSelection: (blockId) => {
        const { selectedBlockIds } = get();
        if (selectedBlockIds.includes(blockId)) {
          get().removeFromSelection(blockId);
        } else {
          get().addToSelection(blockId);
        }
      },
      
      clearSelection: () => set({ 
        selectedBlockIds: [],
        selectedBlockId: null,
      }),
      
      selectAll: () => {
        // Will be called with block ids from component
      },
      
      setMultiSelectMode: (enabled) => set({ isMultiSelectMode: enabled }),

      setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),
      setMobilePreview: (isMobile) => set({ isMobilePreview: isMobile }),
      togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
      toggleMobilePreview: () => set((state) => ({ isMobilePreview: !state.isMobilePreview })),
      
      setDevicePreview: (device) => set({ 
        devicePreview: device,
        isMobilePreview: device === 'mobile' || device === 'mobile-landscape',
        activeCustomBreakpoint: null,
      }),
      
      // Custom breakpoints
      addCustomBreakpoint: (breakpoint) => set((state) => ({
        customBreakpoints: [
          ...state.customBreakpoints,
          { ...breakpoint, id: crypto.randomUUID() },
        ],
      })),
      
      removeCustomBreakpoint: (id) => set((state) => ({
        customBreakpoints: state.customBreakpoints.filter(bp => bp.id !== id),
        activeCustomBreakpoint: state.activeCustomBreakpoint === id ? null : state.activeCustomBreakpoint,
      })),
      
      setActiveCustomBreakpoint: (id) => set({ activeCustomBreakpoint: id }),
      
      toggleSideBySidePreview: () => set((state) => ({ 
        sideBySidePreview: !state.sideBySidePreview 
      })),

      setDragging: (isDragging) => set({ isDragging }),

      setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 25), 200) }),
      zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + 10, 200) })),
      zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - 10, 25) })),
      resetZoom: () => set({ zoom: 100 }),

      addNotification: (notification) => {
        const id = crypto.randomUUID();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));

        if (notification.duration !== 0) {
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          }, notification.duration || 3000);
        }
      },

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
      
      // Undo/Redo implementation
      pushHistory: (action, data) => {
        const { historyStack, historyIndex } = get();
        const newEntry: HistoryEntry = {
          timestamp: Date.now(),
          action,
          data,
        };
        
        const newStack = historyStack.slice(0, historyIndex + 1);
        newStack.push(newEntry);
        
        if (newStack.length > MAX_HISTORY) {
          newStack.shift();
        }
        
        set({
          historyStack: newStack,
          historyIndex: newStack.length - 1,
        });
      },
      
      undo: () => {
        const { historyIndex } = get();
        if (historyIndex > 0) {
          set({ historyIndex: historyIndex - 1 });
        }
      },
      
      redo: () => {
        const { historyStack, historyIndex } = get();
        if (historyIndex < historyStack.length - 1) {
          set({ historyIndex: historyIndex + 1 });
        }
      },
      
      canUndo: () => get().historyIndex > 0,
      canRedo: () => {
        const { historyStack, historyIndex } = get();
        return historyIndex < historyStack.length - 1;
      },
      
      clearHistory: () => set({ historyStack: [], historyIndex: -1 }),
      
      setBlockSearchQuery: (query) => set({ blockSearchQuery: query }),
      
      // Recent blocks
      addRecentBlockType: (type) => set((state) => {
        const filtered = state.recentBlockTypes.filter(t => t !== type);
        return {
          recentBlockTypes: [type, ...filtered].slice(0, MAX_RECENT_BLOCKS),
        };
      }),
      
      // Layers panel
      toggleLayerCollapsed: (groupId) => set((state) => ({
        layersPanelCollapsed: {
          ...state.layersPanelCollapsed,
          [groupId]: !state.layersPanelCollapsed[groupId],
        },
      })),
      
      // Keyboard shortcuts overlay
      toggleShortcutsOverlay: () => set((state) => ({ 
        showShortcutsOverlay: !state.showShortcutsOverlay 
      })),
      
      setShowKeyboardShortcuts: (show) => set({ showKeyboardShortcuts: show }),
      
      // Landscape mode
      toggleLandscapeMode: () => set((state) => ({ 
        isLandscapeMode: !state.isLandscapeMode 
      })),
      
      // Onboarding
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      setCurrentOnboardingStep: (step) => set({ currentOnboardingStep: step }),
      completeOnboarding: () => set({ 
        hasCompletedOnboarding: true,
        showOnboarding: false,
        currentOnboardingStep: 0,
      }),
      resetOnboarding: () => set({ 
        hasCompletedOnboarding: false,
        currentOnboardingStep: 0,
      }),
      
      // Inline editing
      setInlineEditing: (blockId, field) => set({
        inlineEditingBlockId: blockId,
        inlineEditingField: field,
      }),
      
      // Auto-save
      setLastSavedAt: (date) => set({ lastSavedAt: date }),
      setIsSaving: (saving) => set({ isSaving: saving }),
      
      // Block quick actions
      setHoveredBlockId: (blockId) => set({ hoveredBlockId: blockId }),
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        recentBlockTypes: state.recentBlockTypes,
        customBreakpoints: state.customBreakpoints,
      }),
    }
  )
);
