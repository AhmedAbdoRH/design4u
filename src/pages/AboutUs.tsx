import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center py-12">
      <Helmet>
        <title>من نحن - Designs4U</title>
        <meta name="description" content="نحن فريق متخصص في تصميم التطريز بالكمبيوتر والطباعة الاحترافية" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-8">من نحن</h1>
          <div className="bg-blue-800/30 p-8 rounded-lg shadow-xl backdrop-blur-sm border border-blue-700/50">
            <p className="text-lg text-white leading-relaxed">
              نحن فريق متخصص في تصميم التطريز بالكمبيوتر والطباعة الاحترافية، نعمل على تقديم تصاميم مبتكرة تناسب الشركات، العلامات التجارية، والمشروعات الشخصية، بجودة عالية وخدمة دقيقة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
