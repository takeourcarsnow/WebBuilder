'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores';

export function useTheme() {
  const { isDark, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to html element
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Check system preference on mount
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only set if no stored preference
    const storedTheme = localStorage.getItem('theme-storage');
    if (!storedTheme) {
      setTheme(mediaQuery.matches);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-change if user hasn't set a preference
      const stored = localStorage.getItem('theme-storage');
      if (!stored) {
        setTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  return { isDark, toggleTheme };
}
