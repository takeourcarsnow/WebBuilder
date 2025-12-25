'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { ArrowUp, Twitter, Linkedin, Github, Instagram, Facebook, Youtube } from 'lucide-react';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterBlockProps {
  block: WebsiteBlock;
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export const FooterBlock: React.FC<FooterBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);

  const logo = content.logo as string || 'My Site';
  const description = content.description as string || '';
  const columns = (content.columns as unknown as FooterColumn[]) || [];
  const copyright = content.copyright as string || `© ${new Date().getFullYear()} All rights reserved.`;
  const showBackToTop = content.showBackToTop as boolean ?? true;
  const showSocial = content.showSocial as boolean ?? true;
  const socialLinks = (content.socialLinks as unknown as SocialLink[]) || [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={containerClass} style={containerStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">{logo}</h3>
            {description && (
              <p className="opacity-70 text-sm leading-relaxed mb-6">{description}</p>
            )}
            
            {/* Social Links */}
            {showSocial && socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((link, index) => {
                  const Icon = socialIcons[link.platform] || Twitter;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((column, colIndex) => (
            <div key={colIndex}>
              <h4 className="font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-60">{copyright}</p>
          
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
            >
              Back to top
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
