import { create } from 'zustand';
import type { EditorState, Notification } from '@/types';

export type DevicePreview = 'desktop' | 'tablet' | 'mobile';

interface HistoryEntry {
  timestamp: number;
  action: string;
  data?: unknown;
}

interface EditorStore extends EditorState {
  // Selection
  setSelectedBlock: (blockId: string | null) => void;
  
  // Preview
  setPreviewMode: (isPreview: boolean) => void;
  setMobilePreview: (isMobile: boolean) => void;
  togglePreviewMode: () => void;
  toggleMobilePreview: () => void;
  
  // Device preview (desktop, tablet, mobile)
  devicePreview: DevicePreview;
  setDevicePreview: (device: DevicePreview) => void;
  
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
  activeSidebarTab: 'blocks' | 'style' | 'settings';
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveSidebarTab: (tab: 'blocks' | 'style' | 'settings') => void;
  
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
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorStore>((set, get) => ({
  selectedBlockId: null,
  isPreviewMode: false,
  isMobilePreview: false,
  devicePreview: 'desktop',
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

  setSelectedBlock: (blockId) => set({ selectedBlockId: blockId }),

  setPreviewMode: (isPreview) => set({ isPreviewMode: isPreview }),
  setMobilePreview: (isMobile) => set({ isMobilePreview: isMobile }),
  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
  toggleMobilePreview: () => set((state) => ({ isMobilePreview: !state.isMobilePreview })),
  
  setDevicePreview: (device) => set({ 
    devicePreview: device,
    isMobilePreview: device === 'mobile',
  }),

  setDragging: (isDragging) => set({ isDragging }),

  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 50), 150) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + 10, 150) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - 10, 50) })),
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
    
    // Remove any "future" entries if we're not at the end
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(newEntry);
    
    // Limit history size
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
}));
