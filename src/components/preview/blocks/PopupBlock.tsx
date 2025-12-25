'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface PopupBlockContent {
  title: string;
  description: string;
  image?: string;
  buttonText: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  trigger: 'delay' | 'exit-intent' | 'scroll' | 'click';
  delay?: number; // seconds
  scrollPercentage?: number;
  position: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showOverlay: boolean;
  closeOnOverlayClick: boolean;
  style: 'default' | 'newsletter' | 'promo' | 'announcement';
}

interface PopupBlockProps {
  content: PopupBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

export const PopupBlock: React.FC<PopupBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title = 'Special Offer!',
    description = 'Subscribe to our newsletter and get 20% off your first order.',
    image,
    buttonText = 'Get Offer',
    buttonUrl,
    secondaryButtonText = 'No thanks',
    trigger = 'delay',
    delay = 3,
    scrollPercentage = 50,
    position = 'center',
    showOverlay = true,
    closeOnOverlayClick = true,
    style: popupStyle = 'default',
  } = content;

  const [isOpen, setIsOpen] = useState(isPreview);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Trigger handlers
  useEffect(() => {
    if (isPreview || hasTriggered) return;

    if (trigger === 'delay') {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasTriggered(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }

    if (trigger === 'scroll') {
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= scrollPercentage) {
          setIsOpen(true);
          setHasTriggered(true);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    if (trigger === 'exit-intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          setHasTriggered(true);
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [trigger, delay, scrollPercentage, isPreview, hasTriggered]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const positionClasses = {
    'center': 'items-center justify-center',
    'bottom-right': 'items-end justify-end p-6',
    'bottom-left': 'items-end justify-start p-6',
    'top-right': 'items-start justify-end p-6',
    'top-left': 'items-start justify-start p-6',
  };

  const getPopupClasses = () => {
    const baseClasses = 'relative rounded-2xl shadow-2xl overflow-hidden';
    
    switch (popupStyle) {
      case 'newsletter':
        return cn(baseClasses, 'bg-gradient-to-br from-primary-500 to-primary-600 text-white max-w-md');
      case 'promo':
        return cn(baseClasses, 'bg-white dark:bg-gray-900 max-w-lg');
      case 'announcement':
        return cn(baseClasses, 'bg-gray-900 text-white max-w-md');
      default:
        return cn(baseClasses, 'bg-white dark:bg-gray-900 max-w-md');
    }
  };

  // For editor preview, just show the popup content
  if (isPreview) {
    return (
      <section
        className={cn(
          BLOCK_STYLE_CLASSES.padding[blockStyle.padding || 'large'],
          BLOCK_STYLE_CLASSES.width[blockStyle.width || 'medium'],
          'flex flex-col',
          BLOCK_STYLE_CLASSES.alignment[blockStyle.alignment || 'center']
        )}
        style={{
          backgroundColor: blockStyle.backgroundColor,
          color: blockStyle.textColor,
        }}
      >
        <div className="text-center mb-4 text-sm opacity-60">
          Popup Preview (Trigger: {trigger})
        </div>
        
        <div className={getPopupClasses()}>
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          {image && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {popupStyle === 'promo' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium mb-3">
                <Sparkles className="w-3 h-3" />
                Limited Time
              </div>
            )}

            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm opacity-80 mb-4">{description}</p>

            {popupStyle === 'newsletter' && (
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 placeholder:text-white/60 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            )}

            <div className="flex gap-3">
              <button className={cn(
                'flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                popupStyle === 'newsletter' ? 'bg-white text-primary-600 hover:bg-gray-100' : 'bg-primary-500 text-white hover:bg-primary-600'
              )}>
                {buttonText}
                <ChevronRight className="w-4 h-4" />
              </button>
              {secondaryButtonText && (
                <button className="px-4 py-2.5 rounded-lg font-medium opacity-70 hover:opacity-100 transition-opacity">
                  {secondaryButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex',
            positionClasses[position]
          )}
        >
          {/* Overlay */}
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeOnOverlayClick ? handleClose : undefined}
            />
          )}

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={getPopupClasses()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image */}
            {image && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {popupStyle === 'promo' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  Limited Time
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm opacity-80 mb-4">{description}</p>

              {popupStyle === 'newsletter' && (
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/20 border border-white/30 placeholder:text-white/60 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              )}

              <div className="flex gap-3">
                <a
                  href={buttonUrl || '#'}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                    popupStyle === 'newsletter' ? 'bg-white text-primary-600 hover:bg-gray-100' : 'bg-primary-500 text-white hover:bg-primary-600'
                  )}
                >
                  {buttonText}
                  <ChevronRight className="w-4 h-4" />
                </a>
                {secondaryButtonText && (
                  <button
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-lg font-medium opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {secondaryButtonText}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
