import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface ProductImageSliderProps {
  mainImageUrl: string | null;
  additionalImages: string[];
}

export default function ProductImageSlider({ mainImageUrl, additionalImages }: ProductImageSliderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const autoplayTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Combine main image with additional images and remove duplicates
    const allImages = [];
    if (mainImageUrl) {
      allImages.push(mainImageUrl);
    }
    // Add additional images that aren't the same as main image
    additionalImages.forEach(img => {
      if (img && img !== mainImageUrl) {
        allImages.push(img);
      }
    });
    setImages(allImages);
    
    // Cleanup on unmount
    return () => {
      if (autoplayTimeout.current) {
        clearTimeout(autoplayTimeout.current);
      }
    };
  }, [mainImageUrl, additionalImages]);

  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex);
  };

  const handleTouchStart = useCallback(() => {
    // Pause autoplay on touch interaction
    if (isAutoplayActive) {
      setIsAutoplayActive(false);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.stop();
      }
      
      // Resume autoplay after 10 seconds of inactivity
      if (autoplayTimeout.current) {
        clearTimeout(autoplayTimeout.current);
      }
      
      autoplayTimeout.current = setTimeout(() => {
        setIsAutoplayActive(true);
        if (swiperRef.current?.autoplay) {
          swiperRef.current.autoplay.start();
        }
      }, 10000);
    }
  }, [isAutoplayActive]);


  if (images.length === 0) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">لا توجد صور متاحة</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={false}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/70 !opacity-100',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
        }}
        onPaginationClick={() => {
          if (isAutoplayActive) {
            setIsAutoplayActive(false);
            if (swiperRef.current?.autoplay) {
              swiperRef.current.autoplay.stop();
            }
          }
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
          waitForTransition: true,
          reverseDirection: false
        }}
        loop={true}
        speed={800}
        effect='fade'
        fadeEffect={{
          crossFade: true
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        onTouchStart={handleTouchStart}
        className="h-96 rounded-lg overflow-hidden w-full"
        touchRatio={1}
        touchAngle={45}
        threshold={5}
        longSwipesRatio={0.5}
        longSwipesMs={300}
        followFinger={true}
        allowTouchMove={true}
        resistance={true}
        resistanceRatio={0.85}
        watchSlidesProgress={true}
        watchslidesvisibility={true}
      >
        {images.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <img
              src={imageUrl}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain bg-white"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows - Hidden */}


      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
