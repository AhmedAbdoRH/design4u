-- Add sample categories and subcategories for testing
-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'خدمات الطباعة', 'طباعة على جميع أنواع الأقمشة والمنسوجات'),
  ('550e8400-e29b-41d4-a716-446655440002', 'خدمات التطريز', 'تطريز يدوي وآلي على الأقمشة والملابس'),
  ('550e8400-e29b-41d4-a716-446655440003', 'شروحات البرامج', 'دروس تعليمية لبرامج التطريز والتصميم'),
  ('550e8400-e29b-41d4-a716-446655440004', 'تصاميم جاهزة', 'تصاميم جاهزة للطباعة والتطريز')
ON CONFLICT (id) DO NOTHING;

-- Insert sample subcategories
INSERT INTO subcategories (id, name_ar, name_en, slug, category_id) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'طباعة على القماش', 'Fabric Printing', 'fabric-printing', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440002', 'طباعة على الملابس', 'Clothing Printing', 'clothing-printing', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440003', 'طباعة على الحقائب', 'Bag Printing', 'bag-printing', '550e8400-e29b-41d4-a716-446655440001'),
  ('660e8400-e29b-41d4-a716-446655440004', 'طباعة على الأكواب', 'Cup Printing', 'cup-printing', '550e8400-e29b-41d4-a716-446655440001'),
  
  ('660e8400-e29b-41d4-a716-446655440005', 'تطريز يدوي', 'Hand Embroidery', 'hand-embroidery', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440006', 'تطريز آلي', 'Machine Embroidery', 'machine-embroidery', '550e8400-e29b-41d4-a716-446655440002'),
  ('660e8400-e29b-41d4-a716-446655440007', 'تطريز على القمصان', 'Shirt Embroidery', 'shirt-embroidery', '550e8400-e29b-41d4-a716-446655440002'),
  
  ('660e8400-e29b-41d4-a716-446655440008', 'شروحات ويلكوم', 'Wilcom Tutorials', 'wilcom-tutorials', '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440009', 'شروحات إمبريدي', 'Embrilliance Tutorials', 'embrilliance-tutorials', '550e8400-e29b-41d4-a716-446655440003'),
  ('660e8400-e29b-41d4-a716-446655440010', 'شروحات فوتوشوب', 'Photoshop Tutorials', 'photoshop-tutorials', '550e8400-e29b-41d4-a716-446655440003'),
  
  ('660e8400-e29b-41d4-a716-446655440011', 'تصاميم عربية', 'Arabic Designs', 'arabic-designs', '550e8400-e29b-41d4-a716-446655440004'),
  ('660e8400-e29b-41d4-a716-446655440012', 'تصاميم إنجليزية', 'English Designs', 'english-designs', '550e8400-e29b-41d4-a716-446655440004'),
  ('660e8400-e29b-41d4-a716-446655440013', 'تصاميم دينية', 'Religious Designs', 'religious-designs', '550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;
