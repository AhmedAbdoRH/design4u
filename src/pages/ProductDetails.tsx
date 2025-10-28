import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service, ProductSize } from '../types/database';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import ProductImageSlider from '../components/ProductImageSlider';


export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Service[]>([]);

  // Image slider states - removed as we're using ProductImageSlider component
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch service and suggested products on ID change
  useEffect(() => {
    if (id) {
      fetchService(id);
    }
  }, [id]);

  // Fetch suggested products when service data is loaded
  useEffect(() => {
    if (service) {
      fetchSuggested();
    }
  }, [service]);

  const fetchService = async (serviceId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*, sizes:product_sizes(*)')
        .eq('id', serviceId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('المنتج غير موجود');

      setService(data);
      if (data.has_multiple_sizes && data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggested = async () => {
    if (!service) return;
    
    const { data } = await supabase
      .from('services')
      .select('*, sizes:product_sizes(*)')
      .eq('category_id', service.category_id)
      .neq('id', id)
      .limit(10);
      
    setSuggested(data || []);
  };

  const handleContact = () => {
    if (!service) return;
    const productUrl = window.location.href;
    const message = `استفسار عن المنتج: ${service.title}\nرابط المنتج: ${productUrl}`;
    window.open(`https://wa.me/201006464349?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Get all images for the main product carousel
  const images: string[] = [
    service?.image_url || '',
    ...(Array.isArray(service?.gallery) ? service.gallery : [])
  ].filter(Boolean);


  // Extracted background styles for reuse
  const backgroundStyles = {
    // light gray / off-white background for product page
    background: '#f7f7f9',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-24"
        style={backgroundStyles}
      >
        <div className="text-xl text-gray-700">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24"
        style={backgroundStyles}
      >
        <div className="text-xl text-gray-700">{error || 'المنتج غير موجود'}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-secondary text-primary px-6 py-2 rounded-lg hover:bg-opacity-90"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-24 relative bg-white">
      <div className="flex items-center justify-center flex-grow py-8 bg-white">
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
          <div className="rounded-lg shadow-lg overflow-hidden bg-white">
            <div className="md:flex">
              <div className="md:w-1/2">
                <ProductImageSlider 
                  mainImageUrl={service.image_url}
                  additionalImages={Array.isArray(service.gallery) ? service.gallery : []}
                />
              </div>
              <div className="md:w-1/2 p-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800 text-right">{service.title}</h1>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed text-right" style={{ whiteSpace: 'pre-wrap' }}>
  {service.description}
</p>
                <div className="border-t border-gray-200 pt-6 mb-6">
                  {service.has_multiple_sizes && service.sizes && service.sizes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-2 text-gray-800 text-right">المقاسات المتوفرة</h4>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {service.sizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${ selectedSize?.id === size.id
                                ? 'bg-secondary text-primary'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                          >
                            {size.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-2xl font-bold text-accent mb-6 text-right">
                    {service.has_multiple_sizes ? (
                      selectedSize?.sale_price ? (
                        <div className="flex flex-col items-end">
                          <span className="text-2xl text-gold-dark">{selectedSize.sale_price} ج</span>
                          <span className="text-lg text-gray-400 line-through">{selectedSize.price} ج</span>
                        </div>
                      ) : (
                        <span>{selectedSize?.price} ج</span>
                      )
                    ) : (
                      service.sale_price ? (
                        <div className="flex flex-col items-end">
                          <span className="text-2xl text-gold-dark">{service.sale_price} ج</span>
                          <span className="text-lg text-gray-400 line-through">{service.price} ج</span>
                        </div>
                      ) : (
                        <span>{service.price} ج</span>
                      )
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={handleContact}
                      className="flex-1 bg-[#25D366] text-white py-3 px-6 rounded-lg font-bold hover:bg-opacity-90 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      تواصل معنا للطلب
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (service.has_multiple_sizes) {
                          if (selectedSize) {
                            addToCart({
                              id: service.id,
                              title: service.title,
                              price: selectedSize.sale_price || selectedSize.price,
                              imageUrl: service.image_url || '',
                              size: selectedSize.size,
                            });
                            toast.success('تمت إضافة المنتج إلى السلة');
                          } else {
                            toast.error('الرجاء اختيار مقاس');
                          }
                        } else {
                          addToCart({
                            id: service.id,
                            title: service.title,
                            price: service.sale_price || service.price || 0,
                            imageUrl: service.image_url || '',
                          });
                          toast.success('تمت إضافة المنتج إلى السلة');
                        }
                      }}
                      className="bg-header hover:brightness-110 text-white p-3 rounded-lg font-bold flex items-center justify-center"
                      title="أضف إلى السلة"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      {suggested.length > 0 && (
        <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-right">متوفر لدينا ايضا</h2>
          <div
            className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {suggested.map((item) => {
              const images: string[] = [
                item.image_url || '',
                ...(Array.isArray(item.gallery) ? item.gallery : [])
              ].filter(Boolean);
              const imageUrl = images[0] || '';

              return (
                <div
                  key={item.id}
                  className="
                    min-w-[160px] max-w-[180px]
                    md:min-w-[220px] md:max-w-[260px]
                    bg-white rounded-lg shadow p-2 flex-shrink-0 cursor-pointer hover:scale-105 transition border border-gray-100
                  "
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    src={imageUrl || '/placeholder-product.jpg'}
                    alt={item.title}
                    className="w-full h-24 md:h-40 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <div className="mt-2 text-sm md:text-base font-bold text-gray-800 truncate text-right">{item.title}</div>
                  <div className="flex flex-col items-end">
                    {item.has_multiple_sizes && item.sizes && item.sizes.length > 0 && item.sizes[0].sale_price ? (
                      <>
                        <span className="text-xs md:text-sm text-[#D4AF37] font-bold">{item.sizes[0].sale_price} ج</span>
                        <span className="text-xs text-gray-400 line-through">{item.sizes[0].price} ج</span>
                      </>
                    ) : item.has_multiple_sizes && item.sizes && item.sizes.length > 0 ? (
                      <span className="text-xs md:text-sm text-accent">{item.sizes[0].price} ج</span>
                    ) : item.sale_price ? (
                      <>
                        <span className="text-xs md:text-sm text-[#D4AF37] font-bold">{item.sale_price} ج</span>
                        <span className="text-xs text-gray-400 line-through">{item.price} ج</span>
                      </>
                    ) : (
                      <span className="text-xs md:text-sm text-accent">{item.price} ج</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Styles to hide scrollbar */}
          <style>{`
            .hide-scrollbar {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      )}

      {/* Back to Home button */}
      <div className="flex justify-center pb-8">
        <button
          onClick={() => navigate('/')}
          className="text-secondary hover:text-accent px-4 py-2 rounded-lg border border-secondary hover:border-accent"
        >
          ← العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
