import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ServiceCard from '../components/ServiceCard';
import type { Service } from '../types/database';

interface Subcategory {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

export default function SubcategoryProducts() {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subcategoryId) {
      fetchSubcategoryAndServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategoryId]);

  const fetchSubcategoryAndServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch subcategory details with parent category_id
      const { data: subcat, error: subcatErr } = await supabase
        .from('subcategories')
        .select('id, name_ar, description_ar, category_id, created_at')
        .eq('id', subcategoryId)
        .single();
      if (subcatErr) throw subcatErr;
      setSubcategory({
        id: subcat.id,
        name: subcat.name_ar,
        description: subcat.description_ar,
        category_id: subcat.category_id,
        created_at: (subcat as any).created_at ?? ''
      } as Subcategory);

      // Fetch parent category
      if (subcat?.category_id) {
        const { data: cat, error: catErr } = await supabase
          .from('categories')
          .select('id, name')
          .eq('id', subcat.category_id)
          .single();
        if (catErr) throw catErr;
        setCategory({ id: cat.id, name: cat.name } as Category);
      }

      // Fetch services for this subcategory
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('subcategory_id', subcategoryId);
      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
    <div
      className="min-h-screen pt-24 flex items-center justify-center"
      style={{
        background: '#2a2a2a !important',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
        <div className="text-xl text-secondary">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !subcategory) {
    return (
    <div
      className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4"
      style={{
        background: '#2a2a2a !important',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
        <div className="text-xl text-secondary">{error || 'القسم الفرعي غير موجود'}</div>
        <Link
          to="/"
          className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-light transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24"
      style={{
        background: '#2a2a2a !important',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-8 text-secondary">
          <Link to="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/category/${category.id}`} className="hover:text-accent transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-accent">{subcategory.name}</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/40">
          <h1 className="text-3xl font-bold mb-12 text-accent">{subcategory.name}</h1>
          {subcategory.description && (
            <p className="text-secondary/70 mb-8">{subcategory.description}</p>
          )}

          {services.length === 0 ? (
            <p className="text-center text-secondary/70 py-8">
              لا توجد خدمات في هذا القسم الفرعي حالياً
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description || ''}
                  imageUrl={service.image_url || ''}
                  price={service.price || ''}
                  salePrice={service.sale_price || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
