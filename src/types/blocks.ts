// Type-safe block content definitions using discriminated unions

export interface HeroContent {
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
  showButton: boolean;
}

export interface AboutContent {
  title: string;
  description: string;
  image: string;
  showImage: boolean;
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface GalleryContent {
  title: string;
  images: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  columns: number;
}

export interface TestimonialsContent {
  title: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar: string;
  }>;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  showPhone: boolean;
  phone: string;
  showAddress: boolean;
  address: string;
  buttonText: string;
}

export interface CTAContent {
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  showSecondaryButton: boolean;
}

export interface TextContent {
  heading: string;
  body: string;
  showHeading: boolean;
}

export interface ImageContent {
  src: string;
  alt: string;
  caption: string;
  showCaption: boolean;
  linkUrl: string;
}

export interface VideoContent {
  url: string;
  title: string;
  autoplay: boolean;
}

export interface SpacerContent {
  height: number;
}

export interface DividerContent {
  style: 'solid' | 'dashed' | 'dotted';
  thickness: number;
}

export interface SocialLinksContent {
  title: string;
  showLabels: boolean;
  links: Array<{
    platform: string;
    url: string;
  }>;
}

export interface SkillsContent {
  title: string;
  skills: Array<{
    name: string;
    level: number;
  }>;
  showPercentage: boolean;
}

export interface ExperienceContent {
  title: string;
  items: Array<{
    year: string;
    title: string;
    company: string;
    description: string;
  }>;
}

export interface ProjectsContent {
  title: string;
  projects: Array<{
    title: string;
    description: string;
    image: string;
    link: string;
    tags: string[];
  }>;
}

// Content type map for type-safe access
export interface BlockContentMap {
  hero: HeroContent;
  about: AboutContent;
  features: FeaturesContent;
  gallery: GalleryContent;
  testimonials: TestimonialsContent;
  contact: ContactContent;
  cta: CTAContent;
  text: TextContent;
  image: ImageContent;
  video: VideoContent;
  spacer: SpacerContent;
  divider: DividerContent;
  'social-links': SocialLinksContent;
  skills: SkillsContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
}

// Type-safe block with content
export type TypedWebsiteBlock<T extends keyof BlockContentMap = keyof BlockContentMap> = {
  id: string;
  type: T;
  content: BlockContentMap[T];
  style: import('./website').BlockStyle;
  order: number;
};

// Helper type guard
export function isBlockType<T extends keyof BlockContentMap>(
  block: { type: string; content: unknown },
  type: T
): block is { type: T; content: BlockContentMap[T] } {
  return block.type === type;
}

// Get typed content from a block
export function getTypedContent<T extends keyof BlockContentMap>(
  block: { type: T; content: unknown }
): BlockContentMap[T] {
  return block.content as BlockContentMap[T];
}
