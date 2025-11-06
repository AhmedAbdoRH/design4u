// SEO utility functions

// Generate meta title
export const generateMetaTitle = (title: string, siteName: string = 'Designs4U') => {
  return `${title} | ${siteName}`;
};

// Generate meta description
export const generateMetaDescription = (description: string, maxLength: number = 160) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

// Generate keywords from content
export const generateKeywords = (content: string): string[] => {
  const keywords = [
    'Designs4U',
    'طباعة',
    'تطريز',
    'خدمات طباعة',
    'خدمات تطريز',
    'شروحات برامج التطريز',
    'طباعة على القماش',
    'طباعة على الملابس',
    'تطريز يدوي',
    'تطريز آلي',
    'مصر',
    'تصميم',
    'برامج التطريز',
    'ويلكوم',
    'إمبريدي'
  ];

  // Extract additional keywords from content
  const contentKeywords = content
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\s]/g, '') // Keep only Arabic characters and spaces
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !keywords.includes(word))
    .slice(0, 10); // Limit to 10 additional keywords

  return [...keywords, ...contentKeywords];
};

// Generate breadcrumb data
export const generateBreadcrumbs = (path: string, categories?: any[], products?: any[]) => {
  const breadcrumbs = [
    { name: 'الرئيسية', url: '/' }
  ];

  const pathSegments = path.split('/').filter(Boolean);

  if (pathSegments.includes('category') && categories) {
    const categoryId = pathSegments[pathSegments.indexOf('category') + 1];
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      breadcrumbs.push({
        name: category.name,
        url: `/category/${categoryId}`
      });
    }
  }

  if (pathSegments.includes('subcategory') && categories) {
    const subcategoryId = pathSegments[pathSegments.indexOf('subcategory') + 1];
    // You would need to fetch subcategory data here
    breadcrumbs.push({
      name: 'قسم فرعي',
      url: `/subcategory/${subcategoryId}`
    });
  }

  if (pathSegments.includes('product') && products) {
    const productId = pathSegments[pathSegments.indexOf('product') + 1];
    const product = products.find(p => p.id === productId);
    if (product) {
      breadcrumbs.push({
        name: product.title,
        url: `/product/${productId}`
      });
    }
  }

  return breadcrumbs;
};

// Generate structured data for products
export const generateProductStructuredData = (product: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image_url,
    "brand": {
      "@type": "Brand",
      "name": "Designs4U"
    },
    "offers": {
      "@type": "Offer",
      "price": product.sale_price || product.price,
      "priceCurrency": "EGP",
      "availability": "https://schema.org/InStock"
    }
  };
};

// Generate structured data for organization
export const generateOrganizationStructuredData = (storeSettings: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": storeSettings?.store_name || "Designs4U",
    "description": storeSettings?.store_description || "موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز",
    "url": "https://designs4u.com",
    "logo": storeSettings?.logo_url || "/favicon.png",
    "address": [
      {
        "@type": "PostalAddress",
        "addressCountry": "EG",
        "addressLocality": "Cairo"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+201118666186",
      "contactType": "customer service"
    }
  };
};

// Validate SEO data
export const validateSEOData = (data: {
  title?: string;
  description?: string;
  keywords?: string[];
}) => {
  const errors: string[] = [];

  if (!data.title || data.title.length < 30) {
    errors.push('Title should be at least 30 characters long');
  }

  if (!data.description || data.description.length < 120) {
    errors.push('Description should be at least 120 characters long');
  }

  if (!data.keywords || data.keywords.length < 5) {
    errors.push('Should have at least 5 keywords');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
