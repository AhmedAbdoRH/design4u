import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  logoUrl?: string;
  onFinish?: () => void;
}

export default function LoadingScreen({ logoUrl, onFinish }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Hide loading screen after completion
          setTimeout(() => {
            setIsVisible(false);
            onFinish?.();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 10 + 5;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #0e1a2e 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.6, 0],
              x: [0, (Math.random() - 0.5) * 300],
              y: [0, (Math.random() - 0.5) * 300],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${25 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Enhanced logo or loading spinner */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            scale: { duration: 0.8, times: [0, 0.6, 1] }
          }}
        >
          {logoUrl ? (
            <div className="relative">
              <motion.img
                src={logoUrl.includes('supabase.co') ? '/favicon.png' : logoUrl}
                alt="Logo"
                className="w-32 h-32 object-contain"
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    'drop-shadow(0 0 5px rgba(199, 161, 122, 0.3))',
                    'drop-shadow(0 0 20px rgba(199, 161, 122, 0.8))',
                    'drop-shadow(0 0 5px rgba(199, 161, 122, 0.3))'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/favicon.png';
                }}
              />
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent rounded-full"
                style={{
                  borderTopColor: '#c7a17a',
                  borderRightColor: 'rgba(199, 161, 122, 0.2)',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          ) : (
            // Professional loading spinner
            <div className="relative w-32 h-32">
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 border-4 border-transparent rounded-full"
                style={{
                  borderTopColor: '#c7a17a',
                  borderRightColor: 'rgba(199, 161, 122, 0.3)',
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute inset-4 border-2 border-transparent rounded-full"
                style={{
                  borderLeftColor: '#d99323',
                  borderBottomColor: 'rgba(217, 147, 35, 0.5)',
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              {/* Center dot */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-3 h-3 -mt-1.5 -ml-1.5 rounded-full bg-gradient-to-r from-[#c7a17a] to-[#d99323]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-80 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#c7a17a] via-[#d99323] to-[#e0a745]"
            style={{
              boxShadow: '0 0 15px rgba(199, 161, 122, 0.6)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.4,
              ease: "easeOut"
            }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.h2
            className="text-white text-xl font-semibold tracking-wide"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            جارٍ التحميل...
          </motion.h2>
          <motion.p
            className="text-white/70 text-sm font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            يرجى الانتظار قليلاً، نحن نعد المحتوى لك
          </motion.p>
        </motion.div>

        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${i * 45 + 200}, 70%, 60%)`,
                boxShadow: `0 0 10px hsl(${i * 45 + 200}, 70%, 60%)`,
                left: `${20 + i * 10}%`,
                top: `${40 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.sin(i) * 30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Professional CSS animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(199, 161, 122, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(199, 161, 122, 0.8), 0 0 30px rgba(217, 147, 35, 0.4);
          }
        }

        .loading-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .loading-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </motion.div>
  );
}
