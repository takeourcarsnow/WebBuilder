'use client';

import React from 'react';
import type { WebsiteBlock } from '@/types';
import { useBlockStyles } from '@/hooks';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface MapBlockProps {
  block: WebsiteBlock;
}

export const MapBlock: React.FC<MapBlockProps> = ({ block }) => {
  const { content, style } = block;
  const { containerClass, containerStyle } = useBlockStyles(style);

  const title = content.title as string || '';
  const address = content.address as string || '';
  const latitude = content.latitude as number || 40.7128;
  const longitude = content.longitude as number || -74.0060;
  const zoom = content.zoom as number || 14;
  const mapType = content.mapType as string || 'roadmap';
  const showMarker = content.showMarker as boolean ?? true;
  const height = content.height as number || 400;

  // Generate OpenStreetMap embed URL (free alternative to Google Maps)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  // Google Maps embed URL (requires API key for production)
  const googleMapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;

  return (
    <section className={containerClass} style={containerStyle}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        {(title || address) && (
          <div className={cn('mb-6', style.alignment === 'center' && 'text-center')}>
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            )}
            {address && (
              <div className="flex items-center gap-2 text-lg opacity-70" style={{ justifyContent: style.alignment === 'center' ? 'center' : 'flex-start' }}>
                <MapPin className="w-5 h-5" />
                <span>{address}</span>
              </div>
            )}
          </div>
        )}

        {/* Map Container */}
        <div
          className={cn(
            'relative overflow-hidden bg-gray-200 dark:bg-gray-700',
            style.borderRadius === 'small' && 'rounded-lg',
            style.borderRadius === 'medium' && 'rounded-xl',
            style.borderRadius === 'large' && 'rounded-2xl'
          )}
          style={{ height: `${height}px` }}
        >
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          />

          {/* Map Overlay for click-to-open */}
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Open map in new tab"
          />
        </div>

        {/* Directions Link */}
        <div className={cn('mt-4', style.alignment === 'center' && 'text-center')}>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: 'var(--primary-color, #0ea5e9)' }}
          >
            <MapPin className="w-4 h-4" />
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
};
