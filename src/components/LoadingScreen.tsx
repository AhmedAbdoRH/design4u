import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

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
                className="w-40 h-40 object-contain"
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
            <div className="relative w-40 h-40">
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
        </div>
      </div>
    </motion.div>
  );
}