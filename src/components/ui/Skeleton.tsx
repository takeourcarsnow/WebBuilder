'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-ios-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

// Block skeleton components
export const HeroBlockSkeleton: React.FC = () => (
  <div className="flex flex-col items-center space-y-4 p-16">
    <Skeleton variant="text" className="h-12 w-3/4" />
    <Skeleton variant="text" className="h-6 w-1/2" />
    <Skeleton variant="rounded" className="mt-4 h-12 w-40" />
  </div>
);

export const TextBlockSkeleton: React.FC = () => (
  <div className="space-y-3 p-8">
    <Skeleton variant="text" className="h-8 w-1/3" />
    <Skeleton variant="text" className="h-4 w-full" />
    <Skeleton variant="text" className="h-4 w-full" />
    <Skeleton variant="text" className="h-4 w-2/3" />
  </div>
);

export const ImageBlockSkeleton: React.FC = () => (
  <div className="p-8">
    <Skeleton variant="rounded" className="h-64 w-full" />
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="rounded-ios-lg border border-gray-200 p-4 dark:border-gray-700">
    <Skeleton variant="rounded" className="mb-4 h-40 w-full" />
    <Skeleton variant="text" className="mb-2 h-6 w-3/4" />
    <Skeleton variant="text" className="h-4 w-full" />
    <Skeleton variant="text" className="h-4 w-2/3" />
  </div>
);

export const BlockPanelSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <Skeleton variant="text" className="h-6 w-1/2" />
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" className="h-20 w-full" />
      ))}
    </div>
  </div>
);
