// Website block types
export type BlockType = 
  | 'hero'
  | 'about'
  | 'features'
  | 'gallery'
  | 'testimonials'
  | 'contact'
  | 'cta'
  | 'text'
  | 'image'
  | 'video'
  | 'spacer'
  | 'divider'
  | 'social-links'
  | 'skills'
  | 'experience'
  | 'projects';

export interface BlockContent {
  [key: string]: string | string[] | number | boolean | BlockContent | BlockContent[];
}

export interface WebsiteBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  order: number;
}

export interface BlockStyle {
  backgroundColor?: string;
  textColor?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
  width?: 'narrow' | 'medium' | 'wide' | 'full';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  shadow?: 'none' | 'small' | 'medium' | 'large';
  animation?: 'none' | 'fade' | 'slide' | 'scale';
}

export interface Website {
  id: string;
  name: string;
  slug: string;
  blocks: WebsiteBlock[];
  settings: WebsiteSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebsiteSettings {
  title: string;
  description: string;
  favicon?: string;
  theme: ThemeSettings;
  fonts: FontSettings;
  socialLinks: SocialLink[];
  seo: SEOSettings;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface FontSettings {
  heading: string;
  body: string;
  headingSize: 'small' | 'medium' | 'large';
  bodySize: 'small' | 'medium' | 'large';
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export type SocialPlatform = 
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'tiktok'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'website';

export interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
}
