import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Clock, Award, Users, Star } from 'lucide-react';

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>من نحن - Designs4U | خدمات الطباعة والتطريز وشروحات برامج التطريز</title>
        <meta name="description" content="Designs4U - موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز. نقدم أفضل خدمات الطباعة على الأقمشة والملابس والتطريز اليدوي والآلي." />
        <meta name="keywords" content="من نحن, Designs4U, خدمات طباعة, خدمات تطريز, شروحات برامج التطريز, طباعة على القماش, طباعة على الملابس, تطريز يدوي, تطريز آلي" />
        <link rel="canonical" href="https://designs4u.com/about" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              من نحن - <span className="text-gold-dark">Designs4U</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Designs4U - موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز. نقدم أفضل خدمات الطباعة على الأقمشة والملابس والتطريز اليدوي والآلي بأسعار تنافسية وجودة عالية.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Our Story */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-gold-dark mb-6">قصتنا</h2>
              <div className="space-y-4 text-white/90 leading-relaxed">
                <p>
                  بدأت رحلة <strong>Designs4U</strong> بفكرة بسيطة: 
                  تقديم أفضل خدمات الطباعة والتطريز وشروحات برامج التطريز للعملاء في مصر.
                </p>
                <p>
                  على مدار سنوات من الخبرة، اكتسبنا خبرة واسعة في مجال الطباعة والتطريز، 
                  وطورنا من خدماتنا لتشمل جميع أنواع الطباعة على الأقمشة والملابس والتطريز اليدوي والآلي.
                </p>
                <p>
                  نحن نؤمن بأن التصميم والجودة هما الأساس في تقديم خدمات متميزة، لذلك نسعى دائماً لتقديم 
                  أفضل الخدمات التي تجمع بين الجودة والجمال والابتكار.
                </p>
              </div>
            </div>

            {/* Our Values */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-[#FFD700] mb-6">قيمنا</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-gold-dark mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">الجودة</h3>
                    <p className="text-white/80">نقدم منتجات عالية الجودة من أفضل المواد الخام</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-gold-dark mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">خدمة العملاء</h3>
                    <p className="text-white/80">نضع رضا العملاء في المقام الأول</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Star className="h-8 w-8 text-gold-dark mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">التميز</h3>
                    <p className="text-white/80">نسعى دائماً للتميز في كل ما نقدمه</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-gold-dark mb-2">25+</div>
              <div className="text-white/80">سنة خبرة</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-gold-dark mb-2">1000+</div>
              <div className="text-white/80">عميل راضي</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-gold-dark mb-2">5000+</div>
              <div className="text-white/80">منتج متاح</div>
            </div>
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-gold-dark mb-2">2</div>
              <div className="text-white/80">فرع</div>
            </div>
          </div>

          {/* Our Branches */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
            <h2 className="text-3xl font-bold text-gold-dark mb-8 text-center">فروعنا</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <MapPin className="h-6 w-6 text-gold-dark mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">تواصل معنا</h3>
                    <p className="text-white/80 mb-4">
                      +20 100 646 4349
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-white">+20 100 646 4349</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <MapPin className="h-6 w-6 text-gold-dark mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">واتساب</h3>
                    <p className="text-white/80 mb-4">
                      +20 100 646 4349
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-white">+20 100 646 4349</span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
            <h2 className="text-3xl font-bold text-gold-dark mb-6">ساعات العمل</h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Clock className="h-6 w-6 text-gold-dark" />
              <span className="text-xl text-white">يومياً من 9:00 صباحاً إلى 10:00 مساءً</span>
            </div>
            <p className="text-white/80">
              نحن متاحون لخدمتكم على مدار الساعة عبر الهاتف والواتساب
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
