"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import Link from "next/link";

export default function ElectronicsPage() {
  const { lang } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // First, get the category by slug
      const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'electronique')
        .single();

      if (category) {
        // Fetch products for this category
        let query = supabase
          .from('products')
          .select('*, categories(name_fr, name_ar), brands(name)')
          .eq('category_id', category.id);

        if (selectedBrand) {
          query = query.eq('brand_id', selectedBrand);
        }

        const { data: prods } = await query;
        setProducts(prods || []);

        // Fetch brands for this category
        const { data: brandIds } = await supabase
          .from('products')
          .select('brand_id')
          .eq('category_id', category.id);

        if (brandIds && brandIds.length > 0) {
          const uniqueBrandIds = [...new Set(brandIds.map(b => b.brand_id))];
          const { data: brs } = await supabase
            .from('brands')
            .select('*')
            .in('id', uniqueBrandIds);
          setBrands(brs || []);
        }
      }
      
      setLoading(false);
    }

    fetchData();
  }, [selectedBrand]);

  const filteredProducts = products.filter(product => {
    if (selectedBrand && product.brand_id !== selectedBrand) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedBrand(null);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-400 text-lg">
        {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center mb-4">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
        

        
        {/* Filters Section */}
        <div className="space-y-4">

          {/* Filters and Results Count */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Brand Filter */}
            <div className="relative">
              <select
                value={selectedBrand || ""}
                onChange={(e) => setSelectedBrand(e.target.value || null)}
                className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
              >
                <option value="">{lang === 'ar' ? 'كل الماركات' : 'All Brands'}</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>



            {/* Clear Filters */}
            {selectedBrand && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="w-full flex justify-center items-center py-16 text-gray-400 text-center">
          <div>
            <p className="text-lg mb-2">
              {lang === 'ar' ? 'لا توجد منتجات في هذه الفئة' : 'No products in this category'}
            </p>
            <p className="text-sm">
              {lang === 'ar' ? 'جرب تغيير الفلاتر أو البحث' : 'Try changing filters or search terms'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md p-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-100"
              style={{ textDecoration: 'none' }}
            >
              <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image_urls?.[0] || "/vercel.svg"}
                    alt={lang === 'ar' ? product.name_ar : product.name_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* New Badge - Positioned on image */}
                {product.created_at && new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {lang === 'ar' ? 'جديد' : 'New'}
                  </span>
                )}
              </div>
              
              <div className={clsx("space-y-3", lang === 'ar' ? 'text-right' : 'text-left')}>
                {/* Brand */}
                {product.brands && (
                  <p className="text-sm text-green-600 font-semibold">
                    {product.brands.name}
                  </p>
                )}
                
                {/* Product Name */}
                <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? product.name_ar : product.name_fr}
                </h3>
                
                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  {product.promo_price ? (
                    <>
                      <span className="text-gray-400 text-xs line-through">
                        {product.price} Dhs
                      </span>
                      <span className="text-green-700 font-bold text-lg">
                        {product.promo_price} Dhs
                      </span>
                    </>
                  ) : (
                    <span className="text-green-700 font-bold text-lg">
                      {product.price} Dhs
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
} 