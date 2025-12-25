'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface CarouselSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface CarouselBlockContent {
  title?: string;
  slides: CarouselSlide[];
  autoPlay: boolean;
  autoPlayInterval: number; // in seconds
  showArrows: boolean;
  showDots: boolean;
  showProgress: boolean;
  effect: 'slide' | 'fade' | 'zoom';
  aspectRatio: '16:9' | '4:3' | '21:9' | 'square';
}

interface CarouselBlockProps {
  content: CarouselBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=675&fit=crop',
    title: 'Build Amazing Websites',
    subtitle: 'Create stunning websites with our drag-and-drop builder',
    buttonText: 'Get Started',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop',
    title: 'Grow Your Business',
    subtitle: 'Powerful tools to help you succeed online',
    buttonText: 'Learn More',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=675&fit=crop',
    title: 'Design Made Simple',
    subtitle: 'No coding required - just drag, drop, and publish',
    buttonText: 'Try Free',
  },
];

export const CarouselBlock: React.FC<CarouselBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title,
    slides = defaultSlides,
    autoPlay = true,
    autoPlayInterval = 5,
    showArrows = true,
    showDots = true,
    showProgress = true,
    effect = 'slide',
    aspectRatio = '16:9',
  } = content;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '21:9': 'aspect-[21/9]',
    'square': 'aspect-square',
  }[aspectRatio];

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + (100 / (autoPlayInterval * 10));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [autoPlay, isPaused, autoPlayInterval, slides.length, goToNext]);

  const slideVariants = {
    slide: {
      enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
    },
    fade: {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    },
    zoom: {
      enter: { opacity: 0, scale: 1.1 },
      center: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 },
    },
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className={cn(
        BLOCK_STYLE_CLASSES.padding[blockStyle.padding || 'none'],
        BLOCK_STYLE_CLASSES.width[blockStyle.width || 'full'],
        'flex flex-col',
        BLOCK_STYLE_CLASSES.alignment[blockStyle.alignment || 'center']
      )}
      style={{
        backgroundColor: blockStyle.backgroundColor,
        color: blockStyle.textColor,
      }}
    >
      <div className="w-full">
        {/* Title */}
        {title && (
          <motion.h2
            initial={isPreview ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center mb-6"
          >
            {title}
          </motion.h2>
        )}

        {/* Carousel */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides Container */}
          <div className={cn('relative overflow-hidden rounded-2xl', aspectRatioClass)}>
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                custom={1}
                variants={slideVariants[effect]}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {/* Image */}
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title || `Slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Content */}
                {(currentSlide.title || currentSlide.subtitle || currentSlide.buttonText) && (
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentSlide.title && (
                        <h3 className="text-2xl sm:text-4xl font-bold mb-2">
                          {currentSlide.title}
                        </h3>
                      )}
                      {currentSlide.subtitle && (
                        <p className="text-lg opacity-90 mb-4">
                          {currentSlide.subtitle}
                        </p>
                      )}
                      {currentSlide.buttonText && (
                        <button className="px-6 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          {currentSlide.buttonText}
                        </button>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            {showProgress && autoPlay && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                <motion.div
                  className="h-full bg-white"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {showArrows && slides.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Play/Pause Button */}
          {autoPlay && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : (
                <Pause className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Dots Navigation */}
        {showDots && slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-primary-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        <div className="text-center mt-2 text-sm opacity-60">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
};
