'use client';

import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GradientPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface GradientStop {
  color: string;
  position: number;
}

const presetGradients = [
  { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Night', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  { name: 'Sky', value: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Lavender', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
  { name: 'Coral', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { name: 'Steel', value: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #00d2ff 0%, #928DAB 100%)' },
];

const directionOptions = [
  { label: '→', value: 'to right', angle: 90 },
  { label: '↘', value: '135deg', angle: 135 },
  { label: '↓', value: 'to bottom', angle: 180 },
  { label: '↙', value: '225deg', angle: 225 },
  { label: '←', value: 'to left', angle: 270 },
  { label: '↖', value: '315deg', angle: 315 },
  { label: '↑', value: 'to top', angle: 0 },
  { label: '↗', value: '45deg', angle: 45 },
];

function parseGradient(value: string): { type: 'solid' | 'gradient'; color?: string; stops?: GradientStop[]; direction?: string } {
  if (!value || !value.includes('gradient')) {
    return { type: 'solid', color: value || '#ffffff' };
  }
  
  const directionMatch = value.match(/linear-gradient\(([^,]+),/);
  const direction = directionMatch ? directionMatch[1].trim() : '135deg';
  
  const colorStops: GradientStop[] = [];
  const colorRegex = /(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgba?\([^)]+\))\s*(\d+)?%?/g;
  let match;
  let index = 0;
  
  while ((match = colorRegex.exec(value)) !== null) {
    colorStops.push({
      color: match[1],
      position: match[2] ? parseInt(match[2]) : (index === 0 ? 0 : 100),
    });
    index++;
  }
  
  if (colorStops.length < 2) {
    colorStops.push({ color: '#ffffff', position: 0 });
    colorStops.push({ color: '#000000', position: 100 });
  }
  
  return { type: 'gradient', stops: colorStops, direction };
}

function buildGradient(stops: GradientStop[], direction: string): string {
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const colorString = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
  return `linear-gradient(${direction}, ${colorString})`;
}

export const GradientPicker: React.FC<GradientPickerProps> = memo(({
  label,
  value,
  onChange,
  className,
}) => {
  const parsed = parseGradient(value);
  const [mode, setMode] = useState<'solid' | 'gradient'>(parsed.type);
  const [solidColor, setSolidColor] = useState(parsed.color || '#ffffff');
  const [stops, setStops] = useState<GradientStop[]>(parsed.stops || [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ]);
  const [direction, setDirection] = useState(parsed.direction || '135deg');
  const [showPresets, setShowPresets] = useState(false);

  const handleModeChange = useCallback((newMode: 'solid' | 'gradient') => {
    setMode(newMode);
    if (newMode === 'solid') {
      onChange(solidColor);
    } else {
      onChange(buildGradient(stops, direction));
    }
  }, [solidColor, stops, direction, onChange]);

  const handleSolidColorChange = useCallback((color: string) => {
    setSolidColor(color);
    if (mode === 'solid') {
      onChange(color);
    }
  }, [mode, onChange]);

  const handleStopColorChange = useCallback((index: number, color: string) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], color };
    setStops(newStops);
    onChange(buildGradient(newStops, direction));
  }, [stops, direction, onChange]);

  const handleStopPositionChange = useCallback((index: number, position: number) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], position };
    setStops(newStops);
    onChange(buildGradient(newStops, direction));
  }, [stops, direction, onChange]);

  const handleDirectionChange = useCallback((newDirection: string) => {
    setDirection(newDirection);
    onChange(buildGradient(stops, newDirection));
  }, [stops, onChange]);

  const addStop = useCallback(() => {
    if (stops.length >= 5) return;
    
    // Find a position between existing stops
    const sortedPositions = stops.map(s => s.position).sort((a, b) => a - b);
    let newPosition = 50;
    
    for (let i = 0; i < sortedPositions.length - 1; i++) {
      const gap = sortedPositions[i + 1] - sortedPositions[i];
      if (gap > 20) {
        newPosition = Math.round(sortedPositions[i] + gap / 2);
        break;
      }
    }
    
    const newStops = [...stops, { color: '#888888', position: newPosition }];
    setStops(newStops);
    onChange(buildGradient(newStops, direction));
  }, [stops, direction, onChange]);

  const removeStop = useCallback((index: number) => {
    if (stops.length <= 2) return;
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
    onChange(buildGradient(newStops, direction));
  }, [stops, direction, onChange]);

  const applyPreset = useCallback((preset: typeof presetGradients[0]) => {
    setMode('gradient');
    const parsed = parseGradient(preset.value);
    if (parsed.stops) {
      setStops(parsed.stops);
      setDirection(parsed.direction || '135deg');
      onChange(preset.value);
    }
    setShowPresets(false);
  }, [onChange]);

  const reset = useCallback(() => {
    setSolidColor('#ffffff');
    setStops([
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 },
    ]);
    setDirection('135deg');
    setMode('solid');
    onChange('#ffffff');
  }, [onChange]);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <button
          onClick={reset}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Preview */}
      <div
        className="h-12 w-full rounded-ios-lg border border-gray-200 dark:border-gray-700"
        style={{ background: mode === 'solid' ? solidColor : buildGradient(stops, direction) }}
      />

      {/* Mode toggle */}
      <div className="flex rounded-ios bg-gray-100 p-1 dark:bg-surface-dark-secondary">
        <button
          onClick={() => handleModeChange('solid')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded-ios transition-colors',
            mode === 'solid'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-surface-dark-elevated dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          )}
        >
          Solid
        </button>
        <button
          onClick={() => handleModeChange('gradient')}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs font-medium rounded-ios transition-colors',
            mode === 'gradient'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-surface-dark-elevated dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
          )}
        >
          Gradient
        </button>
      </div>

      {mode === 'solid' ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={solidColor}
            onChange={(e) => handleSolidColorChange(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
          />
          <input
            type="text"
            value={solidColor}
            onChange={(e) => handleSolidColorChange(e.target.value)}
            className="flex-1 rounded-ios border border-gray-200 px-2 py-1.5 text-xs dark:border-gray-700 dark:bg-surface-dark-secondary"
          />
        </div>
      ) : (
        <>
          {/* Gradient direction */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Direction</label>
            <div className="grid grid-cols-8 gap-1">
              {directionOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDirectionChange(opt.value)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
                    direction === opt.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-surface-dark-secondary dark:text-gray-300'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500 dark:text-gray-400">Color Stops</label>
              <button
                onClick={addStop}
                disabled={stops.length >= 5}
                className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 disabled:opacity-50"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => handleStopColorChange(index, e.target.value)}
                    className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => handleStopPositionChange(index, parseInt(e.target.value))}
                    className="flex-1 h-1.5 accent-primary-500"
                  />
                  <span className="w-8 text-xs text-gray-500">{stop.position}%</span>
                  {stops.length > 2 && (
                    <button
                      onClick={() => removeStop(index)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs text-primary-500 hover:text-primary-600"
            >
              {showPresets ? 'Hide presets' : 'Show presets'}
            </button>
            
            {showPresets && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-4 gap-2"
              >
                {presetGradients.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="group relative"
                  >
                    <div
                      className="h-8 rounded-ios border border-gray-200 dark:border-gray-700 transition-transform group-hover:scale-105"
                      style={{ background: preset.value }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-ios">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
});

GradientPicker.displayName = 'GradientPicker';
