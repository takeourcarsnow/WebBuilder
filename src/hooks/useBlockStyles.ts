import { useMemo } from 'react';
import type { BlockStyle } from '@/types';
import { BLOCK_STYLE_CLASSES } from '@/lib/constants/design';

export interface BlockStyleClasses {
  paddingClass: string;
  alignmentClass: string;
  widthClass: string;
  borderRadiusClass: string;
  shadowClass: string;
  animationClass: string;
  containerClass: string;
}

/**
 * Hook to generate consistent Tailwind classes from block style settings
 */
export function useBlockStyles(style: BlockStyle): BlockStyleClasses {
  return useMemo(() => {
    const paddingClass = BLOCK_STYLE_CLASSES.padding[style.padding || 'medium'];
    const alignmentClass = BLOCK_STYLE_CLASSES.alignment[style.alignment || 'center'];
    const widthClass = BLOCK_STYLE_CLASSES.width[style.width || 'full'];
    const borderRadiusClass = BLOCK_STYLE_CLASSES.borderRadius[style.borderRadius || 'none'];
    const shadowClass = BLOCK_STYLE_CLASSES.shadow[style.shadow || 'none'];
    const animationClass = BLOCK_STYLE_CLASSES.animation[style.animation || 'none'];

    const containerClass = `${paddingClass} ${widthClass}`;

    return {
      paddingClass,
      alignmentClass,
      widthClass,
      borderRadiusClass,
      shadowClass,
      animationClass,
      containerClass,
    };
  }, [style]);
}

/**
 * Get inline styles for a block
 */
export function useBlockInlineStyles(style: BlockStyle) {
  return useMemo(() => ({
    backgroundColor: style.backgroundColor,
    color: style.textColor,
  }), [style.backgroundColor, style.textColor]);
}
