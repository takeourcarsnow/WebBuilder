'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Move,
  Scale,
  RotateCw,
  Eye,
  Copy,
  Settings,
  Zap,
} from 'lucide-react';
import { useWebsiteStore, useEditorStore, useSelectedBlock } from '@/stores';
import { Slider, Select, Switch } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { AnimationConfig } from '@/types';

interface KeyframePoint {
  id: string;
  time: number; // 0-100 percentage
  properties: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    rotation?: number;
  };
}

interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'exit' | 'attention' | 'scroll';
  keyframes: KeyframePoint[];
  duration: number;
  easing: string;
}

const presets: AnimationPreset[] = [
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0 } },
      { id: '2', time: 100, properties: { opacity: 1 } },
    ],
    duration: 0.5,
    easing: 'ease-out',
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, y: 30 } },
      { id: '2', time: 100, properties: { opacity: 1, y: 0 } },
    ],
    duration: 0.6,
    easing: 'ease-out',
  },
  {
    id: 'slide-down',
    name: 'Slide Down',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, y: -30 } },
      { id: '2', time: 100, properties: { opacity: 1, y: 0 } },
    ],
    duration: 0.6,
    easing: 'ease-out',
  },
  {
    id: 'slide-left',
    name: 'Slide from Left',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, x: -50 } },
      { id: '2', time: 100, properties: { opacity: 1, x: 0 } },
    ],
    duration: 0.6,
    easing: 'ease-out',
  },
  {
    id: 'slide-right',
    name: 'Slide from Right',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, x: 50 } },
      { id: '2', time: 100, properties: { opacity: 1, x: 0 } },
    ],
    duration: 0.6,
    easing: 'ease-out',
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, scale: 0.8 } },
      { id: '2', time: 100, properties: { opacity: 1, scale: 1 } },
    ],
    duration: 0.5,
    easing: 'ease-out',
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, scale: 1.2 } },
      { id: '2', time: 100, properties: { opacity: 1, scale: 1 } },
    ],
    duration: 0.5,
    easing: 'ease-out',
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    category: 'entrance',
    keyframes: [
      { id: '1', time: 0, properties: { opacity: 0, rotation: -90 } },
      { id: '2', time: 100, properties: { opacity: 1, rotation: 0 } },
    ],
    duration: 0.6,
    easing: 'ease-out',
  },
  {
    id: 'bounce',
    name: 'Bounce',
    category: 'attention',
    keyframes: [
      { id: '1', time: 0, properties: { y: 0 } },
      { id: '2', time: 25, properties: { y: -20 } },
      { id: '3', time: 50, properties: { y: 0 } },
      { id: '4', time: 75, properties: { y: -10 } },
      { id: '5', time: 100, properties: { y: 0 } },
    ],
    duration: 1,
    easing: 'ease-in-out',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'attention',
    keyframes: [
      { id: '1', time: 0, properties: { scale: 1 } },
      { id: '2', time: 50, properties: { scale: 1.05 } },
      { id: '3', time: 100, properties: { scale: 1 } },
    ],
    duration: 1,
    easing: 'ease-in-out',
  },
  {
    id: 'shake',
    name: 'Shake',
    category: 'attention',
    keyframes: [
      { id: '1', time: 0, properties: { x: 0 } },
      { id: '2', time: 25, properties: { x: -10 } },
      { id: '3', time: 50, properties: { x: 10 } },
      { id: '4', time: 75, properties: { x: -10 } },
      { id: '5', time: 100, properties: { x: 0 } },
    ],
    duration: 0.5,
    easing: 'ease-in-out',
  },
  {
    id: 'parallax',
    name: 'Parallax',
    category: 'scroll',
    keyframes: [
      { id: '1', time: 0, properties: { y: 50 } },
      { id: '2', time: 100, properties: { y: -50 } },
    ],
    duration: 1,
    easing: 'linear',
  },
];

interface AnimationEditorProps {
  className?: string;
}

export const AnimationEditor: React.FC<AnimationEditorProps> = ({ className }) => {
  const { setBlockAnimation } = useWebsiteStore();
  const selectedBlock = useSelectedBlock();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<AnimationPreset | null>(null);
  const [customKeyframes, setCustomKeyframes] = useState<KeyframePoint[]>([]);
  const [duration, setDuration] = useState(0.5);
  const [delay, setDelay] = useState(0);
  const [easing, setEasing] = useState('ease-out');
  const [triggerOnce, setTriggerOnce] = useState(true);
  const [triggerType, setTriggerType] = useState<'viewport' | 'hover' | 'click' | 'load'>('viewport');
  const [staggerChildren, setStaggerChildren] = useState(false);
  const [staggerDelay, setStaggerDelay] = useState(0.1);

  const categories = [
    { id: 'entrance', name: 'Entrance', icon: Move },
    { id: 'attention', name: 'Attention', icon: Zap },
    { id: 'scroll', name: 'Scroll', icon: ChevronDown },
  ];

  const easings = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
    { value: 'spring', label: 'Spring' },
    { value: 'bounce', label: 'Bounce' },
  ];

  const handleApplyPreset = (preset: AnimationPreset) => {
    setSelectedPreset(preset);
    setDuration(preset.duration);
    setEasing(preset.easing);
    setCustomKeyframes(preset.keyframes);
  };

  const handleSave = () => {
    if (!selectedBlock) return;

    // Convert to AnimationConfig format
    const animationType = selectedPreset?.id || 'custom';
    const config: AnimationConfig = {
      type: animationType as AnimationConfig['type'],
      duration,
      delay,
      easing: easing as AnimationConfig['easing'],
      triggerOnce,
    };

    setBlockAnimation(selectedBlock.id, config);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setCurrentTime(0);
      // Animate through timeline
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 2;
        });
      }, duration * 10);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Calculate current animation values based on keyframes and time
  const currentValues = useMemo(() => {
    if (customKeyframes.length < 2) return {};
    
    // Find surrounding keyframes
    const sortedKeyframes = [...customKeyframes].sort((a, b) => a.time - b.time);
    let prevKeyframe = sortedKeyframes[0];
    let nextKeyframe = sortedKeyframes[1];
    
    for (let i = 0; i < sortedKeyframes.length - 1; i++) {
      if (currentTime >= sortedKeyframes[i].time && currentTime <= sortedKeyframes[i + 1].time) {
        prevKeyframe = sortedKeyframes[i];
        nextKeyframe = sortedKeyframes[i + 1];
        break;
      }
    }
    
    // Interpolate values
    const progress = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
    const values: Record<string, number> = {};
    
    const props = ['opacity', 'x', 'y', 'scale', 'rotation'] as const;
    props.forEach(prop => {
      const start = prevKeyframe.properties[prop];
      const end = nextKeyframe.properties[prop];
      if (start !== undefined && end !== undefined) {
        values[prop] = start + (end - start) * progress;
      }
    });
    
    return values;
  }, [customKeyframes, currentTime]);

  if (!selectedBlock) {
    return (
      <div className={cn('flex items-center justify-center h-full p-4', className)}>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Select a block to edit its animation
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Animation Editor
        </h2>
      </div>

      {/* Preview */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          <motion.div
            animate={{
              opacity: currentValues.opacity ?? 1,
              x: currentValues.x ?? 0,
              y: currentValues.y ?? 0,
              scale: currentValues.scale ?? 1,
              rotate: currentValues.rotation ?? 0,
            }}
            transition={{ duration: 0 }}
            className="w-16 h-16 bg-primary-500 rounded-lg"
          />
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          {/* Timeline */}
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: `${currentTime}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10 text-right">{Math.round(currentTime)}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Presets */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Animation Presets
          </h3>
          {categories.map(category => (
            <div key={category.id} className="mb-4">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <category.icon className="w-3 h-3" />
                {category.name}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {presets
                  .filter(p => p.category === category.id)
                  .map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={cn(
                        'px-3 py-2 text-xs rounded-lg border transition-colors text-left',
                        selectedPreset?.id === preset.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      )}
                    >
                      {preset.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Timing */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Timing
          </h3>
          
          <Slider
            label="Duration"
            value={[duration * 10]}
            onValueChange={(value) => setDuration(value[0] / 10)}
            min={1}
            max={30}
            step={1}
            unit="s"
          />
          
          <Slider
            label="Delay"
            value={[delay * 10]}
            onValueChange={(value) => setDelay(value[0] / 10)}
            min={0}
            max={20}
            step={1}
            unit="s"
          />
          
          <Select
            label="Easing"
            value={easing}
            onValueChange={setEasing}
            options={easings}
          />
        </div>

        {/* Trigger */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Trigger
          </h3>
          
          <Select
            label="Trigger Type"
            value={triggerType}
            onValueChange={(value) => setTriggerType(value as typeof triggerType)}
            options={[
              { value: 'viewport', label: 'When in Viewport' },
              { value: 'load', label: 'On Page Load' },
              { value: 'hover', label: 'On Hover' },
              { value: 'click', label: 'On Click' },
            ]}
          />
          
          <Switch
            label="Trigger Only Once"
            checked={triggerOnce}
            onCheckedChange={setTriggerOnce}
          />
        </div>

        {/* Stagger */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Stagger Children
          </h3>
          
          <Switch
            label="Enable Stagger"
            checked={staggerChildren}
            onCheckedChange={setStaggerChildren}
          />
          
          {staggerChildren && (
            <Slider
              label="Stagger Delay"
              value={[staggerDelay * 100]}
              onValueChange={(value) => setStaggerDelay(value[0] / 100)}
              min={1}
              max={50}
              step={1}
              unit="s"
            />
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
        >
          Apply Animation
        </button>
      </div>
    </div>
  );
};
