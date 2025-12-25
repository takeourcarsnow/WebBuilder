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
  FAQBlock,
  PricingBlock,
  StatsBlock,
  MapBlock,
  BlogBlock,
  CodeBlock,
  NavigationBlock,
  FooterBlock,
} from './blocks';
import { TeamBlock } from './blocks/TeamBlock';
import { LogoCloudBlock } from './blocks/LogoCloudBlock';
import { NewsletterBlock } from './blocks/NewsletterBlock';
import { CountdownBlock } from './blocks/CountdownBlock';
import { TabsBlock } from './blocks/TabsBlock';
import { BeforeAfterBlock } from './blocks/BeforeAfterBlock';
import { CarouselBlock } from './blocks/CarouselBlock';
import { PopupBlock } from './blocks/PopupBlock';
import { AnnouncementBarBlock } from './blocks/AnnouncementBarBlock';
import { ReviewsBlock } from './blocks/ReviewsBlock';

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
    case 'faq':
      return <FAQBlock block={block} />;
    case 'pricing':
      return <PricingBlock block={block} />;
    case 'stats':
      return <StatsBlock block={block} />;
    case 'map':
      return <MapBlock block={block} />;
    case 'blog':
      return <BlogBlock block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'navigation':
      return <NavigationBlock block={block} />;
    case 'footer':
      return <FooterBlock block={block} />;
    // New block types
    case 'team':
      return <TeamBlock content={block.content as any} style={block.style} isPreview />;
    case 'logo-cloud':
      return <LogoCloudBlock content={block.content as any} style={block.style} isPreview />;
    case 'newsletter':
      return <NewsletterBlock content={block.content as any} style={block.style} isPreview />;
    case 'countdown':
      return <CountdownBlock content={block.content as any} style={block.style} isPreview />;
    case 'tabs':
      return <TabsBlock content={block.content as any} style={block.style} isPreview />;
    case 'before-after':
      return <BeforeAfterBlock content={block.content as any} style={block.style} isPreview />;
    case 'carousel':
      return <CarouselBlock content={block.content as any} style={block.style} isPreview />;
    case 'popup':
      return <PopupBlock content={block.content as any} style={block.style} isPreview />;
    case 'announcement-bar':
      return <AnnouncementBarBlock content={block.content as any} style={block.style} isPreview />;
    case 'reviews':
      return <ReviewsBlock content={block.content as any} style={block.style} isPreview />;
    default:
      return (
        <div className="p-8 text-center text-gray-500">
          Unknown block type: {block.type}
        </div>
      );
  }
};
