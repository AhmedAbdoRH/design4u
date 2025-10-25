import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { CartProvider } from './contexts/CartContext';
import Cart from './components/Cart';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import BannerStrip from './components/BannerStrip';
import Services from './components/Services';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ServiceDetails from './pages/ServiceDetails';
import CategoryProducts from './pages/CategoryProducts';
import SubcategoryProducts from './pages/SubcategoryProducts';
import ProductDetails from './pages/ProductDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import LoadingScreen from './components/LoadingScreen';
import StructuredData from './components/StructuredData';
import Hero from './components/Hero';
import type { StoreSettings, Banner } from './types/database';
import { ThemeProvider } from './theme/ThemeContext';

// PrivateRoute component with professional loading spinner
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }

  if (isAuthenticated === null) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-spinner-text"> </p>
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

function App() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [mainContentLoaded, setMainContentLoaded] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function initApp() {
      await fetchStoreSettings();
      
      // Fetch banners with timeout
      const bannersController = new AbortController();
      const bannersTimeoutId = setTimeout(() => bannersController.abort(), 5000);
      
      const { data: bannersData, error: bannersError } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });

      clearTimeout(bannersTimeoutId);

      // Fetch services for structured data with timeout
      const servicesController = new AbortController();
      const servicesTimeoutId = setTimeout(() => servicesController.abort(), 5000);
      
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .limit(10)
        .order('created_at', { ascending: false });

      clearTimeout(servicesTimeoutId);

      // Fetch categories for structured data with timeout
      const categoriesController = new AbortController();
      const categoriesTimeoutId = setTimeout(() => categoriesController.abort(), 5000);
      
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      clearTimeout(categoriesTimeoutId);

      if (isMounted) {
        if (bannersError) {
          console.error("Error fetching banners:", bannersError);
          setBanners([]);
        } else {
          setBanners(bannersData || []);
        }

        if (servicesError) {
          console.error("Error fetching services:", servicesError);
          setServices([]);
        } else {
          setServices(servicesData || []);
        }

        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          setCategories([]);
        } else {
          setCategories(categoriesData || []);
        }
      }

      // Wait for at least 2 seconds OR until settings are fetched, whichever is longer
      // This part is primarily for the initial LoadingScreen, not PrivateRoute
      const timer = setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 2000); // Minimum 2 seconds for initial loading screen

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
    initApp();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (storeSettings) {
      const theme = (storeSettings as any).theme_settings || {};
      const primary = theme.primaryColor || '#c7a17a';
      const secondary = theme.secondaryColor || '#fff';
      const fontFamily = theme.fontFamily || 'Cairo, sans-serif';
      const backgroundGradient = theme.backgroundGradient || '';
      const backgroundColor = theme.backgroundColor || '#000';

      const root = document.documentElement;
      root.style.setProperty('--color-primary', primary);
      root.style.setProperty('--color-secondary', secondary);
      root.style.setProperty('--color-accent', '#d99323'); // Keep or adjust as needed
      root.style.setProperty('--color-accent-light', '#e0a745'); // Keep or adjust
      root.style.setProperty('--font-family', fontFamily);

      if (backgroundGradient && backgroundGradient.trim() !== '') {
        root.style.setProperty('--background-gradient', backgroundGradient);
        root.style.setProperty('--background-color', ''); // Clear single color if gradient is set
      } else {
        root.style.setProperty('--background-gradient', ''); // Clear gradient if single color is set
        root.style.setProperty('--background-color', backgroundColor);
      }
    }
  }, [storeSettings]);

  const fetchStoreSettings = async () => {
    try {
      // محاولة الاتصال بقاعدة البيانات مع timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 ثواني timeout
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      clearTimeout(timeoutId);

      if (error) {
        console.error("Error fetching store settings:", error);
        // Set default settings if fetch fails
        setStoreSettings({
          id: '00000000-0000-0000-0000-000000000001',
          store_name: 'Designs4U',
          store_description: 'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
          logo_url: '/logo.png',
          meta_title: 'Designs4U - خدمات الطباعة والتطريز',
          meta_description: 'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
          theme_settings: {
            primaryColor: '#c7a17a',
            secondaryColor: '#fff',
            fontFamily: 'Cairo, sans-serif',
            backgroundColor: '#000',
            backgroundGradient: ''
          }
        } as StoreSettings);
        return;
      }
      
      if (data) {
        setStoreSettings(data);
      } else {
        // No data found, set default settings
        setStoreSettings({
          id: '00000000-0000-0000-0000-000000000001',
          store_name: 'Designs4U',
          store_description: 'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
          logo_url: '/logo.png',
          meta_title: 'Designs4U - خدمات الطباعة والتطريز',
          meta_description: 'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
          theme_settings: {
            primaryColor: '#c7a17a',
            secondaryColor: '#fff',
            fontFamily: 'Cairo, sans-serif',
            backgroundColor: '#000',
            backgroundGradient: ''
          }
        } as StoreSettings);
      }
    } catch (error) {
      console.error("Unexpected error fetching store settings:", error);
      // Set default settings on any unexpected error
      setStoreSettings({
        id: '00000000-0000-0000-0000-000000000001',
        store_name: 'Designs4U',
        store_description: 'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
        logo_url: '/logo.png',
        meta_title: 'Designs4U - خدمات الطباعة والتطريز',
        meta_description: 'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
        theme_settings: {
          primaryColor: '#c7a17a',
          secondaryColor: '#fff',
          fontFamily: 'Cairo, sans-serif',
          backgroundColor: '#000',
          backgroundGradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
        }
      } as StoreSettings);
    }
  };

  interface LayoutProps {
    children: React.ReactNode;
    banners: Banner[];
  }

  const Layout = ({ children, banners: layoutBanners }: LayoutProps) => {
    // Filter banners for different purposes
    const mainBanners = layoutBanners.filter(banner => 
      banner.type === 'image' && banner.is_active
    );
    const stripBanners = layoutBanners.filter(banner => 
      banner.type === 'strip' && banner.is_active
    );

    return (
      <div
        className="min-h-screen font-cairo" // Ensure font-cairo is defined in tailwind.config.js if used like this
        style={{
          background: (storeSettings && (storeSettings as any).theme_settings?.backgroundGradient)
            ? (storeSettings as any).theme_settings.backgroundGradient
            : (storeSettings && (storeSettings as any).theme_settings?.backgroundColor)
              ? (storeSettings as any).theme_settings.backgroundColor
              : "", // Default fallback
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <Header storeSettings={storeSettings} />
        {window.location.pathname === '/' && mainBanners.length > 0 && (
          <BannerSlider banners={mainBanners} />
        )}
        {window.location.pathname === '/' && stripBanners.length > 0 && (
          <BannerStrip banners={stripBanners} />
        )}
        {window.location.pathname === '/' && (
          <Hero />
        )}
        <MainFade>{children}</MainFade>
        {window.location.pathname === '/' && (
          <Testimonials />
        )}
        <Footer storeSettings={storeSettings} />
        <WhatsAppButton />
      </div>
    );
  };

  if (loading) {
    return (
      <LoadingScreen
        logoUrl={storeSettings?.logo_url || '/logo.png'} // Provide a default logo
      />
    );
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <Helmet>
          <title>{storeSettings?.meta_title || storeSettings?.store_name || 'Designs4U | خدمات الطباعة والتطريز وشروحات برامج التطريز'}</title>
          <meta name="description" content={storeSettings?.meta_description || storeSettings?.store_description || 'Designs4U - موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز. نقدم أفضل خدمات الطباعة على الأقمشة والملابس والتطريز اليدوي والآلي.'} />
          <meta name="keywords" content={storeSettings?.keywords ? storeSettings.keywords.join(', ') : 'Designs4U, طباعة, تطريز, خدمات طباعة, خدمات تطريز, شروحات برامج التطريز, طباعة على القماش, طباعة على الملابس, تطريز يدوي, تطريز آلي, مصر'} />
          <meta name="author" content="Designs4U" />
          <meta name="robots" content="index, follow" />
          <meta name="language" content="Arabic" />
          <meta name="revisit-after" content="7 days" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://designs4u.com/" />
          <meta property="og:title" content={storeSettings?.meta_title || storeSettings?.store_name || 'Designs4U | خدمات الطباعة والتطريز وشروحات برامج التطريز'} />
          <meta property="og:description" content={storeSettings?.meta_description || storeSettings?.store_description || 'Designs4U - موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز. نقدم أفضل خدمات الطباعة على الأقمشة والملابس والتطريز اليدوي والآلي.'} />
          <meta property="og:image" content={storeSettings?.og_image_url || 'https://designs4u.com/logo-social.png'} />
          <meta property="og:image:secure_url" content={storeSettings?.og_image_url || 'https://designs4u.com/logo-social.png'} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Designs4U - خدمات الطباعة والتطريز" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:site_name" content="Designs4U" />
          <meta property="og:locale" content="ar_EG" />
          <meta property="og:updated_time" content={new Date().toISOString()} />
          
          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://designs4u.com/" />
          <meta property="twitter:title" content={storeSettings?.meta_title || storeSettings?.store_name || 'Designs4U | خدمات الطباعة والتطريز وشروحات برامج التطريز'} />
          <meta property="twitter:description" content={storeSettings?.meta_description || storeSettings?.store_description || 'Designs4U - موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز. نقدم أفضل خدمات الطباعة على الأقمشة والملابس والتطريز اليدوي والآلي.'} />
          <meta property="twitter:image" content={storeSettings?.og_image_url || 'https://designs4u.com/logo-social.png'} />
          <meta property="twitter:image:alt" content="Designs4U - خدمات الطباعة والتطريز" />
          <meta name="twitter:site" content="@designs4u" />
          <meta name="twitter:creator" content="@designs4u" />
          
          {/* WhatsApp and Social Media */}
          <meta property="og:image:url" content={storeSettings?.og_image_url || 'https://designs4u.com/logo-social.png'} />
          <meta name="image" content={storeSettings?.og_image_url || 'https://designs4u.com/logo-social.png'} />
          <meta name="thumbnail" content={storeSettings?.og_image_url || 'https://designs4u.com/logo-social.png'} />
          
          {/* Additional SEO Meta Tags */}
          <meta name="geo.region" content="EG" />
          <meta name="geo.placename" content="Egypt" />
          <meta name="geo.position" content="30.0444;31.2357" />
          <meta name="ICBM" content="30.0444, 31.2357" />
          
          {/* Canonical URL */}
          <link rel="canonical" href="https://designs4u.com/" />
          
          {/* Favicon */}
          {storeSettings?.favicon_url && (
            <link rel="icon" href={storeSettings.favicon_url} />
          )}
        </Helmet>
        
        {/* Structured Data */}
        <StructuredData 
          type="organization" 
          data={storeSettings} 
          services={services}
          categories={categories}
        />
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <PrivateRoute>
                <AdminDashboard onSettingsUpdate={fetchStoreSettings} />
              </PrivateRoute>
            } />

            <Route path="/service/:id" element={
              <Layout banners={banners}>
                <ServiceDetails />
              </Layout>
            } />
            <Route path="/product/:id" element={
              <Layout banners={banners}>
                <ProductDetails />
              </Layout>
            } />
            <Route path="/category/:categoryId" element={
              <Layout banners={banners}>
                <CategoryProducts />
              </Layout>
            } />
            <Route path="/subcategory/:subcategoryId" element={
              <Layout banners={banners}>
                <SubcategoryProducts />
              </Layout>
            } />
            <Route path="/about" element={
              <Layout banners={banners}>
                <AboutUs />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout banners={banners}>
                <ContactUs />
              </Layout>
            } />
            <Route path="/" element={
              <Layout banners={banners}>
                <StaggeredHome
                  storeSettings={storeSettings}
                  banners={banners}
                  setMainContentLoaded={setMainContentLoaded}
                />
              </Layout>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

function StaggeredHome({
  storeSettings,
  banners, // This prop is received but not directly used in this simplified version
  setMainContentLoaded,
}: {
  storeSettings: StoreSettings | null;
  banners: Banner[];
  setMainContentLoaded: (v: boolean) => void;
}) {
  useEffect(() => {
    setMainContentLoaded(true); // Signal that content related to StaggeredHome is ready
  }, [setMainContentLoaded]);

  return (
    <>
      {/* Services component is part of the staggered load */}
      <Services />
      {/* You can add more home page sections here to stagger them if needed */}
    </>
  );
}

function MainFade({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50); // Quick fade-in for content
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className="main-fade-content" // Added class for specific styling if needed
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 1200ms cubic-bezier(.4,0,.2,1), transform 700ms cubic-bezier(.4,0,.2,1)',
      }}
    >
      {children}
    </div>
  );
}

export default App;