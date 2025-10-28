import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { ProductSize } from '../types/database';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price?: number | null; // Make price optional and number type
  salePrice?: number | null; // Make salePrice optional and number type
  id: string | number;
  has_multiple_sizes?: boolean;
  sizes?: ProductSize[];
}


// Define the light gold color using the hex code from the Hero component
const lightGold = '#FFD700'; // This is standard gold color

export default function ProductCard({ title, description, imageUrl, price, salePrice, id, has_multiple_sizes, sizes }: ProductCardProps) {

  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Smart pricing system with intelligent fallbacks
  const { displayPrice, displaySalePrice, priceRange, hasMultiplePrices, pricingStrategy } = useMemo(() => {
    // Helper function to generate smart pricing based on product name
    const generateSmartPricing = (productTitle: string) => {
      const title = productTitle.toLowerCase();
      
      // Premium products (German, Memory, Deluxe)
      if (title.includes('ألماني') || title.includes('الماني') || title.includes('ميموري') || title.includes('ديلوكس')) {
        return { min: 8000, max: 15000, category: 'premium' };
      }
      
      // Mid-range products (Super, Mega, Omega)
      if (title.includes('سوبر') || title.includes('ميجا') || title.includes('اوميجا') || title.includes('اكسترا')) {
        return { min: 5000, max: 9000, category: 'mid-range' };
      }
      
      // Standard products (Grand, Fix)
      if (title.includes('جراند') || title.includes('فيكس')) {
        return { min: 3000, max: 6000, category: 'standard' };
      }
      
      // Default pricing
      return { min: 2000, max: 5000, category: 'basic' };
    };

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

      // If we have sale prices, use the minimum sale price
      if (minSalePrice && maxSalePrice) {
        return { 
          displayPrice: minPrice, 
          displaySalePrice: minSalePrice, 
          priceRange: null,
          hasMultiplePrices: minSalePrice !== maxSalePrice,
          pricingStrategy: 'database'
        };
      }
      
      // If we have regular prices, use the minimum price
      if (minPrice && maxPrice) {
        return { 
          displayPrice: minPrice, 
          displaySalePrice: null, 
          priceRange: null,
          hasMultiplePrices: minPrice !== maxPrice,
          pricingStrategy: 'database'
        };
      }
      
      // Smart fallback pricing for multiple sizes - use minimum price
      const smartPricing = generateSmartPricing(title);
      return { 
        displayPrice: smartPricing.min, 
        displaySalePrice: null, 
        priceRange: null,
        hasMultiplePrices: true,
        pricingStrategy: 'smart-fallback'
      };
    }

    // Single price products
    const priceAsFloat = price ? parseFloat(price as any) : null;
    const salePriceAsFloat = salePrice ? parseFloat(salePrice as any) : null;

    if (priceAsFloat || salePriceAsFloat) {
      return { 
        displayPrice: priceAsFloat, 
        displaySalePrice: salePriceAsFloat, 
        priceRange: null, 
        hasMultiplePrices: false,
        pricingStrategy: 'database'
      };
    }

    // Smart fallback for single price products
    const smartPricing = generateSmartPricing(title);
    return { 
      displayPrice: smartPricing.min, 
      displaySalePrice: null, 
      priceRange: null, 
      hasMultiplePrices: false,
      pricingStrategy: 'smart-fallback'
    };
  }, [has_multiple_sizes, sizes, price, salePrice, title]);

  console.log('ProductCard Debug - title:', title, 'has_multiple_sizes:', has_multiple_sizes, 'sizes:', sizes, 'price:', price, 'salePrice:', salePrice, 'displayPrice:', displayPrice, 'displaySalePrice:', displaySalePrice, 'pricingStrategy:', pricingStrategy);

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
    <div className="group relative bg-secondary/5 backdrop-blur-md rounded-xl border border-secondary/20 overflow-hidden transition-all duration-150 hover:scale-105 hover:bg-secondary/10">
      <Link to={`/product/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <img
            src={imageUrl || '/placeholder-product.jpg'}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-header flex items-center gap-2">
            {title}
            <Sparkles className={`h-4 w-4 text-gold-dark`} />
          </h3>
        </div>
      </Link>
      
      <div className="px-6 pb-6 pt-0">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-end">
            {has_multiple_sizes && (displayPrice || displaySalePrice) ? (
              <>
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-lg sm:text-xl text-gold-dark`}>
                    {displaySalePrice || displayPrice}
                  </span>
                  <span className={`font-bold text-lg sm:text-xl text-gold-dark`}>ج</span>
                </div>
                {pricingStrategy === 'smart-fallback' ? (
                  <span className="text-xs text-yellow-400">سعر تقديري</span>
                ) : hasMultiplePrices ? (
                  <span className="text-xs text-gray-400">يبدأ من</span>
                ) : (
                  <span className="text-xs text-gray-400">سعر موحد</span>
                )}
              </>
            ) : displaySalePrice ? (
              <>
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-lg sm:text-xl text-gold-dark`}>{displaySalePrice}</span>
                  <span className={`font-bold text-lg sm:text-xl text-gold-dark`}>ج</span>
                </div>
                {displayPrice && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400 line-through">{displayPrice}</span>
                    <span className="text-sm text-gray-400 line-through">ج</span>
                  </div>
                )}
              </>
            ) : displayPrice ? (
              <>
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-lg sm:text-xl text-gold-dark`}>{displayPrice}</span>
                  <span className={`font-bold text-lg sm:text-xl text-gold-dark`}>ج</span>
                </div>
                {pricingStrategy === 'smart-fallback' && (
                  <span className="text-xs text-gold-dark">سعر تقديري</span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">يرجى التواصل للاستفسار عن السعر</span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${ 
                isAdded 
                  ? 'bg-green-500 text-white' 
                  : `bg-[${lightGold}]/90 hover:bg-[${lightGold}] text-secondary`
              } ${isAdding ? 'opacity-75' : ''}`}
              title={isAdded ? 'تمت الإضافة' : 'أضف إلى السلة'}
            >
              {isAdding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isAdded ? (
                <Check className="h-5 w-5" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleContactClick}
              className={`bg-[${lightGold}]/90 hover:bg-yellow-500 text-secondary px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 backdrop-blur-sm`}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline">اطلب الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}