'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';

interface SpacerBlockProps {
  block: WebsiteBlock;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = ({ block }) => {
  const { content } = block;
  const height = (content.height as number) || 64;

  return <div style={{ height: `${height}px` }} />;
};
