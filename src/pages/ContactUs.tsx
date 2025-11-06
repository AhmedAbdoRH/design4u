import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  return (
    <>
      <Helmet>
        <title>اتصل بنا - Designs4U | خدمات الطباعة والتطريز</title>
        <meta name="description" content="تواصل مع Designs4U - رقم الهاتف: 01118666186. نقدم أفضل خدمات الطباعة والتطريز وشروحات برامج التطريز في مصر." />
        <meta name="keywords" content="اتصل بنا, Designs4U, هاتف, واتساب, طباعة, تطريز, خدمات طباعة, خدمات تطريز" />
        <link rel="canonical" href="https://designs4u.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="text-gold-dark">اتصل بنا</span> - Designs4U
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              نحن هنا لخدمتكم! تواصلوا معنا للحصول على أفضل خدمات الطباعة والتطريز وشروحات برامج التطريز. فريقنا متاح لمساعدتكم في اختيار الخدمات المناسبة.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-gold-dark mb-6">معلومات الاتصال</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Phone className="h-8 w-8 text-green-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">هاتف</h3>
                      <a 
                        href="tel:+201118666186" 
                        className="text-green-400 text-lg hover:text-green-300 transition-colors"
                      >
                        01118666186
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MessageCircle className="h-8 w-8 text-green-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">واتساب</h3>
                      <a 
                        href="https://wa.me/201006464349" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 text-lg hover:text-green-300 transition-colors"
                      >
                        +20 100 646 4349
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-gold-dark mb-6">ساعات العمل</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-gold-dark" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">الأحد - الخميس</h3>
                      <p className="text-white/80">9:00 صباحاً - 10:00 مساءً</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-gold-dark" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">الجمعة - السبت</h3>
                      <p className="text-white/80">9:00 صباحاً - 10:00 مساءً</p>
                    </div>
                  </div>
                </div>
                <p className="text-white/60 text-sm mt-4">
                  * نحن متاحون على مدار الساعة عبر الهاتف والواتساب
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
            <h2 className="text-3xl font-bold text-gold-dark mb-6">خدماتنا</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">استشارة مجانية</h3>
                <p className="text-white/80">نقدم استشارة مجانية لاختيار خدمات الطباعة والتطريز المناسبة</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">توصيل مجاني</h3>
                <p className="text-white/80">توصيل مجاني للمناطق القريبة من فروعنا</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-2">ضمان الجودة</h3>
                <p className="text-white/80">ضمان شامل على جميع منتجاتنا</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
