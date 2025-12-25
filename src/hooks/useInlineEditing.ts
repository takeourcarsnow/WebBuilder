'use client';

import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useWebsiteStore, useEditorStore, useHistoryStore } from '@/stores';

interface UseInlineEditingOptions {
  blockId: string;
  field: string;
  initialValue: string;
}

interface UseInlineEditingReturn {
  isEditing: boolean;
  value: string;
  startEditing: () => void;
  stopEditing: () => void;
  handleChange: (newValue: string) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  contentEditableProps: {
    contentEditable: boolean;
    suppressContentEditableWarning: boolean;
    onDoubleClick: () => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onInput: (e: React.FormEvent<HTMLElement>) => void;
    style: React.CSSProperties;
  };
}

export function useInlineEditing({
  blockId,
  field,
  initialValue,
}: UseInlineEditingOptions): UseInlineEditingReturn {
  const { updateBlockContent, website } = useWebsiteStore();
  const { 
    inlineEditingBlockId, 
    inlineEditingField, 
    setInlineEditing, 
    isPreviewMode 
  } = useEditorStore();
  const { pushState } = useHistoryStore();

  const [localValue, setLocalValue] = useState(initialValue);
  const isEditing = inlineEditingBlockId === blockId && inlineEditingField === field;
  const savedValueRef = useRef(initialValue);

  // Sync local value with initial value
  useEffect(() => {
    setLocalValue(initialValue);
    savedValueRef.current = initialValue;
  }, [initialValue]);

  const startEditing = useCallback(() => {
    if (isPreviewMode) return;
    savedValueRef.current = localValue;
    setInlineEditing(blockId, field);
  }, [blockId, field, localValue, isPreviewMode, setInlineEditing]);

  const stopEditing = useCallback(() => {
    setInlineEditing(null, null);
  }, [setInlineEditing]);

  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
  }, []);

  const saveChanges = useCallback(() => {
    if (localValue !== savedValueRef.current) {
      if (website) {
        pushState(website, `Edit ${field}`);
      }
      updateBlockContent(blockId, { [field]: localValue });
      savedValueRef.current = localValue;
    }
    stopEditing();
  }, [blockId, field, localValue, website, updateBlockContent, pushState, stopEditing]);

  const cancelChanges = useCallback(() => {
    setLocalValue(savedValueRef.current);
    stopEditing();
  }, [stopEditing]);

  const handleBlur = useCallback(() => {
    saveChanges();
  }, [saveChanges]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveChanges();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelChanges();
    }
  }, [saveChanges, cancelChanges]);

  const handleInput = useCallback((e: React.FormEvent<HTMLElement>) => {
    const target = e.currentTarget;
    handleChange(target.textContent || '');
  }, [handleChange]);

  const contentEditableProps = {
    contentEditable: !isPreviewMode,
    suppressContentEditableWarning: true,
    onDoubleClick: startEditing,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onInput: handleInput,
    style: {
      cursor: isPreviewMode ? 'default' : isEditing ? 'text' : 'pointer',
      outline: isEditing ? '2px solid var(--primary-color, #0ea5e9)' : 'none',
      outlineOffset: '2px',
      borderRadius: '4px',
      minHeight: '1em',
    } as React.CSSProperties,
  };

  return {
    isEditing,
    value: localValue,
    startEditing,
    stopEditing,
    handleChange,
    handleBlur,
    handleKeyDown,
    contentEditableProps,
  };
}

// Wrapper component for inline editable text
interface InlineEditableProps {
  blockId: string;
  field: string;
  value: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export function InlineEditable({
  blockId,
  field,
  value,
  as: Component = 'span',
  className,
  placeholder = 'Click to edit...',
  children,
}: InlineEditableProps) {
  const { contentEditableProps, isEditing } = useInlineEditing({
    blockId,
    field,
    initialValue: value,
  });
  const { isPreviewMode } = useEditorStore();

  const displayValue = value || (isPreviewMode ? '' : placeholder);
  const Tag = Component as any;

  return React.createElement(
    Tag,
    {
      ...contentEditableProps,
      className,
      'data-placeholder': !value && !isPreviewMode ? placeholder : undefined,
    },
    children || displayValue
  );
}
