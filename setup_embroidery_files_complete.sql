-- ============================================
-- إعداد كامل لرفع ملفات DST و EMB
-- ============================================
-- 
-- انسخ هذا الملف بالكامل والصقه في Supabase SQL Editor
-- ثم اضغط Run
--
-- ملاحظة: إذا ظهر خطأ "must be owner of table objects"
-- فأنت بحاجة لإضافة Policies من Dashboard يدوياً
-- ============================================

-- الخطوة 1: إنشاء الـ Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('embroidery-files', 'embroidery-files', true)
ON CONFLICT (id) DO NOTHING;

-- التحقق من إنشاء الـ Bucket
SELECT 
  id, 
  name, 
  public,
  created_at
FROM storage.buckets 
WHERE id = 'embroidery-files';

-- ============================================
-- الخطوة 2: إنشاء Storage Policies
-- ============================================
-- 
-- ملاحظة: هذه الأوامر قد تحتاج صلاحيات خاصة
-- إذا فشلت، استخدم Dashboard لإضافة Policies يدوياً
-- ============================================

-- حذف السياسات القديمة إن وجدت (لتجنب التعارضات)
DROP POLICY IF EXISTS "Allow authenticated users to upload embroidery files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to embroidery files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update embroidery files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete embroidery files" ON storage.objects;

-- Policy 1: السماح للمستخدمين المسجلين برفع الملفات (INSERT)
CREATE POLICY "Allow authenticated users to upload embroidery files"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'embroidery-files'
);

-- Policy 2: السماح للجميع بتحميل الملفات (SELECT - Public)
CREATE POLICY "Allow public read access to embroidery files"
ON storage.objects 
FOR SELECT
TO public
USING (
  bucket_id = 'embroidery-files'
);

-- Policy 3: السماح للمستخدمين المسجلين بتحديث الملفات (UPDATE)
CREATE POLICY "Allow authenticated users to update embroidery files"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'embroidery-files'
)
WITH CHECK (
  bucket_id = 'embroidery-files'
);

-- Policy 4: السماح للمستخدمين المسجلين بحذف الملفات (DELETE)
CREATE POLICY "Allow authenticated users to delete embroidery files"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
  bucket_id = 'embroidery-files'
);

-- ============================================
-- التحقق من نجاح العملية
-- ============================================

-- التحقق من الـ Bucket
SELECT 
  'Bucket Status' as check_type,
  id, 
  name, 
  public,
  created_at
FROM storage.buckets 
WHERE id = 'embroidery-files';

-- التحقق من الـ Policies
SELECT 
  'Policy Status' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%embroidery%'
ORDER BY policyname;

-- ============================================
-- إذا ظهرت أخطاء في Policies:
-- ============================================
-- 1. اذهب إلى Supabase Dashboard
-- 2. Storage > embroidery-files > Policies
-- 3. اضغط "New policy" وأضف الـ 4 policies يدوياً
-- 4. استخدم الملف: إضافة_Storage_Policies_خطوة_بخطوة.md
-- ============================================

