'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteStore, useEditorStore } from '@/stores';
import { EditorToolbar, EditorSidebar, OnboardingTour, KeyboardShortcutsOverlay, CommandPalette } from '@/components/builder';
import { WebsitePreview } from '@/components/preview';
import { TemplateSelection } from '@/components/templates';
import { ErrorBoundary } from '@/components/ui';
import { useKeyboardShortcuts } from '@/hooks';
import { cn } from '@/lib/utils';

export default function BuilderPage() {
  const { website } = useWebsiteStore();
  const { setSelectedBlock, showKeyboardShortcuts, setShowKeyboardShortcuts, hasCompletedOnboarding } = useEditorStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Show template selection if no website exists
    if (!website) {
      setShowTemplates(true);
    }
  }, [website]);

  // Show onboarding for first-time users
  useEffect(() => {
    if (website && !hasCompletedOnboarding) {
      // Delay slightly to let the UI render first
      const timer = setTimeout(() => setShowOnboarding(true), 500);
      return () => clearTimeout(timer);
    }
  }, [website, hasCompletedOnboarding]);

  const handleTemplateComplete = () => {
    setShowTemplates(false);
    setSelectedBlock(null);
  };

  // Show template selection
  if (showTemplates || !website) {
    return <TemplateSelection onComplete={handleTemplateComplete} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50/50 dark:bg-surface-dark">
      {/* Command Palette - Global */}
      <CommandPalette />

      {/* Toolbar */}
      <ErrorBoundary>
        <EditorToolbar />
      </ErrorBoundary>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ErrorBoundary>
          <EditorSidebar />
        </ErrorBoundary>

        {/* Preview area */}
        <main className="flex-1 overflow-hidden">
          <ErrorBoundary>
            <WebsitePreview />
          </ErrorBoundary>
        </main>
      </div>

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onComplete={() => setShowOnboarding(false)} />
      )}

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
}
