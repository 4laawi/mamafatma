"use client";
import { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { ProductGallerySkeleton, ProductInfoSkeleton } from "@/components/ui/Skeleton";

export default function ProductPage() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const images = product?.image_urls && product.image_urls.length > 0 ? product.image_urls : ["/vercel.svg"];
  const [brand, setBrand] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  // Similar products from same category
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // Drag-to-scroll state for desktop
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, is_in_stock')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      setProduct(data);
      setLoading(false);
      // Fetch category and brand if product exists
      if (data && data.category_id) {
        const { data: cat } = await supabase
          .from('categories')
          .select('*')
          .eq('id', data.category_id)
          .single();
        setCategory(cat);
      }
      if (data && data.brand_id) {
        const { data: br } = await supabase
          .from('brands')
          .select('*')
          .eq('id', data.brand_id)
          .single();
        setBrand(br);
      }
      // Fetch product variants
      if (data && data.id) {
        const { data: vars } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', data.id)
          .eq('is_available', true);
        setVariants(vars || []);
        if (vars && vars.length > 0) setSelectedVariant(vars[0]);
      }

      // Fetch similar products (same category)
      if (data && data.category_id) {
        const { data: similar } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .neq('id', data.id)
          .limit(8);
        setSimilarProducts(similar || []);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  // Track scroll position for active dot
  const galleryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!galleryRef.current) return;
    const el = galleryRef.current;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const width = el.offsetWidth;
      const idx = Math.round(scrollLeft / width);
      setImgIdx(Math.min(idx, images.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [images.length]);

  // Load recently viewed products
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recentlyViewed') : null;
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Add current product to recently viewed
  useEffect(() => {
    if (product && typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentlyViewed');
      let recent = stored ? JSON.parse(stored) : [];
      
      // Remove current product if already in list
      recent = recent.filter((p: any) => p.id !== product.id);
      
      // Add current product to beginning
      recent.unshift(product);
      
      // Keep only last 4 products
      recent = recent.slice(0, 4);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(recent));
      setRecentlyViewed(recent);
    }
  }, [product]);

  // Debug: log brand object
  console.log('Brand:', brand);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-white flex flex-col md:flex-row md:items-start md:gap-12 px-0 md:px-12 pt-4">
        <ProductGallerySkeleton />
        <ProductInfoSkeleton />
      </main>
    );
  }
  
  if (!product) {
    return <div className="w-full min-h-screen flex items-center justify-center text-gray-400 text-lg">{lang === 'ar' ? 'المنتج غير موجود أو غير مفعل' : 'Product not found or inactive'}</div>;
  }

  // WhatsApp owner number (replace with actual number if needed)
  const ownerNumber = '212703229471'; // Example: Morocco country code
  // Compose message for this product
  const waMessage = lang === 'ar'
    ? `مرحبًا، أنا مهتم بشراء المنتج التالي: *${product.name_ar}*\nبالمواصفة التالية: *${selectedVariant ? (selectedVariant.color || '') + (selectedVariant.size ? ' ' + selectedVariant.size : '') : 'عادي'}*\nكيف أتمم الطلب؟ شكرًا!`
    : `Bonjour, je suis intéressé(e) par l'article suivant : *${product.name_fr}*, de la variante : *${selectedVariant ? (selectedVariant.color || '') + (selectedVariant.size ? ' ' + selectedVariant.size : '') : 'Standard'}*. Pourriez-vous me donner plus d'informations ou comment procéder à l'achat ? Merci !`;
  const waUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(waMessage)}`;

  const isOutOfStock = !product.is_in_stock;

  return (
    <main className="w-full min-h-screen bg-white flex flex-col md:flex-row md:items-start md:gap-12 px-0 md:px-12 pt-4">
      {/* Image Gallery */}
      <div className="w-full md:w-1/2 flex flex-col items-center px-0 md:px-6">
        <div className="w-full max-w-lg bg-white overflow-hidden shadow-xl transition-all duration-500 relative">
          <div
            ref={galleryRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory w-full h-full aspect-square"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseDown={e => {
              if (window.innerWidth >= 768 && galleryRef.current) {
                isDragging.current = true;
                startX.current = e.pageX - galleryRef.current.offsetLeft;
                scrollLeft.current = galleryRef.current.scrollLeft;
              }
            }}
            onMouseLeave={() => { if (window.innerWidth >= 768) isDragging.current = false; }}
            onMouseUp={() => { if (window.innerWidth >= 768) isDragging.current = false; }}
            onMouseMove={e => {
              if (!isDragging.current || window.innerWidth < 768 || !galleryRef.current) return;
              e.preventDefault();
              const x = e.pageX - galleryRef.current.offsetLeft;
              const walk = (x - startX.current) * 1.2; // scroll-fast
              galleryRef.current.scrollLeft = scrollLeft.current - walk;
            }}
          >
            {images.map((img: string, i: number) => (
              <div key={i} className="w-full h-full flex-shrink-0 relative">
                <Image
                  src={img}
                  alt={lang === 'ar' ? product.name_ar : product.name_fr}
                  fill
                  className="object-cover snap-center cursor-zoom-in"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  draggable={false}
                  onClick={() => { setImgIdx(i); }}
                />
              </div>
            ))}
          </div>
          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 flex justify-center gap-2 px-4 py-1 rounded-full bg-white/70 shadow backdrop-blur-sm">
              {images.map((_: string, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    if (galleryRef.current) {
                      galleryRef.current.scrollTo({ left: i * galleryRef.current.offsetWidth, behavior: 'smooth' });
                      setImgIdx(i);
                    }
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === imgIdx ? "bg-green-500 scale-125" : "bg-gray-300"}`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        {/* Thumbnail navigation for desktop */}
        {images.length > 1 && (
          <div className="hidden md:flex gap-3 mt-5 justify-center">
            {images.map((img: string, i: number) => (
              <div key={i} className="relative w-16 h-16">
                <Image
                  src={img}
                  alt="thumb"
                  fill
                  className={clsx(
                    "object-cover rounded-xl border-2 cursor-pointer transition-all duration-200",
                    i === imgIdx ? "border-green-500 ring-2 ring-green-400" : "border-gray-200 hover:border-green-300"
                  )}
                  sizes="64px"
                  quality={75}
                  onClick={() => {
                    setImgIdx(i);
                    if (galleryRef.current) {
                      galleryRef.current.scrollTo({ left: i * galleryRef.current.offsetWidth, behavior: 'smooth' });
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className={clsx("w-full md:w-1/2 flex flex-col gap-4 px-4 md:px-0 mt-6 md:mt-0", lang === 'ar' ? 'text-right' : 'text-left')}> 
        {/* Brand, Title, Badges, Color, Price Grouped */}
        <div className="flex flex-col gap-2 mb-2">
          {/* Brand and Category Chips */}
          <div className="flex flex-wrap gap-2 items-center mb-1">
            {brand && (
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-bold shadow-sm border border-green-200 text-base">
                {lang === 'ar' ? (brand.name_ar || brand.name) : (brand.name_fr || brand.name)}
              </span>
            )}
            {category && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {lang === 'ar' ? category.name_ar : category.name_fr}
              </span>
            )}
          </div>
          {/* Title and New badge */}
          <div className={clsx("flex items-center gap-2", lang === 'ar' ? 'justify-end' : 'justify-start')}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-0">{lang === 'ar' ? product.name_ar : product.name_fr}</h1>
            {product.created_at && dayjs(product.created_at).isAfter(dayjs().subtract(7, 'day')) && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full ml-2">{lang === 'ar' ? 'جديد' : 'New'}</span>
            )}
          </div>
          {/* Color Variants */}
          {variants.length > 0 && (
            <div className={clsx("flex flex-wrap gap-2 items-center mt-1", lang === 'ar' ? 'flex-row-reverse text-right' : '')}>
              <span className="text-base font-semibold text-gray-700 mr-2">{lang === 'ar' ? ': نوع' : 'variante :'}</span>
              {variants.map((variant: any, i: number) => (
                <button
                  key={variant.id}
                  className={clsx(
                    "px-4 py-2 rounded-full border-2 font-semibold transition-all",
                    selectedVariant?.id === variant.id
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-green-400"
                  )}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.color && <span>{variant.color}</span>}
                  {variant.size && <span className="ml-2">{variant.size}</span>}
                </button>
              ))}
            </div>
          )}
          {/* Price */}
          <div className="flex flex-col gap-1 mt-1">
            {product.promo_price ? (
              <>
                <span className="text-gray-400 text-base line-through">{product.price} Dhs</span>
                <span className="text-green-700 font-extrabold text-2xl">{product.promo_price} Dhs</span>
              </>
            ) : (
              <span className="text-green-700 font-extrabold text-2xl">{product.price} Dhs</span>
            )}
          </div>
        </div>
        <p className="text-base text-gray-700 mb-3 whitespace-pre-line">{lang === 'ar' ? product.description_ar : product.description_fr}</p>
        {/* Add to Cart and WhatsApp Buttons */}
        <div className="sticky bottom-4 flex w-full gap-1 z-20 items-center justify-between">
          <div className="relative group flex items-center justify-center">
            <button
              className={`w-16 h-16 bg-white border-2 rounded-full shadow-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${isOutOfStock ? 'border-gray-300 text-gray-400 cursor-not-allowed opacity-60' : 'border-green-500 hover:bg-green-50'} ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}
              aria-label={lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
              onClick={async () => {
                if (!isOutOfStock && !isAddingToCart) {
                  setIsAddingToCart(true);
                  addToCart({
                    ...product,
                    brand: brand?.name,
                    brand_ar: brand?.name_ar,
                    brand_fr: brand?.name_fr
                  }, selectedVariant);
                  setTimeout(() => setIsAddingToCart(false), 500);
                }
              }}
              tabIndex={0}
              disabled={isOutOfStock || isAddingToCart}
            >
              {isAddingToCart ? (
                <svg className="animate-spin w-6 h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" style={{ color: isOutOfStock ? '#ccc' : '#16a34a' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L7.11 14.12a2.25 2.25 0 002.183 1.755h7.414a2.25 2.25 0 002.183-1.755l1.35-6.048a1.125 1.125 0 00-1.1-1.377H6.343m-1.237 0L4.5 6.75m0 0h15.75" />
                  <circle cx="9" cy="20" r="1.25" />
                  <circle cx="17" cy="20" r="1.25" />
                </svg>
              )}
            </button>
            {isOutOfStock && (
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs rounded px-2 py-1 transition pointer-events-none whitespace-nowrap z-20 shadow">{lang === 'ar' ? 'غير متوفر' : 'Out of Stock'}</span>
            )}
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
              {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
            </span>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg text-center transition-all text-lg focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2"
            style={{ marginLeft: lang === 'ar' ? 0 : '8px', marginRight: lang === 'ar' ? '8px' : 0 }}
          >
            {lang === 'ar' ? null : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.13L4 29l7.13-2.36A11.93 11.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.56-1.5l-.39-.23-4.23 1.4 1.4-4.23-.23-.39A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
              </svg>
            )}
            <span>{lang === 'ar' ? 'شراء عبر واتساب' : 'Buy on WhatsApp'}</span>
            {lang === 'ar' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.13L4 29l7.13-2.36A11.93 11.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.56-1.5l-.39-.23-4.23 1.4 1.4-4.23-.23-.39A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
              </svg>
            ) : null}
          </a>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="w-full mt-12 mb-16 px-4 md:px-0">
          <div className="max-w-screen-xl mx-auto">
            <h2 className={clsx("text-xl md:text-2xl font-bold mb-6", lang === 'ar' ? 'text-right' : 'text-left')}>
              {lang === 'ar' ? 'منتجات مشابهة' : 'Produits similaires'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {similarProducts.map(item => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className={clsx(
                    'group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4 transition-all hover:shadow-lg hover:scale-[1.02] hover:border-green-300',
                    lang === 'ar' ? 'text-right' : 'text-center'
                  )}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="relative w-full h-32 md:h-36 lg:h-40 mb-3">
                    <Image
                      src={item.image_urls?.[0] || '/vercel.svg'}
                      alt={lang === 'ar' ? item.name_ar : item.name_fr}
                      fill
                      className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      quality={75}
                    />
                  </div>
                  <span className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
                    {lang === 'ar' ? item.name_ar : item.name_fr}
                  </span>
                  <span className="text-green-600 font-bold text-lg md:text-xl">
                    {item.promo_price ? item.promo_price : item.price} Dhs
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}