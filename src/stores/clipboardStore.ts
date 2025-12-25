/**
 * Clipboard Store for Copy/Paste functionality
 */
import { create } from 'zustand';
import type { WebsiteBlock } from '@/types';
import { generateId } from '@/lib/utils';

interface ClipboardState {
  copiedBlock: WebsiteBlock | null;
  copyBlock: (block: WebsiteBlock) => void;
  pasteBlock: () => WebsiteBlock | null;
  clearClipboard: () => void;
  hasClipboard: () => boolean;
}

export const useClipboardStore = create<ClipboardState>((set, get) => ({
  copiedBlock: null,

  copyBlock: (block) => {
    // Deep clone the block for clipboard
    set({
      copiedBlock: {
        ...block,
        content: { ...block.content },
        style: { ...block.style },
      },
    });
  },

  pasteBlock: () => {
    const { copiedBlock } = get();
    if (!copiedBlock) return null;

    // Create a new block with new ID but same content/style
    return {
      ...copiedBlock,
      id: generateId(),
      content: { ...copiedBlock.content },
      style: { ...copiedBlock.style },
    };
  },

  clearClipboard: () => {
    set({ copiedBlock: null });
  },

  hasClipboard: () => {
    return get().copiedBlock !== null;
  },
}));

// Selector hooks
export const useCopiedBlock = () => useClipboardStore((state) => state.copiedBlock);
export const useHasClipboard = () => useClipboardStore((state) => state.copiedBlock !== null);
