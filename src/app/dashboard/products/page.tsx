"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import ProductForm from "@/components/ui/ProductForm";

interface Product {
  id: string;
  name_fr: string;
  name_ar: string;
  price: number;
  promo_price?: number;
  is_active: boolean;
  is_in_stock: boolean;
  created_at: string;
  categories?: { name_fr: string; name_ar: string };
  brands?: { name: string };
}

export default function ProductsPage() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name_fr, name_ar), brands(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async (productId: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_in_stock: !product.is_in_stock })
        .eq('id', product.id);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error updating product stock:', error);
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
              {lang === 'ar' ? 'إدارة المنتجات' : 'Product Management'}
            </h1>
            <p className={clsx("mt-2 text-gray-600", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'إدارة جميع منتجات المتجر' : 'Manage all store products'}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className={clsx("mt-2 text-sm font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'لا توجد منتجات' : 'No products'}
              </h3>
              <p className={clsx("mt-1 text-sm text-gray-500", lang === 'ar' ? 'text-right' : 'text-left')}>
                {lang === 'ar' ? 'ابدأ بإضافة منتج جديد' : 'Get started by adding a new product'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={clsx("px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'المنتج' : 'Product'}
                    </th>
                    <th className={clsx("px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الفئة' : 'Category'}
                    </th>
                    <th className={clsx("px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الماركة' : 'Brand'}
                    </th>
                    <th className={clsx("px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'السعر' : 'Price'}
                    </th>
                    <th className={clsx("px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'الحالة' : 'Status'}
                    </th>
                    <th className={clsx("px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider", lang === 'ar' ? 'text-right' : 'text-left')}>
                      {lang === 'ar' ? 'المخزون' : 'Stock'}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {lang === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={clsx("text-sm font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                          {lang === 'ar' ? product.name_ar : product.name_fr}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={clsx("text-sm text-gray-500", lang === 'ar' ? 'text-right' : 'text-left')}>
                          {product.categories ? (lang === 'ar' ? product.categories.name_ar : product.categories.name_fr) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={clsx("text-sm text-gray-500", lang === 'ar' ? 'text-right' : 'text-left')}>
                          {product.brands?.name || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={clsx("text-sm text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                          {product.promo_price ? (
                            <div>
                              <span className="text-gray-400 line-through">{product.price} Dhs</span>
                              <span className="text-green-600 font-medium ml-2">{product.promo_price} Dhs</span>
                            </div>
                          ) : (
                            <span>{product.price} Dhs</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active 
                            ? (lang === 'ar' ? 'نشط' : 'Active') 
                            : (lang === 'ar' ? 'غير نشط' : 'Inactive')
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.is_in_stock 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {product.is_in_stock 
                            ? (lang === 'ar' ? 'متوفر' : 'In Stock') 
                            : (lang === 'ar' ? 'غير متوفر' : 'Out of Stock')
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleActive(product)}
                            className={`text-sm px-3 py-1 rounded ${
                              product.is_active 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {product.is_active 
                              ? (lang === 'ar' ? 'إيقاف' : 'Deactivate') 
                              : (lang === 'ar' ? 'تفعيل' : 'Activate')
                            }
                          </button>
                          <button
                            onClick={() => toggleStock(product)}
                            className={`text-sm px-3 py-1 rounded ${
                              product.is_in_stock 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-blue-600 hover:text-blue-900'
                            }`}
                          >
                            {product.is_in_stock 
                              ? (lang === 'ar' ? 'إخراج من المخزون' : 'Mark Out of Stock') 
                              : (lang === 'ar' ? 'إضافة للمخزون' : 'Mark In Stock')
                            }
                          </button>
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-600 hover:text-blue-900 text-sm px-3 py-1 rounded"
                          >
                            {lang === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 text-sm px-3 py-1 rounded"
                          >
                            {lang === 'ar' ? 'حذف' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSave={() => {
            setShowAddModal(false);
            setEditingProduct(null);
            fetchProducts();
          }}
          onCancel={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
} 