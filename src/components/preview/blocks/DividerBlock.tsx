'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';

interface DividerBlockProps {
  block: WebsiteBlock;
}

export const DividerBlock: React.FC<DividerBlockProps> = ({ block }) => {
  const { content, style } = block;

  const paddingClass = {
    none: 'py-0',
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12',
  }[style.padding || 'small'];

  const widthClass = {
    narrow: 'max-w-md',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'max-w-full',
  }[style.width || 'medium'];

  return (
    <div className={cn('w-full', paddingClass)}>
      <div className={cn('mx-auto px-6', widthClass)}>
        <hr
          className="border-gray-200 dark:border-gray-800"
          style={{
            borderStyle: (content.style as string) || 'solid',
            borderWidth: `${(content.thickness as number) || 1}px 0 0 0`,
          }}
        />
      </div>
    </div>
  );
};
