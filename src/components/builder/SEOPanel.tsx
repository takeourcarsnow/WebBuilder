'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Globe,
  Share2,
  Hash,
  ChevronDown,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useWebsiteStore } from '@/stores';
import { cn } from '@/lib/utils';

interface SEOIssue {
  id: string;
  severity: 'error' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
  currentValue?: string;
  recommendedValue?: string;
  category: 'meta' | 'content' | 'technical' | 'social';
}

interface SEOPanelProps {
  className?: string;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({ className }) => {
  const { website, updateSettings } = useWebsiteStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'meta' | 'social' | 'preview'>('overview');
  const [copied, setCopied] = useState(false);

  const settings = website?.settings;
  const seo = settings?.seo;

  // Analyze SEO and generate issues/recommendations
  const { issues, score } = useMemo(() => {
    if (!website || !settings) return { issues: [], score: 0 };

    const issuesList: SEOIssue[] = [];

    // Title checks
    const title = seo?.metaTitle || settings.title || '';
    if (!title) {
      issuesList.push({
        id: 'title-missing',
        severity: 'error',
        title: 'Missing Page Title',
        description: 'Add a title tag to help search engines understand your page.',
        category: 'meta',
      });
    } else if (title.length < 30) {
      issuesList.push({
        id: 'title-short',
        severity: 'warning',
        title: 'Title Too Short',
        description: 'Your title is under 30 characters. Aim for 50-60 characters.',
        currentValue: `${title.length} characters`,
        recommendedValue: '50-60 characters',
        category: 'meta',
      });
    } else if (title.length > 60) {
      issuesList.push({
        id: 'title-long',
        severity: 'warning',
        title: 'Title Too Long',
        description: 'Your title may be truncated in search results. Keep it under 60 characters.',
        currentValue: `${title.length} characters`,
        recommendedValue: '50-60 characters',
        category: 'meta',
      });
    } else {
      issuesList.push({
        id: 'title-good',
        severity: 'success',
        title: 'Good Title Length',
        description: 'Your title is a good length for search engines.',
        currentValue: `${title.length} characters`,
        category: 'meta',
      });
    }

    // Description checks
    const description = seo?.metaDescription || settings.description || '';
    if (!description) {
      issuesList.push({
        id: 'desc-missing',
        severity: 'error',
        title: 'Missing Meta Description',
        description: 'Add a meta description to improve click-through rates from search results.',
        category: 'meta',
      });
    } else if (description.length < 120) {
      issuesList.push({
        id: 'desc-short',
        severity: 'warning',
        title: 'Description Too Short',
        description: 'Your description is under 120 characters. Aim for 150-160 characters.',
        currentValue: `${description.length} characters`,
        recommendedValue: '150-160 characters',
        category: 'meta',
      });
    } else if (description.length > 160) {
      issuesList.push({
        id: 'desc-long',
        severity: 'warning',
        title: 'Description Too Long',
        description: 'Your description may be truncated. Keep it under 160 characters.',
        currentValue: `${description.length} characters`,
        recommendedValue: '150-160 characters',
        category: 'meta',
      });
    } else {
      issuesList.push({
        id: 'desc-good',
        severity: 'success',
        title: 'Good Description Length',
        description: 'Your meta description is a good length.',
        currentValue: `${description.length} characters`,
        category: 'meta',
      });
    }

    // OG Image check
    if (!seo?.ogImage) {
      issuesList.push({
        id: 'og-image-missing',
        severity: 'warning',
        title: 'Missing Social Image',
        description: 'Add an Open Graph image for better social media previews.',
        recommendedValue: '1200x630 pixels',
        category: 'social',
      });
    } else {
      issuesList.push({
        id: 'og-image-good',
        severity: 'success',
        title: 'Social Image Set',
        description: 'Your social sharing image is configured.',
        category: 'social',
      });
    }

    // Content checks
    const blocks = website.blocks || [];
    const hasH1 = blocks.some(b => b.type === 'hero' && b.content.headline);
    if (!hasH1) {
      issuesList.push({
        id: 'h1-missing',
        severity: 'warning',
        title: 'No Main Heading Found',
        description: 'Add a Hero section with a headline to serve as your H1.',
        category: 'content',
      });
    }

    // Image alt text check
    const imageBlocks = blocks.filter(b => b.type === 'image' || b.type === 'gallery');
    const missingAltCount = imageBlocks.filter(b => {
      if (b.type === 'image') return !b.content.alt || b.content.alt === 'Image description';
      return false;
    }).length;
    
    if (missingAltCount > 0) {
      issuesList.push({
        id: 'alt-missing',
        severity: 'warning',
        title: `${missingAltCount} Image${missingAltCount > 1 ? 's' : ''} Missing Alt Text`,
        description: 'Add descriptive alt text to all images for better SEO and accessibility.',
        category: 'content',
      });
    }

    // Keywords check
    if (!seo?.keywords || seo.keywords.length === 0) {
      issuesList.push({
        id: 'keywords-missing',
        severity: 'info',
        title: 'No Keywords Set',
        description: 'Add focus keywords to help with content optimization.',
        category: 'meta',
      });
    }

    // Calculate score
    const errorCount = issuesList.filter(i => i.severity === 'error').length;
    const warningCount = issuesList.filter(i => i.severity === 'warning').length;
    const successCount = issuesList.filter(i => i.severity === 'success').length;
    
    const calculatedScore = Math.max(0, Math.min(100,
      100 - (errorCount * 25) - (warningCount * 10) + (successCount * 5)
    ));

    return { issues: issuesList, score: calculatedScore };
  }, [website, settings, seo]);

  const handleCopySchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settings?.title || '',
      description: settings?.description || '',
      url: 'https://yourwebsite.com',
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityIcons: Record<string, React.ReactNode> = {
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    info: <AlertCircle className="w-4 h-4 text-blue-500" />,
  };

  if (!website) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p className="text-gray-500">No website loaded</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          SEO Tools
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
              SEO Score
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {score >= 80 ? 'Great job!' : score >= 60 ? 'Room for improvement' : 'Needs attention'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'meta', label: 'Meta Tags', icon: FileText },
          { id: 'social', label: 'Social', icon: Share2 },
          { id: 'preview', label: 'Preview', icon: Globe },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === id
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  'p-3 rounded-lg border',
                  issue.severity === 'error' && 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10',
                  issue.severity === 'warning' && 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10',
                  issue.severity === 'success' && 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10',
                  issue.severity === 'info' && 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10',
                )}
              >
                <div className="flex items-start gap-2">
                  {severityIcons[issue.severity]}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {issue.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {issue.description}
                    </p>
                    {issue.currentValue && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current: {issue.currentValue}
                        {issue.recommendedValue && ` → Recommended: ${issue.recommendedValue}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={seo?.metaTitle || settings?.title || ''}
                onChange={(e) => updateSettings({ seo: { ...seo, metaTitle: e.target.value } })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                placeholder="Your page title"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(seo?.metaTitle || settings?.title || '').length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Description
              </label>
              <textarea
                value={seo?.metaDescription || settings?.description || ''}
                onChange={(e) => updateSettings({ seo: { ...seo, metaDescription: e.target.value } })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-20 resize-none"
                placeholder="Describe your page..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {(seo?.metaDescription || settings?.description || '').length}/160 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seo?.keywords?.join(', ') || ''}
                onChange={(e) => updateSettings({ 
                  seo: { 
                    ...seo, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) 
                  } 
                })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schema.org Markup
              </h4>
              <button
                onClick={handleCopySchema}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy JSON-LD Schema'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Social Share Image (OG Image)
              </label>
              <input
                type="url"
                value={seo?.ogImage || ''}
                onChange={(e) => updateSettings({ seo: { ...seo, ogImage: e.target.value } })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1200x630 pixels
              </p>
            </div>

            {seo?.ogImage && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <img
                  src={seo.ogImage}
                  alt="Social preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x630?text=Image+Not+Found';
                  }}
                />
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Social Platforms Preview
              </h4>
              <div className="space-y-3">
                {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                  <div key={platform} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{platform}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {seo?.metaTitle || settings?.title || 'Page Title'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {seo?.metaDescription || settings?.description || 'Page description...'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Google Search Preview
            </h4>
            
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-primary-600 dark:text-primary-400 truncate">
                yourwebsite.com
              </p>
              <p className="text-lg text-blue-800 dark:text-blue-300 hover:underline cursor-pointer truncate">
                {seo?.metaTitle || settings?.title || 'Page Title'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {seo?.metaDescription || settings?.description || 'Add a meta description to see how your page will appear in search results.'}
              </p>
            </div>

            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-4">
              Mobile Search Preview
            </h4>
            
            <div className="max-w-[360px] p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-900 dark:text-white">Your Website</p>
                  <p className="text-xs text-gray-500">yourwebsite.com</p>
                </div>
              </div>
              <p className="text-base text-blue-800 dark:text-blue-300 truncate">
                {seo?.metaTitle || settings?.title || 'Page Title'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {seo?.metaDescription || settings?.description || 'Meta description preview...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
