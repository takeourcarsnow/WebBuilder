/**
 * React/Next.js Export Generator
 * Generates deployable React components from website data
 */

import type { Website, WebsiteBlock, ThemeSettings, FontSettings } from '@/types';

function pascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generateBlockComponent(block: WebsiteBlock): string {
  const { content, style, type } = block;
  const componentName = `${pascalCase(type)}Block`;

  const styleProps = `
    backgroundColor: '${style.backgroundColor || 'transparent'}',
    color: '${style.textColor || 'inherit'}',
  `;

  switch (type) {
    case 'hero':
      return `
const ${componentName} = () => (
  <section className="min-h-[60vh] flex items-center justify-center px-4 py-16" style={{${styleProps}}}>
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">${content.headline || ''}</h1>
      <p className="text-xl md:text-2xl opacity-80 mb-8">${content.subheadline || ''}</p>
      ${content.showButton ? `<a href="${content.buttonLink || '#'}" className="inline-block px-8 py-3 rounded-lg font-semibold bg-white/20 hover:bg-white/30 transition">${content.buttonText || 'Get Started'}</a>` : ''}
    </div>
  </section>
);`;

    case 'about':
      return `
const ${componentName} = () => (
  <section className="py-16 px-4" style={{${styleProps}}}>
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">${content.title || ''}</h2>
      <p className="text-lg opacity-80">${content.description || ''}</p>
    </div>
  </section>
);`;

    case 'features':
      const features = (content.features as Array<{ icon: string; title: string; description: string }>) || [];
      return `
const ${componentName} = () => (
  <section className="py-16 px-4" style={{${styleProps}}}>
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">${content.title || ''}</h2>
      <p className="text-center opacity-80 mb-12">${content.subtitle || ''}</p>
      <div className="grid md:grid-cols-3 gap-8">
        ${features.map(f => `
        <div className="p-6 rounded-xl bg-black/5">
          <div className="text-2xl mb-4">${f.icon}</div>
          <h3 className="text-xl font-semibold mb-2">${f.title}</h3>
          <p className="opacity-70">${f.description}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>
);`;

    case 'cta':
      return `
const ${componentName} = () => (
  <section className="py-16 px-4 text-center" style={{${styleProps}}}>
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">${content.headline || ''}</h2>
      <p className="text-lg opacity-80 mb-8">${content.description || ''}</p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="${content.primaryButtonLink || '#'}" className="px-8 py-3 rounded-lg font-semibold bg-white text-gray-900">${content.primaryButtonText || 'Get Started'}</a>
        ${content.showSecondaryButton ? `<a href="${content.secondaryButtonLink || '#'}" className="px-8 py-3 rounded-lg font-semibold border-2 border-white/30">${content.secondaryButtonText || 'Learn More'}</a>` : ''}
      </div>
    </div>
  </section>
);`;

    case 'contact':
      return `
const ${componentName} = () => (
  <section className="py-16 px-4" style={{${styleProps}}}>
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">${content.title || ''}</h2>
      <p className="opacity-80 mb-8">${content.subtitle || ''}</p>
      <form className="space-y-4 text-left">
        <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-lg border" />
        <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border" />
        <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg border" />
        <button type="submit" className="w-full px-8 py-3 rounded-lg font-semibold bg-primary text-white">${content.buttonText || 'Send'}</button>
      </form>
    </div>
  </section>
);`;

    case 'text':
      return `
const ${componentName} = () => (
  <section className="py-16 px-4" style={{${styleProps}}}>
    <div className="max-w-3xl mx-auto">
      ${content.showHeading ? `<h2 className="text-3xl font-bold mb-6">${content.heading || ''}</h2>` : ''}
      <p className="text-lg leading-relaxed">${content.body || ''}</p>
    </div>
  </section>
);`;

    default:
      return `
const ${componentName} = () => (
  <section className="py-16 px-4" style={{${styleProps}}}>
    <div className="max-w-4xl mx-auto">
      {/* ${type} block */}
    </div>
  </section>
);`;
  }
}

function generateThemeStyles(theme: ThemeSettings, fonts: FontSettings): string {
  return `
const theme = {
  colors: {
    primary: '${theme.primaryColor}',
    secondary: '${theme.secondaryColor}',
    background: '${theme.backgroundColor}',
    text: '${theme.textColor}',
    accent: '${theme.accentColor}',
  },
  fonts: {
    heading: '${fonts.heading}',
    body: '${fonts.body}',
  },
};`;
}

export function generateReactCode(website: Website): string {
  const { settings, blocks, name } = website;
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const imports = `'use client';

import React from 'react';
`;

  const themeCode = generateThemeStyles(settings.theme, settings.fonts);

  const components = sortedBlocks.map(block => generateBlockComponent(block)).join('\n');

  const mainComponent = `
export default function ${pascalCase(name.replace(/\s+/g, ''))}Page() {
  return (
    <main style={{ 
      backgroundColor: theme.colors.background, 
      color: theme.colors.text,
      fontFamily: theme.fonts.body,
      minHeight: '100vh',
    }}>
      ${sortedBlocks.map(block => `<${pascalCase(block.type)}Block />`).join('\n      ')}
      
      <footer className="py-8 text-center text-sm opacity-50 border-t">
        © ${new Date().getFullYear()} ${name}. All rights reserved.
      </footer>
    </main>
  );
}
`;

  return `${imports}\n${themeCode}\n${components}\n${mainComponent}`;
}

export function downloadReactFile(website: Website, filename?: string): void {
  const code = generateReactCode(website);
  const blob = new Blob([code], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${website.slug || 'page'}.tsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
