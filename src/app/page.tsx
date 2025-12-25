'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Layout,
  Palette,
  Smartphone,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button, Card } from '@/components/ui';

const features = [
  {
    icon: Layout,
    title: 'Drag & Drop Builder',
    description: 'Easily arrange and customize blocks to build your perfect website layout.',
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Start with professionally designed templates and make them your own.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Your website looks great on any device, from phones to desktops.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with instant loading and smooth animations.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Your data is safe with enterprise-grade security and regular backups.',
  },
  {
    icon: Globe,
    title: 'One-Click Publish',
    description: 'Go live instantly with free hosting on your custom domain.',
  },
];

const steps = [
  { step: 1, title: 'Choose a Template', description: 'Pick from our collection of stunning templates' },
  { step: 2, title: 'Customize Your Site', description: 'Add your content and make it uniquely yours' },
  { step: 3, title: 'Publish & Share', description: 'Go live with one click and share with the world' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-400/20 to-purple-400/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Sparkles className="h-4 w-4" />
              No coding required
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Create Your
              <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                {' '}Beautiful Website{' '}
              </span>
              in Minutes
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Build stunning personal websites without any coding knowledge. Our intuitive 
              drag-and-drop builder makes it easy for anyone to create their online presence.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/builder">
                <Button size="lg">
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg">
                  View Templates
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-16 max-w-5xl px-4"
        >
          <div className="overflow-hidden rounded-ios-xl border border-gray-200 bg-white shadow-ios-lg dark:border-gray-800 dark:bg-surface-dark-elevated">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-surface-dark-secondary">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="aspect-video bg-gradient-to-br from-primary-500 to-purple-600 p-8">
              <div className="flex h-full flex-col items-center justify-center text-white">
                <div className="mb-4 h-12 w-48 rounded-lg bg-white/20" />
                <div className="mb-2 h-4 w-64 rounded bg-white/30" />
                <div className="h-4 w-48 rounded bg-white/30" />
                <div className="mt-6 h-10 w-32 rounded-lg bg-white/40" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-20 dark:border-gray-800 dark:bg-surface-dark-elevated">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Everything You Need to Build
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Powerful features that make website building a breeze
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" className="h-full">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-ios-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
              Get your website up and running in three simple steps
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+40px)] top-8 hidden h-0.5 w-[calc(100%-80px)] bg-gray-200 dark:bg-gray-700 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-500 to-purple-600 px-4 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Build Your Website?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of creators who have built their online presence with WebBuilder.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/builder">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Deploy in seconds
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
