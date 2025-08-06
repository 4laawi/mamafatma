"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import Link from "next/link";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function CategoryPage() {
  const { category } = useParams();
  const { lang } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [cache, setCache] = useState<Record<string, any>>({});

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized cache key
  const cacheKey = useMemo(() => {
    return `${category}-${selectedBrand}-${debouncedSearchQuery}-${sortBy}-${page}`;
  }, [category, selectedBrand, debouncedSearchQuery, sortBy, page]);

  // Optimized data fetching with parallel requests and caching
  const fetchData = useCallback(async () => {
    if (!category) return;

    // Check cache first
    if (cache[cacheKey]) {
      const cachedData = cache[cacheKey];
      setProducts(cachedData.products);
      setCategoryInfo(cachedData.categoryInfo);
      setBrands(cachedData.brands);
      setHasMore(cachedData.hasMore);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Parallel requests for better performance
      const [categoryResult, productsResult] = await Promise.all([
        // Fetch category info
        supabase
          .from('categories')
          .select('*')
          .eq('slug', category)
          .eq('is_active', true)
          .single(),
        
        // Fetch products with optimized query
        (async () => {
          let query = supabase
            .from('products')
            .select(`
              *,
              categories(name_fr, name_ar),
              brands(name, name_fr, name_ar)
            `)
            .eq('is_active', true)
            .range((page - 1) * 20, page * 20 - 1); // Pagination

          // Add category filter
          if (category !== 'all') {
            query = query.eq('category_id', category);
          }

          // Add brand filter
          if (selectedBrand) {
            query = query.eq('brand_id', selectedBrand);
          }

          // Add search filter
          if (debouncedSearchQuery) {
            query = query.or(`name_fr.ilike.%${debouncedSearchQuery}%,name_ar.ilike.%${debouncedSearchQuery}%`);
          }

          // Add sorting
          switch (sortBy) {
            case 'price-low':
              query = query.order('price', { ascending: true });
              break;
            case 'price-high':
              query = query.order('price', { ascending: false });
              break;
            case 'name-az':
              query = query.order('name_fr', { ascending: true });
              break;
            case 'name-za':
              query = query.order('name_fr', { ascending: false });
              break;
            case 'newest':
            default:
              query = query.order('created_at', { ascending: false });
              break;
          }

          return query;
        })()
      ]);

      const categoryData = categoryResult.data;
      const productsData = productsResult.data;

      if (categoryData) {
        setCategoryInfo(categoryData);
        
        // Fetch brands for this category (only if not cached)
        if (!cache[`${category}-brands`]) {
          const { data: brandIds } = await supabase
            .from('products')
            .select('brand_id')
            .eq('category_id', categoryData.id)
            .eq('is_active', true);

          if (brandIds && brandIds.length > 0) {
            const uniqueBrandIds = [...new Set(brandIds.map(b => b.brand_id))];
            const { data: brs } = await supabase
              .from('brands')
              .select('*')
              .in('id', uniqueBrandIds);
            
            setBrands(brs || []);
            // Cache brands
            setCache(prev => ({ ...prev, [`${category}-brands`]: brs || [] }));
          }
        } else {
          setBrands(cache[`${category}-brands`]);
        }

        // Handle pagination
        if (page === 1) {
          setProducts(productsData || []);
        } else {
          setProducts(prev => [...prev, ...(productsData || [])]);
        }

        setHasMore((productsData || []).length === 20); // 20 items per page

        // Cache the results
        setCache(prev => ({
          ...prev,
          [cacheKey]: {
            products: page === 1 ? productsData : [...products, ...(productsData || [])],
            categoryInfo: categoryData,
            brands: cache[`${category}-brands`] || brands,
            hasMore: (productsData || []).length === 20
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [category, selectedBrand, debouncedSearchQuery, page, cache, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData, sortBy]);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedBrand && product.brand_id !== selectedBrand) return false;
      if (debouncedSearchQuery) {
        const name = lang === 'ar' ? product.name_ar : product.name_fr;
        return name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      }
      return true;
    });
  }, [products, selectedBrand, debouncedSearchQuery, lang]);

  const clearFilters = useCallback(() => {
    setSelectedBrand(null);
    setSearchQuery("");
    setSortBy("newest");
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  if (loading && page === 1) {
    return (
      <main className="w-full min-h-screen bg-white">
        <div className="bg-white border-b px-4 py-6">
          <div className="flex items-center mb-4">
            <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-48 h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="w-full h-12 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-24 h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-gray-400 text-lg">
        {lang === 'ar' ? 'الفئة غير موجودة' : 'Category not found'}
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b px-4 py-6">
        <div className="flex items-center mb-4">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            {lang === 'ar' ? '← العودة للرئيسية' : '← Back to Home'}
          </Link>
        </div>
        
        <h1 className={clsx("text-3xl font-bold text-gray-900 mb-4", lang === 'ar' ? 'text-right' : 'text-left')}>
          {lang === 'ar' ? categoryInfo.name_ar : categoryInfo.name_fr}
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'بحث في المنتجات...' : 'Search products...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={clsx(
              "w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent",
              lang === 'ar' ? 'text-right' : 'text-left'
            )}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Brand Filter */}
          <select
            value={selectedBrand || ""}
            onChange={(e) => setSelectedBrand(e.target.value || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">{lang === 'ar' ? 'كل الماركات' : 'All Brands'}</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {lang === 'ar' ? (brand.name_ar || brand.name) : (brand.name_fr || brand.name)}
              </option>
            ))}
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">{lang === 'ar' ? 'الأحدث' : 'Newest'}</option>
            <option value="price-low">{lang === 'ar' ? 'السعر: من الأقل إلى الأعلى' : 'Price: Low to High'}</option>
            <option value="price-high">{lang === 'ar' ? 'السعر: من الأعلى إلى الأقل' : 'Price: High to Low'}</option>
            <option value="name-az">{lang === 'ar' ? 'الاسم: أ-ي' : 'Name: A-Z'}</option>
            <option value="name-za">{lang === 'ar' ? 'الاسم: ي-أ' : 'Name: Z-A'}</option>
          </select>

          {/* Clear Filters */}
          {(selectedBrand || searchQuery || sortBy !== "newest") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className={clsx("text-gray-600", lang === 'ar' ? 'text-right' : 'text-left')}>
          {lang === 'ar' 
            ? `${filteredProducts.length} منتج في ${categoryInfo.name_ar}` 
            : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} in ${categoryInfo.name_fr}`
          }
        </p>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-md p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-100"
                style={{ textDecoration: 'none' }}
              >
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">
                  <img
                    src={product.image_urls?.[0] || "/vercel.svg"}
                    alt={lang === 'ar' ? product.name_ar : product.name_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className={clsx("space-y-2", lang === 'ar' ? 'text-right' : 'text-left')}>
                  {/* Brand */}
                  {product.brands && (
                    <p className="text-sm text-green-600 font-medium">
                      {lang === 'ar' 
                        ? (product.brands.name_ar || product.brands.name) 
                        : (product.brands.name_fr || product.brands.name)
                      }
                    </p>
                  )}
                  
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {lang === 'ar' ? product.name_ar : product.name_fr}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    {product.promo_price ? (
                      <>
                        <span className="text-gray-400 text-sm line-through">
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

                  {/* New Badge */}
                  {product.created_at && new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                      {lang === 'ar' ? 'جديد' : 'New'}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center py-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                  </span>
                ) : (
                  lang === 'ar' ? 'تحميل المزيد' : 'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
} 