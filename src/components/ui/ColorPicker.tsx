'use client';

import React from 'react';
import { colors } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  showPresets?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  showPresets = true,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-ios border border-gray-300 dark:border-gray-700"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-10 flex-1 rounded-ios border border-gray-300 bg-white px-3 text-sm uppercase',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'dark:border-gray-700 dark:bg-surface-dark-elevated dark:text-white'
          )}
        />
      </div>

      {showPresets && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {colors.presets.map((color) => (
            <button
              key={color.value}
              onClick={() => onChange(color.value)}
              className={cn(
                'h-8 w-full rounded-lg border-2 transition-transform hover:scale-105 active:scale-95',
                value === color.value
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-transparent'
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};
