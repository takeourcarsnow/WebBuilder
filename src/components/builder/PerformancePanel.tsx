'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Image as ImageIcon,
  FileCode,
  Clock,
  Gauge,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  HardDrive,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Tooltip, TooltipProvider } from '@/components/ui';
import { useWebsiteStore } from '@/stores';

interface PerformanceScore {
  overall: number;
  metrics: {
    fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    tbt: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  };
}

interface OptimizationIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'images' | 'scripts' | 'styles' | 'fonts' | 'network';
  title: string;
  description: string;
  impact: string;
  suggestion: string;
  blockId?: string;
  autoFixable: boolean;
}

interface ResourceInfo {
  name: string;
  size: number;
  type: string;
  optimizable: boolean;
}

export const PerformancePanel: React.FC = () => {
  const { website } = useWebsiteStore();
  const blocks = website?.blocks || [];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<PerformanceScore | null>(null);
  const [issues, setIssues] = useState<OptimizationIssue[]>([]);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [resources, setResources] = useState<ResourceInfo[]>([]);

  // Simulated performance analysis
  const analyzePerformance = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      // Generate mock score
      const newScore: PerformanceScore = {
        overall: Math.floor(Math.random() * 30) + 60, // 60-90
        metrics: {
          fcp: { value: 1.2 + Math.random() * 1.5, rating: Math.random() > 0.5 ? 'good' : 'needs-improvement' },
          lcp: { value: 2.0 + Math.random() * 2, rating: Math.random() > 0.3 ? 'good' : 'needs-improvement' },
          cls: { value: Math.random() * 0.2, rating: Math.random() > 0.5 ? 'good' : 'needs-improvement' },
          tbt: { value: 100 + Math.random() * 300, rating: Math.random() > 0.5 ? 'good' : 'needs-improvement' },
          ttfb: { value: 200 + Math.random() * 400, rating: Math.random() > 0.5 ? 'good' : 'needs-improvement' },
        },
      };

      // Generate mock issues based on blocks
      const newIssues: OptimizationIssue[] = [];
      
      // Check for image optimizations
      const imageBlocks = blocks.filter((b: any) => b.type === 'hero' || b.type === 'gallery' || b.type === 'about');
      if (imageBlocks.length > 0) {
        newIssues.push({
          id: '1',
          type: 'warning',
          category: 'images',
          title: 'Unoptimized images detected',
          description: `${imageBlocks.length} blocks contain images that could be optimized.`,
          impact: 'Could reduce page load by 1.2s',
          suggestion: 'Use WebP format and lazy loading for images below the fold.',
          autoFixable: true,
        });
      }

      // Check for too many blocks
      if (blocks.length > 10) {
        newIssues.push({
          id: '2',
          type: 'info',
          category: 'scripts',
          title: 'Large number of components',
          description: `Your page has ${blocks.length} blocks which may affect initial load.`,
          impact: 'Could increase JavaScript bundle size',
          suggestion: 'Consider lazy loading components below the fold.',
          autoFixable: false,
        });
      }

      // Animation performance
      const animatedBlocks = blocks.filter((b: any) => b.animation);
      if (animatedBlocks.length > 5) {
        newIssues.push({
          id: '3',
          type: 'warning',
          category: 'scripts',
          title: 'Multiple animations detected',
          description: `${animatedBlocks.length} blocks have animations which may cause jank.`,
          impact: 'Could reduce CLS score',
          suggestion: 'Use will-change CSS property and prefer transform/opacity animations.',
          autoFixable: false,
        });
      }

      // Font loading
      newIssues.push({
        id: '4',
        type: 'info',
        category: 'fonts',
        title: 'Font loading strategy',
        description: 'Custom fonts may cause layout shift.',
        impact: 'CLS affected by font swap',
        suggestion: 'Use font-display: swap and preload critical fonts.',
        autoFixable: true,
      });

      // Generate mock resources
      const mockResources: ResourceInfo[] = [
        { name: 'main.js', size: 245000, type: 'script', optimizable: true },
        { name: 'styles.css', size: 85000, type: 'style', optimizable: true },
        { name: 'hero-bg.jpg', size: 450000, type: 'image', optimizable: true },
        { name: 'Inter-Regular.woff2', size: 42000, type: 'font', optimizable: false },
        { name: 'Inter-Bold.woff2', size: 44000, type: 'font', optimizable: false },
      ];

      setScore(newScore);
      setIssues(newIssues);
      setResources(mockResources);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    analyzePerformance();
  }, [blocks.length]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 50) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-rose-500';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'needs-improvement':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'poor':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'images':
        return <ImageIcon className="w-4 h-4" />;
      case 'scripts':
        return <FileCode className="w-4 h-4" />;
      case 'styles':
        return <FileCode className="w-4 h-4" />;
      case 'fonts':
        return <FileCode className="w-4 h-4" />;
      case 'network':
        return <Wifi className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalSize = resources.reduce((acc, r) => acc + r.size, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500" />
            Performance
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzePerformance}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Device Selector */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => setSelectedDevice('desktop')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm transition-colors',
              selectedDevice === 'desktop'
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
          <button
            onClick={() => setSelectedDevice('mobile')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm transition-colors',
              selectedDevice === 'mobile'
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isAnalyzing ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary-500" />
            <p className="text-sm text-gray-500">Analyzing performance...</p>
          </div>
        ) : score ? (
          <div className="p-4 space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(score.overall / 100) * 352} 352`}
                    className={getScoreColor(score.overall)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn('text-3xl font-bold', getScoreColor(score.overall))}>
                    {score.overall}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Performance Score
              </p>
            </div>

            {/* Core Web Vitals */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary-500" />
                Core Web Vitals
              </h3>
              <div className="space-y-2">
                {[
                  { key: 'fcp', name: 'First Contentful Paint', unit: 's' },
                  { key: 'lcp', name: 'Largest Contentful Paint', unit: 's' },
                  { key: 'cls', name: 'Cumulative Layout Shift', unit: '' },
                  { key: 'tbt', name: 'Total Blocking Time', unit: 'ms' },
                  { key: 'ttfb', name: 'Time to First Byte', unit: 'ms' },
                ].map((metric) => {
                  const data = score.metrics[metric.key as keyof typeof score.metrics];
                  return (
                    <div
                      key={metric.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{metric.name}</p>
                        <p className="text-xs text-gray-500">{metric.key.toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {data.value.toFixed(metric.key === 'cls' ? 3 : 1)}{metric.unit}
                        </span>
                        <span
                          className={cn(
                            'ml-2 text-xs px-2 py-0.5 rounded-full',
                            getRatingColor(data.rating)
                          )}
                        >
                          {data.rating === 'needs-improvement' ? 'Needs Work' : data.rating}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resource Summary */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary-500" />
                Resources ({formatSize(totalSize)})
              </h3>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div
                      className={cn(
                        'p-1.5 rounded',
                        resource.type === 'image'
                          ? 'bg-purple-100 text-purple-600'
                          : resource.type === 'script'
                          ? 'bg-yellow-100 text-yellow-600'
                          : resource.type === 'style'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {resource.type === 'image' ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <FileCode className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{resource.name}</p>
                      <p className="text-xs text-gray-500">{formatSize(resource.size)}</p>
                    </div>
                    {resource.optimizable && (
                      <TooltipProvider>
                        <Tooltip content="Can be optimized">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Issues */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary-500" />
                Optimization Opportunities ({issues.length})
              </h3>
              <div className="space-y-2">
                {issues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedIssue(expandedIssue === issue.id ? null : issue.id)
                      }
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{issue.title}</p>
                        <p className="text-xs text-gray-500">{issue.impact}</p>
                      </div>
                      <ChevronRight
                        className={cn(
                          'w-4 h-4 text-gray-400 transition-transform',
                          expandedIssue === issue.id && 'rotate-90'
                        )}
                      />
                    </button>

                    {expandedIssue === issue.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800"
                      >
                        <div className="pt-3 space-y-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {issue.description}
                          </p>
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300">
                            💡 {issue.suggestion}
                          </div>
                          {issue.autoFixable && (
                            <Button size="sm" className="w-full">
                              <Zap className="w-4 h-4 mr-2" />
                              Auto-fix
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};
