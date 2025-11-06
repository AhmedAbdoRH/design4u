/*
  ============================================
  إصلاح مشكلة رفع ملفات DST و EMB
  ============================================
  
  هذا الملف SQL يمكنك تشغيله يدوياً في Supabase SQL Editor
  لإنشاء bucket فقط (سياسات الأمان يجب إنشاؤها من Dashboard)
  
  الخطوات:
  1. افتح Supabase Dashboard
  2. اذهب إلى SQL Editor
  3. انسخ والصق محتوى هذا الملف
  4. انقر على Run
  5. اذهب إلى Storage > Policies لإضافة السياسات
*/

-- إنشاء الـ bucket إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public)
VALUES ('embroidery-files', 'embroidery-files', true)
ON CONFLICT (id) DO NOTHING;

-- التحقق من نجاح العملية
SELECT 
  id, 
  name, 
  public,
  created_at
FROM storage.buckets 
WHERE id = 'embroidery-files';

