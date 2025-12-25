'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  GripVertical,
  MessageSquare,
  Folder,
  FolderOpen,
  Trash2,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import { useWebsiteStore, useEditorStore } from '@/stores';
import { getBlockDefinition } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { WebsiteBlock, BlockGroup } from '@/types';

interface LayersPanelProps {
  className?: string;
}

interface LayerItemProps {
  block: WebsiteBlock;
  isSelected: boolean;
  isMultiSelected: boolean;
  onSelect: (blockId: string, shiftKey: boolean) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({ block, isSelected, isMultiSelected, onSelect }) => {
  const { toggleBlockLock, toggleBlockVisibility, deleteBlock, duplicateBlock } = useWebsiteStore();
  const { setActiveSidebarTab } = useEditorStore();
  const definition = getBlockDefinition(block.type);
  
  const isHidden = block.isVisible === false;
  const isLocked = block.isLocked === true;

  const handleClick = (e: React.MouseEvent) => {
    onSelect(block.id, e.shiftKey || e.ctrlKey || e.metaKey);
    setActiveSidebarTab('style');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group',
        isSelected && 'bg-primary-500/20 text-primary-700 dark:text-primary-300',
        isMultiSelected && !isSelected && 'bg-primary-500/10',
        !isSelected && !isMultiSelected && 'hover:bg-gray-100 dark:hover:bg-gray-800',
        isHidden && 'opacity-50'
      )}
      onClick={handleClick}
    >
      {/* Drag Handle */}
      <div className="cursor-grab opacity-40 hover:opacity-100">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Block Type Icon */}
      <div className={cn(
        'w-6 h-6 rounded flex items-center justify-center text-xs font-bold',
        'bg-gray-200 dark:bg-gray-700'
      )}>
        {definition?.name?.charAt(0) || 'B'}
      </div>

      {/* Block Name */}
      <span className="flex-1 text-sm truncate">
        {definition?.name || block.type}
        {block.comment && (
          <MessageSquare className="w-3 h-3 inline ml-1 text-yellow-500" />
        )}
      </span>

      {/* Action Buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBlockVisibility(block.id);
          }}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isHidden ? 'Show block' : 'Hide block'}
        >
          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBlockLock(block.id);
          }}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          title={isLocked ? 'Unlock block' : 'Lock block'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5 text-yellow-500" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
};

interface LayerGroupProps {
  group: BlockGroup;
  blocks: WebsiteBlock[];
  selectedBlockId: string | null;
  selectedBlockIds: string[];
  onSelectBlock: (blockId: string, multi: boolean) => void;
}

const LayerGroup: React.FC<LayerGroupProps> = ({
  group,
  blocks,
  selectedBlockId,
  selectedBlockIds,
  onSelectBlock,
}) => {
  const { toggleGroupCollapse, renameGroup, deleteGroup } = useWebsiteStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(group.name);

  const handleRename = () => {
    if (editName.trim()) {
      renameGroup(group.id, editName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-2">
      {/* Group Header */}
      <div
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => !isEditing && toggleGroupCollapse(group.id)}
      >
        {group.isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        
        {group.isCollapsed ? (
          <Folder className="w-4 h-4 text-yellow-500" />
        ) : (
          <FolderOpen className="w-4 h-4 text-yellow-500" />
        )}

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditName(group.name);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-1 text-sm bg-transparent border-b border-primary-500 outline-none"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="flex-1 text-sm font-medium truncate"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {group.name}
          </span>
        )}

        <span className="text-xs text-gray-400">({blocks.length})</span>
      </div>

      {/* Group Blocks */}
      <AnimatePresence>
        {!group.isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-4 pl-2 border-l border-gray-200 dark:border-gray-700"
          >
            {blocks.map((block) => (
              <LayerItem
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                isMultiSelected={selectedBlockIds.includes(block.id)}
                onSelect={onSelectBlock}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LayersPanel: React.FC<LayersPanelProps> = ({ className }) => {
  const { website, createGroup } = useWebsiteStore();
  const { 
    selectedBlockId, 
    selectedBlockIds, 
    setSelectedBlock, 
    toggleSelection,
    addToSelection,
  } = useEditorStore();

  const sortedBlocks = useMemo(() => {
    if (!website?.blocks) return [];
    return [...website.blocks].sort((a, b) => a.order - b.order);
  }, [website?.blocks]);

  const groups = website?.groups || [];

  // Group blocks by their groupId
  const { groupedBlocks, ungroupedBlocks } = useMemo(() => {
    const grouped: Record<string, WebsiteBlock[]> = {};
    const ungrouped: WebsiteBlock[] = [];

    sortedBlocks.forEach((block) => {
      if (block.groupId) {
        if (!grouped[block.groupId]) {
          grouped[block.groupId] = [];
        }
        grouped[block.groupId].push(block);
      } else {
        ungrouped.push(block);
      }
    });

    return { groupedBlocks: grouped, ungroupedBlocks: ungrouped };
  }, [sortedBlocks]);

  const handleSelectBlock = (blockId: string, multi: boolean) => {
    if (multi) {
      toggleSelection(blockId);
    } else {
      setSelectedBlock(blockId);
    }
  };

  const handleCreateGroup = () => {
    if (selectedBlockIds.length > 0) {
      createGroup('New Group', selectedBlockIds);
    }
  };

  if (!website) {
    return (
      <div className={cn('flex h-full items-center justify-center p-4', className)}>
        <p className="text-sm text-gray-500">No website loaded</p>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Layers
        </h2>
        <div className="flex items-center gap-1">
          {selectedBlockIds.length > 1 && (
            <button
              onClick={handleCreateGroup}
              className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg bg-primary-500/10 text-primary-600 hover:bg-primary-500/20"
            >
              <Folder className="w-3.5 h-3.5" />
              Group ({selectedBlockIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
            <p>No blocks yet</p>
            <p className="text-xs mt-1">Add blocks from the Blocks panel</p>
          </div>
        ) : (
          <>
            {/* Groups */}
            {groups.map((group) => (
              <LayerGroup
                key={group.id}
                group={group}
                blocks={groupedBlocks[group.id] || []}
                selectedBlockId={selectedBlockId}
                selectedBlockIds={selectedBlockIds}
                onSelectBlock={handleSelectBlock}
              />
            ))}

            {/* Ungrouped blocks */}
            <AnimatePresence>
              {ungroupedBlocks.map((block) => (
                <LayerItem
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  isMultiSelected={selectedBlockIds.includes(block.id)}
                  onSelect={handleSelectBlock}
                />
              ))}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <p className="text-xs text-gray-400">
          {sortedBlocks.length} block{sortedBlocks.length !== 1 ? 's' : ''}
          {selectedBlockIds.length > 1 && ` • ${selectedBlockIds.length} selected`}
        </p>
      </div>
    </div>
  );
};
