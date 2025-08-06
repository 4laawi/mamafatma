"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function SearchPage() {
  const { lang } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // Search in both French and Arabic product names
      let searchQuery = supabase
        .from('products')
        .select('*, categories(name_fr, name_ar), brands(name)')
        .or(`name_fr.ilike.%${query}%,name_ar.ilike.%${query}%`);

      if (selectedBrand) {
        searchQuery = searchQuery.eq('brand_id', selectedBrand);
      }

      const { data: prods } = await searchQuery;
      setProducts(prods || []);

      // Get unique brands from search results
      if (prods && prods.length > 0) {
        const uniqueBrandIds = [...new Set(prods.map(p => p.brand_id).filter(Boolean))];
        const { data: brs } = await supabase
          .from('brands')
          .select('*')
          .in('id', uniqueBrandIds);
        setBrands(brs || []);
      } else {
        setBrands([]);
      }
      
      setLoading(false);
    }

    fetchData();
  }, [query, selectedBrand]);

  const filteredProducts = products.filter(product => {
    if (selectedBrand && product.brand_id !== selectedBrand) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedBrand(null);
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="bg-white border-b px-4 py-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
          
          <h1 className={clsx("text-3xl font-bold text-gray-900 mb-6", lang === 'ar' ? 'text-right' : 'text-left')} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {lang === 'ar' 
              ? `نتائج البحث عن "${query}"` 
              : `Search results for "${query}"`
            }
          </h1>
          
          {/* Filters Section Skeleton */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
        
        <h1 className={clsx("text-3xl font-bold text-gray-900 mb-6", lang === 'ar' ? 'text-right' : 'text-left')} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar' 
            ? `نتائج البحث عن "${query}"` 
            : `Search results for "${query}"`
          }
        </h1>
        
        {/* Filters Section */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Brand Filter */}
            {brands.length > 0 && (
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
            )}

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
              {lang === 'ar' 
                ? `لا توجد نتائج للبحث عن "${query}"` 
                : `No results found for "${query}"`
              }
            </p>
            <p className="text-sm">
              {lang === 'ar' 
                ? 'جرب كلمات بحث مختلفة' 
                : 'Try different search terms'
              }
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