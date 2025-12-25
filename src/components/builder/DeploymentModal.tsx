'use client';

import React, { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import { Cloud, Download, ExternalLink, Check, Zap, Github, Globe, Copy, CheckCircle2 } from 'lucide-react';
import { useWebsiteStore, useEditorStore } from '@/stores';
import { downloadDeploymentPackage, openVercelDeploy, openNetlifyDeploy } from '@/lib/utils/exportDeploy';
import { cn } from '@/lib/utils';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeploymentPlatform = 'vercel' | 'netlify' | 'github-pages' | null;

const platforms = [
  {
    id: 'vercel' as const,
    name: 'Vercel',
    icon: Zap,
    description: 'Deploy in seconds with automatic SSL',
    features: ['Instant deployment', 'Free SSL certificate', 'Global CDN', 'Custom domains'],
    difficulty: 'Easiest',
    time: '< 1 minute',
    color: 'text-black dark:text-white',
    bgColor: 'bg-black/5 dark:bg-white/10',
    recommended: true,
  },
  {
    id: 'netlify' as const,
    name: 'Netlify',
    icon: Cloud,
    description: 'Drag & drop deployment platform',
    features: ['One-click deploy', 'Form handling', 'Free hosting', 'Instant rollbacks'],
    difficulty: 'Very Easy',
    time: '< 1 minute',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10',
    recommended: false,
  },
  {
    id: 'github-pages' as const,
    name: 'GitHub Pages',
    icon: Github,
    description: 'Free hosting with GitHub',
    features: ['Free hosting', 'Version control', 'Custom domains', 'GitHub integration'],
    difficulty: 'Easy',
    time: '2-3 minutes',
    color: 'text-gray-800 dark:text-gray-200',
    bgColor: 'bg-gray-500/10',
    recommended: false,
  },
];

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const { website } = useWebsiteStore();
  const { addNotification } = useEditorStore();
  const [selectedPlatform, setSelectedPlatform] = useState<DeploymentPlatform>(null);
  const [step, setStep] = useState<'select' | 'instructions' | 'deploying' | 'success'>('select');
  const [deploymentUrl, setDeploymentUrl] = useState<string>('');

  const handleClose = () => {
    setSelectedPlatform(null);
    setStep('select');
    setDeploymentUrl('');
    onClose();
  };

  const handleSelectPlatform = (platformId: DeploymentPlatform) => {
    setSelectedPlatform(platformId);
    setStep('instructions');
  };

  const handleDeploy = async () => {
    if (!website || !selectedPlatform) return;

    setStep('deploying');

    try {
      if (selectedPlatform === 'vercel') {
        openVercelDeploy(website);
        addNotification({
          type: 'success',
          message: 'Deployment package downloaded! Opening Vercel...',
        });
      } else if (selectedPlatform === 'netlify') {
        openNetlifyDeploy(website);
        addNotification({
          type: 'success',
          message: 'Deployment package downloaded! Opening Netlify...',
        });
      } else {
        await downloadDeploymentPackage(website, selectedPlatform);
        addNotification({
          type: 'success',
          message: 'Deployment package downloaded!',
        });
      }

      // Simulate deployment completion for demo
      setTimeout(() => {
        setStep('success');
        // Mock URL - in reality, user would get this from the platform
        setDeploymentUrl(`https://${website.slug || 'my-website'}-demo.vercel.app`);
      }, 2000);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to prepare deployment package',
      });
      setStep('instructions');
    }
  };

  const handleDownloadOnly = async () => {
    if (!website || !selectedPlatform) return;

    try {
      await downloadDeploymentPackage(website, selectedPlatform);
      addNotification({
        type: 'success',
        message: `${selectedPlatform} package downloaded successfully!`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to download package',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      type: 'success',
      message: 'Copied to clipboard!',
      duration: 1500,
    });
  };

  const renderSelectPlatform = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Choose Your Deployment Platform
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select where you want to deploy your website. All options are free and beginner-friendly!
        </p>
      </div>

      <div className="space-y-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.id}
              onClick={() => handleSelectPlatform(platform.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                'hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-500/10',
                'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark-elevated',
                'relative group'
              )}
            >
              {platform.recommended && (
                <div className="absolute -top-2 right-4 px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-lg', platform.bgColor)}>
                  <Icon className={cn('h-6 w-6', platform.color)} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {platform.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {platform.difficulty} • {platform.time}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {platform.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {platform.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-surface-dark-secondary rounded-full text-gray-700 dark:text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
        <div className="flex gap-3">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              No Coding Required!
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              We'll prepare everything for you. Just follow the simple steps and your website will be live in under a minute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstructions = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    if (!platform) return null;

    const Icon = platform.icon;

    const instructions = {
      vercel: [
        {
          title: 'Download Your Website',
          description: 'Click "Deploy Now" to download your website files',
          icon: Download,
        },
        {
          title: 'Drag & Drop to Vercel',
          description: 'We\'ll open Vercel in a new tab. Just drag and drop the downloaded folder',
          icon: Cloud,
        },
        {
          title: 'Your Site is Live!',
          description: 'Vercel will give you a URL - your website is now on the internet!',
          icon: Check,
        },
      ],
      netlify: [
        {
          title: 'Download Your Website',
          description: 'Click "Deploy Now" to download your website files',
          icon: Download,
        },
        {
          title: 'Drop to Netlify',
          description: 'We\'ll open Netlify Drop. Drag your folder to the page',
          icon: Cloud,
        },
        {
          title: 'Get Your Live URL',
          description: 'Netlify will deploy your site and give you a shareable link',
          icon: Check,
        },
      ],
      'github-pages': [
        {
          title: 'Download Your Website',
          description: 'Download the prepared package with all files',
          icon: Download,
        },
        {
          title: 'Create GitHub Repository',
          description: 'Go to GitHub, create a new repository, and upload the files',
          icon: Github,
        },
        {
          title: 'Enable GitHub Pages',
          description: 'In Settings > Pages, enable deployment from main branch',
          icon: Check,
        },
      ],
    };

    const steps = instructions[selectedPlatform as keyof typeof instructions] || [];

    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setStep('select')}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 mb-4"
          >
            ← Back to platforms
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('p-2 rounded-lg', platform.bgColor)}>
              <Icon className={cn('h-6 w-6', platform.color)} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Deploy to {platform.name}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Follow these simple steps to get your website online in {platform.time}
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <div
                key={idx}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-surface-dark-secondary rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    {step.title}
                    <StepIcon className="h-4 w-4 text-gray-400" />
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleDeploy}
          >
            <Cloud className="h-4 w-4 mr-2" />
            Deploy Now
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadOnly}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>First time deploying?</strong> Don't worry! These platforms are designed for beginners. 
            You don't need any technical knowledge - just follow the steps.
          </p>
        </div>
      </div>
    );
  };

  const renderDeploying = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-500/20 rounded-full mb-4 animate-pulse">
        <Cloud className="h-8 w-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Preparing Your Deployment...
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Creating your deployment package and opening the deployment platform
      </p>
      <div className="mt-6 max-w-xs mx-auto h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full animate-progress" style={{ width: '70%' }} />
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full mb-4">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Ready to Deploy!
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Your deployment package has been downloaded. Follow the platform's instructions to complete the deployment.
      </p>

      {/* Mock deployment URL (would be real in production) */}
      <div className="p-4 bg-gray-50 dark:bg-surface-dark-secondary rounded-lg mb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          After deployment, your site will be available at a URL like:
        </p>
        <div className="flex items-center gap-2 justify-center">
          <code className="text-sm font-mono text-primary-600 dark:text-primary-400">
            {deploymentUrl}
          </code>
          <button
            onClick={() => copyToClipboard(deploymentUrl)}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-surface-dark rounded"
          >
            <Copy className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="primary"
          onClick={handleClose}
          className="w-full"
        >
          Got it!
        </Button>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Need help? Check the README.md file in your download for detailed instructions.
        </p>
      </div>
    </div>
  );

  const content = {
    select: renderSelectPlatform,
    instructions: renderInstructions,
    deploying: renderDeploying,
    success: renderSuccess,
  }[step];

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleClose}
      title={step === 'select' ? 'Deploy Your Website' : ''}
      className="max-w-2xl"
    >
      {content()}
    </Modal>
  );
};
