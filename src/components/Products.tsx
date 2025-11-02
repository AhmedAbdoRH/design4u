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
      className="group relative bg-gray-200 rounded-xl border border-gray-300 overflow-hidden transition-all duration-150 hover:scale-105 hover:bg-gray-200/80 cursor-pointer"
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
        <h3 className="text-lg font-bold mb-1 text-header truncate">{service.title}</h3>
        <p className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis mb-2">
          {(service as any)?.description ? ((service as any).description as string).split(/\r?\n/)[0] : ''}
        </p>
        <div className="flex flex-col items-end font-bold min-h-8">
          {service.sale_price ? (
            <>
              <div className="flex items-center gap-1">
                <span className={`text-lg text-gold-dark`}>{service.sale_price}</span>
                <span className={`text-lg text-gold-dark`}>ج</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400 line-through">{service.price}</span>
                <span className="text-sm text-gray-400 line-through">ج</span>
              </div>
            </>
          ) : service.price ? (
            <div className="flex items-center gap-1">
              <span className={`text-lg text-gold-dark`}>{service.price}</span>
              <span className={`text-lg text-gold-dark`}>ج</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className={`text-lg text-gold-dark`}>مجاناً</span>
            </div>
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
        .select('*')
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
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-800">
          جاري تحميل الخدمات...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-red-600">
          حدث خطأ أثناء تحميل الخدمات: {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="services">
      <motion.div
        className="container mx-auto px-4 bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.11 } } }}
      >
        <motion.h2
          className={`text-3xl font-bold text-center mb-12 text-header`}
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