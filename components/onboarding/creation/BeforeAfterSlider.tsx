'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ArrowsLeftRight } from '@phosphor-icons/react';

interface BeforeAfterSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImageUrl,
  afterImageUrl,
  beforeLabel = 'تصویر اولیه',
  afterLabel = 'خروجی لوما',
  aspectRatio = 'aspect-[16/10]',
  className = '',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Since container is in RTL or standard coordinates, let's compute ratio from left edge
      const offsetX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${aspectRatio} rounded-2xl overflow-hidden select-none border border-white/10 shadow-2xl bg-zinc-950 cursor-ew-resize group ${className}`}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => {
        setIsDragging(true);
        if (e.touches[0]) handleMove(e.touches[0].clientX);
      }}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      dir="ltr" // internal image coordinate system for precision
    >
      {/* After image (full background) */}
      <img
        src={afterImageUrl}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Before image (clipped by slider position) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={beforeImageUrl}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none transition-transform duration-75"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Center handle badge */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-900/90 border border-white/40 shadow-xl backdrop-blur-md flex items-center justify-center text-white">
          <ArrowsLeftRight weight="bold" className="w-4 h-4 text-purple-300" />
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-zinc-300 pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-400/30 text-[11px] font-medium text-purple-200 pointer-events-none">
        {afterLabel}
      </div>

      {/* Drag instruction overlay (fades on drag) */}
      {!isDragging && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-zinc-400 pointer-events-none transition-opacity group-hover:opacity-0">
          بکشید تا مقایسه کنید
        </div>
      )}
    </div>
  );
}
