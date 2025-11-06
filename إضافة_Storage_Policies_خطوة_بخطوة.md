# إضافة Storage Policies لملفات DST و EMB - خطوة بخطوة

## ✅ الخطوة 1: إنشاء الـ Bucket (تمت ✓)

الـ bucket `embroidery-files` تم إنشاؤه بنجاح وهو الآن Public.

## 📋 الخطوة 2: إضافة Policies (4 policies مطلوبة)

اضغط على زر **"New policy"** في صفحة Policies وأضف السياسات التالية واحدة تلو الأخرى:

---

### Policy 1: السماح برفع الملفات (INSERT)

1. اضغط على **"New policy"**
2. اختر **"Create a policy from scratch"**
3. املأ الحقول:
   - **Policy name**: `Allow authenticated users to upload embroidery files`
   - **Allowed operations**: ✅ **INSERT**
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   (bucket_id = 'embroidery-files')
   ```
4. اضغط **"Review"** ثم **"Save policy"**

---

### Policy 2: السماح بتحميل الملفات (SELECT - Public)

1. اضغط على **"New policy"** مرة أخرى
2. اختر **"Create a policy from scratch"**
3. املأ الحقول:
   - **Policy name**: `Allow public read access to embroidery files`
   - **Allowed operations**: ✅ **SELECT**
   - **Target roles**: `public`
   - **Policy definition**:
   ```sql
   (bucket_id = 'embroidery-files')
   ```
4. اضغط **"Review"** ثم **"Save policy"**

---

### Policy 3: السماح بتحديث الملفات (UPDATE)

1. اضغط على **"New policy"**
2. اختر **"Create a policy from scratch"**
3. املأ الحقول:
   - **Policy name**: `Allow authenticated users to update embroidery files`
   - **Allowed operations**: ✅ **UPDATE**
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   (bucket_id = 'embroidery-files')
   ```
4. اضغط **"Review"** ثم **"Save policy"**

---

### Policy 4: السماح بحذف الملفات (DELETE)

1. اضغط على **"New policy"**
2. اختر **"Create a policy from scratch"**
3. املأ الحقول:
   - **Policy name**: `Allow authenticated users to delete embroidery files`
   - **Allowed operations**: ✅ **DELETE**
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   (bucket_id = 'embroidery-files')
   ```
4. اضغط **"Review"** ثم **"Save policy"**

---

## ✅ التحقق من النجاح

بعد إضافة الـ 4 policies، يجب أن ترى قائمة بـ 4 policies في صفحة Policies.

## 🧪 اختبار

بعد إتمام جميع الخطوات:
1. اذهب إلى واجهة الإدارة في التطبيق
2. جرب رفع ملف DST أو EMB
3. يجب أن يعمل بدون أخطاء! ✅

---

## 📝 ملاحظات مهمة

- **Policy definition** يجب أن يكون بالضبط: `(bucket_id = 'embroidery-files')`
- تأكد من اختيار الـ **Target roles** الصحيحة (authenticated أو public)
- بعد إضافة كل policy، سيظهر في القائمة مباشرة

