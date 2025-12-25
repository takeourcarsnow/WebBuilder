'use client';

import React, { useState, useEffect } from 'react';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  url: string;
}

interface NavigationBlockProps {
  block: WebsiteBlock;
}

export const NavigationBlock: React.FC<NavigationBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerStyle } = useBlockStyles(style);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logo = content.logo as string || 'My Site';
  const logoUrl = content.logoUrl as string || '';
  const links = (content.links as unknown as NavLink[]) || [];
  const sticky = content.sticky as boolean ?? true;
  const showCta = content.showCta as boolean ?? true;
  const ctaText = content.ctaText as string || 'Get Started';
  const ctaUrl = content.ctaUrl as string || '#';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (sticky) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [sticky]);

  const handleLinkClick = (url: string) => {
    setIsMobileMenuOpen(false);
    // Smooth scroll for anchor links
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={cn(
        'w-full z-50 transition-all duration-300',
        sticky && 'sticky top-0',
        isScrolled && 'shadow-md backdrop-blur-lg'
      )}
      style={{
        ...containerStyle,
        backgroundColor: isScrolled 
          ? `${containerStyle.backgroundColor || '#ffffff'}ee`
          : containerStyle.backgroundColor,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={logo} className="h-8 md:h-10 w-auto" />
            ) : (
              <span className="text-xl md:text-2xl font-bold">{logo}</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                onClick={(e) => {
                  if (link.url.startsWith('#')) {
                    e.preventDefault();
                    handleLinkClick(link.url);
                  }
                }}
                className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </a>
            ))}
            
            {showCta && (
              <a
                href={ctaUrl}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--primary-color, #0ea5e9)' }}
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: `${containerStyle.color || '#000'}20` }}>
          <div className="px-4 py-4 space-y-2">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                onClick={(e) => {
                  if (link.url.startsWith('#')) {
                    e.preventDefault();
                    handleLinkClick(link.url);
                  }
                }}
                className="block px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            
            {showCta && (
              <a
                href={ctaUrl}
                className="block px-4 py-2 rounded-lg text-center text-white font-semibold"
                style={{ backgroundColor: 'var(--primary-color, #0ea5e9)' }}
              >
                {ctaText}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
