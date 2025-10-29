import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, MessageCircle, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

const DesignRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designType: '',
    description: '',
    files: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    // You should sign up at https://www.emailjs.com/ and get your own service ID and template ID
    // For now, we'll use a direct email approach
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.designType || !formData.description) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const emailContent = `
        اسم العميل: ${formData.name}
        رقم الجوال: ${formData.phone}
        نوع التصميم: ${formData.designType}
        وصف التصميم: ${formData.description}
        عدد الملفات المرفقة: ${formData.files.length}
      `;
      
      const subject = `طلب تصميم جديد - ${formData.designType}`;
      const mailtoLink = `mailto:RehlatHadaf@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
      
      window.location.href = mailtoLink;
      
      console.log('Form submitted:', formData);
      
      alert('تم فتح بريدك الإلكتروني الافتراضي لإرسال الطلب. يرجى إرسال الرسالة.');
      
      setFormData({
        name: '',
        phone: '',
        designType: '',
        description: '',
        files: []
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const designTypes = [
    'تصميم أزياء نسائية',
    'تصميم أزياء رجالية',
    'تصميم ملابس أطفال',
    'تطريز يدوي',
    'تطريز آلي',
    'طباعة على الملابس',
    'تطريز شعارات',
    'تطريز أسماء',
    'تصميم أزياء عروس',
    'تصميم أزياء سهرة',
    'تصميم أزياء رياضية',
    'تصاميم أخرى'
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">اطلب تصميمك المخصص</h1>
          <p className="text-lg text-black">أخبرنا عن احتياجاتك وسنقوم بإنشاء تصميم فريد يناسب متطلباتك</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">معلومات الاتصال</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-1">الاسم بالكامل</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">رقم الجوال</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                  />
                </div>
                
              </div>
            </div>

            {/* Design Details */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-black">تفاصيل التصميم</h2>
              
              <div>
                <label htmlFor="designType" className="block text-sm font-medium text-black mb-1">نوع التصميم المطلوب</label>
                <select
                  id="designType"
                  name="designType"
                  value={formData.designType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  required
                >
                  <option value="" className="text-black">اختر نوع التصميم</option>
                  {designTypes.map((type, index) => (
                    <option key={index} value={type} className="text-black">{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-black mb-1">وصف التصميم المطلوب</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="صِف لنا التصميم الذي تريده بالتفصيل..."
                  required
                ></textarea>
              </div>
            </div>

            {/* File Upload */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="text-lg font-medium text-black">إرفاق ملف / صورة</h2>
                  <span className="mr-2 text-xs text-gray-600">(اختياري)</span>
                </div>
                <label className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-4 h-4 ml-1 text-gray-500" />
                  <span>اختر الملف</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.psd,.ai"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-1">الحد الأقصى 10 ميجابايت</p>
              
              {formData.files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-black">الملفات المرفوعة:</h4>
                  <ul className="space-y-2">
                    {formData.files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-black truncate max-w-xs">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          حذف
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإعداد...
                  </>
                ) : (
                  <>
                    <Mail className="ml-2 h-5 w-5" />
                    إرسال الطلب عبر البريد
                  </>
                )}
              </button>
              <p className="mt-2 text-sm text-gray-700">
                سيتم فتح بريدك الإلكتروني الافتراضي لإرسال الطلب إلى RehlatHadaf@gmail.com
              </p>
            </div>
          </form>
        </div>
        
        {/* Contact Info */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">هل لديك استفسار؟</h3>
                <p className="text-sm text-gray-500">نحن هنا لمساعدتك في أي وقت</p>
              </div>
            </div>
            <a 
              href="https://wa.me/201006464349" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 2h-11C4 2 2 4 2 6.5v11C2 19.9 4.1 22 6.5 22h11c2.4 0 4.5-2.1 4.5-4.5v-11C22 4 20 2 17.5 2zm-9.1 15.3c-.1.1-.3.2-.5.2s-.4-.1-.5-.2l-3.2-3.2c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 6.7-6.7c.3-.3.8-.3 1.1 0s.3.8 0 1.1l-7.3 7.2z"/>
              </svg>
              تواصل معنا على واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignRequest;
