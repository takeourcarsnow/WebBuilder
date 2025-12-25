'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlockStyle } from '@/types';
import { cn } from '@/lib/utils';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: string;
  image?: string;
}

export interface TabsBlockContent {
  title?: string;
  subtitle?: string;
  tabs: Tab[];
  style: 'underline' | 'pills' | 'boxed' | 'vertical';
  defaultTab?: string;
}

interface TabsBlockProps {
  content: TabsBlockContent;
  style: BlockStyle;
  isPreview?: boolean;
}

const defaultTabs: Tab[] = [
  {
    id: 'tab1',
    label: 'Features',
    content: 'Our platform offers a comprehensive suite of features designed to streamline your workflow and boost productivity. From intuitive drag-and-drop interfaces to powerful automation tools, we\'ve got everything you need.',
  },
  {
    id: 'tab2',
    label: 'Pricing',
    content: 'We offer flexible pricing plans to suit businesses of all sizes. Whether you\'re a startup or an enterprise, our transparent pricing ensures you only pay for what you need.',
  },
  {
    id: 'tab3',
    label: 'Support',
    content: 'Our dedicated support team is available 24/7 to help you succeed. With comprehensive documentation, video tutorials, and direct access to experts, help is always just a click away.',
  },
];

export const TabsBlock: React.FC<TabsBlockProps> = ({
  content,
  style: blockStyle,
  isPreview = false,
}) => {
  const {
    title,
    subtitle,
    tabs = defaultTabs,
    style: tabStyle = 'underline',
    defaultTab = tabs[0]?.id,
  } = content;

  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  const getTabListClasses = () => {
    switch (tabStyle) {
      case 'underline':
        return 'flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700';
      case 'pills':
        return 'inline-flex flex-wrap gap-2 p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800';
      case 'boxed':
        return 'grid grid-cols-3 gap-3';
      case 'vertical':
        return 'flex flex-col gap-2 w-48 shrink-0';
      default:
        return 'flex gap-4';
    }
  };

  const getTabClasses = (isActive: boolean) => {
    const baseClasses = 'px-4 py-2.5 font-medium transition-all duration-200 whitespace-nowrap';
    
    switch (tabStyle) {
      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 -mb-px',
          isActive
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        );
      case 'pills':
        return cn(
          baseClasses,
          'rounded-lg',
          isActive
            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        );
      case 'boxed':
        return cn(
          baseClasses,
          'rounded-xl border-2 text-center py-4',
          isActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
        );
      case 'vertical':
        return cn(
          baseClasses,
          'rounded-lg text-left',
          isActive
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-500'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
        );
      default:
        return cn(baseClasses, isActive ? 'text-primary-600' : 'text-gray-500');
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
        {(title || subtitle) && (
          <motion.div
            initial={isPreview ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
            )}
            {subtitle && (
              <p className="text-base opacity-70">{subtitle}</p>
            )}
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={isPreview ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={cn(
            tabStyle === 'vertical' ? 'flex gap-8' : 'space-y-6'
          )}
        >
          {/* Tab List */}
          <div
            className={cn(
              getTabListClasses(),
              tabStyle !== 'vertical' && tabStyle !== 'boxed' && 'justify-center'
            )}
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={getTabClasses(activeTab === tab.id)}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            className={cn(
              'mt-6',
              tabStyle === 'vertical' && 'mt-0 flex-1'
            )}
            role="tabpanel"
          >
            <AnimatePresence mode="wait">
              {activeTabContent && (
                <motion.div
                  key={activeTabContent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50',
                    tabStyle === 'vertical' && 'h-full'
                  )}
                >
                  {activeTabContent.image && (
                    <img
                      src={activeTabContent.image}
                      alt={activeTabContent.label}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-base leading-relaxed opacity-80">
                    {activeTabContent.content}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
