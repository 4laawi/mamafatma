'use client';

import { useState, useRef, useEffect } from 'react';
import { GlobeAltIcon, ShoppingBagIcon, MagnifyingGlassIcon, CameraIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';

function getCategories(lang: string) {
  if (lang === 'ar') {
    return [
      { label: 'الكل', value: 'all' },
      { label: 'أحذية وصنادل', value: 'shoes' },
      { label: 'حقائب', value: 'bags' },
      { label: 'إلكترونيات', value: 'electronics' },
      { label: 'ساعات', value: 'watches' },
    ];
  }
  if (lang === 'fr') {
    return [
      { label: 'Tous', value: 'all' },
      { label: 'Chaussures', value: 'shoes' },
      { label: 'Sacs', value: 'bags' },
      { label: 'Électronique', value: 'electronics' },
      { label: 'Montres', value: 'watches' },
    ];
  }
  // default English
  return [
    { label: 'All', value: 'all' },
    { label: 'Shoes & Sandals', value: 'shoes' },
    { label: 'Bags', value: 'bags' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Watches', value: 'watches' },
  ];
}

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const categories = getCategories(lang);
  // Track which category pill should be highlighted based on the current route.
  const [activeCat, setActiveCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = lang === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [cartOpen, setCartOpen] = useState(false);
  const [badgePop, setBadgePop] = useState(false);
  const prevCartCount = useRef(cartCount);
  // Shrink navbar on scroll
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShrink = window.scrollY > 60;
      setIsShrunk(prev => (prev === shouldShrink ? prev : shouldShrink));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setBadgePop(true);
      setTimeout(() => setBadgePop(false), 300);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on a dashboard page
  const isDashboard = pathname.startsWith('/dashboard');

  // Check scroll indicators
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => {
      setShowLeft(el.scrollLeft > 2);
      setShowRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 2);
    };
    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Update the active category whenever the pathname changes (e.g. when navigating
  // from links outside of the Navbar).
  useEffect(() => {
    // Home page → highlight "all"
    if (pathname === '/' || pathname === '') {
      setActiveCat('all');
      return;
    }

    // Category pages follow the pattern /shop/<slug>
    // We map various slug possibilities to our internal category keys.
    if (pathname.startsWith('/shop/')) {
      const slug = pathname.split('/shop/')[1]?.split('/')[0] || '';

      // Normalise the slug – remove leading/trailing dashes and lowercase
      const normalised = slug.toLowerCase().replace(/^\-+|\-+$/g, '');

      if (['shoes', 'shoe', 'shoes-sandals', 'shoesandals', 'shoes-sandal', 'shoe-sandals'].some(s => normalised.includes(s))) {
        setActiveCat('shoes');
      } else if (normalised.includes('bag')) {
        setActiveCat('bags');
      } else if (normalised.includes('electronic')) {
        setActiveCat('electronics');
      } else if (normalised.includes('watch')) {
        setActiveCat('watches');
      } else {
        // Fallback – keep previous value to avoid clearing highlight unexpectedly
      }
      return;
    }

    // Any other path – no specific category highlighted
    setActiveCat('');
  }, [pathname]);

  return (
    <>
      <nav className={clsx(
        'w-full fixed top-0 left-0 z-50 transition-all duration-300',
        isShrunk ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      )}>
        {/* Row 1: Top Header */}
        <div className={clsx(
          'flex items-center justify-between px-4 w-full transition-all duration-300',
          isShrunk ? 'h-12' : 'h-14'
        )}>
          {/* Globe button (always left) - hidden on dashboard */}
          {!isDashboard && (
            <button
              className={clsx("p-2 flex items-center justify-center", lang === 'ar' ? 'text-green-600' : 'text-gray-700')}
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              aria-label="Change language"
            >
              <GlobeAltIcon className="h-6 w-6" />
            </button>
          )}
          {/* Empty div to maintain layout when globe is hidden */}
          {isDashboard && <div className="w-10"></div>}
          {/* Logo centered */}
          <a href="/" className="font-bold text-2xl md:text-3xl tracking-tight flex-1 text-center select-none text-black font-[var(--font-cairo)] flex items-center justify-center">
            {lang === 'ar' ? 'ماما فاطمة' : 'MAMA FATMA'}
          </a>
          {/* Cart button (always right) - hidden on dashboard */}
          {!isDashboard && (
            <button
              className="p-2 flex items-center justify-center relative"
              aria-label="Cart"
              onClick={() => { console.log('Shopping bag icon clicked'); setCartOpen(true); }}
              style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className={`absolute bg-green-500 text-white rounded-full font-bold text-xs flex items-center justify-center shadow-md ${badgePop ? 'animate-badge-pop' : ''}`}
                  style={{
                    minWidth: 16,
                    height: 16,
                    fontSize: '0.75rem',
                    padding: '0 4px',
                    top: 2,
                    right: 2,
                    lineHeight: 1,
                    transform: 'none',
                    boxSizing: 'border-box',
                  }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}
          {/* Empty div to maintain layout when cart is hidden */}
          {isDashboard && <div className="w-10"></div>}
        </div>
        {/* Row 2: Search Bar */}
        <div className={clsx(
          'flex items-center w-full px-3 overflow-hidden transition-all duration-300',
          isShrunk ? 'max-h-0 opacity-0 py-0' : 'max-h-16 opacity-100 py-2'
        )}>
          <div className="relative w-full">
            <MagnifyingGlassIcon className={clsx(
              'absolute h-5 w-5 text-gray-400',
              isRTL ? 'right-3 left-auto' : 'left-3 right-auto',
              'top-1/2 -translate-y-1/2'
            )} />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'بحث' : 'Search'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className={clsx(
                'w-full py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white',
                isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10',
              )}
              style={{ height: 44 }}
            />
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className={clsx(
                  'absolute top-1/2 -translate-y-1/2 p-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors',
                  isRTL ? 'left-2 right-auto' : 'right-2 left-auto'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Row 3: Category Pills */}
        <div className={clsx(
          'relative px-3 transition-all duration-300',
          isShrunk ? 'pb-2' : 'pb-4',
          'md:px-32 md:flex md:justify-center'
        )}>
          <div className={clsx(
            "flex gap-0.5 justify-center md:justify-center",
            isRTL && 'flex-row-reverse'
          )}>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === 'all' ? '/' : `/shop/${cat.value}`}
                className={clsx(
                  'inline-flex items-center justify-center px-3 py-1.5 rounded-full font-bold leading-none transition whitespace-nowrap',
                  lang === 'ar' ? 'text-xs sm:text-sm md:text-base lg:text-lg' : 'text-xs md:text-sm',
                  activeCat === cat.value
                    ? 'bg-green-500 text-white shadow'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100',
                  isRTL && 'text-right'
                )}
                style={{ minHeight: 40, textDecoration: 'none' }}
                onClick={() => setActiveCat(cat.value)}
              >
                {lang === 'ar' ? arCat(cat.value) : cat.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function arCat(value: string) {
  switch (value) {
    case 'all': return 'الكل';
    case 'shoes': return 'أحذية وصنادل';
    case 'bags': return 'حقائب';
    case 'electronics': return 'إلكترونيات';
    case 'watches': return 'ساعات';
    default: return value;
  }
}

// Hide scrollbars for pills
// Add this to your global CSS if not present:
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } 