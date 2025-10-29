import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Snail as Snapchat, Youtube, Phone, MessageCircle } from 'lucide-react';
import type { StoreSettings } from '../types/database';

interface FooterProps {
  storeSettings?: StoreSettings | null;
}

export default function Footer({ storeSettings }: FooterProps) {
  const socialLinks = [
    { url: storeSettings?.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: storeSettings?.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: storeSettings?.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: storeSettings?.snapchat_url, icon: Snapchat, label: 'Snapchat' },
    { url: storeSettings?.tiktok_url, icon: Youtube, label: 'TikTok' },
  ].filter(link => link.url);

  return (
    <footer className="bg-secondary/5 backdrop-blur-md border-t border-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4 mb-4">
              {socialLinks.map((link, index) => (
                link.url && (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary/80 hover:text-accent transition-colors duration-300"
                    title={link.label}
                  >
                    <link.icon className="h-6 w-6" />
                  </a>
                )
              ))}
            </div>
          )}

          {/* Branches and Contact Info */}
          <div className="w-full max-w-4xl">

            {/* Contact Numbers */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a
                href="tel:+201006464349"
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 rounded-lg border border-green-500/30 transition-all duration-300"
              >
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">اتصل بنا الان</span>
              </a>
              
              <a
                href="https://wa.me/201006464349"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 rounded-lg border border-green-500/30 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">تواصل معنا عبر واتساب</span>
              </a>
            </div>
          </div>

          
          <div className="flex gap-6">
            <Link
              to="/about"
              className="text-white/70 hover:text-accent transition-colors duration-300 text-sm font-medium"
            >
              من نحن
            </Link>
            <Link
              to="/admin/login"
              className="text-white/70 hover:text-accent transition-colors duration-300 text-sm font-medium"
            >
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}