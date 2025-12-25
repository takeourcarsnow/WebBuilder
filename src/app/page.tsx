'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Layout,
  Code2,
  Layers,
  Zap,
  Lock,
  Server,
  ArrowRight,
  CheckCircle,
  Terminal,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button, Card } from '@/components/ui';

const features = [
  {
    icon: Code2,
    title: 'Advanced Builder',
    description: 'Precision-engineered drag & drop interface for maximum control and efficiency.',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description: 'Component-based system designed for scalability and maintainability.',
  },
  {
    icon: Terminal,
    title: 'Developer Tools',
    description: 'Professional-grade tools built for modern web development workflows.',
  },
  {
    icon: Zap,
    title: 'Performance Optimized',
    description: 'Enterprise-level optimization delivering sub-second load times.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Military-grade encryption with comprehensive data protection protocols.',
  },
  {
    icon: Server,
    title: 'Instant Deployment',
    description: 'One-command deployment to global edge infrastructure.',
  },
];

const steps = [
  { step: 1, title: 'Initialize Project', description: 'Select from production-ready architectural templates' },
  { step: 2, title: 'Configure System', description: 'Customize components with precision controls' },
  { step: 3, title: 'Deploy Pipeline', description: 'Launch to production with automated deployment' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32 lg:py-40">
        {/* Grid pattern background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-surface-dark" />
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 0.8, 0.3, 1] }}
          >
            <motion.div 
              className="mb-6 inline-flex items-center gap-2 border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-700 dark:border-gray-800 dark:bg-surface-dark-elevated dark:text-gray-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 0.8, 0.3, 1] }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Enterprise Web Platform
            </motion.div>

            <motion.h1 
              className="mb-6 max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 0.8, 0.3, 1] }}
            >
              Build Production-Grade
              <motion.span 
                className="block bg-gradient-to-r from-accent-teal to-primary-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 0.8, 0.3, 1] }}
              >
                Digital Systems
              </motion.span>
            </motion.h1>

            <motion.p 
              className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-text-dark-secondary md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 0.8, 0.3, 1] }}
            >
              Stack your way to success. Advanced web development platform engineered 
              for professionals who demand enterprise-level performance.
            </motion.p>

            <motion.div 
              className="flex flex-col items-start gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 0.8, 0.3, 1] }}
            >
              <Link href="/builder">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button size="lg" className="group">
                    Initialize Platform
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/templates">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button variant="outline" size="lg">
                    View Architecture
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 0.8, 0.3, 1] }}
          className="mx-auto mt-20 max-w-6xl px-4"
        >
          <div className="overflow-hidden border border-gray-200 bg-white shadow-palantir-lg dark:border-gray-800 dark:bg-surface-dark-elevated">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-surface-dark-secondary">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="ml-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                production-system-v1.0
              </span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-surface-dark via-surface-dark-elevated to-surface-dark-secondary p-12">
              <div className="flex h-full flex-col items-start justify-center text-white">
                <div className="mb-4 h-8 w-64 bg-gradient-to-r from-accent-teal/40 to-transparent" />
                <div className="mb-2 h-4 w-96 bg-gray-700" />
                <div className="mb-2 h-4 w-80 bg-gray-700" />
                <div className="h-4 w-72 bg-gray-700" />
                <div className="mt-8 flex gap-3">
                  <div className="h-10 w-28 border border-accent-teal/50" />
                  <div className="h-10 w-28 border border-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-200 bg-gray-50 px-4 py-24 dark:border-gray-800 dark:bg-surface-dark-elevated">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              Enterprise-Grade
              <span className="block text-accent-teal">Capabilities</span>
            </h2>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-text-dark-secondary">
              Built with the same principles that power mission-critical systems worldwide.
            </p>
          </motion.div>

          <div className="grid gap-px bg-gray-200 dark:bg-gray-800 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    ease: [0.16, 0.8, 0.3, 1]
                  }}
                >
                  <div className="group h-full bg-white p-8 transition-all duration-300 hover:bg-gray-50 dark:bg-surface-dark dark:hover:bg-surface-dark-secondary">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center border border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-800 dark:bg-surface-dark-secondary dark:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-text-dark-secondary">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-gray-200 px-4 py-24 dark:border-gray-800">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 0.8, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
              Deployment Protocol
            </h2>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-text-dark-secondary">
              Streamlined process from initialization to production deployment.
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 0.8, 0.3, 1]
                }}
                className="flex items-start gap-8 border-l-2 border-gray-200 pl-8 dark:border-gray-800"
              >
                <div className="-ml-[41px] flex h-16 w-16 flex-shrink-0 items-center justify-center border-2 border-gray-200 bg-white font-mono text-2xl font-bold text-gray-900 dark:border-gray-800 dark:bg-surface-dark dark:text-white">
                  {item.step}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-text-dark-secondary">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-br from-surface-dark via-surface-dark-elevated to-surface-dark px-4 py-24 dark:border-gray-800">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 0.8, 0.3, 1] }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Deploy Your System
              <span className="block text-accent-teal">Today</span>
            </h2>
            <p className="mb-8 max-w-2xl text-lg text-gray-300">
              Join organizations deploying mission-critical applications with confidence.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/builder">
                <Button
                  size="lg"
                  className="group border border-accent-teal bg-accent-teal text-surface-dark hover:bg-accent-teal/90"
                >
                  Start Deployment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-700 text-white hover:bg-surface-dark-secondary"
                >
                  View Documentation
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid gap-8 border-t border-gray-800 pt-8 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent-teal" />
                <div>
                  <div className="font-semibold text-white">Zero Configuration</div>
                  <div className="text-sm text-gray-400">Production-ready defaults</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent-teal" />
                <div>
                  <div className="font-semibold text-white">Enterprise Security</div>
                  <div className="text-sm text-gray-400">SOC 2 Type II certified</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-accent-teal" />
                <div>
                  <div className="font-semibold text-white">Global Infrastructure</div>
                  <div className="text-sm text-gray-400">Edge deployment worldwide</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
