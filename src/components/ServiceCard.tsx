import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { ProductSize } from '../types/database';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string | string[];
  price?: number | null; // Make price optional and number type
  salePrice?: number | null; // Make salePrice optional and number type
  id: string | number;
  has_multiple_sizes?: boolean;
  sizes?: ProductSize[];
  gallery?: string[]; // Add gallery images for the carousel
}

// Define the light gold color using the hex code from the Hero component
const lightGold = '#FFD700'; // This is standard gold color

export default function ProductCard({ title, description, imageUrl, price, salePrice, id, has_multiple_sizes, sizes, gallery = [] }: ProductCardProps) {
  // Convert single image to array for consistent handling
  const images = useMemo(() => {
    if (Array.isArray(imageUrl)) return imageUrl;
    return imageUrl ? [imageUrl] : [];
  }, [imageUrl]);

  // Add gallery images if available
  const allImages = useMemo(() => {
    const mainImages = images.filter(Boolean);
    const additionalImages = Array.isArray(gallery) ? gallery.filter(Boolean) : [];
    return [...new Set([...mainImages, ...additionalImages])]; // Remove duplicates
  }, [images, gallery]);

  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Pricing: show only if present in DB (no smart fallback)
  const { displayPrice, displaySalePrice, hasMultiplePrices } = useMemo(() => {

    if (has_multiple_sizes && sizes && sizes.length > 0) {
      const validPrices = sizes
        .map(s => parseFloat(s.price as any))
        .filter(p => !isNaN(p) && p > 0);

      const validSalePrices = sizes
        .map(s => parseFloat(s.sale_price as any))
        .filter(p => !isNaN(p) && p > 0);

      const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
      const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;
      const minSalePrice = validSalePrices.length > 0 ? Math.min(...validSalePrices) : null;
      const maxSalePrice = validSalePrices.length > 0 ? Math.max(...validSalePrices) : null;

      if (minSalePrice && maxSalePrice) {
        return { 
          displayPrice: minPrice, 
          displaySalePrice: minSalePrice, 
          hasMultiplePrices: minSalePrice !== maxSalePrice
        };
      }
      
      if (minPrice && maxPrice) {
        return { 
          displayPrice: minPrice, 
          displaySalePrice: null, 
          hasMultiplePrices: minPrice !== maxPrice
        };
      }
      
      return { 
        displayPrice: null, 
        displaySalePrice: null, 
        hasMultiplePrices: false
      };
    }

    // Single price products
    const priceAsFloat = price ? parseFloat(price as any) : null;
    const salePriceAsFloat = salePrice ? parseFloat(salePrice as any) : null;

    if (priceAsFloat || salePriceAsFloat) {
      return { 
        displayPrice: priceAsFloat, 
        displaySalePrice: salePriceAsFloat, 
        hasMultiplePrices: false
      };
    }

    return { 
      displayPrice: null, 
      displaySalePrice: null, 
      hasMultiplePrices: false
    };
  }, [has_multiple_sizes, sizes, price, salePrice, title]);

  console.log('ProductCard Debug - title:', title, 'has_multiple_sizes:', has_multiple_sizes, 'sizes:', sizes, 'price:', price, 'salePrice:', salePrice, 'displayPrice:', displayPrice, 'displaySalePrice:', displaySalePrice);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = `${window.location.origin}/product/${id}`;
    const message = `استفسار عن المنتج: ${title}\nرابط المنتج: ${productUrl}`;
    window.open(`https://wa.me/201006464349?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    // For products with multiple sizes, use the minimum price
    const cartPrice = has_multiple_sizes && sizes && sizes.length > 0 
      ? (displaySalePrice || displayPrice || 0)
      : (displaySalePrice || displayPrice || 0);
    
    addToCart({
      id,
      title,
      price: cartPrice.toString(),
      numericPrice: parseFloat(cartPrice.toString()),
      imageUrl,
    });
    
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2000);
    }, 1000);
  };

  return (
    <div className="group relative bg-gray-200 rounded-xl border border-gray-300 overflow-hidden transition-all duration-150 hover:scale-105 hover:bg-gray-300">
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {allImages.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              loop={allImages.length > 1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-white/70 !opacity-100',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
                renderBullet: (index, className) => {
                  return `<span class="${className} w-2 h-2 mx-1 rounded-full"></span>`;
                }
              }}
              className="w-full h-full"
            >
              {allImages.map((img, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <img
                    src={img}
                    alt={`${title} - صورة ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">لا توجد صورة</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1 text-header flex items-center gap-2">
            {title}
            <Sparkles className={`h-4 w-4 text-gold-dark`} />
          </h3>
          <p className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            {description ? description.split(/\r?\n/)[0] : ''}
          </p>
        </div>
      </Link>
      
      <div className="px-6 pb-6 pt-0">
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col items-end min-h-10">
            {has_multiple_sizes && (displayPrice || displaySalePrice) ? (
              <>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-2xl sm:text-3xl text-gold-dark`}>
                    {displaySalePrice || displayPrice}
                  </span>
                  <span className={`font-bold text-2xl sm:text-3xl text-gold-dark`}>ج</span>
                </div>
                {hasMultiplePrices ? (
                  <span className="text-xs text-gray-400">يبدأ من</span>
                ) : (
                  <span className="text-xs text-gray-400">سعر موحد</span>
                )}
              </>
            ) : displaySalePrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-2xl sm:text-3xl text-gold-dark`}>{displaySalePrice}</span>
                  <span className={`font-bold text-2xl sm:text-3xl text-gold-dark`}>ج</span>
                </div>
                {displayPrice && (
                  <div className="flex items-center gap-1">
                    <span className="text-base text-gray-400 line-through">{displayPrice}</span>
                    <span className="text-base text-gray-400 line-through">ج</span>
                  </div>
                )}
              </>
            ) : displayPrice ? (
              <>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-2xl sm:text-3xl text-gold-dark`}>{displayPrice}</span>
                  <span className={`font-bold text-2xl sm:text-3xl text-gold-dark`}>ج</span>
                </div>
              </>
            ) : (
              <div className="h-6" />
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded}
              className={`flex items-center justify-center p-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ${
                isAdded 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-[#345e8f] to-[#1b3459] text-white ring-1 ring-black/10'
              } ${isAdding ? 'opacity-75' : ''} min-w-[44px] min-h-[44px]`}
              title={isAdded ? 'تمت الإضافة' : 'أضف إلى السلة'}
            >
              {isAdding ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isAdded ? (
                <Check className="h-6 w-6" />
              ) : (
                <ShoppingCart className="h-6 w-6" />
              )}
            </button>
            
            <button
              onClick={handleContactClick}
              className={`bg-gradient-to-r from-[#d1a123] to-[#b8860b] text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 ring-1 ring-black/10 min-h-[44px]`}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-base">اطلب الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}