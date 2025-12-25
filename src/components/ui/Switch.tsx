'use client';

import React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, ...props }, ref) => {
  const id = React.useId();

  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitives.Root
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center border border-gray-300 transition-colors',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-teal',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:border-accent-teal data-[state=checked]:bg-accent-teal data-[state=unchecked]:bg-transparent dark:data-[state=unchecked]:border-gray-700',
          className
        )}
        id={id}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            'pointer-events-none block h-4 w-4 bg-gray-900 transition-transform dark:bg-white',
            'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5'
          )}
        />
      </SwitchPrimitives.Root>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';
