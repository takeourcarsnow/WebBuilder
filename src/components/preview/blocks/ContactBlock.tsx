'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import type { WebsiteBlock } from '@/types';
import { cn } from '@/lib/utils';

interface ContactBlockProps {
  block: WebsiteBlock;
}

export const ContactBlock: React.FC<ContactBlockProps> = ({ block }) => {
  const { content, style } = block;
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const paddingClass = {
    none: 'py-0',
    small: 'py-12',
    medium: 'py-16',
    large: 'py-24',
  }[style.padding || 'large'];

  const widthClass = {
    narrow: 'max-w-md',
    medium: 'max-w-2xl',
    wide: 'max-w-4xl',
    full: 'max-w-6xl',
  }[style.width || 'narrow'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Form submitted! (Demo only)');
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section
      id="contact"
      className={cn('w-full', paddingClass)}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
      }}
    >
      <div className={cn('mx-auto px-6', widthClass)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {content.title as string}
          </h2>
          {content.subtitle && (
            <p className="mb-8 text-lg opacity-70">
              {content.subtitle as string}
            </p>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-md space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={formState.name}
              onChange={(e) =>
                setFormState((s) => ({ ...s, name: e.target.value }))
              }
              required
              className={cn(
                'w-full rounded-ios-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all',
                'placeholder:text-gray-400',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                'dark:border-gray-700 dark:bg-gray-800 dark:text-white'
              )}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              value={formState.email}
              onChange={(e) =>
                setFormState((s) => ({ ...s, email: e.target.value }))
              }
              required
              className={cn(
                'w-full rounded-ios-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all',
                'placeholder:text-gray-400',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                'dark:border-gray-700 dark:bg-gray-800 dark:text-white'
              )}
            />
          </div>
          <div>
            <textarea
              placeholder="Your Message"
              value={formState.message}
              onChange={(e) =>
                setFormState((s) => ({ ...s, message: e.target.value }))
              }
              required
              rows={5}
              className={cn(
                'w-full resize-none rounded-ios-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all',
                'placeholder:text-gray-400',
                'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
                'dark:border-gray-700 dark:bg-gray-800 dark:text-white'
              )}
            />
          </div>
          <button
            type="submit"
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-ios-lg px-6 py-3 font-semibold transition-all',
              'bg-primary-500 text-white shadow-ios hover:bg-primary-600 hover:shadow-ios-lg',
              'active:scale-[0.98]'
            )}
          >
            <Send className="h-4 w-4" />
            {content.buttonText as string}
          </button>
        </motion.form>

        {content.email && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex justify-center"
          >
            <a
              href={`mailto:${content.email}`}
              className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100"
            >
              <Mail className="h-4 w-4" />
              {content.email as string}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};
