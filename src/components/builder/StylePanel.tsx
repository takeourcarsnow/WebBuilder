'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useWebsiteStore, useEditorStore, useSelectedBlock } from '@/stores';
import { Input, Textarea, Select, Switch, ColorPicker, Slider } from '@/components/ui';
import { getBlockDefinition } from '@/lib/constants';
import { useDebouncedCallback } from '@/hooks';
import { cn } from '@/lib/utils';

interface StylePanelProps {
  className?: string;
}

// Debounced input component for text fields
const DebouncedInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = memo(({ label, value: initialValue, onChange, placeholder, type }) => {
  const [localValue, setLocalValue] = useState(initialValue);
  
  // Sync with external value
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  
  const debouncedChange = useDebouncedCallback(onChange, 300);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedChange(newValue);
  }, [debouncedChange]);
  
  return (
    <Input
      label={label}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
    />
  );
});

DebouncedInput.displayName = 'DebouncedInput';

// Debounced textarea component
const DebouncedTextarea: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}> = memo(({ label, value: initialValue, onChange, placeholder, rows }) => {
  const [localValue, setLocalValue] = useState(initialValue);
  
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);
  
  const debouncedChange = useDebouncedCallback(onChange, 300);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedChange(newValue);
  }, [debouncedChange]);
  
  return (
    <Textarea
      label={label}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
    />
  );
});

DebouncedTextarea.displayName = 'DebouncedTextarea';

export const StylePanel: React.FC<StylePanelProps> = ({ className }) => {
  const { updateBlockContent, updateBlockStyle } = useWebsiteStore();
  const selectedBlock = useSelectedBlock();
  const definition = selectedBlock ? getBlockDefinition(selectedBlock.type) : null;

  if (!selectedBlock) {
    return (
      <div className={cn('flex h-full items-center justify-center p-4', className)}>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a block to edit its content and style
          </p>
        </div>
      </div>
    );
  }

  const renderContentEditor = () => {
    const content = selectedBlock.content;

    switch (selectedBlock.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <DebouncedInput
              label="Headline"
              value={content.headline as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { headline: value })}
              placeholder="Your main headline"
            />
            <DebouncedTextarea
              label="Subheadline"
              value={content.subheadline as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { subheadline: value })}
              placeholder="Supporting text"
              rows={3}
            />
            <Switch
              label="Show Button"
              checked={content.showButton as boolean}
              onCheckedChange={(checked) => updateBlockContent(selectedBlock.id, { showButton: checked })}
            />
            {content.showButton && (
              <>
                <DebouncedInput
                  label="Button Text"
                  value={content.buttonText as string}
                  onChange={(value) => updateBlockContent(selectedBlock.id, { buttonText: value })}
                />
                <DebouncedInput
                  label="Button Link"
                  value={content.buttonLink as string}
                  onChange={(value) => updateBlockContent(selectedBlock.id, { buttonLink: value })}
                  placeholder="#section or https://..."
                />
              </>
            )}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            <DebouncedInput
              label="Title"
              value={content.title as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { title: value })}
            />
            <DebouncedTextarea
              label="Description"
              value={content.description as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { description: value })}
              rows={5}
            />
            <Switch
              label="Show Image"
              checked={content.showImage as boolean}
              onCheckedChange={(checked) => updateBlockContent(selectedBlock.id, { showImage: checked })}
            />
            {content.showImage && (
              <DebouncedInput
                label="Image URL"
                value={content.image as string}
                onChange={(value) => updateBlockContent(selectedBlock.id, { image: value })}
                placeholder="https://..."
              />
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <Switch
              label="Show Heading"
              checked={content.showHeading as boolean}
              onCheckedChange={(checked) => updateBlockContent(selectedBlock.id, { showHeading: checked })}
            />
            {content.showHeading && (
              <DebouncedInput
                label="Heading"
                value={content.heading as string}
                onChange={(value) => updateBlockContent(selectedBlock.id, { heading: value })}
              />
            )}
            <DebouncedTextarea
              label="Body Text"
              value={content.body as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { body: value })}
              rows={6}
            />
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <DebouncedInput
              label="Headline"
              value={content.headline as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { headline: value })}
            />
            <DebouncedTextarea
              label="Description"
              value={content.description as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { description: value })}
              rows={3}
            />
            <DebouncedInput
              label="Primary Button Text"
              value={content.primaryButtonText as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { primaryButtonText: value })}
            />
            <DebouncedInput
              label="Primary Button Link"
              value={content.primaryButtonLink as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { primaryButtonLink: value })}
            />
            <Switch
              label="Show Secondary Button"
              checked={content.showSecondaryButton as boolean}
              onCheckedChange={(checked) => updateBlockContent(selectedBlock.id, { showSecondaryButton: checked })}
            />
            {content.showSecondaryButton && (
              <>
                <DebouncedInput
                  label="Secondary Button Text"
                  value={content.secondaryButtonText as string}
                  onChange={(value) => updateBlockContent(selectedBlock.id, { secondaryButtonText: value })}
                />
                <DebouncedInput
                  label="Secondary Button Link"
                  value={content.secondaryButtonLink as string}
                  onChange={(value) => updateBlockContent(selectedBlock.id, { secondaryButtonLink: value })}
                />
              </>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <DebouncedInput
              label="Title"
              value={content.title as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { title: value })}
            />
            <DebouncedTextarea
              label="Subtitle"
              value={content.subtitle as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { subtitle: value })}
              rows={2}
            />
            <DebouncedInput
              label="Email"
              value={content.email as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { email: value })}
              type="email"
            />
            <DebouncedInput
              label="Button Text"
              value={content.buttonText as string}
              onChange={(value) => updateBlockContent(selectedBlock.id, { buttonText: value })}
            />
          </div>
        );

      case 'spacer':
        return (
          <div className="space-y-4">
            <Slider
              label="Height"
              value={[content.height as number]}
              onValueChange={(value) => updateBlockContent(selectedBlock.id, { height: value[0] })}
              min={16}
              max={200}
              step={8}
              unit="px"
            />
          </div>
        );

      default:
        return (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Content editor for this block type coming soon
          </div>
        );
    }
  };

  const renderStyleEditor = () => {
    const style = selectedBlock.style;

    return (
      <div className="space-y-4">
        <ColorPicker
          label="Background Color"
          value={style.backgroundColor || '#ffffff'}
          onChange={(color) => updateBlockStyle(selectedBlock.id, { backgroundColor: color })}
        />

        <ColorPicker
          label="Text Color"
          value={style.textColor || '#000000'}
          onChange={(color) => updateBlockStyle(selectedBlock.id, { textColor: color })}
        />

        <Select
          label="Padding"
          value={style.padding || 'medium'}
          onValueChange={(value) => updateBlockStyle(selectedBlock.id, { padding: value as typeof style.padding })}
          options={[
            { value: 'none', label: 'None' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />

        <Select
          label="Alignment"
          value={style.alignment || 'center'}
          onValueChange={(value) => updateBlockStyle(selectedBlock.id, { alignment: value as typeof style.alignment })}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />

        <Select
          label="Width"
          value={style.width || 'full'}
          onValueChange={(value) => updateBlockStyle(selectedBlock.id, { width: value as typeof style.width })}
          options={[
            { value: 'narrow', label: 'Narrow' },
            { value: 'medium', label: 'Medium' },
            { value: 'wide', label: 'Wide' },
            { value: 'full', label: 'Full Width' },
          ]}
        />
      </div>
    );
  };

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Edit {definition?.name || 'Block'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Content
          </h3>
          {renderContentEditor()}
        </div>

        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Style
          </h3>
          {renderStyleEditor()}
        </div>
      </div>
    </div>
  );
};
