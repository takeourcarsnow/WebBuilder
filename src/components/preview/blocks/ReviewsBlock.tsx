'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, ThumbsUp, Verified } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified: boolean;
  helpful?: number;
  source?: string;
}

export interface ReviewsBlockContent {
  title: string;
  subtitle?: string;
  reviews: Review[];
  layout: 'grid' | 'carousel' | 'list' | 'masonry';
  showRating: boolean;
  showDate: boolean;
  showSource: boolean;
  showHelpful: boolean;
  averageRating?: number;
  totalReviews?: number;
}

interface ReviewsBlockProps {
  content: ReviewsBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

const defaultReviews: Review[] = [
  {
    id: '1',
    author: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    title: 'Absolutely Amazing!',
    content: 'This product exceeded all my expectations. The quality is outstanding and the customer service team was incredibly helpful.',
    date: '2024-01-15',
    verified: true,
    helpful: 24,
  },
  {
    id: '2',
    author: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    title: 'Best Purchase Ever',
    content: 'I\'ve been using this for 3 months now and it\'s been a game-changer for my workflow. Highly recommend!',
    date: '2024-01-10',
    verified: true,
    helpful: 18,
  },
  {
    id: '3',
    author: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 4,
    title: 'Great Value',
    content: 'Good product for the price. Some minor improvements could be made but overall very satisfied.',
    date: '2024-01-05',
    verified: true,
    helpful: 12,
  },
];

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({
  rating,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
          )}
        />
      ))}
    </div>
  );
};

export const ReviewsBlock: React.FC<ReviewsBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title = 'Customer Reviews',
    subtitle = 'See what our customers are saying',
    reviews = defaultReviews,
    layout = 'grid',
    showRating = true,
    showDate = true,
    showSource = false,
    showHelpful = true,
    averageRating = 4.8,
    totalReviews = 1250,
  } = content;

  const [carouselIndex, setCarouselIndex] = useState(0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const ReviewCard: React.FC<{ review: Review; index: number }> = ({ review, index }) => (
    <motion.div
      initial={isPreview ? { opacity: 0, y: 20 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm',
        'hover:shadow-md transition-shadow'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.author}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary-600">
              {review.author.charAt(0)}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{review.author}</span>
            {review.verified && (
              <Verified className="w-4 h-4 text-green-500" />
            )}
          </div>
          {showRating && <StarRating rating={review.rating} size="sm" />}
        </div>
        
        <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800" />
      </div>

      {/* Content */}
      {review.title && (
        <h4 className="font-semibold mb-2">{review.title}</h4>
      )}
      <p className="text-sm opacity-80 leading-relaxed">{review.content}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs">
        <div className="flex items-center gap-4">
          {showDate && (
            <span className="opacity-60">{formatDate(review.date)}</span>
          )}
          {showSource && review.source && (
            <span className="opacity-60">via {review.source}</span>
          )}
        </div>
        
        {showHelpful && review.helpful && (
          <button className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <ThumbsUp className="w-3 h-3" />
            <span>Helpful ({review.helpful})</span>
          </button>
        )}
      </div>
    </motion.div>
  );

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'list':
        return 'flex flex-col gap-4 max-w-2xl mx-auto';
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6';
      case 'carousel':
        return 'relative';
      default:
        return 'grid grid-cols-1 md:grid-cols-3 gap-6';
    }
  };

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
      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={isPreview ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h2>
          {subtitle && (
            <p className="text-base opacity-70 mb-4">{subtitle}</p>
          )}

          {/* Average Rating Summary */}
          {averageRating && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{averageRating}</span>
                <div className="text-left">
                  <StarRating rating={Math.round(averageRating)} size="lg" />
                  <span className="text-sm opacity-60">
                    Based on {totalReviews?.toLocaleString()} reviews
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Reviews */}
        {layout === 'carousel' ? (
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: `-${carouselIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex"
              >
                {reviews.map((review, index) => (
                  <div key={review.id} className="w-full flex-shrink-0 px-4">
                    <ReviewCard review={review} index={index} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
                disabled={carouselIndex === 0}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      index === carouselIndex
                        ? 'bg-primary-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    )}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCarouselIndex((prev) => Math.min(reviews.length - 1, prev + 1))}
                disabled={carouselIndex === reviews.length - 1}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className={getLayoutClasses()}>
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
