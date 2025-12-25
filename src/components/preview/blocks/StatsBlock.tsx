'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface StatsBlockProps {
  block: WebsiteBlock;
}

// Animated counter component
const AnimatedCounter: React.FC<{
  value: number;
  suffix: string;
  duration: number;
  shouldAnimate: boolean;
}> = ({ value, suffix, duration, shouldAnimate }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * value);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration, shouldAnimate]);

  return (
    <span>
      {shouldAnimate ? count : value}{suffix}
    </span>
  );
};

export const StatsBlock: React.FC<StatsBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);

  const title = content.title as string || '';
  const subtitle = content.subtitle as string || '';
  const stats = (content.stats as unknown as StatItem[]) || [];
  const animateOnView = content.animateOnView as boolean ?? true;
  const duration = content.duration as number || 2000;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldAnimate = animateOnView ? isInView : true;

  return (
    <section className={containerClass} style={containerStyle} ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            )}
            {subtitle && (
              <p className="text-lg opacity-80">{subtitle}</p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={duration}
                  shouldAnimate={shouldAnimate}
                />
              </div>
              <div className="text-sm md:text-base opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
