import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service } from '../types/database';
import { MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Service[]>([]);

  // New state to control fade-out of previous image
  const [prevOpacity, setPrevOpacity] = useState(1);

  // إضافة حالتين للتحكم في انتقال الصور
  const [currentTransform, setCurrentTransform] = useState('translateX(0)');
  const [prevTransform, setPrevTransform] = useState('translateX(0)');

  // استخدم مؤشر منفصل للصورة السابقة
  const [prevImageIndexState, setPrevImageIndexState] = useState<number | null>(null);
  // تحكم في حالة الانتقال (لضمان عدم تكرار الترانزيشن أو تعارضها)
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (id) {
      fetchService(id);
      fetchSuggested();
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('الخدمة غير موجودة');

      setService(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // جلب خدمات أخرى (بدون شرط القسم)
  const fetchSuggested = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .neq('id', id)
      .limit(10);
    setSuggested(data || []);
  };

  const handleContact = () => {
    if (!service) return;
    const serviceUrl = window.location.href;
    const message = `استفسار عن الخدمة: ${service.title}
رابط الخدمة: ${serviceUrl}`;
    window.open(`https://wa.me/201006464349?text=${encodeURIComponent(message)}`, '_blank');
  };

  // التقليب التلقائي للصور في الخدمة الرئيسية فقط
  const images: string[] = [
    service?.image_url || '',
    ...(Array.isArray(service?.gallery) ? service.gallery : [])
  ].filter(Boolean);

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4500); // فترة 5000 ملي ثانية (5 ثوانٍ)
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setCurrentImage(0);
  }, [service?.id]);

  // استخدام usePrevious لحفظ مؤشر الصورة السابقة
  const previousImageIndex = usePrevious(currentImage);

  // Extracted background styles for reuse
  const backgroundStyles = {
    background: '#2a2a2a',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };

  // تعديل تأثير الانتقال ليكون أبطأ: زيادة مدة الانتقال إلى 3500ms، مع تأخير 1000ms عند بدء التحريك
  useEffect(() => {
    // ابدأ بتحريك الصورة الجديدة من اليسار
    setCurrentTransform('translateX(-100%)');
    // الصورة السابقة تبدأ من موقعها الحالي
    setPrevTransform('translateX(0)');
    const timer = setTimeout(() => {
      // تحول الصورة الجديدة إلى موقعها النهائي
      setCurrentTransform('translateX(0)');
      // تنزلق الصورة السابقة للخارج إلى اليمين
      setPrevTransform('translateX(100%)');
    }, 1000); // تأخير 1000ms
    return () => clearTimeout(timer);
  }, [currentImage]);

  // عند تغيير الصورة، احفظ المؤشر السابق قبل التغيير
  useEffect(() => {
    setPrevImageIndexState(currentImage);
  }, [currentImage]);

  // انتقال الصور: الصورة الجديدة تبدأ من اليمين وتدخل، والصورة السابقة تخرج لليسار
  useEffect(() => {
    // إعدادات الانتقال
    const DURATION = 1800; // مدة الانتقال الفعلي (ms)
    const DELAY = 0; // لا حاجة لتأخير إضافي

    // ابدأ الانتقال فقط إذا لم يكن هناك انتقال جارٍ
    setIsTransitioning(true);
    setCurrentTransform('translateX(100%)'); // الصورة الجديدة تبدأ خارج الشاشة يميناً
    setPrevTransform('translateX(0)');      // الصورة السابقة في مكانها

    // استخدم requestAnimationFrame لضمان تطبيق الترانزيشن بعد إعادة الرسم
    let raf = requestAnimationFrame(() => {
      setCurrentTransform('translateX(0)');     // الصورة الجديدة تدخل مكانها
      setPrevTransform('translateX(-100%)');    // الصورة السابقة تخرج يساراً
    });

    // بعد انتهاء الانتقال، احذف الصورة السابقة من العرض
    const cleanup = setTimeout(() => {
      setPrevImageIndexState(null);
      setIsTransitioning(false);
    }, DURATION);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cleanup);
    };
  }, [currentImage]);

  // تحديد صورة الخدمة المصغرة بشكل صحيح (الأولوية: image_url ثم لقطة الشاشة الافتراضية)
  const defaultScreenshot = '/screenshot.jpg'; // تأكد من توفر هذه الصورة في المجلد العام
  const ogImage =
    service?.image_url && service.image_url.trim() !== ''
      ? service.image_url
      : defaultScreenshot;

  if (isLoading) {
    // Added pt-24 here as well for consistency with the main view
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-24"
        style={backgroundStyles}
      >
        <div className="text-xl text-secondary">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !service) {
    // Added pt-24 here as well for consistency with the main view
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 pt-24"
        style={backgroundStyles}
      >
        <div className="text-xl text-secondary">{error || 'الخدمة غير موجودة'}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-secondary text-primary px-6 py-2 rounded-lg hover:bg-opacity-90"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <>
      {/* وسوم Open Graph لعرض صورة الخدمة عند مشاركة الرابط (واتساب وغيره) */}
      <Helmet>
        <meta property="og:title" content={service?.title || ''} />
        <meta property="og:description" content={service?.description || ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="website" />
        {/* دعم تويتر أيضاً */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service?.title || ''} />
        <meta name="twitter:description" content={service?.description || ''} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className="min-h-screen flex flex-col pt-24" style={backgroundStyles}>
        {/* This div centers the service card and grows */}
        <div className="flex items-center justify-center flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl">
            <div className="rounded-lg shadow-lg overflow-hidden glass">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="w-full aspect-[4/3] bg-gray-200 relative rounded-t-lg md:rounded-none md:rounded-s-lg overflow-hidden">
                    {prevImageIndexState !== null && prevImageIndexState !== currentImage && (
                      <img
                        src={images[prevImageIndexState]}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          transform: prevTransform,
                          zIndex: 10,
                          transition: isTransitioning
                            ? 'transform 1800ms cubic-bezier(.4,0,.2,1)'
                            : 'none',
                          willChange: 'transform',
                        }}
                        draggable={false}
                      />
                    )}
                    <img
                      src={images[currentImage] || ''}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: currentTransform,
                        zIndex: 5,
                        transition: isTransitioning
                          ? 'transform 1800ms cubic-bezier(.4,0,.2,1)'
                          : 'none',
                        willChange: 'transform',
                      }}
                      draggable={false}
                    />
                    {images.length > 1 && (
                      <>
                        {/* مؤشرات الصور */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {images.map((img, idx) => (
                            <button
                              key={img + idx}
                              className={`w-2 h-2 rounded-full border-none transition-colors ease-in-out duration-500 ${
                                currentImage === idx ? 'bg-white' : 'bg-white/30'
                              }`}
                              onClick={() => setCurrentImage(idx)}
                              aria-label={`عرض الصورة رقم ${idx + 1}`}
                              type="button"
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <h1 className="text-3xl font-bold mb-4 text-secondary">{service.title}</h1>
                  <p className="text-white mb-6 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  <div className="border-t border-gray-700 pt-6 mb-6">
                    <div className="text-2xl font-bold text-accent mb-6">
                      {service.price}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleContact}
                        className="flex-1 bg-[#25D366] text-white py-3 px-6 rounded-lg font-bold hover:bg-opacity-90 flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-5 w-5" />
                        تواصل معنا للطلب
                      </button>
                      {/* زر مشاركة رابط الخدمة مباشرة على واتساب */}
                      <a
                        href={`https://wa.me/201006464349?text=${encodeURIComponent(`شاهد هذه الخدمة: ${service.title}\n${window.location.href}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#128C7E] text-white py-3 px-6 rounded-lg font-bold hover:bg-opacity-90 flex items-center justify-center gap-2"
                        style={{ textDecoration: 'none' }}
                      >
                        <MessageCircle className="h-5 w-5" />
                        مشاركة الخدمة على واتساب
                      </a>
                      {/* نص توضيحي للمشاركة */}
                      <p className="text-xs text-secondary mt-2 text-center w-full">يمكنك مشاركة رابط الخدمة مع أصدقائك على واتساب وسيظهر لهم صورة الخدمة تلقائيًا</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الخدمات المقترحة */}
        {suggested.length > 0 && (
          <div className="container mx-auto px-4 max-w-4xl lg:max-w-5xl mb-8">
            <h2 className="text-xl font-bold text-secondary mb-4">متوفر لدينا ايضا</h2>
            <div
              className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {suggested.map((item) => {
                // فقط أول صورة (بدون تقليب تلقائي)
                const images: string[] = [
                  item.image_url || '',
                  ...(Array.isArray(item.gallery) ? item.gallery : [])
                ].filter(Boolean);
                const imageUrl = images[0] || '';

                return (
                  <div
                    key={item.id}
                    className="
                      min-w-[160px] max-w-[180px]
                      md:min-w-[220px] md:max-w-[260px]
                      bg-white/10 rounded-lg shadow p-2 flex-shrink-0 cursor-pointer hover:scale-105 transition
                    "
                    onClick={() => navigate(`/service/${item.id}`)}
                  >
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-full h-24 md:h-40 object-cover rounded"
                    />
                    <div className="mt-2 text-sm md:text-base font-bold text-secondary truncate">{item.title}</div>
                    <div className="text-xs md:text-sm text-accent">{item.price}</div>
                  </div>
                );
              })}
            </div>
            {/* إضافة ستايل لإخفاء الشريط وتفعيل التمرير التلقائي */}
            <style>{`
              .hide-scrollbar {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>
        )}

        {/* This div contains the "Back to Home" button and is placed below the centered content */}
        <div className="flex justify-center pb-8">
          <button
            onClick={() => navigate('/')}
            className="text-secondary hover:text-accent px-4 py-2 rounded-lg border border-secondary hover:border-accent" // Added border for better visibility
          >
            ← العودة للرئيسية
          </button>
        </div>
      </div>
    </>
  );
}