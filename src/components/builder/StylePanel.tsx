'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { useWebsiteStore, useEditorStore, useSelectedBlock, useHistoryStore } from '@/stores';
import { Input, Textarea, Select, Switch, ColorPicker, Slider, GradientPicker, Tabs } from '@/components/ui';
import { getBlockDefinition } from '@/lib/constants';
import { useDebouncedCallback } from '@/hooks';
import { cn } from '@/lib/utils';
import type { AnimationConfig, ResponsiveStyles } from '@/types';

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

// Animation Editor Component
const AnimationEditor: React.FC<{
  animation?: AnimationConfig;
  onChange: (animation: AnimationConfig) => void;
}> = memo(({ animation, onChange }) => {
  const defaultAnimation: AnimationConfig = {
    type: 'none',
    duration: 0.5,
    delay: 0,
    easing: 'ease-out',
    triggerOnce: true,
  };

  const current = animation || defaultAnimation;

  return (
    <div className="space-y-4">
      <Select
        label="Animation Type"
        value={current.type}
        onValueChange={(value) => onChange({ ...current, type: value as AnimationConfig['type'] })}
        options={[
          { value: 'none', label: 'None' },
          { value: 'fade', label: 'Fade In' },
          { value: 'slide-up', label: 'Slide Up' },
          { value: 'slide-down', label: 'Slide Down' },
          { value: 'slide-left', label: 'Slide Left' },
          { value: 'slide-right', label: 'Slide Right' },
          { value: 'scale', label: 'Scale' },
          { value: 'rotate', label: 'Rotate' },
          { value: 'bounce', label: 'Bounce' },
        ]}
      />
      
      {current.type !== 'none' && (
        <>
          <Slider
            label="Duration"
            value={[current.duration * 10]}
            onValueChange={(value) => onChange({ ...current, duration: value[0] / 10 })}
            min={1}
            max={20}
            step={1}
            unit="s"
          />
          
          <Slider
            label="Delay"
            value={[current.delay * 10]}
            onValueChange={(value) => onChange({ ...current, delay: value[0] / 10 })}
            min={0}
            max={20}
            step={1}
            unit="s"
          />
          
          <Select
            label="Easing"
            value={current.easing}
            onValueChange={(value) => onChange({ ...current, easing: value as AnimationConfig['easing'] })}
            options={[
              { value: 'linear', label: 'Linear' },
              { value: 'ease-in', label: 'Ease In' },
              { value: 'ease-out', label: 'Ease Out' },
              { value: 'ease-in-out', label: 'Ease In Out' },
              { value: 'spring', label: 'Spring' },
            ]}
          />
          
          <Switch
            label="Trigger Once"
            checked={current.triggerOnce}
            onCheckedChange={(checked) => onChange({ ...current, triggerOnce: checked })}
          />
        </>
      )}
    </div>
  );
});

AnimationEditor.displayName = 'AnimationEditor';

// Custom CSS Editor Component
const CustomCSSEditor: React.FC<{
  value: string;
  onChange: (css: string) => void;
}> = memo(({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const debouncedChange = useDebouncedCallback(onChange, 500);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedChange(newValue);
  }, [debouncedChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Custom CSS
      </label>
      <textarea
        value={localValue}
        onChange={handleChange}
        placeholder={`/* Add custom styles */
.block {
  /* Your CSS here */
}`}
        className="w-full h-40 px-3 py-2 text-sm font-mono rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.block</code> to target this block
      </p>
    </div>
  );
});

CustomCSSEditor.displayName = 'CustomCSSEditor';

// Responsive Styles Editor
const ResponsiveStylesEditor: React.FC<{
  responsiveStyles?: ResponsiveStyles;
  currentStyle: Record<string, unknown>;
  onChange: (styles: ResponsiveStyles) => void;
}> = memo(({ responsiveStyles, currentStyle, onChange }) => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'tablet'>('mobile');
  
  const current = responsiveStyles || { mobile: {}, tablet: {} };
  const deviceStyles = (activeDevice === 'mobile' ? current.mobile : current.tablet) || {};

  const handleStyleChange = (key: string, value: unknown) => {
    const newDeviceStyles = { ...deviceStyles, [key]: value };
    onChange({
      ...current,
      [activeDevice]: newDeviceStyles,
    });
  };

  const clearOverride = (key: string) => {
    const newDeviceStyles = { ...deviceStyles } as Record<string, unknown>;
    delete newDeviceStyles[key];
    onChange({
      ...current,
      [activeDevice]: newDeviceStyles as typeof deviceStyles,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveDevice('mobile')}
          className={cn(
            'flex-1 px-3 py-2 text-sm rounded-lg transition-colors',
            activeDevice === 'mobile'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          📱 Mobile
        </button>
        <button
          onClick={() => setActiveDevice('tablet')}
          className={cn(
            'flex-1 px-3 py-2 text-sm rounded-lg transition-colors',
            activeDevice === 'tablet'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          📊 Tablet
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Override styles for {activeDevice} devices. Leave empty to inherit from desktop.
      </p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700 dark:text-gray-300">Padding Override</label>
          {deviceStyles.padding && (
            <button
              onClick={() => clearOverride('padding')}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
        <Select
          value={(deviceStyles.padding as string) || ''}
          onValueChange={(value) => handleStyleChange('padding', value || undefined)}
          options={[
            { value: '', label: 'Inherit from desktop' },
            { value: 'none', label: 'None' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700 dark:text-gray-300">Alignment Override</label>
          {deviceStyles.alignment && (
            <button
              onClick={() => clearOverride('alignment')}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
        <Select
          value={(deviceStyles.alignment as string) || ''}
          onValueChange={(value) => handleStyleChange('alignment', value || undefined)}
          options={[
            { value: '', label: 'Inherit from desktop' },
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />

        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700 dark:text-gray-300">Width Override</label>
          {deviceStyles.width && (
            <button
              onClick={() => clearOverride('width')}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          )}
        </div>
        <Select
          value={(deviceStyles.width as string) || ''}
          onValueChange={(value) => handleStyleChange('width', value || undefined)}
          options={[
            { value: '', label: 'Inherit from desktop' },
            { value: 'narrow', label: 'Narrow' },
            { value: 'medium', label: 'Medium' },
            { value: 'wide', label: 'Wide' },
            { value: 'full', label: 'Full Width' },
          ]}
        />
      </div>
    </div>
  );
});

ResponsiveStylesEditor.displayName = 'ResponsiveStylesEditor';

export const StylePanel: React.FC<StylePanelProps> = ({ className }) => {
  const { updateBlockContent, updateBlockStyle, website, setBlockAnimation, setBlockCustomCSS } = useWebsiteStore();
  const selectedBlock = useSelectedBlock();
  const { pushState } = useHistoryStore();
  const definition = selectedBlock ? getBlockDefinition(selectedBlock.type) : null;
  const [activeTab, setActiveTab] = useState('content');

  // Track changes for undo
  const handleStyleChange = useCallback((styleUpdate: Parameters<typeof updateBlockStyle>[1]) => {
    if (selectedBlock && website) {
      pushState(website, 'Update block style');
      updateBlockStyle(selectedBlock.id, styleUpdate);
    }
  }, [selectedBlock, website, updateBlockStyle, pushState]);

  const handleContentChange = useCallback((contentUpdate: Parameters<typeof updateBlockContent>[1]) => {
    if (selectedBlock && website) {
      // Don't push state for every keystroke - debounced elsewhere
      updateBlockContent(selectedBlock.id, contentUpdate);
    }
  }, [selectedBlock, website, updateBlockContent]);

  const handleAnimationChange = useCallback((animation: AnimationConfig) => {
    if (selectedBlock && website) {
      pushState(website, 'Update block animation');
      setBlockAnimation(selectedBlock.id, animation);
    }
  }, [selectedBlock, website, setBlockAnimation, pushState]);

  const handleCustomCSSChange = useCallback((css: string) => {
    if (selectedBlock && website) {
      setBlockCustomCSS(selectedBlock.id, css);
    }
  }, [selectedBlock, website, setBlockCustomCSS]);

  const handleResponsiveStylesChange = useCallback((styles: ResponsiveStyles) => {
    if (selectedBlock && website) {
      pushState(website, 'Update responsive styles');
      updateBlockStyle(selectedBlock.id, { responsiveStyles: styles } as never);
    }
  }, [selectedBlock, website, updateBlockStyle, pushState]);

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
              onChange={(value) => handleContentChange({ headline: value })}
              placeholder="Your main headline"
            />
            <DebouncedTextarea
              label="Subheadline"
              value={content.subheadline as string}
              onChange={(value) => handleContentChange({ subheadline: value })}
              placeholder="Supporting text"
              rows={3}
            />
            <Switch
              label="Show Button"
              checked={content.showButton as boolean}
              onCheckedChange={(checked) => handleContentChange({ showButton: checked })}
            />
            {content.showButton && (
              <>
                <DebouncedInput
                  label="Button Text"
                  value={content.buttonText as string}
                  onChange={(value) => handleContentChange({ buttonText: value })}
                />
                <DebouncedInput
                  label="Button Link"
                  value={content.buttonLink as string}
                  onChange={(value) => handleContentChange({ buttonLink: value })}
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
              onChange={(value) => handleContentChange({ title: value })}
            />
            <DebouncedTextarea
              label="Description"
              value={content.description as string}
              onChange={(value) => handleContentChange({ description: value })}
              rows={5}
            />
            <Switch
              label="Show Image"
              checked={content.showImage as boolean}
              onCheckedChange={(checked) => handleContentChange({ showImage: checked })}
            />
            {content.showImage && (
              <DebouncedInput
                label="Image URL"
                value={content.image as string}
                onChange={(value) => handleContentChange({ image: value })}
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
              onCheckedChange={(checked) => handleContentChange({ showHeading: checked })}
            />
            {content.showHeading && (
              <DebouncedInput
                label="Heading"
                value={content.heading as string}
                onChange={(value) => handleContentChange({ heading: value })}
              />
            )}
            <DebouncedTextarea
              label="Body Text"
              value={content.body as string}
              onChange={(value) => handleContentChange({ body: value })}
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
              onChange={(value) => handleContentChange({ headline: value })}
            />
            <DebouncedTextarea
              label="Description"
              value={content.description as string}
              onChange={(value) => handleContentChange({ description: value })}
              rows={3}
            />
            <DebouncedInput
              label="Primary Button Text"
              value={content.primaryButtonText as string}
              onChange={(value) => handleContentChange({ primaryButtonText: value })}
            />
            <DebouncedInput
              label="Primary Button Link"
              value={content.primaryButtonLink as string}
              onChange={(value) => handleContentChange({ primaryButtonLink: value })}
            />
            <Switch
              label="Show Secondary Button"
              checked={content.showSecondaryButton as boolean}
              onCheckedChange={(checked) => handleContentChange({ showSecondaryButton: checked })}
            />
            {content.showSecondaryButton && (
              <>
                <DebouncedInput
                  label="Secondary Button Text"
                  value={content.secondaryButtonText as string}
                  onChange={(value) => handleContentChange({ secondaryButtonText: value })}
                />
                <DebouncedInput
                  label="Secondary Button Link"
                  value={content.secondaryButtonLink as string}
                  onChange={(value) => handleContentChange({ secondaryButtonLink: value })}
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
              onChange={(value) => handleContentChange({ title: value })}
            />
            <DebouncedTextarea
              label="Subtitle"
              value={content.subtitle as string}
              onChange={(value) => handleContentChange({ subtitle: value })}
              rows={2}
            />
            <DebouncedInput
              label="Email"
              value={content.email as string}
              onChange={(value) => handleContentChange({ email: value })}
              type="email"
            />
            <DebouncedInput
              label="Button Text"
              value={content.buttonText as string}
              onChange={(value) => handleContentChange({ buttonText: value })}
            />
          </div>
        );

      case 'spacer':
        return (
          <div className="space-y-4">
            <Slider
              label="Height"
              value={[content.height as number]}
              onValueChange={(value) => handleContentChange({ height: value[0] })}
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
        <GradientPicker
          label="Background"
          value={style.backgroundColor || '#ffffff'}
          onChange={(color) => handleStyleChange({ backgroundColor: color })}
        />

        <ColorPicker
          label="Text Color"
          value={style.textColor || '#000000'}
          onChange={(color) => handleStyleChange({ textColor: color })}
        />

        <Select
          label="Padding"
          value={style.padding || 'medium'}
          onValueChange={(value) => handleStyleChange({ padding: value as typeof style.padding })}
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
          onValueChange={(value) => handleStyleChange({ alignment: value as typeof style.alignment })}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />

        <Select
          label="Width"
          value={style.width || 'full'}
          onValueChange={(value) => handleStyleChange({ width: value as typeof style.width })}
          options={[
            { value: 'narrow', label: 'Narrow' },
            { value: 'medium', label: 'Medium' },
            { value: 'wide', label: 'Wide' },
            { value: 'full', label: 'Full Width' },
          ]}
        />

        <Select
          label="Border Radius"
          value={style.borderRadius || 'none'}
          onValueChange={(value) => handleStyleChange({ borderRadius: value as typeof style.borderRadius })}
          options={[
            { value: 'none', label: 'None' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
        />

        <Select
          label="Shadow"
          value={style.shadow || 'none'}
          onValueChange={(value) => handleStyleChange({ shadow: value as typeof style.shadow })}
          options={[
            { value: 'none', label: 'None' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
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
        {selectedBlock.isLocked && (
          <p className="text-xs text-amber-500 mt-1">🔒 This block is locked</p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 px-2">
        {['content', 'style', 'animation', 'advanced'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-2 text-sm font-medium capitalize transition-colors',
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Content
            </h3>
            {renderContentEditor()}
          </div>
        )}

        {activeTab === 'style' && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Style
            </h3>
            {renderStyleEditor()}
          </div>
        )}

        {activeTab === 'animation' && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Animation
            </h3>
            <AnimationEditor
              animation={selectedBlock.animation}
              onChange={handleAnimationChange}
            />
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Custom CSS
              </h3>
              <CustomCSSEditor
                value={selectedBlock.customCSS || ''}
                onChange={handleCustomCSSChange}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Responsive Overrides
              </h3>
              <ResponsiveStylesEditor
                responsiveStyles={selectedBlock.responsiveStyles}
                currentStyle={selectedBlock.style as unknown as Record<string, unknown>}
                onChange={handleResponsiveStylesChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
