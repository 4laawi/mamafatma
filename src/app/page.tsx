"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { clsx } from "clsx";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PartnersCarousel from "@/components/ui/PartnersCarousel";
import { HeroSkeleton, ProductCardSkeleton } from "@/components/ui/Skeleton";

// Only keep the mobile hero image for mobile
const mobileHeroImages = [
  "/hero-banner.webp",
  "/AlbedoBase_XL_MAMA_FATMA_Website_Hero_Banner_Mobile_VersionCr_1 (1).jpg",
  "/AlbedoBase_XL_MAMA_FATMA_Website_Hero_Banner_Mobile_VersionCr_0 (1).jpg",
  "/AlbedoBase_XL_MAMA_FATMA_Website_Hero_Banner_Mobile_VersionCr_2 (1).jpg",
  "/AlbedoBase_XL_MAMA_FATMA_Website_Hero_Banner_Mobile_VersionCr_3 (1).jpg",
];
// Use the new PC hero images for desktop
const desktopHeroImages = [
  "/hero-banner.webp",
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
];

function arCat(value: string) {
  switch (value) {
    case 'Shoes & Sandals': return 'أحذية وصنادل';
    case 'Bags': return 'حقائب';
    case 'Electronics': return 'إلكترونيات';
    case 'Watches': return 'ساعات';
    default: return value;
  }
}

function frCat(value: string) {
  switch (value) {
    case 'Shoes & Sandals': return 'Chaussures & Sandales';
    case 'Bags': return 'Sacs';
    case 'Electronics': return 'Électronique';
    case 'Watches': return 'Montres';
    default: return value;
  }
}

export default function Home() {
  // Track when component has mounted on client to safely render client-only UI
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [current, setCurrent] = useState(0);
  const { lang } = useLanguage();
  // Featured products state
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Slide navigation helpers
  function next() {
    setCurrent((c) => (c + 1) % heroImages.length);
  }

  function prev() {
    setCurrent((c) => (c - 1 + heroImages.length) % heroImages.length);
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      next();
    }
    if (isRightSwipe) {
      prev();
    }
  };

  useEffect(() => {
    async function fetchFeatured() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(8);
        if (error) {
          console.error('Supabase error:', error.message);
        }
        if (data) setFeatured(data);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Detect if user is on desktop (md: and up) – evaluated only on the client **after** first render
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    // This runs only in the browser, so window is always defined here
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    // Set the initial value
    setIsDesktop(mediaQuery.matches);

    // Update state on viewport changes
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  const heroImages = isDesktop ? desktopHeroImages : mobileHeroImages;

  // Ensure the current index is always valid when the heroImages array changes (e.g., after hydration)
  useEffect(() => {
    if (current >= heroImages.length) {
      setCurrent(0);
    }
  }, [heroImages.length]);

  const isRTL = lang === 'ar';

  return (
    <main className="w-full flex flex-col bg-white">
      {/* Desktop container is wider */}
      <div className="w-full">
        {/* Hero Carousel */}
        <section className="relative flex flex-col mb-6 md:mb-10">
          {mounted ? (
          <div className="w-full aspect-[4/5] md:aspect-[21/7] rounded-none shadow-lg shadow-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center relative">
            <div
              className="flex w-full h-full transition-transform duration-400 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {heroImages.map((img, i) => (
                <div key={i} className="w-full h-full flex-shrink-0 relative">
                  <Image
                    src={img}
                    alt={`Hero ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 100vw"
                    quality={85}
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40 pointer-events-none" />

            {/* Text + CTA overlay */}
            <div className={clsx(
              "absolute inset-0 flex flex-col px-4 py-6 z-20 pointer-events-none",
              isRTL ? "items-end text-right" : "items-start text-left"
            )}>
              <h1 className="text-white font-bold drop-shadow-lg text-2xl md:text-4xl lg:text-5xl leading-snug pointer-events-none mb-0">
                {current === 0 
                  ? (lang === 'ar' ? 'اطلب عطرك المفضل' : 'Commandez votre parfum préféré')
                  : (lang === 'ar' ? 'اكتشف أحدث تشكيلاتنا' : 'Découvrez nos nouveautés')
                }
              </h1>
              <p className="text-white text-xs md:text-sm lg:text-base opacity-90 pointer-events-none leading-relaxed max-w-xs md:max-w-sm lg:max-w-md mt-0">
                {current === 0
                  ? (lang === 'ar' ? 'عروض حصرية لكل الأذواق والجودة التي تستحقها' : 'Des offres exclusives pour tous les styles, la qualité que vous méritez')
                  : (lang === 'ar' ? 'عروض حصرية لكل الأذواق والجودة التي تستحقها' : 'Des offres exclusives pour tous les styles, la qualité que vous méritez')
                }
              </p>
              {/* CTA button moved to bottom center */}
            </div>

            {/* Corner logo */}
            <div className={clsx(
              "absolute bottom-2 w-10 h-auto opacity-90 pointer-events-none z-20",
              isRTL ? "left-2" : "right-2"
            )}>
              <Image
                src="/favicone.png"
                alt="MF Logo"
                width={40}
                height={40}
                className="w-10 h-auto"
              />
            </div>
            {/* Carousel Controls - larger and more visible on desktop */}
            <div className="absolute inset-0 items-center justify-between px-2 md:px-6 pointer-events-none z-30 hidden md:flex">
              <button
                onClick={prev}
                className="pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 md:p-3 shadow-lg transition border border-gray-200"
                aria-label="Previous slide"
              >
                <svg width="28" height="28" className="md:w-8 md:h-8" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                onClick={next}
                className="pointer-events-auto bg-white/80 hover:bg-white text-gray-700 rounded-full p-1 md:p-3 shadow-lg transition border border-gray-200"
                aria-label="Next slide"
              >
                <svg width="28" height="28" className="md:w-8 md:h-8" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            {/* Dots */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10 flex justify-center gap-2 px-4 py-1 rounded-full bg-white/80 shadow backdrop-blur-sm">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === current ? "bg-green-500 scale-125" : "bg-gray-300"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
          ) : (
            <HeroSkeleton />
          )}
        </section>
        {/* Featured Products Section */}
        <section className="w-full mb-8 md:mb-12 px-4 md:px-12">
          <h2 className={clsx("text-xl md:text-2xl font-bold mb-4 md:mb-6 mt-2 md:mt-0", lang === 'ar' ? 'text-right' : '')}>{lang === 'ar' ? 'منتجات مميزة' : 'Produits en vedette'}</h2>
          {loading ? (
            <div className={clsx(
              "gap-4 md:gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            )}>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="w-full flex justify-center items-center py-8 md:py-12 text-gray-400 text-center text-base">
              {lang === 'ar' ? 'لا توجد منتجات مميزة حالياً' : 'Aucun produit en vedette pour le moment.'}
            </div>
          ) : (
            <div className={clsx(
              "gap-4 md:gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            )}>
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={"/product/" + product.slug}
                  className={clsx(
                    "group flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-green-300 active:scale-100 h-full min-h-[280px] md:min-h-[300px]", // reduced height, better hover states
                    lang === 'ar' ? 'text-right' : 'text-center'
                  )}
                  style={{ textDecoration: 'none' }}
                >
                  {/* Image container with better proportions */}
                  <div className="relative mb-3 h-48 md:h-56 lg:h-64">
                    <Image 
                      src={product.image_urls?.[0] || "/vercel.svg"} 
                      alt={lang === 'ar' ? product.name_ar : product.name_fr} 
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300" 
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      quality={75}
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.src = "/vercel.svg"; 
                      }}
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-lg"></div>
                  </div>
                  
                  {/* Product name with better typography */}
                  <div className="flex-1 flex flex-col w-full mb-3">
                    <span className="text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors duration-300 mx-2">
                      {lang === 'ar' ? product.name_ar : product.name_fr}
                    </span>
                  </div>
                  
                  {/* Price section with improved hierarchy */}
                  <div className="w-full flex flex-col items-center justify-end">
                    {product.promo_price ? (
                      <div className="text-center">
                        <span className="text-gray-400 text-xs md:text-sm line-through mb-1 block">{product.price} Dhs</span>
                        <span className="text-green-600 font-bold text-lg md:text-xl lg:text-2xl">{product.promo_price} Dhs</span>
                      </div>
                    ) : (
                      <span className="text-green-600 font-bold text-lg md:text-xl lg:text-2xl">{product.price} Dhs</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
      {/* Partners Carousel (full-width) */}
      <PartnersCarousel />
    </main>
  );
}
