'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle, Mail } from 'lucide-react';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface NewsletterBlockContent {
  title: string;
  subtitle?: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  disclaimer?: string;
  style: 'inline' | 'stacked' | 'card';
  showIcon: boolean;
}

interface NewsletterBlockProps {
  content: NewsletterBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title = 'Subscribe to our newsletter',
    subtitle = 'Get the latest updates and news delivered to your inbox.',
    placeholder = 'Enter your email',
    buttonText = 'Subscribe',
    successMessage = 'Thanks for subscribing!',
    disclaimer = 'We respect your privacy. Unsubscribe at any time.',
    style: formStyle = 'inline',
    showIcon = true,
  } = content;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  const inputClasses = cn(
    'px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700',
    'bg-white dark:bg-gray-800',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'text-gray-900 dark:text-white',
    formStyle === 'inline' ? 'flex-1' : 'w-full'
  );

  const buttonClasses = cn(
    'px-6 py-3 rounded-lg font-medium transition-all',
    'bg-primary-500 text-white hover:bg-primary-600',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'flex items-center justify-center gap-2',
    formStyle === 'stacked' && 'w-full'
  );

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
      <div
        className={cn(
          'w-full',
          formStyle === 'card' && 'p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
        )}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          {showIcon && (
            <motion.div
              initial={isPreview ? { opacity: 0, scale: 0.8 } : false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </motion.div>
          )}
          
          <motion.h2
            initial={isPreview ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-2"
          >
            {title}
          </motion.h2>
          
          {subtitle && (
            <motion.p
              initial={isPreview ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base opacity-70 max-w-md mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Form */}
        <motion.form
          initial={isPreview ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto"
        >
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  formStyle === 'inline' && 'flex gap-3',
                  formStyle === 'stacked' && 'space-y-3'
                )}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className={inputClasses}
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={buttonClasses}
                >
                  {status === 'loading' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {buttonText}
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}
        </motion.form>

        {/* Disclaimer */}
        {disclaimer && status !== 'success' && (
          <motion.p
            initial={isPreview ? { opacity: 0 } : false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs text-center opacity-50 mt-4"
          >
            {disclaimer}
          </motion.p>
        )}
      </div>
    </section>
  );
};
