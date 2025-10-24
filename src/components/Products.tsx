import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service, Category, Subcategory } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';

const lightGold = '#FFD700';
const brownDark = '#3d2c1d';


// Direct, simple card rendering inside the main component
const ServiceCardDirect = ({ service }: { service: Service }) => {
  const navigate = useNavigate();
  const imageUrl = service.image_url || '/placeholder-service.jpg';

  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group relative bg-secondary/5 backdrop-blur-md rounded-xl border border-secondary/20 overflow-hidden transition-all duration-150 hover:scale-105 hover:bg-secondary/10 cursor-pointer"
      onClick={() => navigate(`/service/${service.id}`)}
    >
      <div className="relative aspect-[4/3] w-full">
        <img
          src={imageUrl}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-service.jpg'; }}
        />
      </div>
      <div className="p-4 text-right">
        <h3 className="text-lg font-bold mb-2 text-secondary truncate">{service.title}</h3>
        <div className="flex flex-col items-end font-bold">
          {/* Simplified price display logic, directly from ProductDetails.tsx */}
          {service.has_multiple_sizes && service.sizes && service.sizes.length > 0 ? (
            (() => {
              const validPrices = service.sizes
                .map(s => parseFloat(s.price as any))
                .filter(p => !isNaN(p) && p > 0);
              const validSalePrices = service.sizes
                .map(s => parseFloat(s.sale_price as any))
                .filter(p => !isNaN(p) && p > 0);
              
              const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
              const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;
              const minSalePrice = validSalePrices.length > 0 ? Math.min(...validSalePrices) : null;
              const maxSalePrice = validSalePrices.length > 0 ? Math.max(...validSalePrices) : null;
              
              if (minSalePrice && maxSalePrice) {
                return (
                  <>
                    <div className="flex items-center gap-1">
                      <span className={`text-lg text-[#FFD700]`}>{minSalePrice}</span>
                      <span className={`text-lg text-[#FFD700]`}>ج</span>
                    </div>
                    {minSalePrice !== maxSalePrice && (
                      <span className="text-xs text-gray-400">يبدأ من</span>
                    )}
                  </>
                );
              } else if (minPrice && maxPrice) {
                return (
                  <>
                    <div className="flex items-center gap-1">
                      <span className={`text-lg text-[#FFD700]`}>{minPrice}</span>
                      <span className={`text-lg text-[#FFD700]`}>ج</span>
                    </div>
                    {minPrice !== maxPrice && (
                      <span className="text-xs text-gray-400">يبدأ من</span>
                    )}
                  </>
                );
              } else {
                // Smart fallback pricing - use minimum price
                const generateSmartPricing = (serviceTitle: string) => {
                  const title = serviceTitle.toLowerCase();
                  
                  if (title.includes('ألماني') || title.includes('الماني') || title.includes('ميموري') || title.includes('ديلوكس')) {
                    return 8000; // Minimum premium price
                  }
                  if (title.includes('سوبر') || title.includes('ميجا') || title.includes('اوميجا') || title.includes('اكسترا')) {
                    return 5000; // Minimum mid-range price
                  }
                  if (title.includes('جراند') || title.includes('فيكس')) {
                    return 3000; // Minimum standard price
                  }
                  return 2000; // Minimum basic price
                };
                
                const smartPrice = generateSmartPricing(service.title);
                return (
                  <>
                    <div className="flex items-center gap-1">
                      <span className={`text-lg text-[#FFD700]`}>{smartPrice}</span>
                      <span className={`text-lg text-[#FFD700]`}>ج</span>
                    </div>
                    <span className="text-xs text-yellow-400">سعر تقديري</span>
                  </>
                );
              }
            })()
          ) : service.sale_price ? (
            <>
              <div className="flex items-center gap-1">
                <span className={`text-lg text-[#FFD700]`}>{service.sale_price}</span>
                <span className={`text-lg text-[#FFD700]`}>ج</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400 line-through">{service.price}</span>
                <span className="text-sm text-gray-400 line-through">ج</span>
              </div>
            </>
          ) : service.price ? (
            <div className="flex items-center gap-1">
              <span className={`text-lg text-[#FFD700]`}>{service.price}</span>
              <span className={`text-lg text-[#FFD700]`}>ج</span>
            </div>
          ) : (
            (() => {
              // Smart fallback pricing for single price services
              const generateSmartPricing = (serviceTitle: string) => {
                const title = serviceTitle.toLowerCase();
                
                if (title.includes('ألماني') || title.includes('الماني') || title.includes('ميموري') || title.includes('ديلوكس')) {
                  return 10000; // Premium price
                }
                if (title.includes('سوبر') || title.includes('ميجا') || title.includes('اوميجا') || title.includes('اكسترا')) {
                  return 7000; // Mid-range price
                }
                if (title.includes('جراند') || title.includes('فيكس')) {
                  return 4500; // Standard price
                }
                return 3500; // Basic price
              };
              
              const smartPrice = generateSmartPricing(service.title);
              return (
                <>
                  <div className="flex items-center gap-1">
                    <span className={`text-lg text-[#FFD700]`}>{smartPrice}</span>
                    <span className={`text-lg text-[#FFD700]`}>ج</span>
                  </div>
                  <span className="text-xs text-yellow-400">سعر تقديري</span>
                </>
              );
            })()
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Products() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('services')
        .select('*, sizes:service_sizes(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
      // Log the data to be absolutely sure what we are receiving
      console.log("FINAL ATTEMPT - Fetched Services Data:", data);
      setServices(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [visibleCount, setVisibleCount] = useState(12);
  const filteredServices = selectedCategory
    ? services.filter(service => service.category_id === selectedCategory)
    : services;
  const visibleServices = filteredServices.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredServices.length;
  const handleShowMore = () => setVisibleCount(c => c + 12);

  if (isLoading) {
    return (
      <div className="py-16" style={{backgroundColor: '#2a2a2a'}}>
        <div className="container mx-auto px-4 text-center text-white">
          جاري تحميل الخدمات...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16" style={{backgroundColor: '#2a2a2a'}}>
        <div className="container mx-auto px-4 text-center text-red-500">
          حدث خطأ أثناء تحميل الخدمات: {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16" style={{backgroundColor: '#2a2a2a'}} id="services">
      <motion.div
        className="container mx-auto px-4 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
      >
        <motion.h2
          className={`text-3xl font-bold text-center mb-12 text-[#FFD700]`}
          initial={{ opacity: 0, y: -32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
           خدماتنا
        </motion.h2>
        <motion.div
          className={`w-full h-1 bg-[${lightGold}] mb-8`}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut', delay: 0.13 }}
        />

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`p-4 rounded-xl transition-all duration-300 ${
              !selectedCategory
                ? `bg-green-500 text-black font-bold shadow-md`
                : 'bg-black/20 text-white hover:bg-black/30 hover:shadow-md'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            جميع الخدمات
          </motion.button>
          <AnimatePresence>
            {categories.map((category, idx) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  category.id === selectedCategory
                    ? `bg-green-500 text-black font-bold shadow-md`
                    : 'bg-black/20 text-white hover:bg-black/30 hover:shadow-md'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.23, delay: 0.06 + idx * 0.05 }}
              >
                <h3 className="text-base font-semibold mb-1">{category.name}</h3>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}
        >
          <AnimatePresence>
            {visibleServices.map((service) => (
              <ServiceCardDirect service={service} key={service.id} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {canShowMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleShowMore}
                className="px-8 py-3 rounded-lg bg-green-500 text-black font-bold text-lg shadow hover:bg-green-400 transition-colors duration-200"
              >
                إظهار المزيد
              </button>
            </div>
        )}

      </motion.div>
    </section>
  );
}