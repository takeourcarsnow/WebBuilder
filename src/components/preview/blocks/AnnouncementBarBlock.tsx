'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Bell, Gift, AlertTriangle, Info } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';

export interface AnnouncementBarBlockContent {
  message: string;
  linkText?: string;
  linkUrl?: string;
  icon: 'bell' | 'gift' | 'warning' | 'info' | 'none';
  position: 'top' | 'bottom';
  style: 'solid' | 'gradient' | 'minimal';
  backgroundColor?: string;
  dismissible: boolean;
  animated: boolean;
}

interface AnnouncementBarBlockProps {
  content: AnnouncementBarBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

const iconMap = {
  bell: Bell,
  gift: Gift,
  warning: AlertTriangle,
  info: Info,
  none: null,
};

export const AnnouncementBarBlock: React.FC<AnnouncementBarBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    message = '🎉 Free shipping on orders over $50! Limited time offer.',
    linkText = 'Shop Now',
    linkUrl = '#',
    icon = 'none',
    position = 'top',
    style: barStyle = 'solid',
    backgroundColor = '#4F46E5',
    dismissible = true,
    animated = true,
  } = content;

  const [isDismissed, setIsDismissed] = useState(false);

  const IconComponent = iconMap[icon];

  const getBarClasses = () => {
    const baseClasses = 'relative py-3 px-4';
    
    switch (barStyle) {
      case 'gradient':
        return cn(baseClasses, 'bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white');
      case 'minimal':
        return cn(baseClasses, 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700');
      default:
        return cn(baseClasses, 'text-white');
    }
  };

  // For editor preview, show as a regular block
  if (isPreview) {
    return (
      <div className="w-full">
        <div className="text-center mb-2 text-xs opacity-60">
          Announcement Bar (Position: {position})
        </div>
        
        <div
          className={getBarClasses()}
          style={barStyle === 'solid' ? { backgroundColor } : undefined}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
            {/* Icon */}
            {IconComponent && (
              <motion.div
                animate={animated ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
              </motion.div>
            )}

            {/* Message */}
            <span className={cn(animated && 'animate-pulse-subtle')}>
              {message}
            </span>

            {/* Link */}
            {linkText && (
              <a
                href={linkUrl}
                className="font-medium flex items-center gap-1 hover:underline underline-offset-2 flex-shrink-0"
              >
                {linkText}
                <ChevronRight className="w-4 h-4" />
              </a>
            )}

            {/* Dismiss */}
            {dismissible && (
              <button
                onClick={() => setIsDismissed(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={cn(
            'w-full overflow-hidden',
            position === 'top' ? 'fixed top-0 left-0 right-0 z-50' : 'fixed bottom-0 left-0 right-0 z-50'
          )}
        >
          <div
            className={getBarClasses()}
            style={barStyle === 'solid' ? { backgroundColor } : undefined}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm">
              {/* Icon */}
              {IconComponent && (
                <motion.div
                  animate={animated ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                </motion.div>
              )}

              {/* Scrolling Message for long text */}
              {animated && message.length > 50 ? (
                <div className="overflow-hidden max-w-md">
                  <motion.span
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="inline-block whitespace-nowrap"
                  >
                    {message}
                  </motion.span>
                </div>
              ) : (
                <span>{message}</span>
              )}

              {/* Link */}
              {linkText && (
                <a
                  href={linkUrl}
                  className="font-medium flex items-center gap-1 hover:underline underline-offset-2 flex-shrink-0"
                >
                  {linkText}
                  <ChevronRight className="w-4 h-4" />
                </a>
              )}

              {/* Dismiss */}
              {dismissible && (
                <button
                  onClick={() => setIsDismissed(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Add to global CSS
const style = `
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}
`;
