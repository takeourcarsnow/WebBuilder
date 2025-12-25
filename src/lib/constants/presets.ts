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
    id: 'hero-gradient-violet',
    name: 'Violet Gradient Hero',
    description: 'Vibrant violet to pink gradient',
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
      backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },
  {
    id: 'hero-gradient-ocean',
    name: 'Ocean Gradient Hero',
    description: 'Cool blue to teal gradient',
    type: 'hero',
    category: 'creative',
    content: {
      headline: 'Dive Into Innovation',
      subheadline: 'Experience the future of digital solutions today',
      buttonText: 'Explore Now',
      buttonLink: '#features',
      showButton: true,
    },
    style: {
      backgroundColor: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },
  {
    id: 'hero-gradient-sunset',
    name: 'Sunset Gradient Hero',
    description: 'Warm orange to pink gradient',
    type: 'hero',
    category: 'bold',
    content: {
      headline: 'Create Without Limits',
      subheadline: 'Where creativity meets innovation',
      buttonText: 'Start Creating',
      buttonLink: '#start',
      showButton: true,
    },
    style: {
      backgroundColor: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
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
      backgroundColor: '#ffffff',
      textColor: '#1a1a1a',
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    id: 'hero-dark-modern',
    name: 'Dark Modern Hero',
    description: 'Sleek dark themed hero',
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
  {
    id: 'hero-glass',
    name: 'Glassmorphism Hero',
    description: 'Modern glass effect hero',
    type: 'hero',
    category: 'creative',
    content: {
      headline: 'The Future is Clear',
      subheadline: 'Modern, transparent, and beautiful design',
      buttonText: 'See More',
      buttonLink: '#about',
      showButton: true,
    },
    style: {
      backgroundColor: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },

  // CTA Presets
  {
    id: 'cta-gradient-vibrant',
    name: 'Vibrant Gradient CTA',
    description: 'Eye-catching gradient call to action',
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
      backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },
  {
    id: 'cta-orange',
    name: 'Orange CTA',
    description: 'Bold orange call to action',
    type: 'cta',
    category: 'bold',
    content: {
      headline: 'Don\'t Wait, Start Now',
      description: 'Every great journey begins with a single step.',
      primaryButtonText: 'Get Started',
      primaryButtonLink: '#signup',
      secondaryButtonText: 'Watch Demo',
      secondaryButtonLink: '#demo',
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
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      padding: 'large',
      alignment: 'center',
      width: 'medium',
    },
  },
  {
    id: 'cta-dark',
    name: 'Dark CTA',
    description: 'Sleek dark call to action',
    type: 'cta',
    category: 'professional',
    content: {
      headline: 'Ready to Get Started?',
      description: 'Join the thousands of creators already building amazing things.',
      primaryButtonText: 'Start Building',
      primaryButtonLink: '#signup',
      showSecondaryButton: false,
    },
    style: {
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },

  // Features Presets
  {
    id: 'features-gradient-cards',
    name: 'Gradient Icon Cards',
    description: 'Feature cards with gradient icons',
    type: 'features',
    category: 'creative',
    content: {
      title: 'Everything You Need',
      subtitle: 'Powerful features to help you succeed',
      features: [
        { icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed and performance' },
        { icon: 'Shield', title: 'Secure', description: 'Enterprise-grade security built in' },
        { icon: 'Globe', title: 'Global Scale', description: 'Deploy worldwide instantly' },
        { icon: 'Sparkles', title: 'AI Powered', description: 'Smart automation at your fingertips' },
        { icon: 'Users', title: 'Team Ready', description: 'Collaborate seamlessly' },
        { icon: 'Code', title: 'Developer First', description: 'APIs and webhooks included' },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
  {
    id: 'features-services',
    name: 'Services Cards',
    description: 'Services displayed as cards',
    type: 'features',
    category: 'professional',
    content: {
      title: 'Our Services',
      subtitle: 'How we can help you grow',
      features: [
        { icon: 'Palette', title: 'UI/UX Design', description: 'Beautiful, intuitive interfaces that users love' },
        { icon: 'Code', title: 'Web Development', description: 'Fast, secure, and scalable web applications' },
        { icon: 'Smartphone', title: 'Mobile Apps', description: 'Native and cross-platform mobile solutions' },
        { icon: 'TrendingUp', title: 'Growth Strategy', description: 'Data-driven growth optimization' },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
  {
    id: 'features-minimal',
    name: 'Minimal Features',
    description: 'Clean feature list with icons',
    type: 'features',
    category: 'minimal',
    content: {
      title: 'What I Do',
      subtitle: '',
      features: [
        { icon: 'Target', title: 'Strategy', description: 'Smart solutions for complex problems' },
        { icon: 'Palette', title: 'Design', description: 'Visual experiences that inspire' },
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
    id: 'about-company',
    name: 'Company About',
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
  {
    id: 'contact-dark',
    name: 'Dark Contact',
    description: 'Contact with dark background',
    type: 'contact',
    category: 'bold',
    content: {
      title: 'Start a Conversation',
      subtitle: 'Let\'s discuss your next big project.',
      email: 'hello@example.com',
      showPhone: false,
      showAddress: false,
      buttonText: 'Send Message',
    },
    style: {
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
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
  {
    id: 'testimonials-minimal',
    name: 'Minimal Testimonials',
    description: 'Simple testimonial display',
    type: 'testimonials',
    category: 'minimal',
    content: {
      title: 'Kind Words',
      testimonials: [
        { quote: 'Working with them was a game changer for our business.', author: 'Alex Rivera', role: 'Founder', avatar: '' },
        { quote: 'Simply outstanding. Will definitely work together again.', author: 'Jordan Lee', role: 'Creative Director', avatar: '' },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'medium',
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
  {
    id: 'projects-case-studies',
    name: 'Case Studies',
    description: 'Detailed project case studies',
    type: 'projects',
    category: 'professional',
    content: {
      title: 'Case Studies',
      projects: [
        { title: 'Brand Transformation', description: 'Complete rebrand for a Fortune 500 company', image: '', link: '', tags: ['Branding', 'Strategy'] },
        { title: 'Digital Experience', description: 'Award-winning web experience', image: '', link: '', tags: ['Web', 'UX'] },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'left',
      width: 'wide',
    },
  },

  // Stats Presets
  {
    id: 'stats-animated',
    name: 'Animated Stats',
    description: 'Counter animation stats',
    type: 'stats',
    category: 'bold',
    content: {
      title: 'By the Numbers',
      subtitle: 'Our impact in numbers',
      stats: [
        { value: 500, suffix: '+', label: 'Happy Clients' },
        { value: 1200, suffix: '+', label: 'Projects Completed' },
        { value: 99, suffix: '%', label: 'Satisfaction Rate' },
        { value: 24, suffix: '/7', label: 'Support' },
      ],
      animateOnView: true,
      duration: 2000,
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
  {
    id: 'stats-gradient',
    name: 'Gradient Stats',
    description: 'Stats with gradient background',
    type: 'stats',
    category: 'creative',
    content: {
      title: '',
      subtitle: '',
      stats: [
        { value: 10, suffix: 'K+', label: 'Users' },
        { value: 50, suffix: '+', label: 'Countries' },
        { value: 99, suffix: '%', label: 'Uptime' },
        { value: 5, suffix: '★', label: 'Rating' },
      ],
      animateOnView: true,
      duration: 2000,
    },
    style: {
      backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },

  // Pricing Presets
  {
    id: 'pricing-simple',
    name: 'Simple Pricing',
    description: 'Clean pricing table',
    type: 'pricing',
    category: 'minimal',
    content: {
      title: 'Simple Pricing',
      subtitle: 'No hidden fees, no surprises',
      plans: [
        {
          name: 'Starter',
          price: '$9',
          period: '/month',
          description: 'For individuals',
          features: ['5 Projects', '1GB Storage', 'Email Support'],
          buttonText: 'Get Started',
          buttonUrl: '#',
          highlighted: false,
        },
        {
          name: 'Pro',
          price: '$29',
          period: '/month',
          description: 'For teams',
          features: ['Unlimited Projects', '50GB Storage', 'Priority Support', 'Analytics'],
          buttonText: 'Get Started',
          buttonUrl: '#',
          highlighted: true,
        },
      ],
    },
    style: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
  {
    id: 'pricing-enterprise',
    name: 'Enterprise Pricing',
    description: 'Three-tier pricing table',
    type: 'pricing',
    category: 'professional',
    content: {
      title: 'Choose Your Plan',
      subtitle: 'Start free, upgrade when you\'re ready',
      plans: [
        {
          name: 'Free',
          price: '$0',
          period: '/month',
          description: 'Perfect for trying out',
          features: ['3 Projects', '500MB Storage', 'Community Support'],
          buttonText: 'Get Started',
          buttonUrl: '#',
          highlighted: false,
        },
        {
          name: 'Team',
          price: '$49',
          period: '/month',
          description: 'For growing teams',
          features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics', 'Custom Domain'],
          buttonText: 'Start Trial',
          buttonUrl: '#',
          highlighted: true,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          period: '',
          description: 'For large organizations',
          features: ['Everything in Team', 'Unlimited Storage', 'Dedicated Support', 'SLA Guarantee', 'SSO'],
          buttonText: 'Contact Sales',
          buttonUrl: '#',
          highlighted: false,
        },
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

  // FAQ Presets
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    description: 'Frequently asked questions',
    type: 'faq',
    category: 'professional',
    content: {
      title: 'Frequently Asked Questions',
      subtitle: 'Got questions? We\'ve got answers.',
      items: [
        { question: 'How does the free trial work?', answer: 'Start with a 14-day free trial. No credit card required. Cancel anytime.' },
        { question: 'Can I change my plan later?', answer: 'Yes! You can upgrade or downgrade your plan at any time.' },
        { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
        { question: 'Is there a long-term contract?', answer: 'No contracts! All plans are month-to-month unless you choose annual billing.' },
      ],
      allowMultiple: false,
    },
    style: {
      padding: 'large',
      alignment: 'center',
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
