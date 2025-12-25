'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}

export interface TeamBlockContent {
  title: string;
  subtitle?: string;
  members: TeamMember[];
  layout: 'grid' | 'carousel' | 'list';
  showBio: boolean;
  showSocial: boolean;
}

interface TeamBlockProps {
  content: TeamBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

const defaultMembers: TeamMember[] = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Passionate about building products that make a difference.',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Full-stack engineer with 15+ years of experience.',
    social: { linkedin: '#', github: '#' },
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Award-winning designer focused on user experience.',
    social: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'David Kim',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Specializing in scalable architectures.',
    social: { github: '#', twitter: '#' },
  },
];

export const TeamBlock: React.FC<TeamBlockProps> = ({
  content,
  style,
  isPreview = false,
}) => {
  const {
    title = 'Meet Our Team',
    subtitle = 'The people behind our success',
    members = defaultMembers,
    layout = 'grid',
    showBio = true,
    showSocial = true,
  } = content;

  const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    email: Mail,
  };

  return (
    <section
      className={cn(
        BLOCK_STYLE_CLASSES.padding[style.padding || 'large'],
        BLOCK_STYLE_CLASSES.width[style.width || 'wide'],
        'flex flex-col'
      )}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      {/* Header */}
      <div className={cn('mb-12', BLOCK_STYLE_CLASSES.alignment[style.alignment || 'center'])}>
        <motion.h2
          initial={isPreview ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            initial={isPreview ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg opacity-80 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Team Grid */}
      <div
        className={cn(
          'grid gap-8',
          layout === 'grid' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
          layout === 'list' && 'grid-cols-1 max-w-2xl mx-auto'
        )}
      >
        {members.map((member, index) => (
          <motion.div
            key={member.name + index}
            initial={isPreview ? { opacity: 0, y: 30 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'group',
              layout === 'list' && 'flex gap-6 items-center'
            )}
          >
            {/* Image */}
            <div className={cn(
              'relative overflow-hidden rounded-xl',
              layout === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square mb-4'
            )}>
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
              
              {/* Social overlay on hover */}
              {showSocial && member.social && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {Object.entries(member.social).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform as keyof typeof socialIcons];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={cn(
              layout === 'grid' && 'text-center',
              layout === 'list' && 'flex-1'
            )}>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-sm opacity-70 mb-2">{member.role}</p>
              {showBio && member.bio && (
                <p className="text-sm opacity-60 line-clamp-2">{member.bio}</p>
              )}
              
              {/* Social links for list layout */}
              {layout === 'list' && showSocial && member.social && (
                <div className="flex gap-2 mt-3">
                  {Object.entries(member.social).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform as keyof typeof socialIcons];
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Icon className="w-4 h-4 opacity-60" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
