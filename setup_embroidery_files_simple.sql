-- إنشاء الـ Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('embroidery-files', 'embroidery-files', true)
ON CONFLICT (id) DO NOTHING;

-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Allow authenticated users to upload embroidery files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to embroidery files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update embroidery files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete embroidery files" ON storage.objects;

-- Policy 1: السماح برفع الملفات
CREATE POLICY "Allow authenticated users to upload embroidery files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'embroidery-files');

-- Policy 2: السماح بتحميل الملفات (Public)
CREATE POLICY "Allow public read access to embroidery files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'embroidery-files');

-- Policy 3: السماح بتحديث الملفات
CREATE POLICY "Allow authenticated users to update embroidery files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'embroidery-files')
WITH CHECK (bucket_id = 'embroidery-files');

-- Policy 4: السماح بحذف الملفات
CREATE POLICY "Allow authenticated users to delete embroidery files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'embroidery-files');

