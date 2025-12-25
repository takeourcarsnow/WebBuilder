'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  Search,
  Star,
  StarOff,
  RefreshCw,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
} from 'lucide-react';
import { useWebsiteStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Button, Input, Select, Slider } from '@/components/ui';

// Popular Google Fonts
const popularFonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Playfair Display',
  'Merriweather',
  'Raleway',
  'Nunito',
  'Ubuntu',
  'Rubik',
  'Work Sans',
  'DM Sans',
  'Space Grotesk',
  'Plus Jakarta Sans',
  'Outfit',
  'Manrope',
  'Sora',
];

const fontCategories = [
  { id: 'all', label: 'All' },
  { id: 'sans-serif', label: 'Sans Serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'display', label: 'Display' },
  { id: 'handwriting', label: 'Handwriting' },
  { id: 'monospace', label: 'Monospace' },
];

const fontWeights = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

const fontSizePresets = {
  heading: [
    { label: 'Small', h1: '2rem', h2: '1.75rem', h3: '1.5rem', h4: '1.25rem' },
    { label: 'Medium', h1: '2.5rem', h2: '2rem', h3: '1.75rem', h4: '1.5rem' },
    { label: 'Large', h1: '3rem', h2: '2.5rem', h3: '2rem', h4: '1.75rem' },
    { label: 'Extra Large', h1: '3.5rem', h2: '3rem', h3: '2.5rem', h4: '2rem' },
  ],
  body: [
    { label: 'Small', size: '0.875rem', lineHeight: '1.5' },
    { label: 'Medium', size: '1rem', lineHeight: '1.6' },
    { label: 'Large', size: '1.125rem', lineHeight: '1.7' },
    { label: 'Extra Large', size: '1.25rem', lineHeight: '1.8' },
  ],
};

interface FontSettings {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  headingSizePreset: number;
  bodySizePreset: number;
  letterSpacing: number;
  lineHeight: number;
}

interface TypographyPanelProps {
  className?: string;
}

export const TypographyPanel: React.FC<TypographyPanelProps> = ({ className }) => {
  const { website, updateSettings } = useWebsiteStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favoriteFonts, setFavoriteFonts] = useState<string[]>([]);
  const [loadedFonts, setLoadedFonts] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string>('fonts');
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    headingFont: website?.settings?.fonts?.heading || 'Inter',
    bodyFont: website?.settings?.fonts?.body || 'Inter',
    headingWeight: '700',
    bodyWeight: '400',
    headingSizePreset: 1,
    bodySizePreset: 1,
    letterSpacing: 0,
    lineHeight: 1.6,
  });

  // Load Google Font
  const loadFont = (fontName: string) => {
    if (loadedFonts.includes(fontName)) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    setLoadedFonts((prev) => [...prev, fontName]);
  };

  // Load initial fonts
  useEffect(() => {
    loadFont(fontSettings.headingFont);
    loadFont(fontSettings.bodyFont);
    // Load popular fonts for preview
    popularFonts.slice(0, 10).forEach(loadFont);
  }, []);

  // Filter fonts
  const filteredFonts = useMemo(() => {
    let fonts = [...popularFonts];
    
    if (searchQuery) {
      fonts = fonts.filter((font) =>
        font.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return fonts;
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (font: string) => {
    setFavoriteFonts((prev) =>
      prev.includes(font)
        ? prev.filter((f) => f !== font)
        : [...prev, font]
    );
  };

  const applyFontSettings = () => {
    updateSettings({
      fonts: {
        heading: fontSettings.headingFont,
        body: fontSettings.bodyFont,
        headingSize: fontSizePresets.heading[fontSettings.headingSizePreset].label.toLowerCase() as any,
        bodySize: fontSizePresets.body[fontSettings.bodySizePreset].label.toLowerCase() as any,
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const FontPreview: React.FC<{ font: string; isSelected: boolean; onClick: () => void }> = ({
    font,
    isSelected,
    onClick,
  }) => (
    <button
      onClick={() => {
        loadFont(font);
        onClick();
      }}
      className={cn(
        'w-full text-left p-3 rounded-xl border transition-all',
        isSelected
          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{font}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(font);
            }}
          >
            {favoriteFonts.includes(font) ? (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {isSelected && <Check className="w-4 h-4 text-primary-500" />}
        </div>
      </div>
      <p
        className="text-lg mt-1"
        style={{ fontFamily: `'${font}', sans-serif` }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
    </button>
  );

  return (
    <div className={cn('h-full overflow-y-auto', className)}>
      <div className="p-4 space-y-4">
        {/* Font Selection Section */}
        <section>
          <button
            onClick={() => toggleSection('fonts')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Selection
            </h3>
            {expandedSection === 'fonts' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'fonts' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fonts..."
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {fontCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-lg transition-colors',
                        selectedCategory === cat.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Heading Font */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Heading Font</label>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {filteredFonts.map((font) => (
                      <FontPreview
                        key={font}
                        font={font}
                        isSelected={fontSettings.headingFont === font}
                        onClick={() => setFontSettings({ ...fontSettings, headingFont: font })}
                      />
                    ))}
                  </div>
                </div>

                {/* Body Font */}
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Body Font</label>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {filteredFonts.map((font) => (
                      <FontPreview
                        key={font}
                        font={font}
                        isSelected={fontSettings.bodyFont === font}
                        onClick={() => setFontSettings({ ...fontSettings, bodyFont: font })}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Font Weight Section */}
        <section>
          <button
            onClick={() => toggleSection('weights')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Bold className="w-4 h-4" />
              Font Weights
            </h3>
            {expandedSection === 'weights' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'weights' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Heading Weight</label>
                  <Select
                    value={fontSettings.headingWeight}
                    onValueChange={(val) => setFontSettings({ ...fontSettings, headingWeight: val })}
                    options={fontWeights.map((w) => ({ value: w.value, label: `${w.label} (${w.value})` }))}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Body Weight</label>
                  <Select
                    value={fontSettings.bodyWeight}
                    onValueChange={(val) => setFontSettings({ ...fontSettings, bodyWeight: val })}
                    options={fontWeights.map((w) => ({ value: w.value, label: `${w.label} (${w.value})` }))}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Size Presets Section */}
        <section>
          <button
            onClick={() => toggleSection('sizes')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Size Presets
            </h3>
            {expandedSection === 'sizes' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'sizes' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Heading Sizes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontSizePresets.heading.map((preset, i) => (
                      <button
                        key={preset.label}
                        onClick={() => setFontSettings({ ...fontSettings, headingSizePreset: i })}
                        className={cn(
                          'p-2 rounded-xl border text-center transition-all',
                          fontSettings.headingSizePreset === i
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        )}
                      >
                        <span className="text-xs">{preset.label}</span>
                        <p
                          className="text-sm font-bold mt-1"
                          style={{ fontFamily: `'${fontSettings.headingFont}', sans-serif` }}
                        >
                          H1: {preset.h1}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Body Sizes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontSizePresets.body.map((preset, i) => (
                      <button
                        key={preset.label}
                        onClick={() => setFontSettings({ ...fontSettings, bodySizePreset: i })}
                        className={cn(
                          'p-2 rounded-xl border text-center transition-all',
                          fontSettings.bodySizePreset === i
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        )}
                      >
                        <span className="text-xs">{preset.label}</span>
                        <p
                          className="text-sm mt-1"
                          style={{ fontFamily: `'${fontSettings.bodyFont}', sans-serif` }}
                        >
                          {preset.size}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Advanced Settings */}
        <section>
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between mb-3"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Advanced Settings
            </h3>
            {expandedSection === 'advanced' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'advanced' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Letter Spacing</label>
                    <span className="text-xs font-mono">{fontSettings.letterSpacing}em</span>
                  </div>
                  <Slider
                    min={-0.05}
                    max={0.2}
                    step={0.01}
                    value={[fontSettings.letterSpacing]}
                    onValueChange={([val]) => setFontSettings({ ...fontSettings, letterSpacing: val })}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-gray-500">Line Height</label>
                    <span className="text-xs font-mono">{fontSettings.lineHeight}</span>
                  </div>
                  <Slider
                    min={1}
                    max={2.5}
                    step={0.1}
                    value={[fontSettings.lineHeight]}
                    onValueChange={([val]) => setFontSettings({ ...fontSettings, lineHeight: val })}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Preview */}
        <section className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <h4 className="text-xs text-gray-500 mb-3">Preview</h4>
          <div
            style={{
              fontFamily: `'${fontSettings.headingFont}', sans-serif`,
              fontWeight: fontSettings.headingWeight,
            }}
          >
            <h1 className="text-2xl mb-2">Heading Example</h1>
          </div>
          <div
            style={{
              fontFamily: `'${fontSettings.bodyFont}', sans-serif`,
              fontWeight: fontSettings.bodyWeight,
              letterSpacing: `${fontSettings.letterSpacing}em`,
              lineHeight: fontSettings.lineHeight,
            }}
          >
            <p className="text-sm">
              This is body text. It demonstrates how your selected fonts will look
              in the final design. The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </section>

        {/* Apply Button */}
        <Button onClick={applyFontSettings} className="w-full">
          Apply Typography Settings
        </Button>

        {/* Google Fonts Link */}
        <a
          href="https://fonts.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-primary-500 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Browse more fonts on Google Fonts
        </a>
      </div>
    </div>
  );
};
