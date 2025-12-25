'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks';
import { TooltipProvider, NotificationContainer } from '@/components/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-surface-dark">
        {/* Loading placeholder */}
      </div>
    );
  }

  return (
    <TooltipProvider>
      {children}
      <NotificationContainer />
    </TooltipProvider>
  );
}
