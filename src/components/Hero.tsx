import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider'; // Import the new ImageSlider component

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4">
        {/* Badge - Moved outside and above both content and shapes */}
        <motion.div className="flex justify-center mb-4 md:hidden">
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            تطريز تقليدي × متجر حديث
          </motion.span>
        </motion.div>
        
        <div className="hero-inner">
          {/* النص والزرين */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
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
            
            <div className="hero-buttons">
              <button 
                onClick={() => {
                  const productsSection = document.getElementById('products-section');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
                className="btn btn-primary"
              >
                استكشف الآن
              </button>
              <Link 
                to="/design-request" 
                className="btn btn-ghost"
              >
                اطلب تصميمك
              </Link>
            </div>

          </motion.div>

          {/* الشبكة البصرية */}
          <motion.div
            className="hero-frame"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-preview">
              <ImageSlider /> {/* Use the ImageSlider component here */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}