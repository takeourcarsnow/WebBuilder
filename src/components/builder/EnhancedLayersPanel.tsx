'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoreVertical,
  Search,
  Filter,
  FolderPlus,
  Grid3X3,
  List,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Tooltip, TooltipProvider } from '@/components/ui';
import { useWebsiteStore, useEditorStore } from '@/stores';
import type { WebsiteBlock } from '@/types';

interface LayerItem {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  expanded?: boolean;
  groupId?: string;
  children?: LayerItem[];
}

interface LayerGroup {
  id: string;
  name: string;
  expanded: boolean;
  layers: string[];
}

const blockIcons: { [key: string]: string } = {
  hero: '🦸',
  header: '📌',
  about: '👤',
  features: '✨',
  services: '🛠️',
  testimonials: '💬',
  contact: '📧',
  footer: '📋',
  gallery: '🖼️',
  pricing: '💰',
  faq: '❓',
  cta: '🎯',
  team: '👥',
  blog: '📝',
  newsletter: '📮',
  countdown: '⏰',
  tabs: '📑',
  carousel: '🎠',
  reviews: '⭐',
  text: '📄',
  image: '🖼️',
  video: '🎬',
  code: '💻',
  divider: '➖',
  spacer: '↕️',
  default: '📦',
};

export const EnhancedLayersPanel: React.FC = () => {
  const { website, updateBlock, deleteBlock, reorderBlocks, duplicateBlock, toggleBlockVisibility, toggleBlockLock } = useWebsiteStore();
  const { selectedBlockId, setSelectedBlock } = useEditorStore();

  const blocks = website?.blocks || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [groups, setGroups] = useState<LayerGroup[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [multiSelect, setMultiSelect] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Convert blocks to layer items
  const layers = useMemo((): LayerItem[] => {
    return blocks.map((block: WebsiteBlock) => ({
      id: block.id,
      name: (block.content as any)?.title || (block.content as any)?.headline || `${block.type} block`,
      type: block.type,
      visible: block.isVisible !== false,
      locked: block.isLocked === true,
    }));
  }, [blocks]);

  // Filter layers
  const filteredLayers = useMemo(() => {
    return layers.filter((layer) => {
      const matchesSearch =
        searchQuery === '' ||
        layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        layer.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === null || layer.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [layers, searchQuery, filterType]);

  // Get unique block types for filter
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(layers.map((l) => l.type)));
  }, [layers]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedBlocks(newExpanded);
  };

  const handleToggleVisibility = (id: string) => {
    toggleBlockVisibility(id);
  };

  const handleToggleLock = (id: string) => {
    toggleBlockLock(id);
  };

  const handleDuplicate = (id: string) => {
    duplicateBlock(id);
  };

  const handleDelete = (id: string) => {
    if (multiSelect.size > 0 && multiSelect.has(id)) {
      multiSelect.forEach((selectedId) => {
        deleteBlock(selectedId);
      });
      setMultiSelect(new Set());
    } else {
      deleteBlock(id);
    }
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || isMultiSelectMode) {
      const newMultiSelect = new Set(multiSelect);
      if (newMultiSelect.has(id)) {
        newMultiSelect.delete(id);
      } else {
        newMultiSelect.add(id);
      }
      setMultiSelect(newMultiSelect);
    } else {
      setSelectedBlock(id);
      setMultiSelect(new Set());
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const currentIndex = blocks.findIndex((b: WebsiteBlock) => b.id === id);
    if (currentIndex === -1) return;

    let targetIndex: number;
    switch (direction) {
      case 'up':
        targetIndex = Math.max(0, currentIndex - 1);
        break;
      case 'down':
        targetIndex = Math.min(blocks.length - 1, currentIndex + 1);
        break;
      case 'top':
        targetIndex = 0;
        break;
      case 'bottom':
        targetIndex = blocks.length - 1;
        break;
    }

    if (targetIndex !== currentIndex && blocks[targetIndex]) {
      reorderBlocks(id, blocks[targetIndex].id);
    }
  };

  const createGroup = () => {
    if (newGroupName && multiSelect.size > 0) {
      const newGroup: LayerGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        expanded: true,
        layers: Array.from(multiSelect),
      };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setShowGroupModal(false);
      setMultiSelect(new Set());
    }
  };

  const selectAll = () => {
    setMultiSelect(new Set(filteredLayers.map((l) => l.id)));
    setIsMultiSelectMode(true);
  };

  const clearSelection = () => {
    setMultiSelect(new Set());
    setIsMultiSelectMode(false);
  };

  const getBlockIcon = (type: string) => {
    return blockIcons[type] || blockIcons.default;
  };

  const handleReorder = (newOrder: LayerItem[]) => {
    // Find what changed and call reorderBlocks appropriately
    if (newOrder.length >= 2) {
      const firstId = newOrder[0].id;
      const secondId = newOrder[1].id;
      if (firstId !== layers[0]?.id) {
        reorderBlocks(firstId, secondId);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-primary-500" />
            Layers
            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
              {filteredLayers.length}
            </span>
          </h2>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip content="List view">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded',
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </Tooltip>
              <Tooltip content="Grid view">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded',
                    viewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search layers..."
            className="pl-9 pr-9 h-8 text-sm"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded',
              showFilters ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setFilterType(null)}
                  className={cn(
                    'px-2 py-1 text-xs rounded-full transition-colors',
                    filterType === null
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  All
                </button>
                {uniqueTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={cn(
                      'px-2 py-1 text-xs rounded-full transition-colors',
                      filterType === type
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {getBlockIcon(type)} {type}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-select Actions */}
        <AnimatePresence>
          {(multiSelect.size > 0 || isMultiSelectMode) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary-600">
                  {multiSelect.size} selected
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={selectAll}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    Select all
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearSelection}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip content="Create group">
                    <button
                      onClick={() => setShowGroupModal(true)}
                      className="p-1.5 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                      disabled={multiSelect.size < 2}
                    >
                      <FolderPlus className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete selected">
                    <button
                      onClick={() => {
                        multiSelect.forEach((id) => deleteBlock(id));
                        setMultiSelect(new Set());
                      }}
                      className="p-1.5 rounded bg-white dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <Reorder.Group
            axis="y"
            values={filteredLayers}
            onReorder={handleReorder}
            className="p-2 space-y-1"
          >
            {filteredLayers.map((layer) => (
              <Reorder.Item
                key={layer.id}
                value={layer}
                className={cn(
                  'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                  selectedBlockId === layer.id
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
                  multiSelect.has(layer.id) && 'ring-2 ring-primary-400',
                  layer.locked && 'opacity-60'
                )}
                onClick={(e) => handleSelect(layer.id, e)}
              >
                {/* Drag Handle */}
                <div className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {/* Multi-select Checkbox */}
                {isMultiSelectMode && (
                  <input
                    type="checkbox"
                    checked={multiSelect.has(layer.id)}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                )}

                {/* Icon */}
                <span className="text-base flex-shrink-0">{getBlockIcon(layer.type)}</span>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate block">
                    {layer.name}
                  </span>
                  <span className="text-xs text-gray-500">{layer.type}</span>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TooltipProvider>
                    <Tooltip content={layer.visible ? 'Hide' : 'Show'}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleVisibility(layer.id);
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        {layer.visible ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </button>
                    </Tooltip>
                    <Tooltip content={layer.locked ? 'Unlock' : 'Lock'}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLock(layer.id);
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        {layer.locked ? (
                          <Lock className="w-3.5 h-3.5 text-orange-500" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Context Menu Trigger */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(layer.id);
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>

                  {/* Expanded Context Menu */}
                  <AnimatePresence>
                    {expandedBlocks.has(layer.id) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 min-w-[160px]"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(layer.id);
                            toggleExpand(layer.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(layer.id, 'top');
                            toggleExpand(layer.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ChevronFirst className="w-4 h-4" />
                          Move to top
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(layer.id, 'up');
                            toggleExpand(layer.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ArrowUp className="w-4 h-4" />
                          Move up
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(layer.id, 'down');
                            toggleExpand(layer.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ArrowDown className="w-4 h-4" />
                          Move down
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(layer.id, 'bottom');
                            toggleExpand(layer.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ChevronLast className="w-4 h-4" />
                          Move to bottom
                        </button>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(layer.id);
                            toggleExpand(layer.id);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          /* Grid View */
          <div className="p-2 grid grid-cols-3 gap-2">
            {filteredLayers.map((layer) => (
              <motion.div
                key={layer.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-colors text-center',
                  selectedBlockId === layer.id
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800',
                  multiSelect.has(layer.id) && 'ring-2 ring-primary-400',
                  layer.locked && 'opacity-60'
                )}
                onClick={(e) => handleSelect(layer.id, e)}
              >
                <span className="text-2xl block mb-1">{getBlockIcon(layer.type)}</span>
                <span className="text-xs font-medium truncate block">{layer.name}</span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {!layer.visible && <EyeOff className="w-3 h-3 text-gray-400" />}
                  {layer.locked && <Lock className="w-3 h-3 text-orange-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredLayers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No layers found</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>
            {layers.filter((l) => l.visible).length}/{layers.length} visible
          </span>
          <span>{layers.filter((l) => l.locked).length} locked</span>
        </div>
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80 shadow-xl"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-primary-500" />
              Create Group
            </h3>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name"
              className="mb-4"
            />
            <p className="text-sm text-gray-500 mb-4">
              {multiSelect.size} layers will be grouped
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowGroupModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={createGroup} className="flex-1">
                Create
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
