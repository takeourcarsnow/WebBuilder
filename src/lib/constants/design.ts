// Color palette for the builder
export const colors = {
  presets: [
    { name: 'Sky Blue', value: '#0ea5e9' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Slate', value: '#64748b' },
    { name: 'Zinc', value: '#71717a' },
  ],
  backgrounds: {
    light: [
      { name: 'White', value: '#ffffff' },
      { name: 'Snow', value: '#fafafa' },
      { name: 'Pearl', value: '#f5f5f4' },
      { name: 'Cream', value: '#fffbeb' },
      { name: 'Ice', value: '#f0f9ff' },
      { name: 'Mist', value: '#f0fdf4' },
    ],
    dark: [
      { name: 'Black', value: '#000000' },
      { name: 'Night', value: '#0a0a0a' },
      { name: 'Charcoal', value: '#18181b' },
      { name: 'Slate', value: '#1e293b' },
      { name: 'Navy', value: '#0f172a' },
      { name: 'Deep', value: '#1c1c1e' },
    ],
  },
};

// Font options
export const fonts = {
  heading: [
    { name: 'System (SF Pro)', value: '-apple-system, BlinkMacSystemFont, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Lora', value: 'Lora, serif' },
  ],
  body: [
    { name: 'System (SF Pro)', value: '-apple-system, BlinkMacSystemFont, sans-serif' },
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
  ],
};

// Spacing options
export const spacing = {
  padding: {
    none: '0',
    small: '1rem',
    medium: '2rem',
    large: '4rem',
  },
  gap: {
    none: '0',
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
};

// Animation options
export const animations = {
  none: '',
  fade: 'animate-fade-in',
  slide: 'animate-slide-up',
  scale: 'animate-scale-in',
};

// Border radius options
export const borderRadius = {
  none: '0',
  small: '0.375rem',
  medium: '0.75rem',
  large: '1rem',
  full: '9999px',
};

// Shadow options
export const shadows = {
  none: 'none',
  small: '0 1px 3px rgba(0,0,0,0.12)',
  medium: '0 4px 6px rgba(0,0,0,0.1)',
  large: '0 10px 25px rgba(0,0,0,0.15)',
};

// ============================================
// Centralized Block Style Classes
// ============================================

export const BLOCK_STYLE_CLASSES = {
  padding: {
    none: 'py-0',
    small: 'py-8 sm:py-12',
    medium: 'py-12 sm:py-16 md:py-20',
    large: 'py-16 sm:py-24 md:py-32',
  },
  alignment: {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  },
  width: {
    narrow: 'max-w-2xl mx-auto px-4 sm:px-6',
    medium: 'max-w-4xl mx-auto px-4 sm:px-6',
    wide: 'max-w-6xl mx-auto px-4 sm:px-6',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  },
  borderRadius: {
    none: 'rounded-none',
    small: 'rounded',
    medium: 'rounded-ios-lg',
    large: 'rounded-ios-xl',
  },
  shadow: {
    none: 'shadow-none',
    small: 'shadow-sm',
    medium: 'shadow-ios',
    large: 'shadow-ios-lg',
  },
  animation: {
    none: '',
    fade: 'animate-fade-in',
    slide: 'animate-slide-up',
    scale: 'animate-scale-in',
  },
} as const;

// Device preview dimensions
export const DEVICE_DIMENSIONS = {
  desktop: { width: '100%', maxWidth: '1280px' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' },
  'mobile-landscape': { width: '667px', maxWidth: '667px' },
} as const;

// Z-index scale for consistent layering
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
} as const;

// Transition presets
export const TRANSITIONS = {
  fast: 'transition-all duration-150 ease-out',
  normal: 'transition-all duration-200 ease-out',
  slow: 'transition-all duration-300 ease-out',
  spring: 'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
} as const;
