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
  | 'projects'
  // New block types
  | 'code'
  | 'navigation'
  | 'footer'
  | 'faq'
  | 'pricing'
  | 'stats'
  | 'map'
  | 'blog'
  // Additional new block types
  | 'team'
  | 'logo-cloud'
  | 'newsletter'
  | 'countdown'
  | 'tabs'
  | 'before-after'
  | 'carousel'
  | 'popup'
  | 'announcement-bar'
  | 'reviews';

export interface BlockContent {
  [key: string]: string | string[] | number | boolean | BlockContent | BlockContent[];
}

// Animation configuration
export interface AnimationConfig {
  type: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'rotate' | 'bounce';
  duration: number; // in ms
  delay: number; // in ms
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  triggerOnce: boolean;
}

// Responsive style overrides
export interface ResponsiveStyles {
  mobile?: Partial<BlockStyle>;
  tablet?: Partial<BlockStyle>;
}

export interface WebsiteBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  order: number;
  // New properties
  isLocked?: boolean;
  isVisible?: boolean;
  comment?: string;
  groupId?: string;
  animation?: AnimationConfig;
  responsiveStyles?: ResponsiveStyles;
  customCSS?: string;
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

// Block group for organizing blocks
export interface BlockGroup {
  id: string;
  name: string;
  isCollapsed: boolean;
  order: number;
}

// Style Preset System
export interface StylePreset {
  id: string;
  name: string;
  style: BlockStyle;
  animation?: AnimationConfig;
  category: 'user' | 'system';
  createdAt: Date;
}

// Theme Preset System
export type ThemePresetCategory = 'light' | 'dark' | 'colorful' | 'minimal';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: ThemeSettings;
  fonts: FontSettings;
  category: ThemePresetCategory;
  thumbnail?: string;
}

export interface Website {
  id: string;
  name: string;
  slug: string;
  blocks: WebsiteBlock[];
  groups?: BlockGroup[];
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
