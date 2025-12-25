'use client';

import React, { lazy, Suspense, memo, ComponentType } from 'react';
import type { WebsiteBlock, BlockType } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { BlockErrorBoundary } from '@/components/ui/ErrorBoundary';

// Lazy load all block components for code splitting
const HeroBlock = lazy(() => import('./blocks/HeroBlock').then(m => ({ default: m.HeroBlock })));
const AboutBlock = lazy(() => import('./blocks/AboutBlock').then(m => ({ default: m.AboutBlock })));
const FeaturesBlock = lazy(() => import('./blocks/FeaturesBlock').then(m => ({ default: m.FeaturesBlock })));
const CTABlock = lazy(() => import('./blocks/CTABlock').then(m => ({ default: m.CTABlock })));
const ContactBlock = lazy(() => import('./blocks/ContactBlock').then(m => ({ default: m.ContactBlock })));
const TextBlock = lazy(() => import('./blocks/TextBlock').then(m => ({ default: m.TextBlock })));
const SpacerBlock = lazy(() => import('./blocks/SpacerBlock').then(m => ({ default: m.SpacerBlock })));
const DividerBlock = lazy(() => import('./blocks/DividerBlock').then(m => ({ default: m.DividerBlock })));
const ProjectsBlock = lazy(() => import('./blocks/ProjectsBlock').then(m => ({ default: m.ProjectsBlock })));
const SkillsBlock = lazy(() => import('./blocks/SkillsBlock').then(m => ({ default: m.SkillsBlock })));
const ExperienceBlock = lazy(() => import('./blocks/ExperienceBlock').then(m => ({ default: m.ExperienceBlock })));
const TestimonialsBlock = lazy(() => import('./blocks/TestimonialsBlock').then(m => ({ default: m.TestimonialsBlock })));
const SocialLinksBlock = lazy(() => import('./blocks/SocialLinksBlock').then(m => ({ default: m.SocialLinksBlock })));
const GalleryBlock = lazy(() => import('./blocks/GalleryBlock').then(m => ({ default: m.GalleryBlock })));

// Block component type
type BlockComponent = ComponentType<{ block: WebsiteBlock }>;

// Block registry using Map for O(1) lookups
const blockRegistry = new Map<BlockType, BlockComponent>([
  ['hero', HeroBlock],
  ['about', AboutBlock],
  ['features', FeaturesBlock],
  ['cta', CTABlock],
  ['contact', ContactBlock],
  ['text', TextBlock],
  ['spacer', SpacerBlock],
  ['divider', DividerBlock],
  ['projects', ProjectsBlock],
  ['skills', SkillsBlock],
  ['experience', ExperienceBlock],
  ['testimonials', TestimonialsBlock],
  ['social-links', SocialLinksBlock],
  ['gallery', GalleryBlock],
]);

// Get a block component from the registry
export function getBlockComponent(type: BlockType): BlockComponent | undefined {
  return blockRegistry.get(type);
}

// Register a new block component (for extensibility)
export function registerBlock(type: BlockType, component: BlockComponent): void {
  blockRegistry.set(type, component);
}

// Check if a block type is registered
export function isBlockRegistered(type: BlockType): boolean {
  return blockRegistry.has(type);
}

// Get all registered block types
export function getRegisteredBlockTypes(): BlockType[] {
  return Array.from(blockRegistry.keys());
}

// Loading fallback for suspense
const BlockLoadingFallback: React.FC = () => (
  <div className="flex min-h-[100px] items-center justify-center p-8">
    <Skeleton variant="rounded" className="h-24 w-full" animation="pulse" />
  </div>
);

// Unknown block fallback
const UnknownBlock: React.FC<{ type: string }> = ({ type }) => (
  <div className="p-8 text-center text-gray-500">
    Unknown block type: {type}
  </div>
);

interface BlockRendererProps {
  block: WebsiteBlock;
}

// Memoized block renderer component
export const BlockRenderer: React.FC<BlockRendererProps> = memo(({ block }) => {
  const BlockComponent = blockRegistry.get(block.type);

  if (!BlockComponent) {
    return <UnknownBlock type={block.type} />;
  }

  return (
    <BlockErrorBoundary blockType={block.type}>
      <Suspense fallback={<BlockLoadingFallback />}>
        <BlockComponent block={block} />
      </Suspense>
    </BlockErrorBoundary>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if block data actually changed
  return (
    prevProps.block.id === nextProps.block.id &&
    prevProps.block.type === nextProps.block.type &&
    JSON.stringify(prevProps.block.content) === JSON.stringify(nextProps.block.content) &&
    JSON.stringify(prevProps.block.style) === JSON.stringify(nextProps.block.style)
  );
});

BlockRenderer.displayName = 'BlockRenderer';
