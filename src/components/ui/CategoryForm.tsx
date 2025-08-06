"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import ImageUpload from "./ImageUpload";

interface CategoryFormProps {
  category?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const [formData, setFormData] = useState({
    name_fr: category?.name_fr || '',
    name_ar: category?.name_ar || '',
    slug: category?.slug || '',
    image_url: category?.image_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from French name if not provided
      const slug = formData.slug || formData.name_fr.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const categoryData = {
        ...formData,
        slug,
      };

      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', category.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className={clsx("text-lg font-medium text-gray-900 mb-4", lang === 'ar' ? 'text-right' : 'text-left')}>
            {category ? (lang === 'ar' ? 'تعديل الفئة' : 'Edit Category') : (lang === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* French Name */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'الاسم بالفرنسية' : 'French Name'} *
              </label>
              <input
                type="text"
                required
                value={formData.name_fr}
                onChange={(e) => handleInputChange('name_fr', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'اسم الفئة بالفرنسية' : 'Category name in French'}
              />
            </div>

            {/* Arabic Name */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'} *
              </label>
              <input
                type="text"
                required
                value={formData.name_ar}
                onChange={(e) => handleInputChange('name_ar', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'اسم الفئة بالعربية' : 'Category name in Arabic'}
              />
            </div>

            {/* Slug */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'الرابط' : 'Slug'}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'سيتم إنشاؤه تلقائياً' : 'Will be auto-generated'}
              />
              <p className={clsx("text-xs text-gray-500 mt-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'اتركه فارغاً ليتم إنشاؤه تلقائياً من الاسم الفرنسي' : 'Leave empty to auto-generate from French name'}
              </p>
            </div>

            {/* Image */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'صورة الفئة' : 'Category Image'}
              </label>
              <div className="space-y-2">
                {formData.image_url && (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Category"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image_url', '')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowImageUpload(true)}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700"
                >
                  {lang === 'ar' ? 'إضافة صورة' : 'Add Image'}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading 
                  ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                  : (category ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add'))
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onUpload={(url) => {
            handleInputChange('image_url', url);
            setShowImageUpload(false);
          }}
          onCancel={() => setShowImageUpload(false)}
          folder="categories"
        />
      )}
    </div>
  );
} 