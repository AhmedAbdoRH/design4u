import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Shirt } from 'lucide-react';

interface LoadingScreenProps {
  logoUrl?: string;
  onFinish?: () => void;
}

export default function LoadingScreen({ logoUrl, onFinish }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isCut, setIsCut] = useState(false);

  useEffect(() => {
    const cutTimer = setTimeout(() => {
      setIsCut(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onFinish?.();
    }, 3000);

    return () => {
      clearTimeout(cutTimer);
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
      style={{
        backgroundColor: '#1b3459',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
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
            </div>
          ) : (
            <div className="relative w-32 h-32">
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

        {/* Design Elements & Scissors Animation */}
        <div className="relative mt-8 h-32 w-64">
          {/* Fabric Piece - Left Side */}
          <motion.div
            className="absolute left-12 top-0"
            initial={{ opacity: 0, y: -20 }}
            animate={isCut ? {
              x: -40,
              y: 30,
              rotate: -20,
              opacity: 0
            } : {
              opacity: 1,
              y: 0
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg width="80" height="60" viewBox="0 0 80 60">
              <defs>
                <pattern id="fabricPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="8" height="8" fill="#c7a17a" opacity="0.3"/>
                  <line x1="0" y1="0" x2="8" y2="8" stroke="#d99323" strokeWidth="0.5" opacity="0.5"/>
                  <line x1="8" y1="0" x2="0" y2="8" stroke="#d99323" strokeWidth="0.5" opacity="0.5"/>
                </pattern>
              </defs>
              <path
                d="M 10 10 L 70 10 L 65 50 L 15 50 Z"
                fill="url(#fabricPattern)"
                stroke="#c7a17a"
                strokeWidth="2"
              />
            </svg>
          </motion.div>

          {/* Fabric Piece - Right Side */}
          <motion.div
            className="absolute right-12 top-0"
            initial={{ opacity: 0, y: -20 }}
            animate={isCut ? {
              x: 40,
              y: 30,
              rotate: 20,
              opacity: 0
            } : {
              opacity: 1,
              y: 0
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg width="80" height="60" viewBox="0 0 80 60">
              <path
                d="M 10 10 L 70 10 L 65 50 L 15 50 Z"
                fill="url(#fabricPattern)"
                stroke="#c7a17a"
                strokeWidth="2"
              />
            </svg>
          </motion.div>

          {/* Scissors */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-8"
            initial={{ x: -120, y: -20, rotate: -45, opacity: 0 }}
            animate={isCut ? {
              x: 0,
              y: 0,
              rotate: [0, -15, 0],
              opacity: [1, 1, 0],
              scale: [1, 1.15, 0.95]
            } : {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1
            }}
            transition={{
              x: { duration: 0.7, ease: "easeOut" },
              y: { duration: 0.7, ease: "easeOut" },
              rotate: { duration: 0.25, delay: 0.7 },
              opacity: { duration: 0.4, delay: 1.3 },
              scale: { duration: 0.25, delay: 0.7 }
            }}
          >
            <Scissors 
              size={48} 
              className="text-[#c7a17a]"
              style={{
                filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.4))'
              }}
            />
          </motion.div>

          {/* Cutting Sparks */}
          {isCut && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-12 w-1.5 h-1.5 rounded-full bg-[#d99323]"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1,
                    scale: 1
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 12) * 40,
                    y: Math.sin((i * Math.PI * 2) / 12) * 40,
                    opacity: 0,
                    scale: [1, 2, 0]
                  }}
                  transition={{
                    duration: 0.7,
                    delay: 0.7,
                    ease: "easeOut"
                  }}
                  style={{
                    boxShadow: '0 0 10px #d99323'
                  }}
                />
              ))}
            </>
          )}

          {/* Flash Effect */}
          {isCut && (
            <motion.div
              className="absolute left-1/2 top-12 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(217, 147, 35, 0.9) 0%, transparent 70%)'
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            />
          )}

          {/* Text Labels with Animation */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex justify-center gap-8 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {/* Print Icon & Text */}
            <motion.div 
              className="flex items-center gap-2"
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles size={20} className="text-[#d99323]" />
              <span className="text-[#c7a17a] font-semibold text-lg tracking-wide">طباعة</span>
            </motion.div>

            {/* Divider */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#c7a17a] to-transparent"></div>

            {/* Embroidery Icon & Text */}
            <motion.div 
              className="flex items-center gap-2"
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
            >
              <span className="text-[#c7a17a] font-semibold text-lg tracking-wide">تطريز</span>
              <Shirt size={20} className="text-[#d99323]" />
            </motion.div>
          </motion.div>

          {/* Decorative Thread Lines */}
          <motion.svg
            className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none"
            width="100%"
            height="100%"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <defs>
              <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#c7a17a', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#d99323', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#c7a17a', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <motion.path
              d="M 20 80 Q 80 60, 140 80"
              stroke="url(#threadGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="5,5"
              animate={{
                strokeDashoffset: [0, -10]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.path
              d="M 244 80 Q 184 60, 124 80"
              stroke="url(#threadGradient)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="5,5"
              animate={{
                strokeDashoffset: [0, 10]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.svg>
        </div>
      </div>
    </motion.div>
  );
}