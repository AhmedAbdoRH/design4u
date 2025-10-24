import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Service, Category, Subcategory } from '../types/database';

interface SitemapGeneratorProps {
  onSitemapGenerated?: (sitemap: string) => void;
}

export default function SitemapGenerator({ onSitemapGenerated }: SitemapGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      // Fetch all data needed for sitemap
      const [servicesResult, categoriesResult, subcategoriesResult] = await Promise.all([
        supabase.from('services').select('id, created_at, updated_at').order('updated_at', { ascending: false }),
        supabase.from('categories').select('id, created_at, updated_at').order('updated_at', { ascending: false }),
        supabase.from('subcategories').select('id, created_at, updated_at').order('updated_at', { ascending: false })
      ]);

      const services = servicesResult.data || [];
      const categories = categoriesResult.data || [];
      const subcategories = subcategoriesResult.data || [];

      const baseUrl = 'https://designs4u.com';
      const currentDate = new Date().toISOString();

      // Generate sitemap XML
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

      // Add categories
      categories.forEach(category => {
        const lastmod = category.updated_at || category.created_at || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/category/${category.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      // Add subcategories
      subcategories.forEach(subcategory => {
        const lastmod = subcategory.updated_at || subcategory.created_at || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/subcategory/${subcategory.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      // Add products/services
      services.forEach(service => {
        const lastmod = service.updated_at || service.created_at || currentDate;
        sitemap += `
  <url>
    <loc>${baseUrl}/product/${service.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      // Save sitemap to public folder (this would need to be handled by the backend)
      if (onSitemapGenerated) {
        onSitemapGenerated(sitemap);
      }

      console.log('Sitemap generated successfully');
    } catch (error) {
      console.error('Error generating sitemap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateSitemap();
  }, []);

  return null; // This component doesn't render anything
}

// Function to download sitemap
export const downloadSitemap = (sitemap: string) => {
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
