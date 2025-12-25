'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Crop,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast,
  Palette,
  Droplet,
  Sliders,
  Filter,
  Download,
  X,
  Check,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Move,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Modal, Slider, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
  opacity: number;
}

interface Transform {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  scale: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const filterPresets = [
  { name: 'Original', adjustments: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Vivid', adjustments: { brightness: 105, contrast: 115, saturation: 130, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Muted', adjustments: { brightness: 100, contrast: 90, saturation: 70, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Warm', adjustments: { brightness: 105, contrast: 100, saturation: 110, blur: 0, grayscale: 0, sepia: 20, hueRotate: -10, invert: 0, opacity: 100 } },
  { name: 'Cool', adjustments: { brightness: 100, contrast: 105, saturation: 90, blur: 0, grayscale: 0, sepia: 0, hueRotate: 20, invert: 0, opacity: 100 } },
  { name: 'B&W', adjustments: { brightness: 100, contrast: 110, saturation: 0, blur: 0, grayscale: 100, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Sepia', adjustments: { brightness: 100, contrast: 100, saturation: 80, blur: 0, grayscale: 0, sepia: 80, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Dreamy', adjustments: { brightness: 110, contrast: 85, saturation: 90, blur: 1, grayscale: 0, sepia: 10, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Dramatic', adjustments: { brightness: 90, contrast: 130, saturation: 80, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Vintage', adjustments: { brightness: 95, contrast: 95, saturation: 70, blur: 0, grayscale: 10, sepia: 30, hueRotate: -5, invert: 0, opacity: 100 } },
  { name: 'Pop', adjustments: { brightness: 105, contrast: 120, saturation: 140, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
  { name: 'Noir', adjustments: { brightness: 90, contrast: 140, saturation: 0, blur: 0, grayscale: 100, sepia: 0, hueRotate: 0, invert: 0, opacity: 100 } },
];

const aspectRatios = [
  { name: 'Free', value: null },
  { name: '1:1', value: 1 },
  { name: '4:3', value: 4 / 3 },
  { name: '16:9', value: 16 / 9 },
  { name: '3:2', value: 3 / 2 },
  { name: '2:3', value: 2 / 3 },
  { name: '9:16', value: 9 / 16 },
];

interface ImageEditorProps {
  imageUrl?: string;
  onSave?: (editedImageUrl: string, adjustments: ImageAdjustments, transform: Transform) => void;
  onClose?: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl: initialUrl,
  onSave,
  onClose,
}) => {
  const [imageUrl, setImageUrl] = useState(initialUrl || '');
  const [urlInput, setUrlInput] = useState('');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
  });
  const [transform, setTransform] = useState<Transform>({
    rotation: 0,
    flipH: false,
    flipV: false,
    scale: 1,
  });
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'transform'>('adjust');
  const [isCropping, setIsCropping] = useState(false);
  const [cropAspect, setCropAspect] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFilterString = useCallback(() => {
    const filters = [
      `brightness(${adjustments.brightness}%)`,
      `contrast(${adjustments.contrast}%)`,
      `saturate(${adjustments.saturation}%)`,
      `blur(${adjustments.blur}px)`,
      `grayscale(${adjustments.grayscale}%)`,
      `sepia(${adjustments.sepia}%)`,
      `hue-rotate(${adjustments.hueRotate}deg)`,
      `invert(${adjustments.invert}%)`,
      `opacity(${adjustments.opacity}%)`,
    ];
    return filters.join(' ');
  }, [adjustments]);

  const getTransformString = useCallback(() => {
    const transforms = [
      `rotate(${transform.rotation}deg)`,
      `scale(${transform.flipH ? -1 : 1} * ${transform.scale}, ${transform.flipV ? -1 : 1} * ${transform.scale})`,
    ];
    return `rotate(${transform.rotation}deg) scale(${transform.flipH ? -transform.scale : transform.scale}, ${transform.flipV ? -transform.scale : transform.scale})`;
  }, [transform]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlAdd = () => {
    if (urlInput) {
      setImageUrl(urlInput);
      setUrlInput('');
    }
  };

  const updateAdjustment = (key: keyof ImageAdjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = (preset: typeof filterPresets[0]) => {
    setAdjustments(preset.adjustments);
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      invert: 0,
      opacity: 100,
    });
    setTransform({
      rotation: 0,
      flipH: false,
      flipV: false,
      scale: 1,
    });
  };

  const rotateLeft = () => {
    setTransform((prev) => ({ ...prev, rotation: prev.rotation - 90 }));
  };

  const rotateRight = () => {
    setTransform((prev) => ({ ...prev, rotation: prev.rotation + 90 }));
  };

  const flipHorizontal = () => {
    setTransform((prev) => ({ ...prev, flipH: !prev.flipH }));
  };

  const flipVertical = () => {
    setTransform((prev) => ({ ...prev, flipV: !prev.flipV }));
  };

  const handleSave = () => {
    if (onSave && imageUrl) {
      onSave(imageUrl, adjustments, transform);
    }
  };

  const adjustmentControls = [
    { key: 'brightness', label: 'Brightness', icon: Sun, min: 0, max: 200, default: 100 },
    { key: 'contrast', label: 'Contrast', icon: Contrast, min: 0, max: 200, default: 100 },
    { key: 'saturation', label: 'Saturation', icon: Palette, min: 0, max: 200, default: 100 },
    { key: 'blur', label: 'Blur', icon: Droplet, min: 0, max: 20, default: 0 },
    { key: 'grayscale', label: 'Grayscale', icon: Layers, min: 0, max: 100, default: 0 },
    { key: 'sepia', label: 'Sepia', icon: Filter, min: 0, max: 100, default: 0 },
    { key: 'hueRotate', label: 'Hue Rotate', icon: RefreshCw, min: -180, max: 180, default: 0 },
    { key: 'opacity', label: 'Opacity', icon: Sliders, min: 0, max: 100, default: 100 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Image Editor</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetAdjustments}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 dark:bg-black p-8 overflow-hidden">
          {imageUrl ? (
            <div className="relative max-w-full max-h-full">
              <img
                src={imageUrl}
                alt="Editing"
                className="max-w-full max-h-[60vh] object-contain transition-all duration-200"
                style={{
                  filter: getFilterString(),
                  transform: getTransformString(),
                }}
              />
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400 mb-4">No image loaded</p>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <div className="flex gap-2">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button variant="outline" onClick={handleUrlAdd}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls Panel */}
        {imageUrl && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'adjust', label: 'Adjust', icon: Sliders },
                { id: 'filters', label: 'Filters', icon: Filter },
                { id: 'transform', label: 'Transform', icon: Move },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors border-b-2',
                      activeTab === tab.id
                        ? 'text-primary-600 border-primary-500'
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Adjust Tab */}
              {activeTab === 'adjust' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  {adjustmentControls.map((control) => {
                    const Icon = control.icon;
                    const value = adjustments[control.key as keyof ImageAdjustments];
                    return (
                      <div key={control.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            {control.label}
                          </label>
                          <span className="text-xs text-gray-500">
                            {value}{control.key === 'hueRotate' ? '°' : control.key === 'blur' ? 'px' : '%'}
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          min={control.min}
                          max={control.max}
                          step={1}
                          onValueChange={([v]) =>
                            updateAdjustment(control.key as keyof ImageAdjustments, v)
                          }
                        />
                        {value !== control.default && (
                          <button
                            onClick={() =>
                              updateAdjustment(control.key as keyof ImageAdjustments, control.default)
                            }
                            className="text-xs text-primary-500 hover:text-primary-600"
                          >
                            Reset to {control.default}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {/* Filters Tab */}
              {activeTab === 'filters' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-3 gap-2"
                >
                  {filterPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden mb-1.5 border border-gray-200 dark:border-gray-700">
                        <img
                          src={imageUrl}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                          style={{
                            filter: [
                              `brightness(${preset.adjustments.brightness}%)`,
                              `contrast(${preset.adjustments.contrast}%)`,
                              `saturate(${preset.adjustments.saturation}%)`,
                              `blur(${preset.adjustments.blur}px)`,
                              `grayscale(${preset.adjustments.grayscale}%)`,
                              `sepia(${preset.adjustments.sepia}%)`,
                              `hue-rotate(${preset.adjustments.hueRotate}deg)`,
                            ].join(' '),
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Transform Tab */}
              {activeTab === 'transform' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Rotation */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Rotation</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={rotateLeft} className="flex-1">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Left
                      </Button>
                      <Button variant="outline" onClick={rotateRight} className="flex-1">
                        <RotateCw className="w-4 h-4 mr-2" />
                        Right
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">Fine Rotation</label>
                        <span className="text-xs text-gray-500">{transform.rotation}°</span>
                      </div>
                      <Slider
                        value={[transform.rotation]}
                        min={-180}
                        max={180}
                        step={1}
                        onValueChange={([v]) => setTransform((prev) => ({ ...prev, rotation: v }))}
                      />
                    </div>
                  </div>

                  {/* Flip */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Flip</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={transform.flipH ? 'primary' : 'outline'}
                        onClick={flipHorizontal}
                        className="flex-1"
                      >
                        <FlipHorizontal className="w-4 h-4 mr-2" />
                        Horizontal
                      </Button>
                      <Button
                        variant={transform.flipV ? 'primary' : 'outline'}
                        onClick={flipVertical}
                        className="flex-1"
                      >
                        <FlipVertical className="w-4 h-4 mr-2" />
                        Vertical
                      </Button>
                    </div>
                  </div>

                  {/* Scale */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Scale</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTransform((prev) => ({ ...prev, scale: Math.max(0.1, prev.scale - 0.1) }))
                        }
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-sm font-medium">{Math.round(transform.scale * 100)}%</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setTransform((prev) => ({ ...prev, scale: Math.min(3, prev.scale + 0.1) }))
                        }
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                    <Slider
                      value={[transform.scale * 100]}
                      min={10}
                      max={300}
                      step={1}
                      onValueChange={([v]) => setTransform((prev) => ({ ...prev, scale: v / 100 }))}
                    />
                  </div>

                  {/* Crop Aspect Ratio */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Crop Aspect Ratio</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio.name}
                          onClick={() => setCropAspect(ratio.value)}
                          className={cn(
                            'px-2 py-1.5 text-xs rounded-lg border transition-colors',
                            cropAspect === ratio.value
                              ? 'bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300'
                          )}
                        >
                          {ratio.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <Button onClick={handleSave} className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Edited
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
