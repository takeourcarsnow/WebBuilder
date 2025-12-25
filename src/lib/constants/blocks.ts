import type { BlockType, BlockContent, BlockStyle } from '@/types';

interface BlockDefinition {
  type: BlockType;
  name: string;
  description: string;
  icon: string;
  category: 'layout' | 'content' | 'media' | 'interactive';
  defaultContent: BlockContent;
  defaultStyle: BlockStyle;
}

export const blockDefinitions: BlockDefinition[] = [
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'A large banner with headline and call to action',
    icon: 'Layout',
    category: 'layout',
    defaultContent: {
      headline: 'Welcome to My Website',
      subheadline: 'I create beautiful things for the digital world',
      buttonText: 'Get Started',
      buttonLink: '#contact',
      backgroundImage: '',
      showButton: true,
    },
    defaultStyle: {
      backgroundColor: '#0ea5e9',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
    },
  },
  {
    type: 'about',
    name: 'About Me',
    description: 'Introduce yourself with text and image',
    icon: 'User',
    category: 'content',
    defaultContent: {
      title: 'About Me',
      description: 'I am a passionate creator who loves building beautiful and functional experiences. With years of experience in my field, I bring creativity and attention to detail to every project.',
      image: '',
      showImage: true,
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    type: 'features',
    name: 'Features / Services',
    description: 'Showcase your skills or services in a grid',
    icon: 'Grid3x3',
    category: 'content',
    defaultContent: {
      title: 'What I Do',
      subtitle: 'My services and expertise',
      features: [
        { icon: 'Palette', title: 'Design', description: 'Beautiful and intuitive designs' },
        { icon: 'Code', title: 'Development', description: 'Clean and efficient code' },
        { icon: 'Rocket', title: 'Strategy', description: 'Growth-focused solutions' },
      ],
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'Display multiple images in a beautiful grid',
    icon: 'Images',
    category: 'media',
    defaultContent: {
      title: 'My Work',
      images: [
        { src: '', alt: 'Project 1', caption: 'Project One' },
        { src: '', alt: 'Project 2', caption: 'Project Two' },
        { src: '', alt: 'Project 3', caption: 'Project Three' },
      ],
      columns: 3,
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
      borderRadius: 'medium',
    },
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Show quotes from happy clients',
    icon: 'Quote',
    category: 'content',
    defaultContent: {
      title: 'What People Say',
      testimonials: [
        { quote: 'Amazing work! Highly recommended.', author: 'John Doe', role: 'CEO, Company', avatar: '' },
        { quote: 'Professional and creative. Will work again.', author: 'Jane Smith', role: 'Designer', avatar: '' },
      ],
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'center',
      width: 'medium',
    },
  },
  {
    type: 'contact',
    name: 'Contact Form',
    description: 'Let visitors get in touch with you',
    icon: 'Mail',
    category: 'interactive',
    defaultContent: {
      title: 'Get In Touch',
      subtitle: 'Have a question or want to work together?',
      email: '',
      showPhone: false,
      phone: '',
      showAddress: false,
      address: '',
      buttonText: 'Send Message',
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'center',
      width: 'narrow',
    },
  },
  {
    type: 'cta',
    name: 'Call to Action',
    description: 'Encourage visitors to take action',
    icon: 'MousePointerClick',
    category: 'interactive',
    defaultContent: {
      headline: 'Ready to Get Started?',
      description: 'Let\'s create something amazing together.',
      primaryButtonText: 'Contact Me',
      primaryButtonLink: '#contact',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '#about',
      showSecondaryButton: true,
    },
    defaultStyle: {
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      padding: 'large',
      alignment: 'center',
      width: 'full',
      borderRadius: 'none',
    },
  },
  {
    type: 'text',
    name: 'Text Block',
    description: 'Add custom text content',
    icon: 'Type',
    category: 'content',
    defaultContent: {
      heading: '',
      body: 'Add your text content here. You can write paragraphs, lists, or any other text-based content.',
      showHeading: false,
    },
    defaultStyle: {
      padding: 'medium',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    type: 'image',
    name: 'Single Image',
    description: 'Display a single image with optional caption',
    icon: 'Image',
    category: 'media',
    defaultContent: {
      src: '',
      alt: 'Image description',
      caption: '',
      showCaption: false,
      linkUrl: '',
    },
    defaultStyle: {
      padding: 'medium',
      alignment: 'center',
      width: 'medium',
      borderRadius: 'medium',
      shadow: 'medium',
    },
  },
  {
    type: 'video',
    name: 'Video Embed',
    description: 'Embed a YouTube or Vimeo video',
    icon: 'Video',
    category: 'media',
    defaultContent: {
      url: '',
      title: 'Video',
      autoplay: false,
    },
    defaultStyle: {
      padding: 'medium',
      alignment: 'center',
      width: 'wide',
      borderRadius: 'medium',
    },
  },
  {
    type: 'spacer',
    name: 'Spacer',
    description: 'Add vertical spacing between sections',
    icon: 'MoveVertical',
    category: 'layout',
    defaultContent: {
      height: 64,
    },
    defaultStyle: {},
  },
  {
    type: 'divider',
    name: 'Divider',
    description: 'Add a horizontal line separator',
    icon: 'Minus',
    category: 'layout',
    defaultContent: {
      style: 'solid',
      thickness: 1,
    },
    defaultStyle: {
      padding: 'small',
      width: 'medium',
    },
  },
  {
    type: 'social-links',
    name: 'Social Links',
    description: 'Display your social media profiles',
    icon: 'Share2',
    category: 'interactive',
    defaultContent: {
      title: 'Follow Me',
      showLabels: false,
      links: [
        { platform: 'twitter', url: '' },
        { platform: 'instagram', url: '' },
        { platform: 'linkedin', url: '' },
      ],
    },
    defaultStyle: {
      padding: 'medium',
      alignment: 'center',
    },
  },
  {
    type: 'skills',
    name: 'Skills',
    description: 'Show your skills with progress bars',
    icon: 'BarChart3',
    category: 'content',
    defaultContent: {
      title: 'My Skills',
      skills: [
        { name: 'Design', level: 90 },
        { name: 'Development', level: 85 },
        { name: 'Marketing', level: 75 },
      ],
      showPercentage: true,
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    type: 'experience',
    name: 'Experience Timeline',
    description: 'Display your work history or milestones',
    icon: 'Clock',
    category: 'content',
    defaultContent: {
      title: 'Experience',
      items: [
        { year: '2023', title: 'Senior Designer', company: 'Tech Company', description: 'Led design team and projects.' },
        { year: '2021', title: 'Designer', company: 'Startup Inc', description: 'Created brand identity and products.' },
        { year: '2019', title: 'Junior Designer', company: 'Agency', description: 'Worked on various client projects.' },
      ],
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'left',
      width: 'medium',
    },
  },
  {
    type: 'projects',
    name: 'Projects Showcase',
    description: 'Display your portfolio projects',
    icon: 'Briefcase',
    category: 'content',
    defaultContent: {
      title: 'Featured Projects',
      projects: [
        { title: 'Project One', description: 'A brief description of the project', image: '', link: '', tags: ['Design', 'Development'] },
        { title: 'Project Two', description: 'Another amazing project', image: '', link: '', tags: ['Branding', 'Strategy'] },
      ],
    },
    defaultStyle: {
      padding: 'large',
      alignment: 'center',
      width: 'wide',
    },
  },
];

export const getBlockDefinition = (type: BlockType): BlockDefinition | undefined => {
  return blockDefinitions.find(b => b.type === type);
};

export const getBlocksByCategory = (category: BlockDefinition['category']): BlockDefinition[] => {
  return blockDefinitions.filter(b => b.category === category);
};
