import React from 'react';
import { Link } from 'react-router-dom';
import { Target , Facebook, Instagram, Twitter, Snail as Snapchat, Youtube, Phone, MapPin, MessageCircle } from 'lucide-react';
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Branch 1 */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">تواصل معنا</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      +20 100 646 4349
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">واتساب</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      +20 100 646 4349
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Numbers */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a
                href="tel:+201006464349"
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 rounded-lg border border-green-500/30 transition-all duration-300"
              >
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">+20 100 646 4349</span>
              </a>
              
              <a
                href="https://wa.me/201006464349"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 rounded-lg border border-green-500/30 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">+20 100 646 4349</span>
              </a>
            </div>
          </div>

          {/* Developer Info */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-white text-opacity-50 flex items-center gap-2 text-sm">
              تم تطوير الموقع بواسطة
              <Target className="text-red-500 h-6 w-6" />
              <a href="https://RehlatHadaf.online" className="text-white text-opacity-80 underline hover:no-underline">رحلة هدف للتسويق التجاري</a>
            </p>
          </div>
          
          <Link
            to="/admin/login"
            className="text-secondary/0 hover:text-accent transition-colors duration-300 flex justify-center items-center"
          >
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}