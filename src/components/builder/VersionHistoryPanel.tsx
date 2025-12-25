'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Clock,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Eye,
  GitBranch,
  GitCommit,
  GitMerge,
  Bookmark,
  Tag,
  Plus,
  MoreVertical,
  Copy,
  Trash2,
  Edit3,
  CheckCircle,
  Calendar,
  User,
  Layers,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Modal, Tooltip, TooltipProvider } from '@/components/ui';
import { useHistoryStore } from '@/stores';

interface Version {
  id: string;
  name?: string;
  description?: string;
  timestamp: Date;
  isAutoSave: boolean;
  isBookmarked: boolean;
  changes: {
    type: 'add' | 'edit' | 'delete' | 'move';
    blockType?: string;
    blockName?: string;
  }[];
  snapshot: any; // The actual state snapshot
}

interface VersionGroup {
  date: string;
  versions: Version[];
}

const mockVersions: Version[] = [
  {
    id: '1',
    name: 'Launch Ready',
    description: 'Final version ready for launch',
    timestamp: new Date(),
    isAutoSave: false,
    isBookmarked: true,
    changes: [
      { type: 'edit', blockType: 'hero', blockName: 'Hero Section' },
      { type: 'add', blockType: 'cta', blockName: 'CTA Block' },
    ],
    snapshot: {},
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isAutoSave: true,
    isBookmarked: false,
    changes: [
      { type: 'edit', blockType: 'contact', blockName: 'Contact Form' },
    ],
    snapshot: {},
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isAutoSave: true,
    isBookmarked: false,
    changes: [
      { type: 'delete', blockType: 'text', blockName: 'Text Block' },
      { type: 'add', blockType: 'features', blockName: 'Features Grid' },
    ],
    snapshot: {},
  },
  {
    id: '4',
    name: 'Design Review',
    description: 'After client feedback',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isAutoSave: false,
    isBookmarked: true,
    changes: [
      { type: 'edit', blockType: 'hero', blockName: 'Hero Section' },
      { type: 'edit', blockType: 'about', blockName: 'About Section' },
      { type: 'move', blockType: 'testimonials', blockName: 'Testimonials' },
    ],
    snapshot: {},
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isAutoSave: true,
    isBookmarked: false,
    changes: [
      { type: 'add', blockType: 'hero', blockName: 'Hero Section' },
      { type: 'add', blockType: 'about', blockName: 'About Section' },
    ],
    snapshot: {},
  },
  {
    id: '6',
    name: 'Initial Setup',
    description: 'Project created',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    isAutoSave: false,
    isBookmarked: false,
    changes: [],
    snapshot: {},
  },
];

export const VersionHistoryPanel: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>(mockVersions);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionDescription, setVersionDescription] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Today']));
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  const historyStore = useHistoryStore();

  // Group versions by date
  const groupedVersions = React.useMemo((): VersionGroup[] => {
    const groups: { [key: string]: Version[] } = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const filteredVersions = filterBookmarked
      ? versions.filter((v) => v.isBookmarked)
      : versions;

    filteredVersions.forEach((version) => {
      const dateStr = version.timestamp.toDateString();
      let groupName = dateStr;
      if (dateStr === today) groupName = 'Today';
      else if (dateStr === yesterday) groupName = 'Yesterday';
      else groupName = version.timestamp.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(version);
    });

    return Object.entries(groups).map(([date, versions]) => ({ date, versions }));
  }, [versions, filterBookmarked]);

  const toggleGroup = (date: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedGroups(newExpanded);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const saveVersion = () => {
    const newVersion: Version = {
      id: Date.now().toString(),
      name: versionName || undefined,
      description: versionDescription || undefined,
      timestamp: new Date(),
      isAutoSave: false,
      isBookmarked: false,
      changes: [],
      snapshot: {},
    };
    setVersions([newVersion, ...versions]);
    setVersionName('');
    setVersionDescription('');
    setShowSaveModal(false);
  };

  const toggleBookmark = (id: string) => {
    setVersions(
      versions.map((v) => (v.id === id ? { ...v, isBookmarked: !v.isBookmarked } : v))
    );
  };

  const restoreVersion = (version: Version) => {
    // In a real implementation, this would restore the state
    console.log('Restoring version:', version.id);
    setSelectedVersion(null);
    setIsPreviewMode(false);
  };

  const deleteVersion = (id: string) => {
    setVersions(versions.filter((v) => v.id !== id));
    if (selectedVersion?.id === id) {
      setSelectedVersion(null);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <Plus className="w-3 h-3 text-green-500" />;
      case 'edit':
        return <Edit3 className="w-3 h-3 text-blue-500" />;
      case 'delete':
        return <Trash2 className="w-3 h-3 text-red-500" />;
      case 'move':
        return <Layers className="w-3 h-3 text-purple-500" />;
      default:
        return <GitCommit className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <History className="w-5 h-5 text-primary-500" />
            Version History
          </h2>
          <Button size="sm" onClick={() => setShowSaveModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <GitCommit className="w-4 h-4" />
            {versions.length} versions
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-4 h-4" />
            {versions.filter((v) => v.isBookmarked).length} saved
          </span>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFilterBookmarked(!filterBookmarked)}
          className={cn(
            'mt-3 px-3 py-1.5 text-sm rounded-lg transition-colors',
            filterBookmarked
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
          )}
        >
          <Bookmark className="w-4 h-4 inline mr-1" />
          {filterBookmarked ? 'Show All' : 'Bookmarked Only'}
        </button>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        {groupedVersions.map((group) => (
          <div key={group.date}>
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.date)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {expandedGroups.has(group.date) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Calendar className="w-4 h-4" />
              {group.date}
              <span className="ml-auto text-xs text-gray-400">
                {group.versions.length} version{group.versions.length !== 1 ? 's' : ''}
              </span>
            </button>

            {/* Group Items */}
            <AnimatePresence>
              {expandedGroups.has(group.date) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  {group.versions.map((version, index) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'relative px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors',
                        selectedVersion?.id === version.id && 'bg-primary-50 dark:bg-primary-900/20'
                      )}
                      onClick={() => setSelectedVersion(version)}
                    >
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                      {/* Timeline Dot */}
                      <div
                        className={cn(
                          'absolute left-5 top-4 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 z-10',
                          version.isAutoSave
                            ? 'bg-gray-300 dark:bg-gray-600'
                            : 'bg-primary-500'
                        )}
                      />

                      <div className="ml-6 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {version.name ? (
                                <span className="font-medium text-sm">{version.name}</span>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {version.isAutoSave ? 'Auto-save' : 'Saved'}
                                </span>
                              )}
                              {version.isBookmarked && (
                                <Bookmark className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {formatTime(version.timestamp)}
                            </span>
                          </div>

                          <TooltipProvider>
                            <div className="flex items-center gap-1">
                              <Tooltip content="Preview">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedVersion(version);
                                    setIsPreviewMode(true);
                                  }}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Tooltip>
                              <Tooltip content={version.isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmark(version.id);
                                  }}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <Bookmark
                                    className={cn(
                                      'w-4 h-4',
                                      version.isBookmarked && 'text-yellow-500 fill-yellow-500'
                                    )}
                                  />
                                </button>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </div>

                        {version.description && (
                          <p className="text-xs text-gray-500 mt-1">{version.description}</p>
                        )}

                        {/* Changes */}
                        {version.changes.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {version.changes.slice(0, 3).map((change, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                              >
                                {getChangeIcon(change.type)}
                                {change.blockName}
                              </span>
                            ))}
                            {version.changes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{version.changes.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Selected Version Actions */}
      <AnimatePresence>
        {selectedVersion && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-medium text-sm">
                  {selectedVersion.name || 'Version'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatTime(selectedVersion.timestamp)}
                </span>
              </div>
              <button
                onClick={() => setSelectedVersion(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => restoreVersion(selectedVersion)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore
              </Button>
              <Button variant="outline" onClick={() => setIsPreviewMode(true)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => deleteVersion(selectedVersion.id)}
                className="text-red-500 hover:text-red-600 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Version Modal */}
      <Modal
        open={showSaveModal}
        onOpenChange={(open) => setShowSaveModal(open)}
        title="Save Version"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Version Name (optional)
            </label>
            <Input
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g., After client review"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Description (optional)
            </label>
            <textarea
              value={versionDescription}
              onChange={(e) => setVersionDescription(e.target.value)}
              placeholder="What changes were made..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSaveModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={saveVersion} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Version
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
