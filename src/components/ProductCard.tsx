import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { supabase } from '../lib/supabase';
import type { Service, Category } from '../types/database';

const lightGold = '#FFD700';
const brownDark = '#3d2c1d';
const accentColor = '#d99323'; // New accent color for selected categories

export default function Services() {
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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
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
        .select(`
          *,
          category:categories(*),
          sizes:service_sizes(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = selectedCategory
    ? services.filter(service => service.category_id === selectedCategory)
    : services;

  if (isLoading) {
    return (
      <div className="py-16" style={{backgroundColor: '#2a2a2a'}}>
        <div className="container mx-auto px-4 text-center text-secondary">
     
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16" style={{backgroundColor: '#2a2a2a'}}>
        <div className="container mx-auto px-4 text-center text-red-600">
          حدث خطأ أثناء تحميل خدمات الطباعة والتطريز
        </div>
      </div>
    );
  }

  return (
    <section className="py-16" style={{backgroundColor: '#2a2a2a'}} id="services">
      <div className="container mx-auto px-4
                   bg-white/5
                   backdrop-blur-xl
                   rounded-2xl
                   p-8
                   border border-white/10
                   shadow-2xl shadow-black/40">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: lightGold }}>
          مفروشاتنا
        </h2>
        <div className="w-full h-1 mb-8" style={{ backgroundColor: lightGold }}></div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-4 rounded-xl transition-all duration-300 ${
              !selectedCategory
                ? `bg-[var(--color-secondary,#34C759)] text-black font-bold shadow-md`
                : 'bg-black/20 text-white hover:bg-black/30 hover:shadow-md'
            }`}
          >
            جميع خدمات الطباعة والتطريز
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                category.id === selectedCategory
                  ? `bg-[var(--color-secondary,#34C759)] text-black font-bold shadow-md`
                  : 'bg-black/20 text-white hover:bg-black/30 hover:shadow-md'
              }`}
            >
              <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-sm opacity-80">{category.description}</p>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description || ''}
              imageUrl={service.image_url || ''}
              price={service.price}
              salePrice={service.sale_price}
              has_multiple_sizes={service.has_multiple_sizes}
              sizes={service.sizes}
            />
          ))}
        </div>
      </div>
    </section>
  );
}