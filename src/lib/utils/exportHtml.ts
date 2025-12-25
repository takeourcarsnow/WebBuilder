/**
 * HTML/CSS Export Generator
 * Generates deployable static HTML files from website data
 */

import type { Website, WebsiteBlock, BlockStyle, ThemeSettings, FontSettings } from '@/types';

interface ExportOptions {
  minify?: boolean;
  includeComments?: boolean;
}

// Mapping for padding classes to actual values
const paddingValues: Record<string, string> = {
  none: '0',
  small: '1rem',
  medium: '2rem',
  large: '4rem',
};

// Mapping for width classes
const widthValues: Record<string, string> = {
  narrow: '640px',
  medium: '768px',
  wide: '1024px',
  full: '100%',
};

// Mapping for border-radius
const borderRadiusValues: Record<string, string> = {
  none: '0',
  small: '0.25rem',
  medium: '0.5rem',
  large: '1rem',
};

// Mapping for shadow
const shadowValues: Record<string, string> = {
  none: 'none',
  small: '0 1px 3px rgba(0,0,0,0.12)',
  medium: '0 4px 6px rgba(0,0,0,0.1)',
  large: '0 10px 25px rgba(0,0,0,0.15)',
};

function generateBlockStyles(style: BlockStyle, theme: ThemeSettings): string {
  const styles: string[] = [];
  
  if (style.backgroundColor) {
    styles.push(`background-color: ${style.backgroundColor}`);
  }
  if (style.textColor) {
    styles.push(`color: ${style.textColor}`);
  }
  if (style.padding && paddingValues[style.padding]) {
    styles.push(`padding: ${paddingValues[style.padding]}`);
  }
  if (style.borderRadius && borderRadiusValues[style.borderRadius]) {
    styles.push(`border-radius: ${borderRadiusValues[style.borderRadius]}`);
  }
  if (style.shadow && shadowValues[style.shadow]) {
    styles.push(`box-shadow: ${shadowValues[style.shadow]}`);
  }
  
  return styles.join('; ');
}

function generateAlignmentClass(alignment?: string): string {
  switch (alignment) {
    case 'left': return 'text-left';
    case 'right': return 'text-right';
    case 'center':
    default: return 'text-center';
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateBlockHtml(block: WebsiteBlock, theme: ThemeSettings): string {
  const { content, style, type } = block;
  const blockStyles = generateBlockStyles(style, theme);
  const alignClass = generateAlignmentClass(style.alignment);
  const maxWidth = style.width ? widthValues[style.width] || '100%' : '100%';

  switch (type) {
    case 'hero':
      return `
    <section class="hero-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h1 class="hero-headline">${escapeHtml(content.headline as string || '')}</h1>
        <p class="hero-subheadline">${escapeHtml(content.subheadline as string || '')}</p>
        ${content.showButton ? `<a href="${escapeHtml(content.buttonLink as string || '#')}" class="btn btn-primary">${escapeHtml(content.buttonText as string || 'Get Started')}</a>` : ''}
      </div>
    </section>`;

    case 'about':
      return `
    <section class="about-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        ${content.showImage && content.image ? `<img src="${escapeHtml(content.image as string)}" alt="About" class="about-image">` : ''}
        <p class="about-description">${escapeHtml(content.description as string || '')}</p>
      </div>
    </section>`;

    case 'features':
      const features = (content.features as Array<{ icon: string; title: string; description: string }>) || [];
      return `
    <section class="features-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <p class="section-subtitle">${escapeHtml(content.subtitle as string || '')}</p>
        <div class="features-grid">
          ${features.map(f => `
          <div class="feature-card">
            <div class="feature-icon">${f.icon}</div>
            <h3 class="feature-title">${escapeHtml(f.title)}</h3>
            <p class="feature-description">${escapeHtml(f.description)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;

    case 'gallery':
      const images = (content.images as Array<{ src: string; alt: string; caption: string }>) || [];
      const columns = content.columns as number || 3;
      return `
    <section class="gallery-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <div class="gallery-grid" style="grid-template-columns: repeat(${columns}, 1fr);">
          ${images.map(img => `
          <figure class="gallery-item">
            <img src="${escapeHtml(img.src || '/placeholder.jpg')}" alt="${escapeHtml(img.alt)}">
            ${img.caption ? `<figcaption>${escapeHtml(img.caption)}</figcaption>` : ''}
          </figure>`).join('')}
        </div>
      </div>
    </section>`;

    case 'testimonials':
      const testimonials = (content.testimonials as Array<{ quote: string; author: string; role: string; avatar: string }>) || [];
      return `
    <section class="testimonials-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <div class="testimonials-grid">
          ${testimonials.map(t => `
          <blockquote class="testimonial-card">
            <p class="testimonial-quote">"${escapeHtml(t.quote)}"</p>
            <footer class="testimonial-author">
              ${t.avatar ? `<img src="${escapeHtml(t.avatar)}" alt="${escapeHtml(t.author)}" class="testimonial-avatar">` : ''}
              <div>
                <cite class="author-name">${escapeHtml(t.author)}</cite>
                <p class="author-role">${escapeHtml(t.role)}</p>
              </div>
            </footer>
          </blockquote>`).join('')}
        </div>
      </div>
    </section>`;

    case 'contact':
      return `
    <section class="contact-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <p class="section-subtitle">${escapeHtml(content.subtitle as string || '')}</p>
        <form class="contact-form" action="#" method="POST">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">${escapeHtml(content.buttonText as string || 'Send Message')}</button>
        </form>
      </div>
    </section>`;

    case 'cta':
      return `
    <section class="cta-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="cta-headline">${escapeHtml(content.headline as string || '')}</h2>
        <p class="cta-description">${escapeHtml(content.description as string || '')}</p>
        <div class="cta-buttons">
          <a href="${escapeHtml(content.primaryButtonLink as string || '#')}" class="btn btn-primary">${escapeHtml(content.primaryButtonText as string || 'Get Started')}</a>
          ${content.showSecondaryButton ? `<a href="${escapeHtml(content.secondaryButtonLink as string || '#')}" class="btn btn-secondary">${escapeHtml(content.secondaryButtonText as string || 'Learn More')}</a>` : ''}
        </div>
      </div>
    </section>`;

    case 'text':
      return `
    <section class="text-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        ${content.showHeading ? `<h2 class="section-title">${escapeHtml(content.heading as string || '')}</h2>` : ''}
        <div class="text-content">${escapeHtml(content.body as string || '')}</div>
      </div>
    </section>`;

    case 'skills':
      const skills = (content.skills as Array<{ name: string; level: number }>) || [];
      const showPercentage = content.showPercentage as boolean;
      return `
    <section class="skills-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <div class="skills-list">
          ${skills.map(skill => `
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${escapeHtml(skill.name)}</span>
              ${showPercentage ? `<span class="skill-percentage">${skill.level}%</span>` : ''}
            </div>
            <div class="skill-bar">
              <div class="skill-progress" style="width: ${skill.level}%"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;

    case 'experience':
      const experiences = (content.items as Array<{ year: string; title: string; company: string; description: string }>) || [];
      return `
    <section class="experience-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <div class="timeline">
          ${experiences.map(exp => `
          <div class="timeline-item">
            <span class="timeline-year">${escapeHtml(exp.year)}</span>
            <h3 class="timeline-title">${escapeHtml(exp.title)}</h3>
            <p class="timeline-company">${escapeHtml(exp.company)}</p>
            <p class="timeline-description">${escapeHtml(exp.description)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`;

    case 'projects':
      const projects = (content.projects as Array<{ title: string; description: string; image: string; link: string; tags: string[] }>) || [];
      return `
    <section class="projects-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        <h2 class="section-title">${escapeHtml(content.title as string || '')}</h2>
        <div class="projects-grid">
          ${projects.map(project => `
          <article class="project-card">
            ${project.image ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="project-image">` : ''}
            <div class="project-content">
              <h3 class="project-title">${escapeHtml(project.title)}</h3>
              <p class="project-description">${escapeHtml(project.description)}</p>
              <div class="project-tags">
                ${project.tags?.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('') || ''}
              </div>
              ${project.link ? `<a href="${escapeHtml(project.link)}" class="project-link">View Project →</a>` : ''}
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>`;

    case 'social-links':
      const links = (content.links as Array<{ platform: string; url: string }>) || [];
      const showLabels = content.showLabels as boolean;
      return `
    <section class="social-section ${alignClass}" style="${blockStyles}">
      <div class="container" style="max-width: ${maxWidth}; margin: 0 auto; padding: 0 1.5rem;">
        ${content.title ? `<h2 class="section-title">${escapeHtml(content.title as string)}</h2>` : ''}
        <div class="social-links">
          ${links.map(link => `<a href="${escapeHtml(link.url)}" class="social-link" target="_blank" rel="noopener noreferrer">${showLabels ? escapeHtml(link.platform) : getSocialIcon(link.platform)}</a>`).join('')}
        </div>
      </div>
    </section>`;

    case 'spacer':
      const height = content.height as number || 64;
      return `<div class="spacer" style="height: ${height}px;"></div>`;

    case 'divider':
      const dividerStyle = content.style as string || 'solid';
      const thickness = content.thickness as number || 1;
      return `
    <div class="divider-wrapper" style="${blockStyles}">
      <hr class="divider" style="border-style: ${dividerStyle}; border-width: ${thickness}px 0 0 0; max-width: ${maxWidth}; margin: 0 auto;">
    </div>`;

    default:
      return `<!-- Unknown block type: ${type} -->`;
  }
}

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: '𝕏',
    instagram: '📷',
    facebook: 'f',
    linkedin: 'in',
    github: '⌨',
    youtube: '▶',
    tiktok: '♪',
    dribbble: '🏀',
    behance: 'Bē',
    medium: 'M',
    website: '🌐',
  };
  return icons[platform] || platform.charAt(0).toUpperCase();
}

function generateCSS(theme: ThemeSettings, fonts: FontSettings): string {
  return `
/* Generated CSS - Website Builder */
:root {
  --primary-color: ${theme.primaryColor};
  --secondary-color: ${theme.secondaryColor};
  --background-color: ${theme.backgroundColor};
  --text-color: ${theme.textColor};
  --accent-color: ${theme.accentColor};
  --heading-font: ${fonts.heading};
  --body-font: ${fonts.body};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--body-font);
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Typography Sizes */
${fonts.headingSize === 'small' ? `
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }
` : fonts.headingSize === 'large' ? `
h1 { font-size: 3.5rem; }
h2 { font-size: 2.5rem; }
h3 { font-size: 2rem; }
` : `
h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
`}

${fonts.bodySize === 'small' ? `
body { font-size: 0.875rem; }
` : fonts.bodySize === 'large' ? `
body { font-size: 1.125rem; }
` : `
body { font-size: 1rem; }
`}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-color);
  border: 2px solid var(--text-color);
}

.btn-secondary:hover {
  background-color: var(--text-color);
  color: var(--background-color);
}

/* Alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Hero Section */
.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-headline {
  font-size: clamp(2rem, 5vw, 4rem);
  margin-bottom: 1.5rem;
}

.hero-subheadline {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Section Titles */
.section-title {
  margin-bottom: 1rem;
}

.section-subtitle {
  opacity: 0.8;
  margin-bottom: 2rem;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  padding: 2rem;
  background: rgba(0,0,0,0.03);
  border-radius: 1rem;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

/* Gallery Grid */
.gallery-grid {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.gallery-item figcaption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Testimonials */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  padding: 2rem;
  background: rgba(0,0,0,0.03);
  border-radius: 1rem;
  border-left: 4px solid var(--primary-color);
}

.testimonial-quote {
  font-style: italic;
  margin-bottom: 1.5rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  font-style: normal;
  display: block;
}

.author-role {
  opacity: 0.7;
  font-size: 0.875rem;
  margin: 0;
}

/* Contact Form */
.contact-form {
  max-width: 500px;
  margin: 2rem auto 0;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(0,0,0,0.1);
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* CTA Section */
.cta-section {
  padding: 4rem 0;
}

.cta-headline {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

/* Skills */
.skills-list {
  max-width: 600px;
  margin: 2rem auto 0;
}

.skill-item {
  margin-bottom: 1.5rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-bar {
  height: 8px;
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Timeline */
.timeline {
  max-width: 600px;
  margin: 2rem auto 0;
  border-left: 2px solid var(--primary-color);
  padding-left: 2rem;
}

.timeline-item {
  margin-bottom: 2rem;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -2.5rem;
  top: 0;
  width: 12px;
  height: 12px;
  background: var(--primary-color);
  border-radius: 50%;
}

.timeline-year {
  font-size: 0.875rem;
  color: var(--primary-color);
  font-weight: 600;
}

.timeline-company {
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  border-radius: 1rem;
  overflow: hidden;
  background: rgba(0,0,0,0.03);
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-content {
  padding: 1.5rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.project-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(0,0,0,0.05);
  border-radius: 50%;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
}

/* Spacer & Divider */
.spacer {
  width: 100%;
}

.divider-wrapper {
  padding: 1rem 0;
}

.divider {
  border: none;
  border-top: 1px solid rgba(0,0,0,0.1);
}

/* About Section */
.about-image {
  max-width: 300px;
  border-radius: 1rem;
  margin: 1.5rem auto;
  display: block;
}

.about-description {
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
}

/* Footer */
footer {
  padding: 2rem;
  text-align: center;
  opacity: 0.6;
  font-size: 0.875rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  margin-top: 4rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    min-height: 50vh;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .testimonials-grid,
  .features-grid,
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
`;
}

export function generateFullHtml(website: Website, options: ExportOptions = {}): string {
  const { settings, blocks, name } = website;
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  const blocksHtml = sortedBlocks
    .map(block => generateBlockHtml(block, settings.theme))
    .join('\n');

  const css = generateCSS(settings.theme, settings.fonts);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(settings.seo?.metaDescription || settings.description || '')}">
  <meta property="og:title" content="${escapeHtml(settings.seo?.metaTitle || settings.title || name)}">
  <meta property="og:description" content="${escapeHtml(settings.seo?.metaDescription || settings.description || '')}">
  ${settings.seo?.ogImage ? `<meta property="og:image" content="${escapeHtml(settings.seo.ogImage)}">` : ''}
  <title>${escapeHtml(settings.seo?.metaTitle || settings.title || name)}</title>
  <style>
${css}
  </style>
</head>
<body>
  <main>
${blocksHtml}
  </main>
  
  <footer>
    <p>© ${new Date().getFullYear()} ${escapeHtml(name)}. All rights reserved.</p>
  </footer>
</body>
</html>`;

  return options.minify ? html.replace(/\n\s+/g, '\n').replace(/\n{2,}/g, '\n') : html;
}

export function downloadHtmlFile(website: Website, filename?: string): void {
  const html = generateFullHtml(website);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${website.slug || 'website'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
