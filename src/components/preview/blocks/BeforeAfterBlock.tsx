'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, GripVertical } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface BeforeAfterBlockContent {
  title?: string;
  subtitle?: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  orientation: 'horizontal' | 'vertical';
  showLabels: boolean;
  initialPosition: number; // 0-100
}

interface BeforeAfterBlockProps {
  content: BeforeAfterBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

export const BeforeAfterBlock: React.FC<BeforeAfterBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title = 'Before & After',
    subtitle = 'Drag the slider to compare',
    beforeImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    afterImage = 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop',
    beforeLabel = 'Before',
    afterLabel = 'After',
    orientation = 'horizontal',
    showLabels = true,
    initialPosition = 50,
  } = content;

  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let position: number;

      if (orientation === 'horizontal') {
        position = ((clientX - rect.left) / rect.width) * 100;
      } else {
        position = ((clientY - rect.top) / rect.height) * 100;
      }

      setSliderPosition(Math.min(100, Math.max(0, position)));
    },
    [orientation]
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  return (
    <section
      className={cn(
        BLOCK_STYLE_CLASSES.padding[blockStyle.padding || 'large'],
        BLOCK_STYLE_CLASSES.width[blockStyle.width || 'medium'],
        'flex flex-col',
        BLOCK_STYLE_CLASSES.alignment[blockStyle.alignment || 'center']
      )}
      style={{
        backgroundColor: blockStyle.backgroundColor,
        color: blockStyle.textColor,
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            initial={isPreview ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
            )}
            {subtitle && (
              <p className="text-base opacity-70 flex items-center justify-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Comparison Container */}
        <motion.div
          ref={containerRef}
          initial={isPreview ? { opacity: 0, scale: 0.95 } : false}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl cursor-col-resize select-none"
          style={{ aspectRatio: '16/10' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* After Image (Background) */}
          <div className="absolute inset-0">
            <img
              src={afterImage}
              alt={afterLabel}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {showLabels && (
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-sm font-medium shadow-lg">
                {afterLabel}
              </span>
            )}
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={
              orientation === 'horizontal'
                ? { width: `${sliderPosition}%` }
                : { height: `${sliderPosition}%` }
            }
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={
                orientation === 'horizontal'
                  ? { width: `${(100 / sliderPosition) * 100}%`, maxWidth: 'none' }
                  : { height: `${(100 / sliderPosition) * 100}%`, maxHeight: 'none' }
              }
              draggable={false}
            />
            {showLabels && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-sm font-medium shadow-lg">
                {beforeLabel}
              </span>
            )}
          </div>

          {/* Slider Handle */}
          <div
            className={cn(
              'absolute z-10',
              orientation === 'horizontal'
                ? 'top-0 bottom-0 w-1'
                : 'left-0 right-0 h-1'
            )}
            style={
              orientation === 'horizontal'
                ? { left: `${sliderPosition}%`, transform: 'translateX(-50%)' }
                : { top: `${sliderPosition}%`, transform: 'translateY(-50%)' }
            }
          >
            {/* Line */}
            <div className="absolute inset-0 bg-white shadow-lg" />

            {/* Handle Button */}
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className={cn(
                'absolute w-12 h-12 -ml-6 -mt-6 rounded-full bg-white shadow-xl border-4 border-primary-500',
                'flex items-center justify-center cursor-grab active:cursor-grabbing',
                'hover:scale-110 transition-transform',
                orientation === 'horizontal'
                  ? 'top-1/2 left-1/2'
                  : 'left-1/2 top-1/2'
              )}
            >
              <GripVertical
                className={cn(
                  'w-5 h-5 text-primary-500',
                  orientation === 'vertical' && 'rotate-90'
                )}
              />
            </div>
          </div>
        </motion.div>

        {/* Percentage Indicator */}
        <div className="mt-4 text-center">
          <span className="text-sm opacity-60">
            {Math.round(sliderPosition)}% {beforeLabel} / {Math.round(100 - sliderPosition)}% {afterLabel}
          </span>
        </div>
      </div>
    </section>
  );
};
