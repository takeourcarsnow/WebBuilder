/**
 * Block Presets - Pre-configured block variations for quick insertion
 */
import type { BlockType, BlockContent, BlockStyle } from '@/types';

export interface BlockPreset {
  id: string;
  name: string;
  description: string;
  type: BlockType;
  content: BlockContent;
  style: BlockStyle;
  thumbnail?: string;
  category: 'professional' | 'creative' | 'minimal' | 'bold';
}

export const blockPresets: BlockPreset[] = [
  // Hero Presets
  {
    id: 'hero-gradient',
    name: 'Gradient Hero',
    description: 'Hero with gradient background',
    type: 'hero',
    category: 'creative',
    content: {
      headline: 'Build Something Amazing',
      subheadline: 'Transform your ideas into reality with our cutting-edge solutions',
      buttonText: 'Get Started',
      buttonLink: '#contact',
      showButton: true,
    },
    style: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },
  {
    id: 'hero-minimal',
    name: 'Minimal Hero',
    description: 'Clean and simple hero section',
    type: 'hero',
    category: 'minimal',
    content: {
      headline: 'Hello, I\'m a Designer',
      subheadline: 'Creating beautiful digital experiences',
      buttonText: 'View Work',
      buttonLink: '#projects',
      showButton: true,
    },
    style: {
      backgroundColor: '#fafafa',
      textColor: '#1a1a1a',
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    id: 'hero-dark',
    name: 'Dark Hero',
    description: 'Bold dark themed hero',
    type: 'hero',
    category: 'bold',
    content: {
      headline: 'Innovation Starts Here',
      subheadline: 'Pushing boundaries and creating tomorrow\'s solutions today',
      buttonText: 'Explore',
      buttonLink: '#features',
      showButton: true,
    },
    style: {
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },

  // CTA Presets
  {
    id: 'cta-vibrant',
    name: 'Vibrant CTA',
    description: 'Eye-catching call to action',
    type: 'cta',
    category: 'bold',
    content: {
      headline: 'Ready to Transform Your Business?',
      description: 'Join thousands of satisfied customers who have taken their business to the next level.',
      primaryButtonText: 'Start Free Trial',
      primaryButtonLink: '#signup',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '#about',
      showSecondaryButton: true,
    },
    style: {
      backgroundColor: '#f97316',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },
  {
    id: 'cta-subtle',
    name: 'Subtle CTA',
    description: 'Professional call to action',
    type: 'cta',
    category: 'professional',
    content: {
      headline: 'Let\'s Work Together',
      description: 'I\'m always open to discussing new projects and opportunities.',
      primaryButtonText: 'Contact Me',
      primaryButtonLink: '#contact',
      showSecondaryButton: false,
    },
    style: {
      backgroundColor: '#f1f5f9',
      textColor: '#334155',
      padding: 'large',
      alignment: 'center',
      width: 'medium',
    },
  },

  // Features Presets
  {
    id: 'features-cards',
    name: 'Feature Cards',
    description: 'Services displayed as cards',
    type: 'features',
    category: 'professional',
    content: {
      title: 'Our Services',
      subtitle: 'Everything you need to succeed',
      features: [
        { icon: 'Palette', title: 'UI/UX Design', description: 'Beautiful, intuitive interfaces that users love' },
        { icon: 'Code', title: 'Web Development', description: 'Fast, secure, and scalable web applications' },
        { icon: 'Smartphone', title: 'Mobile Apps', description: 'Native and cross-platform mobile solutions' },
        { icon: 'LineChart', title: 'Analytics', description: 'Data-driven insights for better decisions' },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
  {
    id: 'features-icons',
    name: 'Icon Features',
    description: 'Minimal feature list with icons',
    type: 'features',
    category: 'minimal',
    content: {
      title: 'What I Do',
      subtitle: '',
      features: [
        { icon: 'Lightbulb', title: 'Strategy', description: 'Smart solutions for complex problems' },
        { icon: 'Brush', title: 'Design', description: 'Visual experiences that inspire' },
        { icon: 'Rocket', title: 'Launch', description: 'From concept to reality, fast' },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'medium',
    },
  },

  // Skills Presets
  {
    id: 'skills-technical',
    name: 'Technical Skills',
    description: 'Programming and technical skills',
    type: 'skills',
    category: 'professional',
    content: {
      title: 'Technical Skills',
      skills: [
        { name: 'React / Next.js', level: 95 },
        { name: 'TypeScript', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'AWS / Cloud', level: 75 },
      ],
      showPercentage: true,
    },
    style: {
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    id: 'skills-design',
    name: 'Design Skills',
    description: 'Creative and design skills',
    type: 'skills',
    category: 'creative',
    content: {
      title: 'Design Expertise',
      skills: [
        { name: 'UI Design', level: 95 },
        { name: 'UX Research', level: 88 },
        { name: 'Prototyping', level: 92 },
        { name: 'Illustration', level: 75 },
        { name: 'Motion Design', level: 70 },
      ],
      showPercentage: true,
    },
    style: {
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },

  // About Presets
  {
    id: 'about-personal',
    name: 'Personal About',
    description: 'Personal introduction section',
    type: 'about',
    category: 'creative',
    content: {
      title: 'About Me',
      description: 'Hi there! I\'m a passionate designer and developer with over 5 years of experience creating digital products. I believe in clean code, thoughtful design, and continuous learning. When I\'m not coding, you\'ll find me exploring new technologies or enjoying the outdoors.',
      image: '',
      showImage: true,
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'medium',
    },
  },
  {
    id: 'about-professional',
    name: 'Professional About',
    description: 'Business-focused about section',
    type: 'about',
    category: 'professional',
    content: {
      title: 'Who We Are',
      description: 'We are a team of dedicated professionals committed to delivering exceptional results. With decades of combined experience, we bring expertise, creativity, and a client-first approach to every project we undertake.',
      image: '',
      showImage: false,
    },
    style: {
      padding: 'large',
      alignment: 'left',
      width: 'wide',
    },
  },

  // Contact Presets
  {
    id: 'contact-simple',
    name: 'Simple Contact',
    description: 'Basic contact form',
    type: 'contact',
    category: 'minimal',
    content: {
      title: 'Get In Touch',
      subtitle: 'Have a question? Drop me a message.',
      email: '',
      showPhone: false,
      showAddress: false,
      buttonText: 'Send',
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'narrow',
    },
  },
  {
    id: 'contact-detailed',
    name: 'Detailed Contact',
    description: 'Full contact information',
    type: 'contact',
    category: 'professional',
    content: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you. Fill out the form below or reach out directly.',
      email: 'hello@example.com',
      showPhone: true,
      phone: '+1 (555) 123-4567',
      showAddress: true,
      address: '123 Main Street, City, State 12345',
      buttonText: 'Send Message',
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'medium',
    },
  },

  // Testimonials Presets
  {
    id: 'testimonials-cards',
    name: 'Testimonial Cards',
    description: 'Client testimonials in cards',
    type: 'testimonials',
    category: 'professional',
    content: {
      title: 'What Our Clients Say',
      testimonials: [
        { quote: 'Exceptional work quality and professionalism. Delivered beyond our expectations.', author: 'Sarah Johnson', role: 'CEO, TechStart', avatar: '' },
        { quote: 'A true pleasure to work with. Creative, responsive, and detail-oriented.', author: 'Michael Chen', role: 'Product Manager, InnovateCo', avatar: '' },
        { quote: 'Transformed our vision into reality. Highly recommended!', author: 'Emily Davis', role: 'Founder, CreativeHub', avatar: '' },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },

  // Projects Presets
  {
    id: 'projects-portfolio',
    name: 'Portfolio Grid',
    description: 'Project showcase grid',
    type: 'projects',
    category: 'creative',
    content: {
      title: 'Featured Work',
      projects: [
        { title: 'E-Commerce Platform', description: 'Modern online shopping experience', image: '', link: '', tags: ['React', 'Node.js', 'MongoDB'] },
        { title: 'Mobile Banking App', description: 'Secure and intuitive banking', image: '', link: '', tags: ['React Native', 'TypeScript'] },
        { title: 'SaaS Dashboard', description: 'Analytics and reporting tool', image: '', link: '', tags: ['Next.js', 'D3.js', 'PostgreSQL'] },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },

  // Text Presets
  {
    id: 'text-quote',
    name: 'Quote Block',
    description: 'Inspirational quote',
    type: 'text',
    category: 'creative',
    content: {
      heading: '',
      body: '"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs',
      showHeading: false,
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'medium',
      backgroundColor: '#f8fafc',
    },
  },
  {
    id: 'text-section',
    name: 'Content Section',
    description: 'Text section with heading',
    type: 'text',
    category: 'professional',
    content: {
      heading: 'Our Philosophy',
      body: 'We believe that great design goes beyond aesthetics. It\'s about solving problems, creating meaningful experiences, and making a positive impact. Every project we take on is an opportunity to push boundaries and deliver excellence.',
      showHeading: true,
    },
    style: {
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
];

export const getPresetsByType = (type: BlockType): BlockPreset[] => {
  return blockPresets.filter(preset => preset.type === type);
};

export const getPresetsByCategory = (category: BlockPreset['category']): BlockPreset[] => {
  return blockPresets.filter(preset => preset.category === category);
};

export const getPresetById = (id: string): BlockPreset | undefined => {
  return blockPresets.find(preset => preset.id === id);
};
