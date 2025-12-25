// Simple history actions interface for undo/redo
export interface HistoryActions {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

// Note: This middleware is a reference implementation.
// The actual undo/redo is implemented directly in editorStore.ts for simplicity.
// This file can be extended for more complex state management needs.
