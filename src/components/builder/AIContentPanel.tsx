'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  Loader2,
  Lightbulb,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { generateAIContent, improveContent, industryPresets, type AIGenerationOptions } from '@/lib/services/aiService';
import { cn } from '@/lib/utils';

interface AIContentPanelProps {
  onApply: (content: string | Record<string, unknown>) => void;
  contentType: AIGenerationOptions['type'];
  currentContent?: string;
  blockType?: string;
  className?: string;
}

const tones: { value: AIGenerationOptions['tone']; label: string; emoji: string }[] = [
  { value: 'professional', label: 'Professional', emoji: '👔' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'playful', label: 'Playful', emoji: '🎉' },
  { value: 'formal', label: 'Formal', emoji: '📋' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
];

const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'creative', label: 'Creative Agency' },
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal/Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'restaurant', label: 'Restaurant/Food' },
  { value: 'fitness', label: 'Fitness/Wellness' },
];

const lengths: { value: AIGenerationOptions['length']; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export const AIContentPanel: React.FC<AIContentPanelProps> = ({
  onApply,
  contentType,
  currentContent,
  blockType,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [tone, setTone] = useState<AIGenerationOptions['tone']>('professional');
  const [industry, setIndustry] = useState('technology');
  const [length, setLength] = useState<AIGenerationOptions['length']>('medium');
  const [context, setContext] = useState('');
  
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    
    const result = await generateAIContent({
      type: contentType,
      tone,
      industry,
      length,
      context: context || undefined,
      existingContent: currentContent,
    });
    
    setIsGenerating(false);
    
    if (result.success) {
      setGeneratedContent(result.content);
    } else {
      setError(result.error || 'Failed to generate content');
    }
  }, [contentType, tone, industry, length, context, currentContent]);

  const handleImprove = useCallback(async (instruction: string) => {
    if (!currentContent) return;
    
    setIsGenerating(true);
    setError(null);
    
    const result = await improveContent(currentContent, instruction);
    
    setIsGenerating(false);
    
    if (result.success) {
      setGeneratedContent(result.content);
    } else {
      setError(result.error || 'Failed to improve content');
    }
  }, [currentContent]);

  const handleApply = () => {
    if (generatedContent) {
      onApply(generatedContent);
      setGeneratedContent(null);
      setIsExpanded(false);
    }
  };

  const quickSuggestions = industryPresets[industry as keyof typeof industryPresets];

  return (
    <div className={cn('rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            AI Content Generator
          </span>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-gray-500 transition-transform', isExpanded && 'rotate-180')} />
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Quick Actions */}
              {currentContent && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Quick Improve</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Make it shorter', instruction: 'Make this more concise' },
                      { label: 'Make it longer', instruction: 'Expand with more detail' },
                      { label: 'More professional', instruction: 'Make this more professional and formal' },
                      { label: 'More engaging', instruction: 'Make this more engaging and compelling' },
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleImprove(action.instruction)}
                        disabled={isGenerating}
                        className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Industry Selection */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Industry/Niche</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {industries.map((ind) => (
                    <option key={ind.value} value={ind.value}>{ind.label}</option>
                  ))}
                </select>
              </div>

              {/* Tone Selection */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-full transition-colors',
                        tone === t.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection (for applicable content types) */}
              {['description', 'about'].includes(contentType) && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Length</label>
                  <div className="flex gap-2">
                    {lengths.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLength(l.value)}
                        className={cn(
                          'flex-1 py-1.5 text-xs rounded-lg transition-colors',
                          length === l.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Context Input */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">Additional Context (optional)</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="E.g., 'We specialize in mobile apps' or 'Target audience is small businesses'"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none h-16 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Quick Suggestions */}
              {quickSuggestions && contentType === 'headline' && (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowQuickSuggestions(!showQuickSuggestions)}
                    className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700"
                  >
                    <Lightbulb className="w-3 h-3" />
                    Quick Suggestions
                    <ChevronDown className={cn('w-3 h-3 transition-transform', showQuickSuggestions && 'rotate-180')} />
                  </button>
                  {showQuickSuggestions && (
                    <div className="space-y-1">
                      {quickSuggestions.headlines.map((headline, i) => (
                        <button
                          key={i}
                          onClick={() => onApply(headline)}
                          className="w-full text-left px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {headline}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate with AI
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Generated Content Preview */}
              {generatedContent && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Generated Content</p>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                      {typeof generatedContent === 'string' 
                        ? generatedContent 
                        : JSON.stringify(generatedContent, null, 2)
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleApply}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Apply
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </button>
                    <button
                      onClick={() => setGeneratedContent(null)}
                      className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Compact AI button for inline use
export const AIAssistButton: React.FC<{
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}> = ({ onClick, isLoading, className }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={cn(
      'flex items-center gap-1 px-2 py-1 text-xs rounded-md',
      'bg-gradient-to-r from-purple-500/10 to-blue-500/10',
      'text-purple-600 dark:text-purple-400',
      'hover:from-purple-500/20 hover:to-blue-500/20',
      'transition-colors disabled:opacity-50',
      className
    )}
  >
    {isLoading ? (
      <Loader2 className="w-3 h-3 animate-spin" />
    ) : (
      <Sparkles className="w-3 h-3" />
    )}
    AI
  </button>
);
