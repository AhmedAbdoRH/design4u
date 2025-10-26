export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  image_url: string;
  created_at: string;
}

export interface ProductSize {
  id: number;
  service_id: number;
  size: string;
  price: number;
  sale_price?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  category_id: string;
  subcategory_id?: string | null; // إضافة حقل الفئة الفرعية
  title: string;
  description: string | null;
  image_url: string | null;
  images?: ProductImage[]; // Array of product images
  gallery?: string[]; // روابط صور متعددة
  price?: number | null;
  sale_price?: number | null;
  has_multiple_sizes?: boolean;
  sizes?: ProductSize[]; // Array of product sizes
  is_featured?: boolean; // أحدث العروض
  is_best_seller?: boolean; // الأكثر مبيعاً
  created_at: string;
  category?: Category;
  subcategory?: Subcategory; // إضافة علاقة الفئة الفرعية
  // For search results display
  displayImage?: string;
}

export interface Banner {
  id: string;
  type: 'image' | 'text' | 'strip';
  title: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  // Strip banner specific properties
  strip_text_color?: string | null;
  strip_background_color?: string | null;
  strip_position?: 'above_main' | 'below_main' | null;
}

export interface StoreSettings {
  id: string;
  store_name: string | null;
  store_description: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  snapchat_url: string | null;
  tiktok_url: string | null;
  theme_settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    backgroundGradient?: string;
    fontFamily?: string;
  } | null;
  updated_at: string;
}

// واجهة آراء العملاء (Testimonials)
export interface Testimonial {
  id: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

// Subcategory type used in the frontend
export interface Subcategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string | null;
  description_en: string | null;
  category_id: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}