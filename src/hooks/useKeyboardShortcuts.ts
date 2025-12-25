import { useEffect, useCallback } from 'react';
import { useWebsiteStore, useEditorStore } from '@/stores';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
};

export function useKeyboardShortcuts() {
  const { deleteBlock, duplicateBlock, moveBlock, website } = useWebsiteStore();
  const { 
    selectedBlockId, 
    setSelectedBlock, 
    togglePreviewMode, 
    undo, 
    redo,
    addNotification 
  } = useEditorStore();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'z',
      ctrl: true,
      action: () => {
        undo();
        addNotification({ type: 'info', message: 'Undo', duration: 1500 });
      },
      description: 'Undo',
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      action: () => {
        redo();
        addNotification({ type: 'info', message: 'Redo', duration: 1500 });
      },
      description: 'Redo',
    },
    {
      key: 'y',
      ctrl: true,
      action: () => {
        redo();
        addNotification({ type: 'info', message: 'Redo', duration: 1500 });
      },
      description: 'Redo',
    },
    {
      key: 'Delete',
      action: () => {
        if (selectedBlockId) {
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
        if (selectedBlockId) {
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
        if (selectedBlockId) {
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
            moveBlock(selectedBlockId, block.order + 1);
          }
        }
      },
      description: 'Move block down',
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
  { keys: 'Delete / Backspace', description: 'Delete selected block' },
  { keys: 'Ctrl+D', description: 'Duplicate selected block' },
  { keys: 'Ctrl+P', description: 'Toggle preview mode' },
  { keys: 'Escape', description: 'Deselect block' },
  { keys: 'Alt+↑', description: 'Move block up' },
  { keys: 'Alt+↓', description: 'Move block down' },
];
