# إعداد Storage Policies لملفات DST و EMB

## المشكلة
خطأ "new row violates row-level security policy" عند رفع ملفات DST أو EMB.

## الحل

### الخطوة 1: إنشاء الـ Bucket

شغّل الملف SQL التالي في Supabase SQL Editor:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('embroidery-files', 'embroidery-files', true)
ON CONFLICT (id) DO NOTHING;
```

أو استخدم الملف: `fix_embroidery_files_bucket.sql`

### الخطوة 2: إنشاء Storage Policies من Dashboard

1. افتح **Supabase Dashboard**
2. اذهب إلى **Storage** في القائمة الجانبية
3. اختر bucket **embroidery-files**
4. اضغط على تبويب **Policies**
5. اضغط على **New Policy**

#### Policy 1: السماح للمستخدمين المسجلين برفع الملفات (INSERT)

- **Policy Name**: `Allow authenticated users to upload embroidery files`
- **Allowed Operation**: `INSERT`
- **Target Roles**: `authenticated`
- **Policy Definition**:
  ```sql
  (bucket_id = 'embroidery-files')
  ```

#### Policy 2: السماح للجميع بتحميل الملفات (SELECT)

- **Policy Name**: `Allow public read access to embroidery files`
- **Allowed Operation**: `SELECT`
- **Target Roles**: `public`
- **Policy Definition**:
  ```sql
  (bucket_id = 'embroidery-files')
  ```

#### Policy 3: السماح للمستخدمين المسجلين بتحديث الملفات (UPDATE)

- **Policy Name**: `Allow authenticated users to update embroidery files`
- **Allowed Operation**: `UPDATE`
- **Target Roles**: `authenticated`
- **Policy Definition**:
  ```sql
  (bucket_id = 'embroidery-files')
  ```

#### Policy 4: السماح للمستخدمين المسجلين بحذف الملفات (DELETE)

- **Policy Name**: `Allow authenticated users to delete embroidery files`
- **Allowed Operation**: `DELETE`
- **Target Roles**: `authenticated`
- **Policy Definition**:
  ```sql
  (bucket_id = 'embroidery-files')
  ```

### بديل سريع: استخدام SQL مع Service Role

إذا كان لديك Service Role Key، يمكنك استخدام Supabase CLI أو API:

```bash
# استخدام Supabase CLI
supabase storage create-bucket embroidery-files --public
```

## التحقق

بعد إتمام الخطوات، جرب رفع ملف DST أو EMB من واجهة الإدارة. يجب أن يعمل بدون أخطاء.

