import React, { useEffect, useRef, useState } from 'react';
import type { Banner } from '../types/database';

interface BannerSliderProps {
  banners: Banner[];
}

const SLIDE_INTERVAL = 4000;

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 50);
  }, []);
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, SLIDE_INTERVAL);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [current, banners]);

  if (!banners.length) return null;

  return (
    <div
      className={`relative w-full h-[200px] md:h-[350px] lg:h-[500px] flex items-center justify-center overflow-hidden rounded-none mt-32 md:mt-32 fade-in-banner${fadeIn ? ' fade-in-active' : ''}`}
      style={{ marginTop: 'var(--header-height, 4.9rem)' }}
    >
      {/* تأثير Fade-in للبانر عند أول تحميل */}
      <style>{`
        .fade-in-banner {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(.4,0,.2,1), transform 0.9s cubic-bezier(.4,0,.2,1);
        }
        .fade-in-banner.fade-in-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {banner.type === 'image' && banner.image_url ? (
            <img
              src={banner.image_url}
              alt={banner.title || 'Banner'}
              className="w-full h-full min-h-full object-cover object-center"
              style={{ borderRadius: 0 }}
            />
          ) : (
            <div className="w-full h-full min-h-full flex flex-col justify-center items-center bg-white/5 backdrop-blur-xl p-8 sm:p-12 border border-white/10 shadow-2xl">
              {banner.title && (
  <h1
  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 text-center text-white"
  style={{ fontFamily: `'Cairo', 'Tajawal', 'Amiri', 'Arial', 'sans-serif'`, letterSpacing: '0.03em', lineHeight: '1.2', marginBottom: '1rem' }}
>
  {banner.title}
</h1>
)}
{banner.description && (
  <p
    className="text-lg sm:text-xl mb-4 text-center text-gray-300"
    style={{ fontFamily: `'Cairo', 'Tajawal', 'Amiri', 'Arial', 'sans-serif'`, letterSpacing: '0.02em', lineHeight: '1.7', marginTop: '0', marginBottom: '1.2rem' }}
  >
    {banner.description}
  </p>
) }
            </div>
          )}
        </div>
      ))}
      {/* المؤشرات */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors border border-white/15
                ${current === idx ? 'bg-white/20' : 'bg-white/10'}
              `}
              onClick={() => setCurrent(idx)}
              aria-label={`انتقل إلى البانر رقم ${idx + 1}`}
              style={{ minWidth: 6, minHeight: 6 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
