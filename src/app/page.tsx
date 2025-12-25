'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Layout,
  Palette,
  Layers,
  Zap,
  Download,
  Wand2,
  ArrowRight,
  Check,
  Star,
  MousePointerClick,
  Eye,
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { Button, Card } from '@/components/ui';

const features = [
  {
    icon: MousePointerClick,
    title: 'Drag & Drop Magic',
    description: 'Intuitively arrange blocks with smooth drag and drop. No coding needed!',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Palette,
    title: 'Beautiful Themes',
    description: 'Choose from stunning color palettes and typography combinations.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Wand2,
    title: 'Smart Presets',
    description: 'Pre-designed blocks that look amazing out of the box.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    description: 'See your changes instantly as you build your website.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Layers,
    title: '20+ Block Types',
    description: 'Hero sections, features, testimonials, pricing, and more.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download as HTML, React, or deploy directly to Vercel.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const steps = [
  { step: '01', title: 'Pick a Template', description: 'Choose from our collection of beautiful starter templates', emoji: '🎨' },
  { step: '02', title: 'Customize Everything', description: 'Drag, drop, and style blocks to match your vision', emoji: '✨' },
  { step: '03', title: 'Publish & Share', description: 'Export your site and share it with the world', emoji: '🚀' },
];

const testimonials = [
  { quote: "This is exactly what I needed to build my portfolio quickly!", author: "Sarah K.", role: "Designer" },
  { quote: "So much faster than coding from scratch. Love the modern templates.", author: "Mike R.", role: "Developer" },
  { quote: "The drag and drop is incredibly smooth. Best builder I've used.", author: "Emma L.", role: "Freelancer" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32 sm:pt-28 lg:pt-32">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-pink-50 dark:from-surface-dark dark:via-surface-dark dark:to-surface-dark-elevated" />
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div 
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 px-4 py-2 text-sm font-medium text-violet-700 dark:from-violet-900/50 dark:to-pink-900/50 dark:text-violet-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Sparkles className="h-4 w-4" />
              Build stunning websites in minutes
            </motion.div>

            <motion.h1 
              className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Create Beautiful
              <motion.span 
                className="block bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Websites Effortlessly
              </motion.span>
            </motion.h1>

            <motion.p 
              className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The most intuitive website builder for portfolios, landing pages, and personal sites. 
              No coding required — just drag, drop, and publish.
            </motion.p>

            <motion.div 
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/builder">
                <Button size="lg" className="group rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-8 hover:from-violet-700 hover:to-pink-700 shadow-lg shadow-violet-500/25">
                  Start Building Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Browse Templates
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div 
              className="mt-12 flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Loved by <span className="font-semibold text-slate-700 dark:text-slate-200">2,000+</span> creators worldwide
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mx-auto mt-16 max-w-5xl px-4"
        >
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 p-2 shadow-2xl dark:from-slate-800 dark:to-slate-900">
            <div className="overflow-hidden rounded-xl bg-white shadow-inner dark:bg-slate-900">
              {/* Browser header */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1.5 text-xs text-slate-400 dark:bg-slate-700">
                  myawesome.site
                </div>
              </div>
              {/* Preview content */}
              <div className="aspect-[16/9] bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 p-8 md:p-12">
                <div className="flex h-full flex-col items-center justify-center text-center text-white">
                  <motion.div 
                    className="mb-4 h-3 w-20 rounded-full bg-white/30"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="mb-2 h-8 w-72 rounded-lg bg-white/90" />
                  <div className="mb-6 h-4 w-48 rounded bg-white/50" />
                  <div className="flex gap-3">
                    <div className="h-10 w-28 rounded-full bg-white" />
                    <div className="h-10 w-28 rounded-full border-2 border-white/50" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -right-4 top-20 rounded-xl bg-white p-3 shadow-lg dark:bg-slate-800"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Palette className="h-6 w-6 text-pink-500" />
            </motion.div>
            <motion.div 
              className="absolute -left-4 bottom-32 rounded-xl bg-white p-3 shadow-lg dark:bg-slate-800"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <Layout className="h-6 w-6 text-violet-500" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-24 dark:border-slate-800 dark:bg-surface-dark-elevated">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
              Features
            </span>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Powerful tools that make website building fun and effortless.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
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
      <section className="border-t border-slate-200 px-4 py-24 dark:border-slate-800">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              Simple Process
            </span>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Three Steps to Launch
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              From idea to live website in minutes, not hours.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-3xl dark:from-slate-700 dark:to-slate-800">
                  {item.emoji}
                </div>
                <div className="mb-2 text-sm font-bold text-violet-600 dark:text-violet-400">
                  STEP {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-1/3 translate-x-full bg-gradient-to-r from-slate-300 to-transparent md:block dark:from-slate-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-violet-50 via-white to-pink-50 px-4 py-24 dark:border-slate-800 dark:from-surface-dark dark:via-surface-dark dark:to-surface-dark-elevated">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-pink-100 px-4 py-1.5 text-sm font-medium text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">
              Testimonials
            </span>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Loved by Creators
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-slate-700 dark:text-slate-200">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-slate-200 px-4 py-24 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Ready to Build Something Amazing?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Join thousands of creators who've built their dream websites with Webstax.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/builder">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-8 text-violet-600 hover:bg-slate-100"
                >
                  Start Building Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-white/80">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Export anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
