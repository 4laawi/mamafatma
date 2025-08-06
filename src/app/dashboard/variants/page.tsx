"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import Link from "next/link";

export default function VariantsPage() {
  const { lang } = useLanguage();
  const [variants, setVariants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState<any>(null);

  useEffect(() => {
    fetchVariants();
    fetchProducts();
  }, []);

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_fr, name_ar')
        .eq('is_active', true)
        .order('name_fr');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المتغير؟' : 'Are you sure you want to delete this variant?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchVariants();
    } catch (error) {
      console.error('Error deleting variant:', error);
      alert(lang === 'ar' ? 'خطأ في حذف المتغير' : 'Error deleting variant');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchVariants();
    } catch (error) {
      console.error('Error updating variant:', error);
      alert(lang === 'ar' ? 'خطأ في تحديث المتغير' : 'Error updating variant');
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
          <h1 className={clsx("text-2xl font-bold text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
            {lang === 'ar' ? 'متغيرات المنتجات' : 'Product Variants'}
          </h1>
          <button
            onClick={() => {
              setEditingVariant(null);
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {lang === 'ar' ? 'إضافة متغير جديد' : 'Add New Variant'}
          </button>
        </div>
      </div>

      {/* Variants List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {variants.length === 0 ? (
            <p className={clsx("text-gray-500 text-center py-8", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'لا توجد متغيرات منتجات' : 'No product variants found'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={clsx("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'اللون' : 'Color'}
                    </th>
                    <th className={clsx("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'المقاس' : 'Size'}
                    </th>
                    <th className={clsx("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'السعر' : 'Price'}
                    </th>
                    <th className={clsx("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'متاح' : 'Available'}
                    </th>
                    <th className={clsx("px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr key={variant.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {variant.color || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {variant.size || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {variant.price ? `${variant.price} MAD` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleAvailability(variant.id, variant.is_available)}
                          className={clsx(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            variant.is_available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {variant.is_available 
                            ? (lang === 'ar' ? 'متاح' : 'Available')
                            : (lang === 'ar' ? 'غير متاح' : 'Unavailable')
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingVariant(variant);
                            setShowForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          {lang === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDelete(variant.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {lang === 'ar' ? 'حذف' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Variant Form Modal */}
      {showForm && (
        <VariantForm
          variant={editingVariant}
          products={products}
          onSave={() => {
            setShowForm(false);
            setEditingVariant(null);
            fetchVariants();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingVariant(null);
          }}
        />
      )}
    </div>
  );
}

// VariantForm Component
function VariantForm({ variant, products, onSave, onCancel }: {
  variant?: any;
  products: any[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: variant?.product_id || '',
    color: variant?.color || '',
    size: variant?.size || '',
    price: variant?.price || '',
    is_available: variant?.is_available ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const variantData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      };

      if (variant) {
        // Update existing variant
        const { error } = await supabase
          .from('product_variants')
          .update(variantData)
          .eq('id', variant.id);

        if (error) throw error;
      } else {
        // Create new variant
        const { error } = await supabase
          .from('product_variants')
          .insert([variantData]);

        if (error) throw error;
      }

      onSave();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      alert(`Error saving variant: ${error.message}`);
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
      <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className={clsx("text-lg font-medium text-gray-900 mb-4", lang === 'ar' ? 'text-right' : 'text-left')}>
            {variant ? (lang === 'ar' ? 'تعديل المتغير' : 'Edit Variant') : (lang === 'ar' ? 'إضافة متغير جديد' : 'Add New Variant')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'المنتج' : 'Product'} *
              </label>
              <select
                required
                value={formData.product_id}
                onChange={(e) => handleInputChange('product_id', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
              >
                <option value="">{lang === 'ar' ? 'اختر المنتج' : 'Select Product'}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {lang === 'ar' ? product.name_ar : product.name_fr}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'اللون' : 'Color'}
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'لون المتغير' : 'Variant color'}
              />
            </div>

            {/* Size */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'المقاس' : 'Size'}
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'مقاس المتغير' : 'Variant size'}
              />
            </div>

            {/* Price */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'السعر (اختياري)' : 'Price (Optional)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'سعر المتغير (اختياري)' : 'Variant price (optional)'}
              />
              <p className={clsx("text-xs text-gray-500 mt-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'اتركه فارغاً لاستخدام سعر المنتج الأساسي' : 'Leave empty to use base product price'}
              </p>
            </div>

            {/* Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => handleInputChange('is_available', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="is_available" className={clsx("ml-2 block text-sm text-gray-900", lang === 'ar' ? 'mr-2 ml-0' : 'ml-2')}>
                {lang === 'ar' ? 'متاح للبيع' : 'Available for sale'}
              </label>
            </div>

            {/* Buttons */}
            <div className={clsx("flex gap-3 pt-4", lang === 'ar' ? 'flex-row-reverse' : 'flex-row')}>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (variant ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add'))}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 