'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showCloseButton = true,
}) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
            'rounded-ios-xl bg-white p-6 shadow-ios-lg',
            'dark:bg-surface-dark-elevated dark:shadow-ios-dark-lg',
            'data-[state=open]:animate-scale-in',
            'max-h-[90vh] overflow-y-auto',
            className
          )}
        >
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-4 top-4 rounded-full p-1.5 transition-colors',
                'hover:bg-gray-100 dark:hover:bg-surface-dark-secondary',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
            >
              <X className="h-5 w-5 text-gray-500" />
            </DialogPrimitive.Close>
          )}
          
          {title && (
            <DialogPrimitive.Title className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </DialogPrimitive.Title>
          )}
          
          {description && (
            <DialogPrimitive.Description className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </DialogPrimitive.Description>
          )}
          
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export const ModalTrigger = DialogPrimitive.Trigger;
