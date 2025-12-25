'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface CountdownBlockContent {
  title?: string;
  subtitle?: string;
  targetDate: string; // ISO date string
  completedMessage: string;
  style: 'modern' | 'classic' | 'minimal' | 'cards';
  showLabels: boolean;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
}

interface CountdownBlockProps {
  content: CountdownBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownBlock: React.FC<CountdownBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title = 'Coming Soon',
    subtitle = 'Something amazing is on the way',
    targetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedMessage = '🎉 The wait is over!',
    style: countdownStyle = 'modern',
    showLabels = true,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
  } = content;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsComplete(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const timeUnits = [
    { key: 'days', value: timeLeft.days, label: 'Days', show: showDays },
    { key: 'hours', value: timeLeft.hours, label: 'Hours', show: showHours },
    { key: 'minutes', value: timeLeft.minutes, label: 'Minutes', show: showMinutes },
    { key: 'seconds', value: timeLeft.seconds, label: 'Seconds', show: showSeconds },
  ].filter((unit) => unit.show);

  const getStyleClasses = () => {
    switch (countdownStyle) {
      case 'modern':
        return {
          container: 'flex items-center justify-center gap-3 sm:gap-6',
          unit: 'flex flex-col items-center',
          value: 'w-16 sm:w-24 h-16 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-3xl sm:text-5xl font-bold shadow-lg',
          label: 'mt-2 text-xs sm:text-sm font-medium opacity-70',
          separator: 'text-3xl sm:text-5xl font-bold opacity-30',
        };
      case 'classic':
        return {
          container: 'flex items-center justify-center gap-2 sm:gap-4',
          unit: 'flex flex-col items-center',
          value: 'w-16 sm:w-20 h-16 sm:h-20 border-2 border-current rounded-lg flex items-center justify-center text-2xl sm:text-4xl font-mono',
          label: 'mt-2 text-xs uppercase tracking-wider opacity-60',
          separator: 'text-2xl sm:text-4xl font-mono',
        };
      case 'minimal':
        return {
          container: 'flex items-center justify-center gap-2',
          unit: 'flex items-baseline gap-1',
          value: 'text-4xl sm:text-6xl font-light',
          label: 'text-sm uppercase opacity-60',
          separator: 'text-4xl sm:text-6xl font-light opacity-30 mx-2',
        };
      case 'cards':
        return {
          container: 'flex items-center justify-center gap-4 sm:gap-6',
          unit: 'flex flex-col items-center',
          value: 'w-20 sm:w-28 h-20 sm:h-28 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-3xl sm:text-5xl font-bold',
          label: 'mt-3 text-sm font-medium opacity-70',
          separator: '',
        };
      default:
        return {
          container: 'flex items-center justify-center gap-4',
          unit: 'flex flex-col items-center',
          value: 'text-4xl font-bold',
          label: 'text-sm opacity-70',
          separator: 'text-4xl',
        };
    }
  };

  const styles = getStyleClasses();

  return (
    <section
      className={cn(
        BLOCK_STYLE_CLASSES.padding[blockStyle.padding || 'large'],
        BLOCK_STYLE_CLASSES.width[blockStyle.width || 'medium'],
        'flex flex-col',
        BLOCK_STYLE_CLASSES.alignment[blockStyle.alignment || 'center']
      )}
      style={{
        backgroundColor: blockStyle.backgroundColor,
        color: blockStyle.textColor,
      }}
    >
      <div className="w-full text-center">
        {/* Header */}
        <motion.div
          initial={isPreview ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg opacity-70">{subtitle}</p>
          )}
        </motion.div>

        {/* Countdown */}
        {isComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl sm:text-5xl font-bold"
          >
            {completedMessage}
          </motion.div>
        ) : (
          <motion.div
            initial={isPreview ? { opacity: 0, scale: 0.9 } : false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={styles.container}
          >
            {timeUnits.map((unit, index) => (
              <React.Fragment key={unit.key}>
                <div className={styles.unit}>
                  <motion.div
                    key={unit.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={styles.value}
                  >
                    {formatNumber(unit.value)}
                  </motion.div>
                  {showLabels && (
                    <span className={styles.label}>{unit.label}</span>
                  )}
                </div>
                {index < timeUnits.length - 1 && styles.separator && (
                  <span className={styles.separator}>:</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}

        {/* Optional: Show target date */}
        {!isComplete && (
          <motion.div
            initial={isPreview ? { opacity: 0 } : false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm opacity-50"
          >
            <Clock className="w-4 h-4" />
            <span>
              Until {new Date(targetDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
};
