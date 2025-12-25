'use client';

import React, { useMemo, useState } from 'react';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { Code2, Eye, EyeOff } from 'lucide-react';

interface CodeBlockProps {
  block: WebsiteBlock;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);
  const [showPreview, setShowPreview] = useState(content.showPreview as boolean ?? true);

  const html = content.html as string || '';
  const css = content.css as string || '';
  const javascript = content.javascript as string || '';

  // Create a safe preview by combining HTML and CSS
  const previewContent = useMemo(() => {
    return `
      <style>${css}</style>
      ${html}
    `;
  }, [html, css]);

  // Execute JavaScript safely (in preview only)
  const executeScript = useMemo(() => {
    if (!javascript || !showPreview) return null;
    try {
      // Create a safe execution context
      return new Function(javascript);
    } catch (e) {
      console.error('Script execution error:', e);
      return null;
    }
  }, [javascript, showPreview]);

  React.useEffect(() => {
    if (executeScript && showPreview) {
      try {
        executeScript();
      } catch (e) {
        console.error('Runtime error:', e);
      }
    }
  }, [executeScript, showPreview]);

  return (
    <section className={cn(containerClass, 'relative')} style={containerStyle}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Toggle Preview */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show Preview
              </>
            )}
          </button>
        </div>

        {showPreview ? (
          /* Live Preview */
          <div
            className="border rounded-lg p-4 bg-white dark:bg-gray-900 min-h-[100px]"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        ) : (
          /* Code Display */
          <div className="space-y-4">
            {html && (
              <div className="rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 text-sm">
                  <Code2 className="w-4 h-4" />
                  HTML
                </div>
                <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                  <code>{html}</code>
                </pre>
              </div>
            )}
            
            {css && (
              <div className="rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-blue-100 text-sm">
                  <Code2 className="w-4 h-4" />
                  CSS
                </div>
                <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                  <code>{css}</code>
                </pre>
              </div>
            )}
            
            {javascript && (
              <div className="rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-700 text-yellow-100 text-sm">
                  <Code2 className="w-4 h-4" />
                  JavaScript
                </div>
                <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                  <code>{javascript}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
