import { Helmet } from 'react-helmet-async';
import type { Service, Category, StoreSettings } from '../types/database';

interface StructuredDataProps {
  type: 'organization' | 'product' | 'category' | 'breadcrumb';
  data?: Service | Category | StoreSettings;
  services?: Service[];
  categories?: Category[];
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function StructuredData({ type, data, services, categories, breadcrumbs }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseUrl = 'https://designs4u.com';
    
    switch (type) {
      case 'organization':
        const storeSettings = data as StoreSettings;
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": storeSettings?.store_name || "Designs4U",
          "description": storeSettings?.store_description || "موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز",
          "url": baseUrl,
          "logo": storeSettings?.logo_url ? `${baseUrl}${storeSettings.logo_url}` : `${baseUrl}/logo.png`,
          "image": storeSettings?.og_image_url ? `${baseUrl}${storeSettings.og_image_url}` : `${baseUrl}/logo-social.png`,
          "address": [
            {
              "@type": "PostalAddress",
              "addressCountry": "EG",
              "addressLocality": "Cairo"
            }
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+201118666186",
              "contactType": "customer service",
              "areaServed": "EG",
              "availableLanguage": "Arabic"
            },
            {
              "@type": "ContactPoint",
              "telephone": "+201118666186",
              "contactType": "customer service",
              "areaServed": "EG",
              "availableLanguage": "Arabic"
            }
          ],
          "sameAs": [
            storeSettings?.facebook_url,
            storeSettings?.instagram_url,
            storeSettings?.twitter_url,
            storeSettings?.snapchat_url,
            storeSettings?.tiktok_url
          ].filter(Boolean),
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "مفروشات وأثاث منزلي",
            "itemListElement": services?.map((service, index) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": service.title,
                "description": service.description,
                "image": service.image_url ? `${baseUrl}${service.image_url}` : `${baseUrl}/placeholder-product.jpg`,
                "url": `${baseUrl}/product/${service.id}`
              },
              "price": service.price,
              "priceCurrency": "EGP",
              "availability": "https://schema.org/InStock"
            })) || []
          }
        };

      case 'product':
        const service = data as Service;
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": service.title,
          "description": service.description,
          "image": service.image_url ? `${baseUrl}${service.image_url}` : `${baseUrl}/placeholder-product.jpg`,
          "url": `${baseUrl}/product/${service.id}`,
          "brand": {
            "@type": "Brand",
            "name": "Designs4U"
          },
          "category": service.category?.name || "مفروشات",
          "offers": {
            "@type": "Offer",
            "price": service.sale_price || service.price,
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "Designs4U"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "50"
          }
        };

      case 'category':
        const category = data as Category;
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": category.name,
          "description": category.description || `منتجات ${category.name} من Designs4U`,
          "url": `${baseUrl}/category/${category.id}`,
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": services?.map((service, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Product",
                "name": service.title,
                "url": `${baseUrl}/product/${service.id}`,
                "image": service.image_url ? `${baseUrl}${service.image_url}` : `${baseUrl}/placeholder-product.jpg`
              }
            })) || []
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs?.map((breadcrumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": breadcrumb.name,
            "item": breadcrumb.url
          })) || []
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
}
