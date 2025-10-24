import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductImageSliderProps {
  mainImageUrl: string | null;
  additionalImages: string[];
}

export default function ProductImageSlider({ mainImageUrl, additionalImages }: ProductImageSliderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    // Combine main image with additional images
    if (mainImageUrl) {
      setImages([mainImageUrl, ...additionalImages]);
    } else {
      setImages(additionalImages);
    }
  }, [mainImageUrl, additionalImages]);

  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex);
  };

  const handleTouchStart = () => {
    // Pause autoplay on touch interaction
    if (isAutoplayActive) {
      setIsAutoplayActive(false);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.stop();
      }
    }
  };


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
        autoplay={isAutoplayActive ? {
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
          stopOnLastSlide: false,
          waitForTransition: true,
        } : false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        onTouchStart={handleTouchStart}
        className="h-96 rounded-lg overflow-hidden"
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
        watchSlidesVisibility={true}
      >
        {images.map((imageUrl, index) => (
          <SwiperSlide key={index}>
            <img
              src={imageUrl}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows - Hidden */}

      {/* Touch indicator for mobile */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 md:hidden">
        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          اسحب للتنقل
        </div>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
