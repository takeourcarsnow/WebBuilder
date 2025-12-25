/**
 * History middleware for proper undo/redo functionality
 * Stores full website snapshots for accurate state restoration
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Website } from '@/types';

interface HistoryEntry {
  timestamp: number;
  website: Website;
  action: string;
}

interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
  maxHistory: number;
  
  // Actions
  pushState: (website: Website, action: string) => void;
  undo: () => Website | null;
  redo: () => Website | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  getHistoryInfo: () => { past: number; future: number; lastAction: string | null };
}

const MAX_HISTORY = 30;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  maxHistory: MAX_HISTORY,

  pushState: (website, action) => {
    const { past, maxHistory } = get();
    
    // Deep clone the website state
    const snapshot: HistoryEntry = {
      timestamp: Date.now(),
      website: JSON.parse(JSON.stringify(website)),
      action,
    };

    // Add to past, limit size
    const newPast = [...past, snapshot];
    if (newPast.length > maxHistory) {
      newPast.shift();
    }

    set({
      past: newPast,
      future: [], // Clear future on new action
    });
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;

    const newPast = [...past];
    const previous = newPast.pop();
    
    if (!previous) return null;

    set({
      past: newPast,
      future: [previous, ...future],
    });

    // Return the website state to restore
    return newPast.length > 0 
      ? JSON.parse(JSON.stringify(newPast[newPast.length - 1].website))
      : null;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;

    const newFuture = [...future];
    const next = newFuture.shift();
    
    if (!next) return null;

    set({
      past: [...past, next],
      future: newFuture,
    });

    return JSON.parse(JSON.stringify(next.website));
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clearHistory: () => set({ past: [], future: [] }),

  getHistoryInfo: () => {
    const { past, future } = get();
    return {
      past: past.length,
      future: future.length,
      lastAction: past.length > 0 ? past[past.length - 1].action : null,
    };
  },
}));

// Selector hooks
export const useCanUndo = () => useHistoryStore((state) => state.past.length > 0);
export const useCanRedo = () => useHistoryStore((state) => state.future.length > 0);
export const useHistoryInfo = () => useHistoryStore((state) => ({
  pastCount: state.past.length,
  futureCount: state.future.length,
  lastAction: state.past.length > 0 ? state.past[state.past.length - 1].action : null,
}));
