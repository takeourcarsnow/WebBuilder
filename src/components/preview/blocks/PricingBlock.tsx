'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  highlighted: boolean;
}

interface PricingBlockProps {
  block: WebsiteBlock;
}

export const PricingBlock: React.FC<PricingBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);

  const title = content.title as string || 'Pricing';
  const subtitle = content.subtitle as string || '';
  const plans = (content.plans as unknown as PricingPlan[]) || [];

  return (
    <section className={containerClass} style={containerStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg opacity-70 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                'relative rounded-2xl p-8 transition-all duration-300',
                plan.highlighted
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600 text-white scale-105 shadow-xl'
                  : 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl'
              )}
              style={plan.highlighted ? { backgroundColor: 'var(--primary-color, #0ea5e9)' } : {}}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className={cn(
                  'text-xl font-semibold mb-2',
                  !plan.highlighted && 'text-gray-900 dark:text-white'
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  'text-sm mb-4',
                  plan.highlighted ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={cn(
                    'text-4xl font-bold',
                    !plan.highlighted && 'text-gray-900 dark:text-white'
                  )}>
                    {plan.price}
                  </span>
                  <span className={cn(
                    'text-sm',
                    plan.highlighted ? 'text-white/70' : 'text-gray-500'
                  )}>
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={cn(
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      plan.highlighted ? 'text-white' : 'text-green-500'
                    )} />
                    <span className={cn(
                      'text-sm',
                      plan.highlighted ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={plan.buttonUrl}
                className={cn(
                  'block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all',
                  plan.highlighted
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                )}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
