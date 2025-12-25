import type { Template } from '@/types';
import { generateId } from '@/lib/utils';

export const templates: Template[] = [
  {
    id: 'minimal-portfolio',
    name: 'Minimal Portfolio',
    description: 'Clean and simple portfolio for creatives',
    thumbnail: '/templates/minimal.png',
    category: 'minimal',
    settings: {
      title: 'My Portfolio',
      description: 'A personal portfolio website',
      theme: {
        mode: 'light',
        primaryColor: '#000000',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        accentColor: '#0ea5e9',
      },
      fonts: {
        heading: '-apple-system, BlinkMacSystemFont, sans-serif',
        body: '-apple-system, BlinkMacSystemFont, sans-serif',
        headingSize: 'large',
        bodySize: 'medium',
      },
      socialLinks: [],
      seo: {},
    },
    blocks: [
      {
        id: generateId(),
        type: 'hero',
        order: 0,
        content: {
          headline: 'Hi, I\'m Alex',
          subheadline: 'Designer & Developer creating digital experiences',
          buttonText: 'View My Work',
          buttonLink: '#projects',
          showButton: true,
        },
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          padding: 'large',
          alignment: 'center',
          width: 'full',
        },
      },
      {
        id: generateId(),
        type: 'about',
        order: 1,
        content: {
          title: 'About',
          description: 'I\'m a designer and developer with 5+ years of experience creating digital products. I focus on clean design, smooth interactions, and solving real problems.',
          showImage: false,
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'narrow',
        },
      },
      {
        id: generateId(),
        type: 'projects',
        order: 2,
        content: {
          title: 'Selected Work',
          projects: [
            { title: 'Brand Redesign', description: 'Complete visual identity for tech startup', image: '', link: '#', tags: ['Branding', 'Design'] },
            { title: 'Mobile App', description: 'iOS app for fitness tracking', image: '', link: '#', tags: ['UI/UX', 'Mobile'] },
            { title: 'E-commerce Site', description: 'Full-stack online store', image: '', link: '#', tags: ['Development', 'Design'] },
          ],
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'wide',
        },
      },
      {
        id: generateId(),
        type: 'contact',
        order: 3,
        content: {
          title: 'Let\'s Talk',
          subtitle: 'Have a project in mind? Let\'s create something great together.',
          email: 'hello@example.com',
          buttonText: 'Send Message',
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'narrow',
        },
      },
    ],
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Bold and colorful design for artists',
    thumbnail: '/templates/creative.png',
    category: 'creative',
    settings: {
      title: 'Creative Portfolio',
      description: 'A bold creative portfolio',
      theme: {
        mode: 'dark',
        primaryColor: '#a855f7',
        secondaryColor: '#ec4899',
        backgroundColor: '#0a0a0a',
        textColor: '#ffffff',
        accentColor: '#a855f7',
      },
      fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Inter, sans-serif',
        headingSize: 'large',
        bodySize: 'medium',
      },
      socialLinks: [],
      seo: {},
    },
    blocks: [
      {
        id: generateId(),
        type: 'hero',
        order: 0,
        content: {
          headline: 'Creative Mind',
          subheadline: 'Turning ideas into visual stories',
          buttonText: 'Explore',
          buttonLink: '#gallery',
          showButton: true,
        },
        style: {
          backgroundColor: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          textColor: '#ffffff',
          padding: 'large',
          alignment: 'center',
          width: 'full',
        },
      },
      {
        id: generateId(),
        type: 'gallery',
        order: 1,
        content: {
          title: 'Gallery',
          images: [
            { src: '', alt: 'Art 1', caption: 'Abstract Dreams' },
            { src: '', alt: 'Art 2', caption: 'Color Theory' },
            { src: '', alt: 'Art 3', caption: 'Digital Art' },
            { src: '', alt: 'Art 4', caption: 'Illustrations' },
            { src: '', alt: 'Art 5', caption: 'Photography' },
            { src: '', alt: 'Art 6', caption: 'Mixed Media' },
          ],
          columns: 3,
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'wide',
          borderRadius: 'large',
        },
      },
      {
        id: generateId(),
        type: 'cta',
        order: 2,
        content: {
          headline: 'Let\'s Create Together',
          description: 'Available for commissions and collaborations',
          primaryButtonText: 'Get in Touch',
          primaryButtonLink: '#contact',
          showSecondaryButton: false,
        },
        style: {
          backgroundColor: '#a855f7',
          textColor: '#ffffff',
          padding: 'large',
          alignment: 'center',
          width: 'full',
        },
      },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean design for business professionals',
    thumbnail: '/templates/professional.png',
    category: 'business',
    settings: {
      title: 'Professional Portfolio',
      description: 'A professional business portfolio',
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
      socialLinks: [],
      seo: {},
    },
    blocks: [
      {
        id: generateId(),
        type: 'hero',
        order: 0,
        content: {
          headline: 'John Smith',
          subheadline: 'Business Consultant | Strategy Expert',
          buttonText: 'Schedule a Call',
          buttonLink: '#contact',
          showButton: true,
        },
        style: {
          backgroundColor: '#0ea5e9',
          textColor: '#ffffff',
          padding: 'large',
          alignment: 'center',
          width: 'full',
        },
      },
      {
        id: generateId(),
        type: 'features',
        order: 1,
        content: {
          title: 'Services',
          subtitle: 'How I can help your business grow',
          features: [
            { icon: 'TrendingUp', title: 'Growth Strategy', description: 'Data-driven strategies to scale your business' },
            { icon: 'Users', title: 'Team Building', description: 'Build high-performing teams that deliver' },
            { icon: 'Target', title: 'Market Analysis', description: 'Deep insights into your target market' },
          ],
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'wide',
        },
      },
      {
        id: generateId(),
        type: 'experience',
        order: 2,
        content: {
          title: 'Experience',
          items: [
            { year: '2020-Present', title: 'Senior Consultant', company: 'Fortune 500', description: 'Leading strategic initiatives' },
            { year: '2017-2020', title: 'Strategy Manager', company: 'Tech Corp', description: 'Drove 40% revenue growth' },
            { year: '2014-2017', title: 'Business Analyst', company: 'Consulting Firm', description: 'Client advisory services' },
          ],
        },
        style: {
          padding: 'large',
          alignment: 'left',
          width: 'medium',
        },
      },
      {
        id: generateId(),
        type: 'testimonials',
        order: 3,
        content: {
          title: 'Client Testimonials',
          testimonials: [
            { quote: 'John transformed our business strategy and helped us achieve record growth.', author: 'Sarah Johnson', role: 'CEO, TechStart', avatar: '' },
            { quote: 'Exceptional insights and professional approach. Highly recommended.', author: 'Michael Chen', role: 'Founder, GrowthCo', avatar: '' },
          ],
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'medium',
        },
      },
      {
        id: generateId(),
        type: 'contact',
        order: 4,
        content: {
          title: 'Let\'s Connect',
          subtitle: 'Ready to take your business to the next level?',
          email: 'john@example.com',
          buttonText: 'Get in Touch',
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'narrow',
        },
      },
    ],
  },
  {
    id: 'personal-blog',
    name: 'Personal Blog',
    description: 'Warm and inviting personal website',
    thumbnail: '/templates/blog.png',
    category: 'personal',
    settings: {
      title: 'Personal Blog',
      description: 'My personal corner of the internet',
      theme: {
        mode: 'light',
        primaryColor: '#f97316',
        secondaryColor: '#78716c',
        backgroundColor: '#fffbeb',
        textColor: '#292524',
        accentColor: '#f97316',
      },
      fonts: {
        heading: 'Playfair Display, serif',
        body: 'Lato, sans-serif',
        headingSize: 'large',
        bodySize: 'medium',
      },
      socialLinks: [],
      seo: {},
    },
    blocks: [
      {
        id: generateId(),
        type: 'hero',
        order: 0,
        content: {
          headline: 'Hello, I\'m Emma',
          subheadline: 'Writer, dreamer, and storyteller',
          buttonText: 'Read My Story',
          buttonLink: '#about',
          showButton: true,
        },
        style: {
          backgroundColor: '#fffbeb',
          textColor: '#292524',
          padding: 'large',
          alignment: 'center',
          width: 'full',
        },
      },
      {
        id: generateId(),
        type: 'about',
        order: 1,
        content: {
          title: 'My Story',
          description: 'I believe in the power of words to connect, inspire, and transform. Here, I share my thoughts on life, creativity, and the little moments that make it all worthwhile.',
          showImage: true,
        },
        style: {
          padding: 'large',
          alignment: 'center',
          width: 'narrow',
        },
      },
      {
        id: generateId(),
        type: 'social-links',
        order: 2,
        content: {
          title: 'Let\'s Connect',
          showLabels: true,
          links: [
            { platform: 'twitter', url: '' },
            { platform: 'instagram', url: '' },
            { platform: 'medium', url: '' },
          ],
        },
        style: {
          padding: 'large',
          alignment: 'center',
        },
      },
    ],
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Begin with a blank canvas',
    thumbnail: '/templates/blank.png',
    category: 'minimal',
    settings: {
      title: 'My Website',
      description: 'Welcome to my website',
      theme: {
        mode: 'light',
        primaryColor: '#0ea5e9',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        accentColor: '#0ea5e9',
      },
      fonts: {
        heading: '-apple-system, BlinkMacSystemFont, sans-serif',
        body: '-apple-system, BlinkMacSystemFont, sans-serif',
        headingSize: 'medium',
        bodySize: 'medium',
      },
      socialLinks: [],
      seo: {},
    },
    blocks: [],
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return templates.filter(t => t.category === category);
};
