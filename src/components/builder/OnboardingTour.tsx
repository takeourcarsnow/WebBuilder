'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Layout, 
  Palette, 
  Eye, 
  Download, 
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import { useEditorStore } from '@/stores';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  tip?: string;
  highlightSelector?: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Website Builder! 🎉',
    description: 'Build beautiful websites without writing code. This quick tour will show you the essentials.',
    icon: <Sparkles className="w-8 h-8" />,
  },
  {
    id: 2,
    title: 'Add Building Blocks',
    description: 'Click any block from the sidebar to add it to your website. Drag blocks to reorder them.',
    icon: <Layout className="w-8 h-8" />,
    tip: 'Pro tip: Press Ctrl+B to quickly open the blocks panel',
    highlightSelector: '[data-tour="blocks-panel"]',
  },
  {
    id: 3,
    title: 'Customize Styles',
    description: 'Select any block to edit its content and style. Change colors, fonts, spacing, and more.',
    icon: <Palette className="w-8 h-8" />,
    tip: 'Pro tip: Use gradients for eye-catching backgrounds',
    highlightSelector: '[data-tour="style-panel"]',
  },
  {
    id: 4,
    title: 'Organize with Layers',
    description: 'The Layers panel gives you a bird\'s-eye view of all blocks. Lock, hide, or group blocks for better organization.',
    icon: <Layers className="w-8 h-8" />,
    tip: 'Pro tip: Shift+Click to select multiple blocks',
  },
  {
    id: 5,
    title: 'Preview Your Site',
    description: 'Toggle preview mode to see how your site looks on different devices. Test desktop, tablet, and mobile views.',
    icon: <Eye className="w-8 h-8" />,
    tip: 'Pro tip: Press Ctrl+P to toggle preview mode',
    highlightSelector: '[data-tour="preview-button"]',
  },
  {
    id: 6,
    title: 'Export & Share',
    description: 'When you\'re ready, export your website as HTML, React components, or deploy directly.',
    icon: <Download className="w-8 h-8" />,
    highlightSelector: '[data-tour="export-button"]',
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const {
    showOnboarding,
    currentOnboardingStep,
    hasCompletedOnboarding,
    setShowOnboarding,
    setCurrentOnboardingStep,
    completeOnboarding,
  } = useEditorStore();

  // Show onboarding automatically for new users
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasCompletedOnboarding, setShowOnboarding]);

  const currentStep = steps[currentOnboardingStep];
  const isFirstStep = currentOnboardingStep === 0;
  const isLastStep = currentOnboardingStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      onComplete?.();
    } else {
      setCurrentOnboardingStep(currentOnboardingStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentOnboardingStep(currentOnboardingStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onComplete?.();
  };

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      {showOnboarding && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentOnboardingStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Step Counter */}
              <div className="flex items-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentOnboardingStep
                        ? 'w-6 bg-primary-500'
                        : index < currentOnboardingStep
                        ? 'bg-primary-300'
                        : 'bg-gray-200 dark:bg-gray-700'
                    )}
                  />
                ))}
              </div>

              {/* Icon */}
              <motion.div
                key={currentStep.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mb-6"
              >
                {currentStep.icon}
              </motion.div>

              {/* Title & Description */}
              <motion.div
                key={`text-${currentStep.id}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {currentStep.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {currentStep.description}
                </p>

                {/* Tip */}
                {currentStep.tip && (
                  <div className="mt-4 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      💡 {currentStep.tip}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Skip tour
              </button>

              <div className="flex items-center gap-3">
                {!isFirstStep && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                >
                  {isLastStep ? (
                    <>
                      <Check className="w-4 h-4" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
