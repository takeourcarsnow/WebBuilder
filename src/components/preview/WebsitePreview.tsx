'use client';

import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useWebsiteStore, useEditorStore, useSortedBlocks, usePreviewState } from '@/stores';
import { BlockWrapper } from '@/components/builder';
import { BlockRenderer } from './BlockRegistry';
import { EmptyState, Button, ErrorBoundary } from '@/components/ui';
import { Layout, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEVICE_DIMENSIONS } from '@/lib/constants/design';
import type { WebsiteBlock } from '@/types';

interface WebsitePreviewProps {
  className?: string;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ className }) => {
  const { website, reorderBlocks } = useWebsiteStore();
  const { setSelectedBlock, setActiveSidebarTab, setDragging } = useEditorStore();
  const { isPreviewMode, devicePreview, zoom } = usePreviewState();
  const sortedBlocks = useSortedBlocks();
  
  const [activeBlock, setActiveBlock] = React.useState<WebsiteBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const block = sortedBlocks.find(b => b.id === event.active.id);
    setActiveBlock(block || null);
    setDragging(true);
  }, [sortedBlocks, setDragging]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBlock(null);
    setDragging(false);
    
    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  }, [reorderBlocks, setDragging]);

  const handleDragCancel = useCallback(() => {
    setActiveBlock(null);
    setDragging(false);
  }, [setDragging]);

  const handleAddBlock = useCallback(() => {
    setActiveSidebarTab('blocks');
  }, [setActiveSidebarTab]);

  // Memoize device styles
  const deviceStyles = useMemo(() => {
    const dimensions = DEVICE_DIMENSIONS[devicePreview];
    return {
      width: dimensions.width,
      maxWidth: dimensions.maxWidth,
    };
  }, [devicePreview]);

  // Memoize container classes
  const containerClasses = useMemo(() => cn(
    'relative overflow-hidden bg-white shadow-ios-lg transition-all duration-300 dark:bg-surface-dark-elevated',
    devicePreview === 'mobile' && 'rounded-[3rem] border-8 border-gray-800',
    devicePreview === 'tablet' && 'rounded-[2rem] border-4 border-gray-700',
    devicePreview === 'desktop' && 'rounded-ios-xl',
    !isPreviewMode && 'ring-1 ring-gray-200 dark:ring-gray-800'
  ), [devicePreview, isPreviewMode]);

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden',
        className
      )}
    >
      {/* Preview container with canvas-style background */}
      <div className="relative flex flex-1 items-start justify-center overflow-auto p-8">
        {/* Subtle canvas grid background */}
        <div 
          className="absolute inset-0 bg-gray-100/50 dark:bg-gray-900/50"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(0,0,0,0.07) 1px, transparent 0)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        <motion.div
          layout
          className={cn(
            containerClasses,
            'relative' // Ensure it's above the grid
          )}
          style={{
            ...deviceStyles,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            backgroundColor: website?.settings.theme.backgroundColor,
            color: website?.settings.theme.textColor,
          }}
        >
          {/* Mobile notch */}
          {devicePreview === 'mobile' && (
            <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-gray-800" />
          )}

          {/* Tablet camera */}
          {devicePreview === 'tablet' && (
            <div className="absolute left-1/2 top-2 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-600" />
          )}

          {/* Content area */}
          <div className={cn(
            'min-h-[80vh]',
            devicePreview === 'mobile' && 'pt-8',
            devicePreview === 'tablet' && 'pt-6'
          )}>
            {sortedBlocks.length === 0 ? (
              <EmptyState
                icon={<Layout className="h-8 w-8 text-gray-400" />}
                title="Start Building Your Website"
                description="Add your first block to begin creating your personal website"
                action={
                  <Button onClick={handleAddBlock}>
                    <Plus className="h-4 w-4" />
                    Add Block
                  </Button>
                }
                className="min-h-[50vh]"
              />
            ) : (
              <ErrorBoundary>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <SortableContext
                    items={sortedBlocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <AnimatePresence mode="popLayout">
                      {sortedBlocks.map((block) => (
                        <BlockWrapper key={block.id} block={block}>
                          <BlockRenderer block={block} />
                        </BlockWrapper>
                      ))}
                    </AnimatePresence>
                  </SortableContext>
                  
                  {/* Drag overlay for better visual feedback */}
                  <DragOverlay dropAnimation={null}>
                    {activeBlock ? (
                      <div className="opacity-80 shadow-2xl rounded-lg overflow-hidden">
                        <BlockRenderer block={activeBlock} />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </ErrorBoundary>
            )}
          </div>

          {/* Footer */}
          {sortedBlocks.length > 0 && (
            <footer className="border-t border-gray-200 py-6 text-center dark:border-gray-800">
              <p className="text-sm opacity-50">
                © {new Date().getFullYear()} {website?.name || 'My Website'}. All rights reserved.
              </p>
            </footer>
          )}
        </motion.div>
      </div>
    </div>
  );
};
