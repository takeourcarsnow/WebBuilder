/**
 * Tailwind CSS Export Generator
 * Generates Tailwind-based HTML from website data
 */

import type { Website, WebsiteBlock, ThemeSettings, FontSettings } from '@/types';

// Map style values to Tailwind classes
const paddingClasses: Record<string, string> = {
  none: 'py-0',
  small: 'py-8 md:py-12',
  medium: 'py-12 md:py-16 lg:py-20',
  large: 'py-16 md:py-24 lg:py-32',
};

const widthClasses: Record<string, string> = {
  narrow: 'max-w-2xl mx-auto px-4',
  medium: 'max-w-4xl mx-auto px-4',
  wide: 'max-w-6xl mx-auto px-4',
  full: 'w-full px-4 md:px-8',
};

const alignmentClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const borderRadiusClasses: Record<string, string> = {
  none: 'rounded-none',
  small: 'rounded-md',
  medium: 'rounded-xl',
  large: 'rounded-2xl',
};

const shadowClasses: Record<string, string> = {
  none: 'shadow-none',
  small: 'shadow-sm',
  medium: 'shadow-lg',
  large: 'shadow-2xl',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getBlockClasses(style: WebsiteBlock['style']): string {
  const classes = [
    paddingClasses[style.padding || 'medium'],
    alignmentClasses[style.alignment || 'center'],
  ];
  
  if (style.borderRadius && style.borderRadius !== 'none') {
    classes.push(borderRadiusClasses[style.borderRadius]);
  }
  
  if (style.shadow && style.shadow !== 'none') {
    classes.push(shadowClasses[style.shadow]);
  }
  
  return classes.join(' ');
}

function generateBlockHtml(block: WebsiteBlock): string {
  const { content, style, type } = block;
  const containerClasses = getBlockClasses(style);
  const widthClass = widthClasses[style.width || 'medium'];
  
  const bgStyle = style.backgroundColor ? `background-color: ${style.backgroundColor};` : '';
  const textStyle = style.textColor ? `color: ${style.textColor};` : '';
  const inlineStyle = bgStyle || textStyle ? ` style="${bgStyle} ${textStyle}"` : '';

  switch (type) {
    case 'hero':
      return `
    <section class="${containerClasses} min-h-[60vh] flex items-center justify-center"${inlineStyle}>
      <div class="${widthClass}">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">${escapeHtml(content.headline as string || '')}</h1>
        <p class="text-lg md:text-xl opacity-80 mb-8 max-w-2xl ${style.alignment === 'center' ? 'mx-auto' : ''}">${escapeHtml(content.subheadline as string || '')}</p>
        ${content.showButton ? `
        <a href="${escapeHtml(content.buttonLink as string || '#')}" class="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-white/20 hover:bg-white/30 transition-colors">
          ${escapeHtml(content.buttonText as string || 'Get Started')}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>` : ''}
      </div>
    </section>`;

    case 'about':
      return `
    <section class="${containerClasses}"${inlineStyle}>
      <div class="${widthClass}">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">${escapeHtml(content.title as string || '')}</h2>
        ${content.showImage && content.image ? `
        <img src="${escapeHtml(content.image as string)}" alt="About" class="rounded-xl mb-6 ${style.alignment === 'center' ? 'mx-auto' : ''}" />` : ''}
        <p class="text-lg opacity-80 leading-relaxed">${escapeHtml(content.description as string || '')}</p>
      </div>
    </section>`;

    case 'features':
      const features = (content.features as Array<{ icon: string; title: string; description: string }>) || [];
      return `
    <section class="${containerClasses}"${inlineStyle}>
      <div class="${widthClass}">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">${escapeHtml(content.title as string || '')}</h2>
        <p class="text-lg opacity-70 mb-12">${escapeHtml(content.subtitle as string || '')}</p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${features.map(f => `
          <div class="p-6 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <div class="text-3xl mb-4">${f.icon}</div>
            <h3 class="text-xl font-semibold mb-2">${escapeHtml(f.title)}</h3>
            <p class="opacity-70">${escapeHtml(f.description)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;

    case 'cta':
      return `
    <section class="${containerClasses}"${inlineStyle}>
      <div class="${widthClass}">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">${escapeHtml(content.headline as string || '')}</h2>
        <p class="text-lg opacity-80 mb-8 max-w-2xl ${style.alignment === 'center' ? 'mx-auto' : ''}">${escapeHtml(content.description as string || '')}</p>
        <div class="flex flex-wrap ${style.alignment === 'center' ? 'justify-center' : ''} gap-4">
          <a href="${escapeHtml(content.primaryButtonLink as string || '#')}" class="px-8 py-3 rounded-lg font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-colors">
            ${escapeHtml(content.primaryButtonText as string || 'Get Started')}
          </a>
          ${content.showSecondaryButton ? `
          <a href="${escapeHtml(content.secondaryButtonLink as string || '#')}" class="px-8 py-3 rounded-lg font-semibold border-2 border-current opacity-80 hover:opacity-100 transition-opacity">
            ${escapeHtml(content.secondaryButtonText as string || 'Learn More')}
          </a>` : ''}
        </div>
      </div>
    </section>`;

    case 'contact':
      return `
    <section class="${containerClasses}"${inlineStyle}>
      <div class="${widthClass}">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">${escapeHtml(content.title as string || '')}</h2>
        <p class="text-lg opacity-70 mb-8">${escapeHtml(content.subtitle as string || '')}</p>
        <form class="max-w-md ${style.alignment === 'center' ? 'mx-auto' : ''} space-y-4">
          <input type="text" placeholder="Your Name" required class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition" />
          <input type="email" placeholder="Your Email" required class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition" />
          <textarea placeholder="Your Message" rows="4" required class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition resize-none"></textarea>
          <button type="submit" class="w-full px-8 py-3 rounded-lg font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-colors">
            ${escapeHtml(content.buttonText as string || 'Send Message')}
          </button>
        </form>
      </div>
    </section>`;

    case 'text':
      return `
    <section class="${containerClasses}"${inlineStyle}>
      <div class="${widthClass}">
        ${content.showHeading ? `<h2 class="text-3xl md:text-4xl font-bold mb-6">${escapeHtml(content.heading as string || '')}</h2>` : ''}
        <div class="prose prose-lg dark:prose-invert max-w-none">${escapeHtml(content.body as string || '')}</div>
      </div>
    </section>`;

    case 'spacer':
      const height = content.height as number || 64;
      return `    <div class="w-full" style="height: ${height}px"></div>`;

    case 'divider':
      return `
    <div class="${containerClasses}"${inlineStyle}>
      <hr class="${widthClass} border-t border-current opacity-20" />
    </div>`;

    default:
      return `    <!-- ${type} block -->`;
  }
}

function generateTailwindConfig(theme: ThemeSettings): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '${theme.primaryColor}10',
          100: '${theme.primaryColor}20',
          200: '${theme.primaryColor}40',
          300: '${theme.primaryColor}60',
          400: '${theme.primaryColor}80',
          500: '${theme.primaryColor}',
          600: '${theme.primaryColor}',
          700: '${theme.primaryColor}',
          800: '${theme.primaryColor}',
          900: '${theme.primaryColor}',
        },
      },
    },
  },
  plugins: [],
}`;
}

export function generateTailwindHtml(website: Website): string {
  const { settings, blocks, name } = website;
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const blocksHtml = sortedBlocks.map(block => generateBlockHtml(block)).join('\n');

  return `<!DOCTYPE html>
<html lang="en" class="${settings.theme.mode === 'dark' ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(settings.seo?.metaDescription || settings.description || '')}">
  <title>${escapeHtml(settings.seo?.metaTitle || settings.title || name)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              500: '${settings.theme.primaryColor}',
              600: '${settings.theme.primaryColor}',
            },
          },
        },
      },
    }
  </script>
  <style>
    :root {
      --primary-color: ${settings.theme.primaryColor};
    }
    body {
      font-family: ${settings.fonts.body};
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: ${settings.fonts.heading};
    }
  </style>
</head>
<body class="min-h-screen" style="background-color: ${settings.theme.backgroundColor}; color: ${settings.theme.textColor};">
  <main>
${blocksHtml}
  </main>

  <footer class="py-8 text-center text-sm opacity-50 border-t border-current/10">
    <p>© ${new Date().getFullYear()} ${escapeHtml(name)}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

export function downloadTailwindFile(website: Website, filename?: string): void {
  const html = generateTailwindHtml(website);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${website.slug || 'website'}-tailwind.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
