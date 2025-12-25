'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';
import {
  HeroBlock,
  AboutBlock,
  FeaturesBlock,
  CTABlock,
  ContactBlock,
  TextBlock,
  SpacerBlock,
  DividerBlock,
  ProjectsBlock,
  SkillsBlock,
  ExperienceBlock,
  TestimonialsBlock,
  SocialLinksBlock,
  GalleryBlock,
} from './blocks';

interface BlockRendererProps {
  block: WebsiteBlock;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} />;
    case 'about':
      return <AboutBlock block={block} />;
    case 'features':
      return <FeaturesBlock block={block} />;
    case 'cta':
      return <CTABlock block={block} />;
    case 'contact':
      return <ContactBlock block={block} />;
    case 'text':
      return <TextBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
    case 'divider':
      return <DividerBlock block={block} />;
    case 'projects':
      return <ProjectsBlock block={block} />;
    case 'skills':
      return <SkillsBlock block={block} />;
    case 'experience':
      return <ExperienceBlock block={block} />;
    case 'testimonials':
      return <TestimonialsBlock block={block} />;
    case 'social-links':
      return <SocialLinksBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} />;
    default:
      return (
        <div className="p-8 text-center text-gray-500">
          Unknown block type: {block.type}
        </div>
      );
  }
};
