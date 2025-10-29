import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, MessageCircle, Check } from 'lucide-react';

const DesignRequest = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    designType: '',
    description: '',
    files: [] as File[],
    terms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your backend
    }
  };

  const designTypes = [
    'تصميم شعار',
    'تصميم بوسترات',
    'تصميم بطاقات عمل',
    'تصميم أغلفة',
    'تصميم شعارات',
    'تصاميم أخرى'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">اطلب تصميمك المخصص</h1>
          <p className="text-lg text-gray-600">أخبرنا عن احتياجاتك وسنقوم بإنشاء تصميم فريد يناسب متطلباتك</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-12 relative">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center z-10">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${step >= stepNum ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                {step > stepNum ? <Check className="w-6 h-6" /> : stepNum}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">
                {stepNum === 1 && 'معلومات الاتصال'}
                {stepNum === 2 && 'تفاصيل التصميم'}
                {stepNum === 3 && 'رفع الملفات'}
              </span>
            </div>
          ))}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الاتصال</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">تفاصيل التصميم</h2>
                
                <div>
                  <label htmlFor="designType" className="block text-sm font-medium text-gray-700 mb-1">نوع التصميم المطلوب</label>
                  <select
                    id="designType"
                    name="designType"
                    value={formData.designType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">اختر نوع التصميم</option>
                    {designTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف التصميم المطلوب</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="صِف لنا التصميم الذي تريده بالتفصيل..."
                    required
                  ></textarea>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">رفع الملفات</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">اسحب وأفلت الملفات هنا</h3>
                  <p className="text-sm text-gray-500 mb-4">أو</p>
                  <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    <span>اختر الملفات</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.psd,.ai"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-3">الحد الأقصى لحجم الملف 10 ميجابايت</p>
                </div>
                
                {formData.files.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">الملفات المرفوعة:</h4>
                    <ul className="space-y-2">
                      {formData.files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
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
                
                <div className="flex items-start mt-6">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => setFormData({...formData, terms: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                  </div>
                  <label htmlFor="terms" className="mr-2 block text-sm text-gray-700">
                    أوافق على الشروط والأحكام وسياسة الخصوصية
                  </label>
                </div>
              </motion.div>
            )}
            
            <div className="flex justify-between mt-10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowLeft className="ml-2 h-5 w-5" />
                  السابق
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {step < 3 ? 'التالي' : 'إرسال الطلب'}
                {step < 3 && <ArrowLeft className="mr-2 h-5 w-5 transform rotate-180" />}
              </button>
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
