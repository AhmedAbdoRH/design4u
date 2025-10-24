import React, { useEffect, useState } from 'react';

export default function LoadingScreen({
  logoUrl,
  onFinish,
}: {
  logoUrl?: string;
  onFinish?: () => void;
}) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Constants for timing
  const FADE_START_DELAY = 1500; // ms, time until fade-out starts
  const HIDE_DELAY = 3000; // ms, time until component is hidden
  const FADE_OUT_DURATION_MS = HIDE_DELAY - FADE_START_DELAY; // Duration of the fade-out effect

  useEffect(() => {
    let isMounted = true;

    // Only attempt to load image if logoUrl is provided
    if (logoUrl) {
      const img = new Image();
      img.onload = () => {
        if (isMounted) {
          setImageLoaded(true);
          setImageError(false);
        }
      };
      img.onerror = () => {
        if (isMounted) {
          setImageError(true);
          setImageLoaded(true); // Still mark as loaded to continue animation flow
        }
      };
      img.src = logoUrl;
    } else {
      // If no logo URL provided, show the fallback (custom loader) immediately
      if (isMounted) {
        setImageError(true);
        setImageLoaded(true);
      }
    }

    // Timer to start the fade-out of the entire screen
    const timer1 = setTimeout(() => {
      if (isMounted) setFadeOut(true);
    }, FADE_START_DELAY);

    // Timer to hide the component completely and call onFinish
    const timer2 = setTimeout(() => {
      if (isMounted) {
        setShow(false);
        onFinish?.();
      }
    }, HIDE_DELAY);

    // Cleanup function to clear timers if the component unmounts
    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [logoUrl, onFinish]); // Dependencies for the useEffect hook

  // If show is false, render nothing
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ 
        transitionDuration: `${FADE_OUT_DURATION_MS}ms`,
        backgroundColor: '#2a2a2a'
      }}
    >
      {/* Only render logo or custom loader once image loading status is determined */}
      {imageLoaded && (
        <>
          {imageError ? (
            // Fallback: Custom loader when image fails or no URL provided
            <div className="custom-loader-entry-animation"> {/* Container for entry animation */}
              <div className="custom-loader">
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            // Show actual logo if it loaded successfully
            <img
              src={logoUrl?.includes('supabase.co') ? '/favicon.png' : (logoUrl || '/favicon.png')}
              alt="Loading Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain logo-animation"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/favicon.png') {
                  target.src = '/favicon.png';
                }
              }}
            />
          )}
        </>
      )}

      {/* CSS animations are defined here */}
      <style>{`
        /* Keyframe for initial appearance: fade in and scale up */
        @keyframes fade-in-scale-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Keyframe for logo pulsing glow effect */
        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1); /* Maintain scale from fade-in-scale-up */
            filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.4));
          }
          50% {
            transform: scale(1.04); /* Pulse effect */
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.7));
          }
        }

        /* Animation class for the logo image */
        .logo-animation {
          animation:
            fade-in-scale-up 0.8s cubic-bezier(.4,0,.2,1) forwards,
            pulse-glow 2.5s infinite ease-in-out 0.8s; /* pulse-glow starts after fade-in */
          will-change: transform, opacity, filter; /* Optimize animations */
        }

        /* Animation class for the custom loader's entry */
        .custom-loader-entry-animation {
          animation: fade-in-scale-up 0.8s cubic-bezier(.4,0,.2,1) forwards;
          will-change: transform, opacity; /* Optimize animations */
          display: flex; /* For centering the loader itself */
          justify-content: center;
          align-items: center;
        }
        
        /* Custom loader styles */
        .custom-loader {
          position: relative;
          width: 64px;
          height: 64px;
        }

        .custom-loader div {
          box-sizing: border-box; /* Ensure border doesn't add to size */
          position: absolute;
          border: 4px solid #FFFFFF; /* Loader color set to white */
          border-radius: 50%;
          animation: loader8435 1s ease-out infinite;
        }

        .custom-loader div:nth-child(2) {
          animation-delay: -0.5s; /* Second circle starts later */
        }

        @keyframes loader8435 {
          0% {
            top: 32px; /* Center within 64px parent */
            left: 32px; /* Center within 64px parent */
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: 0px;
            left: 0px;
            width: 64px; /* Expand to full size of parent */
            height: 64px; /* Expand to full size of parent */
            opacity: 0;
          } 
        }
      `}</style>
    </div>
  );
}