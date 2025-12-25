import { useEffect, useCallback } from 'react';
import { useWebsiteStore, useEditorStore } from '@/stores';
import { useClipboardStore } from '@/stores/clipboardStore';
import { useHistoryStore } from '@/stores/historyStore';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
};

export function useKeyboardShortcuts() {
  const { deleteBlock, duplicateBlock, moveBlock, website, setCurrentWebsite } = useWebsiteStore();
  const { 
    selectedBlockId, 
    setSelectedBlock, 
    togglePreviewMode, 
    addNotification,
    setActiveSidebarTab,
  } = useEditorStore();
  
  const { copyBlock, pasteBlock, hasClipboard } = useClipboardStore();
  const { undo: historyUndo, redo: historyRedo, pushState, canUndo, canRedo } = useHistoryStore();
  const addBlock = useWebsiteStore((state) => state.addBlock);

  // Get current selected block for copy
  const getSelectedBlock = useCallback(() => {
    if (!selectedBlockId || !website) return null;
    return website.blocks.find(b => b.id === selectedBlockId);
  }, [selectedBlockId, website]);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'z',
      ctrl: true,
      action: () => {
        if (canUndo()) {
          const previousState = historyUndo();
          if (previousState) {
            setCurrentWebsite(previousState);
            addNotification({ type: 'info', message: 'Undo', duration: 1500 });
          }
        }
      },
      description: 'Undo',
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: () => {
        if (canRedo()) {
          const nextState = historyRedo();
          if (nextState) {
            setCurrentWebsite(nextState);
            addNotification({ type: 'info', message: 'Redo', duration: 1500 });
          }
        }
      },
      description: 'Redo',
    },
    {
      key: 'y',
      ctrl: true,
      action: () => {
        if (canRedo()) {
          const nextState = historyRedo();
          if (nextState) {
            setCurrentWebsite(nextState);
            addNotification({ type: 'info', message: 'Redo', duration: 1500 });
          }
        }
      },
      description: 'Redo',
    },
    {
      key: 'c',
      ctrl: true,
      action: () => {
        const block = getSelectedBlock();
        if (block) {
          copyBlock(block);
          addNotification({ type: 'success', message: 'Block copied', duration: 1500 });
        }
      },
      description: 'Copy selected block',
    },
    {
      key: 'v',
      ctrl: true,
      action: () => {
        if (hasClipboard() && website) {
          // Save current state for undo
          pushState(website, 'Paste block');
          
          const pastedBlock = pasteBlock();
          if (pastedBlock) {
            // Get current block order to paste after
            const selectedBlock = getSelectedBlock();
            const insertIndex = selectedBlock ? selectedBlock.order + 1 : website.blocks.length;
            
            // Add block at the correct position using store
            const block = website.blocks.find(b => b.order >= insertIndex);
            if (block) {
              // Insert at position
              const newBlocks = [...website.blocks];
              pastedBlock.order = insertIndex;
              newBlocks.splice(insertIndex, 0, pastedBlock);
              // Reorder
              newBlocks.forEach((b, i) => b.order = i);
              setCurrentWebsite({ ...website, blocks: newBlocks, updatedAt: new Date() });
            } else {
              pastedBlock.order = website.blocks.length;
              setCurrentWebsite({ 
                ...website, 
                blocks: [...website.blocks, pastedBlock],
                updatedAt: new Date()
              });
            }
            
            setSelectedBlock(pastedBlock.id);
            addNotification({ type: 'success', message: 'Block pasted', duration: 1500 });
          }
        }
      },
      description: 'Paste copied block',
    },
    {
      key: 'x',
      ctrl: true,
      action: () => {
        const block = getSelectedBlock();
        if (block && website) {
          // Save state for undo
          pushState(website, 'Cut block');
          
          copyBlock(block);
          deleteBlock(block.id);
          setSelectedBlock(null);
          addNotification({ type: 'success', message: 'Block cut', duration: 1500 });
        }
      },
      description: 'Cut selected block',
    },
    {
      key: 'Delete',
      action: () => {
        if (selectedBlockId && website) {
          // Save state for undo
          pushState(website, 'Delete block');
          
          deleteBlock(selectedBlockId);
          setSelectedBlock(null);
          addNotification({ type: 'success', message: 'Block deleted', duration: 1500 });
        }
      },
      description: 'Delete selected block',
    },
    {
      key: 'Backspace',
      action: () => {
        if (selectedBlockId && website) {
          // Save state for undo
          pushState(website, 'Delete block');
          
          deleteBlock(selectedBlockId);
          setSelectedBlock(null);
          addNotification({ type: 'success', message: 'Block deleted', duration: 1500 });
        }
      },
      description: 'Delete selected block',
    },
    {
      key: 'd',
      ctrl: true,
      action: () => {
        if (selectedBlockId && website) {
          // Save state for undo
          pushState(website, 'Duplicate block');
          
          const newBlock = duplicateBlock(selectedBlockId);
          if (newBlock) {
            setSelectedBlock(newBlock.id);
            addNotification({ type: 'success', message: 'Block duplicated', duration: 1500 });
          }
        }
      },
      description: 'Duplicate selected block',
    },
    {
      key: 'p',
      ctrl: true,
      action: () => {
        togglePreviewMode();
      },
      description: 'Toggle preview mode',
    },
    {
      key: 'Escape',
      action: () => {
        setSelectedBlock(null);
      },
      description: 'Deselect block',
    },
    {
      key: 'ArrowUp',
      alt: true,
      action: () => {
        if (selectedBlockId && website) {
          const block = website.blocks.find(b => b.id === selectedBlockId);
          if (block && block.order > 0) {
            pushState(website, 'Move block up');
            moveBlock(selectedBlockId, block.order - 1);
          }
        }
      },
      description: 'Move block up',
    },
    {
      key: 'ArrowDown',
      alt: true,
      action: () => {
        if (selectedBlockId && website) {
          const block = website.blocks.find(b => b.id === selectedBlockId);
          if (block && block.order < website.blocks.length - 1) {
            pushState(website, 'Move block down');
            moveBlock(selectedBlockId, block.order + 1);
          }
        }
      },
      description: 'Move block down',
    },
    {
      key: 'b',
      ctrl: true,
      action: () => {
        setActiveSidebarTab('blocks');
        addNotification({ type: 'info', message: 'Blocks panel', duration: 1000 });
      },
      description: 'Open blocks panel',
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        // Prevent browser save dialog
        addNotification({ type: 'success', message: 'Changes saved', duration: 1500 });
      },
      description: 'Save (auto-saved)',
    },
  ];

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (event.key === shortcut.key && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { shortcuts };
}

// Export shortcut descriptions for UI display
export const getShortcutDescriptions = () => [
  { keys: 'Ctrl+Z', description: 'Undo' },
  { keys: 'Ctrl+Shift+Z / Ctrl+Y', description: 'Redo' },
  { keys: 'Ctrl+C', description: 'Copy selected block' },
  { keys: 'Ctrl+V', description: 'Paste copied block' },
  { keys: 'Ctrl+X', description: 'Cut selected block' },
  { keys: 'Delete / Backspace', description: 'Delete selected block' },
  { keys: 'Ctrl+D', description: 'Duplicate selected block' },
  { keys: 'Ctrl+P', description: 'Toggle preview mode' },
  { keys: 'Ctrl+B', description: 'Open blocks panel' },
  { keys: 'Ctrl+S', description: 'Save (auto-saved)' },
  { keys: 'Escape', description: 'Deselect block' },
  { keys: 'Alt+↑', description: 'Move block up' },
  { keys: 'Alt+↓', description: 'Move block down' },
];
