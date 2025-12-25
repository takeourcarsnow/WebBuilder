'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  FolderOpen,
  Copy,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Search,
  Tag,
  Clock,
  Download,
  Upload,
  Sparkles,
  Filter,
} from 'lucide-react';
import { useWebsiteStore, useEditorStore, useSelectedBlock } from '@/stores';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { WebsiteBlock, BlockStyle, AnimationConfig } from '@/types';

// Block template type - a saved block configuration
interface BlockTemplate {
  id: string;
  name: string;
  description?: string;
  blockType: string;
  content: Record<string, unknown>;
  style: BlockStyle;
  animation?: AnimationConfig;
  customCSS?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Storage key for templates
const TEMPLATES_STORAGE_KEY = 'webstax-block-templates';

// Load templates from localStorage
const loadTemplates = (): BlockTemplate[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
      const templates = JSON.parse(stored);
      return templates.map((t: BlockTemplate) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    }
  } catch (e) {
    console.error('Failed to load templates:', e);
  }
  return [];
};

// Save templates to localStorage
const saveTemplates = (templates: BlockTemplate[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates:', e);
  }
};

interface BlockTemplatesLibraryProps {
  className?: string;
  onApplyTemplate?: (template: BlockTemplate) => void;
}

export const BlockTemplatesLibrary: React.FC<BlockTemplatesLibraryProps> = ({
  className,
  onApplyTemplate,
}) => {
  const { website, addBlock, updateBlockContent, updateBlockStyle, setBlockAnimation, setBlockCustomCSS, setCurrentWebsite } = useWebsiteStore();
  const { addNotification, setSelectedBlock } = useEditorStore();
  const selectedBlock = useSelectedBlock();
  
  const [templates, setTemplates] = useState<BlockTemplate[]>(loadTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['saved']));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('saved');
  const [newTemplateTags, setNewTemplateTags] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return ['saved', ...Array.from(cats).filter(c => c !== 'saved')];
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templates;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.blockType.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    return filtered;
  }, [templates, searchQuery, selectedCategory]);

  // Group templates by category
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, BlockTemplate[]> = {};
    filteredTemplates.forEach(template => {
      if (!grouped[template.category]) {
        grouped[template.category] = [];
      }
      grouped[template.category].push(template);
    });
    return grouped;
  }, [filteredTemplates]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Save current block as template
  const handleSaveTemplate = useCallback(() => {
    if (!selectedBlock || !newTemplateName.trim()) return;

    const template: BlockTemplate = {
      id: generateId(),
      name: newTemplateName.trim(),
      description: newTemplateDescription.trim() || undefined,
      blockType: selectedBlock.type,
      content: { ...selectedBlock.content },
      style: { ...selectedBlock.style },
      animation: selectedBlock.animation,
      customCSS: selectedBlock.customCSS,
      category: newTemplateCategory,
      tags: newTemplateTags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTemplates = [...templates, template];
    setTemplates(newTemplates);
    saveTemplates(newTemplates);

    setShowSaveModal(false);
    setNewTemplateName('');
    setNewTemplateDescription('');
    setNewTemplateCategory('saved');
    setNewTemplateTags('');

    addNotification({
      type: 'success',
      message: 'Block saved as template',
      duration: 2000,
    });
  }, [selectedBlock, newTemplateName, newTemplateDescription, newTemplateCategory, newTemplateTags, templates, addNotification]);

  // Apply template to create new block
  const handleApplyTemplate = useCallback((template: BlockTemplate) => {
    if (!website) return;

    // Create new block from template
    const newBlock: WebsiteBlock = {
      id: generateId(),
      type: template.blockType as WebsiteBlock['type'],
      content: { ...template.content } as WebsiteBlock['content'],
      style: { ...template.style },
      animation: template.animation,
      customCSS: template.customCSS,
      order: website.blocks.length,
    };

    setCurrentWebsite({
      ...website,
      blocks: [...website.blocks, newBlock],
      updatedAt: new Date(),
    });

    setSelectedBlock(newBlock.id);
    onApplyTemplate?.(template);

    addNotification({
      type: 'success',
      message: `${template.name} added`,
      duration: 2000,
    });
  }, [website, setCurrentWebsite, setSelectedBlock, onApplyTemplate, addNotification]);

  // Delete template
  const handleDeleteTemplate = useCallback((templateId: string) => {
    const newTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(newTemplates);
    saveTemplates(newTemplates);

    addNotification({
      type: 'info',
      message: 'Template deleted',
      duration: 2000,
    });
  }, [templates, addNotification]);

  // Duplicate template
  const handleDuplicateTemplate = useCallback((template: BlockTemplate) => {
    const duplicated: BlockTemplate = {
      ...template,
      id: generateId(),
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newTemplates = [...templates, duplicated];
    setTemplates(newTemplates);
    saveTemplates(newTemplates);

    addNotification({
      type: 'success',
      message: 'Template duplicated',
      duration: 2000,
    });
  }, [templates, addNotification]);

  // Export templates
  const handleExport = useCallback(() => {
    const data = JSON.stringify(templates, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'block-templates.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [templates]);

  // Import templates
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text) as BlockTemplate[];
        const newTemplates = [
          ...templates,
          ...imported.map(t => ({
            ...t,
            id: generateId(),
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })),
        ];
        setTemplates(newTemplates);
        saveTemplates(newTemplates);

        addNotification({
          type: 'success',
          message: `${imported.length} templates imported`,
          duration: 2000,
        });
      } catch {
        addNotification({
          type: 'error',
          message: 'Failed to import templates',
          duration: 3000,
        });
      }
    };
    input.click();
  }, [templates, addNotification]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Block Templates
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleImport}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Import"
          >
            <Upload className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleExport}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Export"
          >
            <Download className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Save Current Block */}
      {selectedBlock && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowSaveModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Current Block as Template
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-2 py-1 text-xs rounded-full transition-colors',
              !selectedCategory
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={cn(
                'px-2 py-1 text-xs rounded-full transition-colors capitalize',
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              No templates yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Save a block to create your first template
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 py-2 text-left"
                >
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                    {category}
                  </span>
                  <span className="text-xs text-gray-400">({categoryTemplates.length})</span>
                </button>
                
                <AnimatePresence>
                  {expandedCategories.has(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pl-6">
                        {categoryTemplates.map(template => (
                          <div
                            key={template.id}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {template.name}
                                </p>
                                {template.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                    {template.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                    {template.blockType}
                                  </span>
                                  {template.tags.slice(0, 2).map(tag => (
                                    <span
                                      key={tag}
                                      className="px-1.5 py-0.5 text-[10px] rounded bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleApplyTemplate(template)}
                                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  title="Use template"
                                >
                                  <Plus className="w-4 h-4 text-primary-500" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateTemplate(template)}
                                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  title="Duplicate"
                                >
                                  <Copy className="w-4 h-4 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSaveModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Save as Template
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="My Hero Template"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="A beautiful hero section with..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newTemplateCategory}
                    onChange={(e) => setNewTemplateCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="saved"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTemplateTags}
                    onChange={(e) => setNewTemplateTags(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="hero, dark, modern"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={!newTemplateName.trim()}
                  className="px-4 py-2 text-sm rounded-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                >
                  Save Template
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
