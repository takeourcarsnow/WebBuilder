/**
 * Deployment Export Generator
 * Creates deployment packages for various hosting platforms
 */

import type { Website } from '@/types';
import { generateFullHtml } from './exportHtml';
import JSZip from 'jszip';

export interface DeploymentPackage {
  files: { name: string; content: string }[];
  instructions: string;
}

/**
 * Create a deployment package for Vercel
 */
export function createVercelPackage(website: Website): DeploymentPackage {
  const html = generateFullHtml(website);
  
  return {
    files: [
      {
        name: 'index.html',
        content: html,
      },
      {
        name: 'vercel.json',
        content: JSON.stringify({
          version: 2,
          builds: [
            {
              src: '*.html',
              use: '@vercel/static',
            },
          ],
        }, null, 2),
      },
      {
        name: 'README.md',
        content: `# ${website.name}

${website.settings.description || 'Website built with WebBuilder'}

## Deployment

This website has been exported from WebBuilder and is ready to deploy to Vercel.

### Quick Deploy

1. Install Vercel CLI: \`npm i -g vercel\`
2. Run: \`vercel\`
3. Follow the prompts

Or simply drag and drop this folder to https://vercel.com/new

## About

- Created: ${new Date(website.createdAt).toLocaleDateString()}
- Blocks: ${website.blocks.length}
- Last Updated: ${new Date(website.updatedAt).toLocaleDateString()}
`,
      },
    ],
    instructions: 'vercel',
  };
}

/**
 * Create a deployment package for Netlify
 */
export function createNetlifyPackage(website: Website): DeploymentPackage {
  const html = generateFullHtml(website);
  
  return {
    files: [
      {
        name: 'index.html',
        content: html,
      },
      {
        name: 'netlify.toml',
        content: `[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
      },
      {
        name: 'README.md',
        content: `# ${website.name}

${website.settings.description || 'Website built with WebBuilder'}

## Deployment to Netlify

This website has been exported from WebBuilder and is ready to deploy.

### Quick Deploy

1. Drag and drop this folder to https://app.netlify.com/drop
2. Your site will be live in seconds!

Or use Netlify CLI:

1. Install: \`npm i -g netlify-cli\`
2. Run: \`netlify deploy\`
`,
      },
    ],
    instructions: 'netlify',
  };
}

/**
 * Create a deployment package for GitHub Pages
 */
export function createGitHubPagesPackage(website: Website): DeploymentPackage {
  const html = generateFullHtml(website);
  
  return {
    files: [
      {
        name: 'index.html',
        content: html,
      },
      {
        name: '.nojekyll',
        content: '',
      },
      {
        name: 'README.md',
        content: `# ${website.name}

${website.settings.description || 'Website built with WebBuilder'}

## Deployment to GitHub Pages

This website has been exported from WebBuilder.

### Deploy Instructions

1. Create a new GitHub repository
2. Upload these files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/" (root) folder
6. Click Save

Your site will be available at \`https://[username].github.io/[repository-name]\`
`,
      },
    ],
    instructions: 'github-pages',
  };
}

/**
 * Download deployment package as ZIP
 */
export async function downloadDeploymentPackage(
  website: Website,
  platform: 'vercel' | 'netlify' | 'github-pages'
): Promise<void> {
  let packageData: DeploymentPackage;
  
  switch (platform) {
    case 'vercel':
      packageData = createVercelPackage(website);
      break;
    case 'netlify':
      packageData = createNetlifyPackage(website);
      break;
    case 'github-pages':
      packageData = createGitHubPagesPackage(website);
      break;
  }

  // Create ZIP file
  const zip = new JSZip();
  
  packageData.files.forEach(file => {
    zip.file(file.name, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${website.slug || 'website'}-${platform}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Deploy directly to Vercel using their API
 * This creates a deployment and returns the URL
 */
export async function deployToVercel(website: Website, projectName?: string): Promise<{ url: string; deploymentId: string }> {
  // Note: This requires the Vercel API token to be set by the user
  // For security, we'll guide users to deploy via CLI or drag-and-drop instead
  // Direct API deployment would expose tokens in the frontend
  
  throw new Error('Direct API deployment is not available for security reasons. Please use the CLI or drag-and-drop method.');
}

/**
 * Open Vercel deploy page with deployment ready
 */
export function openVercelDeploy(website: Website): void {
  // Create the package and open Vercel's new project page
  downloadDeploymentPackage(website, 'vercel');
  
  // Open Vercel deployment page in new tab
  setTimeout(() => {
    window.open('https://vercel.com/new', '_blank');
  }, 500);
}

/**
 * Open Netlify deploy page
 */
export function openNetlifyDeploy(website: Website): void {
  downloadDeploymentPackage(website, 'netlify');
  
  setTimeout(() => {
    window.open('https://app.netlify.com/drop', '_blank');
  }, 500);
}
