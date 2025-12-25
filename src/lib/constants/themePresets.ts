/**
 * Theme Presets - Pre-built color schemes and typography settings
 */
import type { ThemePreset } from '@/types/website';

export const themePresets: ThemePreset[] = [
  // Light Themes
  {
    id: 'modern-light',
    name: 'Modern Light',
    description: 'Clean and contemporary with sky blue accents',
    category: 'light',
    theme: {
      mode: 'light',
      primaryColor: '#0ea5e9',
      secondaryColor: '#64748b',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#0ea5e9',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    description: 'Soft and inviting with warm tones',
    category: 'light',
    theme: {
      mode: 'light',
      primaryColor: '#d97706',
      secondaryColor: '#78716c',
      backgroundColor: '#fffbeb',
      textColor: '#44403c',
      accentColor: '#ea580c',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lato, sans-serif',
      headingSize: 'large',
      bodySize: 'medium',
    },
  },
  {
    id: 'fresh-mint',
    name: 'Fresh Mint',
    description: 'Refreshing green with natural feel',
    category: 'light',
    theme: {
      mode: 'light',
      primaryColor: '#10b981',
      secondaryColor: '#6b7280',
      backgroundColor: '#f0fdf4',
      textColor: '#1f2937',
      accentColor: '#059669',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },

  // Dark Themes
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Elegant dark theme with purple accents',
    category: 'dark',
    theme: {
      mode: 'dark',
      primaryColor: '#a855f7',
      secondaryColor: '#94a3b8',
      backgroundColor: '#0f172a',
      textColor: '#f1f5f9',
      accentColor: '#c084fc',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },
  {
    id: 'carbon',
    name: 'Carbon',
    description: 'Deep black with orange highlights',
    category: 'dark',
    theme: {
      mode: 'dark',
      primaryColor: '#f97316',
      secondaryColor: '#71717a',
      backgroundColor: '#09090b',
      textColor: '#fafafa',
      accentColor: '#fb923c',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Roboto, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },
  {
    id: 'ocean-night',
    name: 'Ocean Night',
    description: 'Deep blue with cyan accents',
    category: 'dark',
    theme: {
      mode: 'dark',
      primaryColor: '#06b6d4',
      secondaryColor: '#94a3b8',
      backgroundColor: '#0c1929',
      textColor: '#e2e8f0',
      accentColor: '#22d3ee',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Open Sans, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },

  // Colorful Themes
  {
    id: 'sunset-gradient',
    name: 'Sunset',
    description: 'Vibrant warm colors inspired by sunset',
    category: 'colorful',
    theme: {
      mode: 'light',
      primaryColor: '#f43f5e',
      secondaryColor: '#f97316',
      backgroundColor: '#fff7ed',
      textColor: '#1c1917',
      accentColor: '#ec4899',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Inter, sans-serif',
      headingSize: 'large',
      bodySize: 'medium',
    },
  },
  {
    id: 'neon-pop',
    name: 'Neon Pop',
    description: 'Bold and energetic with electric colors',
    category: 'colorful',
    theme: {
      mode: 'dark',
      primaryColor: '#22c55e',
      secondaryColor: '#f59e0b',
      backgroundColor: '#18181b',
      textColor: '#ffffff',
      accentColor: '#84cc16',
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Inter, sans-serif',
      headingSize: 'large',
      bodySize: 'medium',
    },
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    description: 'Soft pastels for a playful feel',
    category: 'colorful',
    theme: {
      mode: 'light',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#fdf4ff',
      textColor: '#4a044e',
      accentColor: '#d946ef',
    },
    fonts: {
      heading: 'Poppins, sans-serif',
      body: 'Lato, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },

  // Minimal Themes
  {
    id: 'pure-white',
    name: 'Pure White',
    description: 'Ultra-minimal with maximum contrast',
    category: 'minimal',
    theme: {
      mode: 'light',
      primaryColor: '#000000',
      secondaryColor: '#525252',
      backgroundColor: '#ffffff',
      textColor: '#171717',
      accentColor: '#000000',
    },
    fonts: {
      heading: '-apple-system, BlinkMacSystemFont, sans-serif',
      body: '-apple-system, BlinkMacSystemFont, sans-serif',
      headingSize: 'medium',
      bodySize: 'medium',
    },
  },
  {
    id: 'newsprint',
    name: 'Newsprint',
    description: 'Classic editorial typography',
    category: 'minimal',
    theme: {
      mode: 'light',
      primaryColor: '#1a1a1a',
      secondaryColor: '#737373',
      backgroundColor: '#fafaf9',
      textColor: '#1a1a1a',
      accentColor: '#404040',
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif',
      headingSize: 'large',
      bodySize: 'medium',
    },
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Sophisticated monochrome palette',
    category: 'minimal',
    theme: {
      mode: 'light',
      primaryColor: '#52525b',
      secondaryColor: '#a1a1aa',
      backgroundColor: '#f4f4f5',
      textColor: '#27272a',
      accentColor: '#3f3f46',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      headingSize: 'small',
      bodySize: 'small',
    },
  },
];

export const getThemePresetById = (id: string): ThemePreset | undefined => {
  return themePresets.find(preset => preset.id === id);
};

export const getThemePresetsByCategory = (category: ThemePreset['category']): ThemePreset[] => {
  return themePresets.filter(preset => preset.category === category);
};
