import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types/database';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Constants for styling and animation
const VISIBLE_CARDS = 3; // How many cards to prepare for the stack effect (current + next ones)
const CARD_OFFSET_X = '8%'; // Horizontal offset for stacked cards
const CARD_OFFSET_Y = '10px'; // Vertical offset for stacked cards
const CARD_SCALE_DECREMENT = 0.08; // How much smaller each stacked card gets
const ANIMATION_DURATION = 500; // ms, ensure this matches Tailwind duration class

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  // No isAnimating state needed for this specific slide approach if transitions are handled by CSS
  // and we prevent rapid clicks on buttons if desired. For simplicity, we'll keep it if needed for button debouncing.
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, image_url, is_active, created_at')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const testimonialsWithImages = testimonials.filter(t => t.image_url);
  const totalTestimonials = testimonialsWithImages.length;

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || totalTestimonials <= 1) return;
    setIsAnimating(true);

    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % totalTestimonials;
      } else {
        return (prevIndex - 1 + totalTestimonials) % totalTestimonials;
      }
    });

    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, totalTestimonials, ANIMATION_DURATION]);

  const nextTestimonial = useCallback(() => handleNavigation('next'), [handleNavigation]);
  const prevTestimonial = useCallback(() => handleNavigation('prev'), [handleNavigation]);

  const goToTestimonial = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || totalTestimonials <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, currentIndex, totalTestimonials, ANIMATION_DURATION]);


  useEffect(() => {
    if (totalTestimonials <= 1) return;
    const timer = setInterval(nextTestimonial, 3000);
    return () => clearInterval(timer);
  }, [totalTestimonials, nextTestimonial]); // currentIndex removed, nextTestimonial is memoized

  if (loading) {
    return (
      <div className="relative py-12 px-4 md:px-0 border-t border-gray-700/30 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md -z-10"></div>
        <div className="text-center text-white py-8 backdrop-blur-xl bg-white/10 max-w-4xl mx-auto rounded-xl p-8 border border-white/20">

        </div>
      </div>
    );
  }

  if (totalTestimonials === 0) {
    return (
      <section className="relative py-12 px-4 md:px-0 border-t border-gray-700/30 mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md -z-10"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-10 drop-shadow-lg">آراء عملائنا</h2>
          <div className="text-center text-gray-200 backdrop-blur-xl bg-white/10 rounded-xl shadow-2xl p-8 border border-white/20">
            لا توجد صور آراء لعرضها حالياً.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black/70 py-12 px-4 md:px-0 border-t border-gray-700 mt-16 overflow-x-hidden"> {/* overflow-x-hidden is important */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-10">آراء عملائنا</h2>

        <div className="relative h-[400px] md:h-[500px] w-full"> {/* Fixed height container for cards */}
          {/* Testimonial Cards */}
          {testimonialsWithImages.map((testimonial, index) => {
            let positionFactor = index - currentIndex;
            if (positionFactor < -totalTestimonials / 2) {
              positionFactor += totalTestimonials;
            } else if (positionFactor > totalTestimonials / 2) {
              positionFactor -= totalTestimonials;
            }
            
            // Determine card state based on its position relative to currentIndex
            // We want to style cards that are current, next, and one after next
            // And also the one that is previous (for exiting animation)
            let zIndex = totalTestimonials - Math.abs(positionFactor);
            let scale = 1 - Math.abs(positionFactor) * CARD_SCALE_DECREMENT;
            let opacity = positionFactor === 0 ? 1 : (Math.abs(positionFactor) < VISIBLE_CARDS ? 0.7 - Math.abs(positionFactor) * 0.2 : 0);
            let translateX = `${positionFactor * 100}%`; // Default for current, prev, next for simple slide
            let cardOffsetY = `${Math.abs(positionFactor) * parseFloat(CARD_OFFSET_Y)}px`;

            // More refined positioning for stack effect
            if (positionFactor === 0) { // Current card
              translateX = '0%';
              cardOffsetY = '0px';
              scale = 1;
              opacity = 1;
              zIndex = VISIBLE_CARDS + 1;
            } else if (positionFactor > 0 && positionFactor < VISIBLE_CARDS) { // Stacked upcoming cards
              translateX = `calc(${positionFactor * parseFloat(CARD_OFFSET_X)}% + ${positionFactor * 10}px)`; // Add small gap
              cardOffsetY = `${positionFactor * parseFloat(CARD_OFFSET_Y)}px`;
              scale = 1 - positionFactor * CARD_SCALE_DECREMENT;
              opacity = 1 - positionFactor * 0.3; // More gradual fade
              zIndex = VISIBLE_CARDS - positionFactor;
            } else if (positionFactor < 0) { // Exiting card (to the left)
              translateX = '-100%';
              opacity = 0;
              scale = 0.8;
              zIndex = 0;
            } else { // Cards far in the future (to the right, hidden)
              translateX = '100%';
              opacity = 0;
              scale = 0.8;
              zIndex = 0;
            }


            return (
              <div
                key={testimonial.id}
                className="absolute inset-0 transition-all origin-center"
                style={{
                  transform: `translateX(${translateX}) translateY(${cardOffsetY}) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transitionDuration: `${ANIMATION_DURATION}ms`,
                }}
              >
                <div className="w-full h-full flex justify-center items-center p-2 md:p-4">
                  <img
                    src={testimonial.image_url}
                    alt={`testimonial by client ${testimonial.id}`}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                    style={{ background: 'white' }} // Keep background for non-transparent parts of image
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls */}
        {totalTestimonials > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4 rtl:space-x-reverse">
            <button
              onClick={prevTestimonial}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none disabled:opacity-50"
              aria-label="التعليق السابق"
              disabled={isAnimating}
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              {testimonialsWithImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  disabled={isAnimating}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
                  } disabled:opacity-50`}
                  aria-label={`انتقل إلى التعليق ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none disabled:opacity-50"
              aria-label="التعليق التالي"
              disabled={isAnimating}
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
