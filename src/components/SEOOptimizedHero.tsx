import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Award, Truck, Shield } from 'lucide-react';

interface SEOOptimizedHeroProps {
  storeSettings?: any;
}

export default function SEOOptimizedHero({ storeSettings }: SEOOptimizedHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading with SEO Keywords */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-header">
            <span>Designs4U</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl mb-8 text-white/90 font-medium">
            خدمات الطباعة والتطريز وشروحات برامج التطريز | طباعة على القماش، طباعة على الملابس، تطريز يدوي، تطريز آلي
          </h2>
          
          {/* SEO-optimized description */}
          <div className="text-lg md:text-xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
            <p className="mb-4">
              مرحباً بكم في <strong>Designs4U</strong> - وجهتكم الأولى للحصول على 
              <strong> أفضل خدمات الطباعة والتطريز وشروحات برامج التطريز</strong> في مصر. نقدم مجموعة واسعة من 
              <strong> خدمات الطباعة على الأقمشة والملابس</strong> و<strong>التطريز اليدوي والآلي</strong> 
              بأسعار تنافسية وجودة عالية.
            </p>
            <p>
              نوفر خدمة التوصيل في <strong>جميع أنحاء مصر</strong> مع ضمان الجودة والرضا التام.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <Award className="h-8 w-8 text-gold-dark mx-auto mb-2" />
              <h3 className="font-semibold text-sm">جودة عالية</h3>
              <p className="text-xs text-white/70">أفضل المواد الخام</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <Truck className="h-8 w-8 text-gold-dark mx-auto mb-2" />
              <h3 className="font-semibold text-sm">توصيل مجاني</h3>
              <p className="text-xs text-white/70">للمناطق القريبة</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <Shield className="h-8 w-8 text-gold-dark mx-auto mb-2" />
              <h3 className="font-semibold text-sm">ضمان الجودة</h3>
              <p className="text-xs text-white/70">ضمان شامل</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
            >
              <Star className="h-8 w-8 text-gold-dark mx-auto mb-2" />
              <h3 className="font-semibold text-sm">تقييم 5 نجوم</h3>
              <p className="text-xs text-white/70">من عملائنا</p>
            </motion.div>
          </div>

          {/* Location Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-bold mb-4 text-gold-dark">فروعنا</h3>
            <div className="grid md:grid-cols-1 gap-4 text-right">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold-dark mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">تواصل معنا</h4>
                  <p className="text-sm text-white/80">
                    01118666186
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="tel:+201118666186"
              className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-6 py-3 rounded-lg border border-green-500/30 transition-all duration-300"
            >
              <Phone className="h-5 w-5 text-green-400" />
              <span className="font-medium">01118666186</span>
            </a>
            
            <a
              href="https://wa.me/201006464349"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-6 py-3 rounded-lg border border-green-500/30 transition-all duration-300"
            >
              <Phone className="h-5 w-5 text-green-400" />
              <span className="font-medium">+20 100 646 4349</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
