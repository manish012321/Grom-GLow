// frontend/components/BeforeAfterSlider.jsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({
  title = 'Transformation',
  description = '',
  beforeImage,
  afterImage,
  className = ''
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className={`overflow-hidden rounded-xs border border-[#ECE7DE] bg-white shadow-xs ${className}`}>
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative w-full aspect-[4/3] md:aspect-[16/11] select-none cursor-ew-resize overflow-hidden"
      >
        {/* After Image (Full background) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={afterImage}
            alt={`${title} - After`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-[#181715]/80 text-[#FDFBF7] text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 font-semibold backdrop-blur-xs">
            After
          </div>
        </div>

        {/* Before Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
            <img
              src={beforeImage}
              alt={`${title} - Before`}
              className="w-full h-full object-cover max-w-none"
              style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            />
          </div>
          <div className="absolute top-4 left-4 bg-[#C5A880]/90 text-[#181715] text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 font-semibold backdrop-blur-xs">
            Before
          </div>
        </div>

        {/* Slider Handle Divider */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#181715] border-2 border-white text-white flex items-center justify-center shadow-xl">
            <MoveHorizontal className="w-4 h-4 text-[#C5A880]" />
          </div>
        </div>
      </div>

      {(title || description) && (
        <div className="p-5 border-t border-[#ECE7DE]">
          <h4 className="font-editorial text-xl font-normal text-[#181715]">{title}</h4>
          {description && (
            <p className="text-xs text-[#736E67] mt-1 leading-relaxed font-light">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
