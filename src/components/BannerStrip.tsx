import React from 'react';
import type { Banner } from '../types/database';
import { motion } from 'framer-motion';

interface BannerStripProps {
  banners: Banner[];
}

export default function BannerStrip({ banners }: BannerStripProps) {
  // Filter only strip banners that are active and positioned below main
  const stripBanners = banners.filter(banner => 
    banner.type === 'strip' && 
    banner.is_active && 
    banner.title?.trim() &&
    (banner as any).strip_position === 'below_main'
  );

  if (stripBanners.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {stripBanners.map((banner) => (
        <div
          key={banner.id}
          className="w-full py-1 px-4 text-center md:py-3"
          style={{
            backgroundColor: (banner as any).strip_background_color || '#b8860b',
            color: (banner as any).strip_text_color || '#ffffff',
          }}
        >
          <div className="container mx-auto">
            <motion.h2 
              className="text-lg md:text-xl font-normal"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {banner.title}
            </motion.h2>
            {banner.description && (
              <motion.p 
                className="text-sm md:text-base mt-1 opacity-90"
                animate={{
                  scale: [1, 1.01, 1],
                  opacity: [0.8, 0.9, 0.8]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                {banner.description}
              </motion.p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
