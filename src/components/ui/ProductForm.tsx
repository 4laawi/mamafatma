"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import ImageUpload from "./ImageUpload";

interface ProductFormProps {
  product?: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name_fr: product?.name_fr || '',
    name_ar: product?.name_ar || '',
    description_fr: product?.description_fr || '',
    description_ar: product?.description_ar || '',
    price: product?.price || '',
    promo_price: product?.promo_price || '',
    category_id: product?.category_id || '',
    brand_id: product?.brand_id || '',
    slug: product?.slug || '',
    is_active: product?.is_active ?? true,
    is_in_stock: product?.is_in_stock ?? true,
    image_urls: product?.image_urls || [],
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
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
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Form data before processing:', formData);

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
        category_id: formData.category_id || null,
        brand_id: formData.brand_id || null,
        slug: formData.name_fr.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        is_active: formData.is_active ?? true,
        is_in_stock: formData.is_in_stock ?? true,
      };

      console.log('Product data to save:', productData);

      if (product) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Product created successfully:', data);
      }

      onSave();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Error saving product: ${error.message}`);
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
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className={clsx("text-lg font-medium text-gray-900 mb-4", lang === 'ar' ? 'text-right' : 'text-left')}>
            {product ? (lang === 'ar' ? 'تعديل المنتج' : 'Edit Product') : (lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product')}
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
                placeholder={lang === 'ar' ? 'اسم المنتج بالفرنسية' : 'Product name in French'}
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
                placeholder={lang === 'ar' ? 'اسم المنتج بالعربية' : 'Product name in Arabic'}
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

            {/* French Description */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'الوصف بالفرنسية' : 'French Description'}
              </label>
              <textarea
                value={formData.description_fr}
                onChange={(e) => handleInputChange('description_fr', e.target.value)}
                rows={3}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'وصف المنتج بالفرنسية' : 'Product description in French'}
              />
            </div>

            {/* Arabic Description */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
              </label>
              <textarea
                value={formData.description_ar}
                onChange={(e) => handleInputChange('description_ar', e.target.value)}
                rows={3}
                className={clsx(
                  "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'وصف المنتج بالعربية' : 'Product description in Arabic'}
              />
            </div>

            {/* Price and Promo Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                  {lang === 'ar' ? 'السعر' : 'Price'} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={clsx(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                    lang === 'ar' ? 'text-right' : 'text-left'
                  )}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                  {lang === 'ar' ? 'سعر الترويج' : 'Promo Price'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.promo_price}
                  onChange={(e) => handleInputChange('promo_price', e.target.value)}
                  className={clsx(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                    lang === 'ar' ? 'text-right' : 'text-left'
                  )}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                  {lang === 'ar' ? 'الفئة' : 'Category'}
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={clsx(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                    lang === 'ar' ? 'text-right' : 'text-left'
                  )}
                >
                  <option value="">{lang === 'ar' ? 'اختر الفئة' : 'Select Category'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {lang === 'ar' ? category.name_ar : category.name_fr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                  {lang === 'ar' ? 'الماركة' : 'Brand'}
                </label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => handleInputChange('brand_id', e.target.value)}
                  className={clsx(
                    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                    lang === 'ar' ? 'text-right' : 'text-left'
                  )}
                >
                  <option value="">{lang === 'ar' ? 'اختر الماركة' : 'Select Brand'}</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URLs */}
            <div>
              <label className={clsx("block text-sm font-medium text-gray-700 mb-1", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'صور المنتج' : 'Product Images'}
              </label>
              <div className="space-y-2">
                {formData.image_urls && formData.image_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.image_urls.map((url: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          width={240}
                          height={96}
                          loading="lazy"
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newUrls = formData.image_urls.filter((_: string, i: number) => i !== index);
                            handleInputChange('image_urls', newUrls);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
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

            {/* Active Status and Stock Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className={clsx("ml-2 block text-sm text-gray-900", lang === 'ar' ? 'mr-2 ml-0' : 'ml-2')}>
                  {lang === 'ar' ? 'منتج نشط' : 'Active Product'}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_in_stock"
                  checked={formData.is_in_stock}
                  onChange={(e) => handleInputChange('is_in_stock', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_in_stock" className={clsx("ml-2 block text-sm text-gray-900", lang === 'ar' ? 'mr-2 ml-0' : 'ml-2')}>
                  {lang === 'ar' ? 'متوفر في المخزون' : 'In Stock'}
                </label>
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
                  : (product ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add'))
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
            const newUrls = [...(formData.image_urls || []), url];
            handleInputChange('image_urls', newUrls);
            setShowImageUpload(false);
          }}
          onCancel={() => setShowImageUpload(false)}
          folder="products"
        />
      )}
    </div>
  );
} 