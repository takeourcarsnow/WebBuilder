'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  url: string;
}

interface BlogBlockProps {
  block: WebsiteBlock;
}

export const BlogBlock: React.FC<BlogBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);

  const title = content.title as string || 'Latest Posts';
  const subtitle = content.subtitle as string || '';
  const posts = (content.posts as unknown as BlogPost[]) || [];
  const layout = content.layout as string || 'grid';
  const showDate = content.showDate as boolean ?? true;
  const showAuthor = content.showAuthor as boolean ?? true;
  const showCategory = content.showCategory as boolean ?? true;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className={containerClass} style={containerStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg opacity-70 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Posts Grid */}
        <div
          className={cn(
            'grid gap-8',
            layout === 'grid' && 'md:grid-cols-2 lg:grid-cols-3',
            layout === 'list' && 'max-w-3xl mx-auto'
          )}
        >
          {posts.map((post, index) => (
            <article
              key={index}
              className={cn(
                'group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300',
                layout === 'list' && 'md:flex'
              )}
            >
              {/* Image */}
              <div
                className={cn(
                  'relative overflow-hidden',
                  layout === 'grid' && 'aspect-video',
                  layout === 'list' && 'md:w-64 md:flex-shrink-0'
                )}
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <span className="text-4xl opacity-50">📝</span>
                  </div>
                )}

                {/* Category Badge */}
                {showCategory && post.category && (
                  <span
                    className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full text-white"
                    style={{ backgroundColor: 'var(--primary-color, #0ea5e9)' }}
                  >
                    {post.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Meta */}
                {(showDate || showAuthor) && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {showDate && post.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.date)}
                      </span>
                    )}
                    {showAuthor && post.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    )}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-1 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <a
                  href={post.url || '#'}
                  className="inline-flex items-center gap-2 text-sm font-medium group/link"
                  style={{ color: 'var(--primary-color, #0ea5e9)' }}
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
