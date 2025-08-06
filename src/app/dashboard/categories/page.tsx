"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import CategoryForm from "@/components/ui/CategoryForm";

interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  image_url?: string;
  created_at: string;
}

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_fr');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه الفئة؟' : 'Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={clsx("text-2xl font-bold text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'إدارة الفئات' : 'Category Management'}
            </h1>
            <p className={clsx("mt-2 text-gray-600", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'إدارة فئات المنتجات' : 'Manage product categories'}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {lang === 'ar' ? 'إضافة فئة جديدة' : 'Add New Category'}
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className={clsx("mt-2 text-sm font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'لا توجد فئات' : 'No categories'}
            </h3>
            <p className={clsx("mt-1 text-sm text-gray-500", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'ابدأ بإضافة فئة جديدة' : 'Get started by adding a new category'}
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={clsx("text-lg font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? category.name_ar : category.name_fr}
                    </h3>
                    <p className={clsx("text-sm text-gray-500 mt-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الاسم بالإنجليزية' : 'English name'}: {category.name_fr}
                    </p>
                    <p className={clsx("text-sm text-gray-500", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الاسم بالعربية' : 'Arabic name'}: {category.name_ar}
                    </p>
                    <p className={clsx("text-sm text-gray-500", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الرابط' : 'Slug'}: {category.slug}
                    </p>
                  </div>
                  {category.image_url && (
                    <div className="ml-4">
                      <img
                        src={category.image_url}
                        alt={lang === 'ar' ? category.name_ar : category.name_fr}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {lang === 'ar' ? 'تم الإنشاء في' : 'Created'}: {new Date(category.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-600 hover:text-blue-900 text-sm px-3 py-1 rounded border border-blue-300 hover:bg-blue-50"
                    >
                      {lang === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900 text-sm px-3 py-1 rounded border border-red-300 hover:bg-red-50"
                    >
                      {lang === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSave={() => {
            setShowAddModal(false);
            setEditingCategory(null);
            fetchCategories();
          }}
          onCancel={() => {
            setShowAddModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
} 