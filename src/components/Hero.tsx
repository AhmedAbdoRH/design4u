import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4">
        <div className="hero-inner">
          {/* النص والزرين */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="hero-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              تطريز تقليدي × متجر حديث
            </motion.span>
            
            <motion.h2
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              تصميمات تطريز وطباعة تجمع روح الحِرفة وأناقة العصر
            </motion.h2>
            
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              حمّل ملفات التطريز الجاهزة، تسوّق منتجات مطبوعة ومطرزة بعناية، أو اطلب تصميمًا خاصًا يُحاك على قياس هويتك.
            </motion.p>
            
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link to="/" className="btn btn-primary">
                استكشف الآن
              </Link>
              <Link to="/contact" className="btn btn-ghost">
                اطلب تصميمك
              </Link>
            </motion.div>
          </motion.div>

          {/* الشبكة البصرية */}
          <motion.div
            className="hero-frame"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-preview">
              {/* الصف الأول */}
              <motion.div
                className="hero-ph"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <svg viewBox="0 0 100 100">
                  <path d="M10 60 L40 30 L65 55 L85 35" stroke="#2a4365" strokeWidth="6" fill="none"/>
                  <circle cx="30" cy="35" r="6" fill="#b63b4a"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="hero-ph"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <svg viewBox="0 0 100 100">
                  <path d="M20 80 L80 20 M20 20 L80 80" stroke="#c6a052" strokeWidth="8"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="hero-ph"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <svg viewBox="0 0 100 100">
                  <rect x="18" y="18" width="64" height="64" rx="10" stroke="#b63b4a" strokeWidth="6" fill="none"/>
                </svg>
              </motion.div>
              
              {/* الصف الثاني */}
              <motion.div
                className="hero-ph"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <svg viewBox="0 0 100 100">
                  <path d="M15 70 Q50 30 85 70" stroke="#b63b4a" strokeWidth="7" fill="none"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="hero-ph"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="28" stroke="#2a4365" strokeWidth="6" fill="none"/>
                </svg>
              </motion.div>
              
              <motion.div
                className="hero-ph"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <svg viewBox="0 0 100 100">
                  <rect x="15" y="25" width="70" height="50" rx="8" stroke="#c6a052" strokeWidth="6" fill="none"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}