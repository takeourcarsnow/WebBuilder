'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Contrast,
  Type,
  Image as ImageIcon,
  Link,
  Keyboard,
  Info,
} from 'lucide-react';
import { useWebsiteStore } from '@/stores';
import { cn } from '@/lib/utils';
import type { WebsiteBlock } from '@/types';

interface AccessibilityIssue {
  id: string;
  blockId: string;
  blockType: string;
  severity: 'error' | 'warning' | 'info';
  category: 'contrast' | 'images' | 'links' | 'headings' | 'forms' | 'keyboard';
  title: string;
  description: string;
  wcagCriteria?: string;
  suggestion?: string;
}

interface AccessibilityPanelProps {
  className?: string;
}

// Color contrast checker utility
function getLuminance(hex: string): number {
  const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
  const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(foreground: string, background: string): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  const ratio = getContrastRatio(foreground, background);
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}

// Analyze blocks for accessibility issues
function analyzeAccessibility(blocks: WebsiteBlock[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  blocks.forEach((block) => {
    const content = block.content as Record<string, unknown>;
    const style = block.style;

    // Check color contrast
    if (style.textColor && style.backgroundColor) {
      const contrast = checkContrast(style.textColor, style.backgroundColor);
      if (!contrast.passesAA) {
        issues.push({
          id: `contrast-${block.id}`,
          blockId: block.id,
          blockType: block.type,
          severity: 'error',
          category: 'contrast',
          title: 'Low Color Contrast',
          description: `Contrast ratio is ${contrast.ratio.toFixed(2)}:1. Minimum required is 4.5:1 for normal text.`,
          wcagCriteria: 'WCAG 2.1 Level AA - 1.4.3',
          suggestion: 'Increase the contrast between text and background colors.',
        });
      } else if (!contrast.passesAAA) {
        issues.push({
          id: `contrast-aaa-${block.id}`,
          blockId: block.id,
          blockType: block.type,
          severity: 'info',
          category: 'contrast',
          title: 'Consider Higher Contrast',
          description: `Contrast ratio is ${contrast.ratio.toFixed(2)}:1. For AAA compliance, aim for 7:1.`,
          wcagCriteria: 'WCAG 2.1 Level AAA - 1.4.6',
          suggestion: 'For better accessibility, consider increasing contrast.',
        });
      }
    }

    // Check images for alt text
    if (block.type === 'image' || block.type === 'gallery') {
      if (block.type === 'image') {
        const src = content.src as string;
        const alt = content.alt as string;
        if (src && (!alt || alt === 'Image description')) {
          issues.push({
            id: `alt-${block.id}`,
            blockId: block.id,
            blockType: block.type,
            severity: 'error',
            category: 'images',
            title: 'Missing Alt Text',
            description: 'Image is missing descriptive alternative text.',
            wcagCriteria: 'WCAG 2.1 Level A - 1.1.1',
            suggestion: 'Add meaningful alt text that describes the image content.',
          });
        }
      }
      if (block.type === 'gallery') {
        const images = content.images as Array<{ src: string; alt: string }>;
        if (images) {
          images.forEach((img, i) => {
            if (img.src && (!img.alt || img.alt.startsWith('Project '))) {
              issues.push({
                id: `alt-gallery-${block.id}-${i}`,
                blockId: block.id,
                blockType: block.type,
                severity: 'warning',
                category: 'images',
                title: `Gallery Image ${i + 1} Missing Alt Text`,
                description: 'Gallery image has generic or missing alt text.',
                wcagCriteria: 'WCAG 2.1 Level A - 1.1.1',
                suggestion: 'Add descriptive alt text for each gallery image.',
              });
            }
          });
        }
      }
    }

    // Check for missing headings structure
    if (block.type === 'hero' || block.type === 'about' || block.type === 'features') {
      const title = content.title as string || content.headline as string;
      if (!title || title.length < 3) {
        issues.push({
          id: `heading-${block.id}`,
          blockId: block.id,
          blockType: block.type,
          severity: 'warning',
          category: 'headings',
          title: 'Missing or Short Heading',
          description: 'Section is missing a descriptive heading.',
          wcagCriteria: 'WCAG 2.1 Level A - 1.3.1',
          suggestion: 'Add a clear, descriptive heading for this section.',
        });
      }
    }

    // Check links
    if (block.type === 'cta' || block.type === 'hero') {
      const buttonText = content.buttonText as string || content.primaryButtonText as string;
      if (buttonText && ['Click here', 'Learn more', 'Read more'].includes(buttonText)) {
        issues.push({
          id: `link-${block.id}`,
          blockId: block.id,
          blockType: block.type,
          severity: 'warning',
          category: 'links',
          title: 'Non-Descriptive Link Text',
          description: `"${buttonText}" doesn't describe where the link leads.`,
          wcagCriteria: 'WCAG 2.1 Level A - 2.4.4',
          suggestion: 'Use descriptive text like "View our services" or "Contact us today".',
        });
      }
    }

    // Check form labels
    if (block.type === 'contact') {
      const hasEmail = content.email as string;
      if (!hasEmail) {
        issues.push({
          id: `form-${block.id}`,
          blockId: block.id,
          blockType: block.type,
          severity: 'info',
          category: 'forms',
          title: 'Form Accessibility',
          description: 'Ensure form fields have visible labels and error messages.',
          wcagCriteria: 'WCAG 2.1 Level A - 3.3.2',
          suggestion: 'Add clear labels and validation feedback for all form fields.',
        });
      }
    }
  });

  return issues;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ className }) => {
  const { website } = useWebsiteStore();
  const { setSelectedBlock } = require('@/stores').useEditorStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['error']));
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const issues = useMemo(() => {
    if (!website?.blocks) return [];
    return analyzeAccessibility(website.blocks);
  }, [website?.blocks]);

  const filteredIssues = useMemo(() => {
    let filtered = issues;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        issue =>
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query) ||
          issue.blockType.toLowerCase().includes(query)
      );
    }
    
    if (selectedSeverity) {
      filtered = filtered.filter(issue => issue.severity === selectedSeverity);
    }
    
    return filtered;
  }, [issues, searchQuery, selectedSeverity]);

  const issuesByCategory = useMemo(() => {
    const grouped: Record<string, AccessibilityIssue[]> = {};
    filteredIssues.forEach(issue => {
      if (!grouped[issue.category]) {
        grouped[issue.category] = [];
      }
      grouped[issue.category].push(issue);
    });
    return grouped;
  }, [filteredIssues]);

  const stats = useMemo(() => ({
    errors: issues.filter(i => i.severity === 'error').length,
    warnings: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
    total: issues.length,
  }), [issues]);

  const score = useMemo(() => {
    if (stats.total === 0) return 100;
    const weightedScore = (stats.errors * 10 + stats.warnings * 5 + stats.info * 1);
    return Math.max(0, Math.min(100, 100 - weightedScore));
  }, [stats]);

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

  const categoryIcons: Record<string, React.ReactNode> = {
    contrast: <Contrast className="w-4 h-4" />,
    images: <ImageIcon className="w-4 h-4" />,
    headings: <Type className="w-4 h-4" />,
    links: <Link className="w-4 h-4" />,
    forms: <Keyboard className="w-4 h-4" />,
    keyboard: <Keyboard className="w-4 h-4" />,
  };

  const severityColors: Record<string, string> = {
    error: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
  };

  const severityIcons: Record<string, React.ReactNode> = {
    error: <XCircle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Accessibility
        </h2>
      </div>

      {/* Score Card */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
            score >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
            score >= 60 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
            'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
          )}>
            {score}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              {score >= 80 ? 'Good' : score >= 60 ? 'Needs Improvement' : 'Critical Issues'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stats.total} {stats.total === 1 ? 'issue' : 'issues'} found
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'error', label: 'Errors', count: stats.errors },
            { key: 'warning', label: 'Warnings', count: stats.warnings },
            { key: 'info', label: 'Info', count: stats.info },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setSelectedSeverity(selectedSeverity === key ? null : key)}
              className={cn(
                'flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
                selectedSeverity === key
                  ? severityColors[key]
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {count} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
            <p className="font-medium text-gray-900 dark:text-white">
              {issues.length === 0 ? 'No accessibility issues found!' : 'No matching issues'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {issues.length === 0 
                ? 'Your website follows accessibility best practices.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          Object.entries(issuesByCategory).map(([category, categoryIssues]) => (
            <div key={category} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {expandedCategories.has(category) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  {categoryIcons[category]}
                </span>
                <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                  {category}
                </span>
                <span className="text-xs text-gray-500">{categoryIssues.length}</span>
              </button>
              
              <AnimatePresence>
                {expandedCategories.has(category) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {categoryIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => setSelectedBlock(issue.blockId)}
                        className="px-4 py-3 border-t border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <span className={severityColors[issue.severity]}>
                            {severityIcons[issue.severity]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {issue.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {issue.description}
                            </p>
                            {issue.wcagCriteria && (
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                {issue.wcagCriteria}
                              </p>
                            )}
                            {issue.suggestion && (
                              <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">
                                💡 {issue.suggestion}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlock(issue.blockId);
                            }}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                            title="Go to block"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Based on WCAG 2.1 guidelines
        </p>
      </div>
    </div>
  );
};
