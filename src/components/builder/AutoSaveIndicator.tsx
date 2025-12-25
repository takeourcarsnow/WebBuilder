'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AutoSaveIndicatorProps {
  className?: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  className,
  isSaving: propIsSaving,
  lastSaved: propLastSaved,
}) => {
  const [showSaved, setShowSaved] = useState(false);
  const [prevSaving, setPrevSaving] = useState(propIsSaving);

  // Show "Saved" when transitioning from saving to not saving
  useEffect(() => {
    if (prevSaving && !propIsSaving) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevSaving(propIsSaving);
  }, [propIsSaving, prevSaving]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('flex items-center gap-2 text-sm', className)}>
      <AnimatePresence mode="wait">
        {propIsSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </motion.div>
        ) : showSaved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-1.5 text-green-600 dark:text-green-400"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
            <span>Saved</span>
          </motion.div>
        ) : propLastSaved ? (
          <motion.div
            key="last-saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500"
          >
            <Cloud className="w-4 h-4" />
            <span className="hidden sm:inline">Last saved {formatTime(propLastSaved)}</span>
            <span className="sm:hidden">{formatTime(propLastSaved)}</span>
          </motion.div>
        ) : (
          <motion.div
            key="no-save"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500"
          >
            <CloudOff className="w-4 h-4" />
            <span>Not saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
