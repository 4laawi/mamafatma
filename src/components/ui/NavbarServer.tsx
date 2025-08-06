import Link from "next/link";
import { GlobeAltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// This is a server-side compatible navbar that renders immediately
// It will be replaced by the full interactive navbar once the client loads
export default function NavbarServer() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white" dir="rtl">
      {/* Row 1: Top Header */}
      <div className="flex items-center justify-between px-4 w-full h-14">
        {/* Globe button */}
        <button
          className="p-2 flex items-center justify-center text-green-600"
          aria-label="Change language"
        >
          <GlobeAltIcon className="h-6 w-6" />
        </button>
        
        {/* Logo centered */}
        <a href="/" className="font-bold text-2xl md:text-3xl tracking-tight flex-1 text-center select-none text-black font-[var(--font-cairo)] flex items-center justify-center">
          ماما فاطمة
        </a>
        
        {/* Cart button */}
        <button
          className="p-2 flex items-center justify-center relative"
          aria-label="Cart"
          style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>
      </div>
      
      {/* Row 2: Search Bar */}
      <div className="flex items-center w-full px-3 max-h-16 py-2">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="absolute h-5 w-5 text-gray-400 right-3 left-auto top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث"
            className="w-full py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white pr-10 pl-10 text-right"
            style={{ height: 44 }}
            disabled
          />
        </div>
      </div>
      
      {/* Row 3: Category Pills */}
      <div className="relative px-3 pb-4 md:px-32 md:flex md:justify-center">
        <div className="flex gap-0.5 justify-center md:justify-center flex-row-reverse">
          {[
            { label: 'الكل', value: 'all' },
            { label: 'أحذية وصنادل', value: 'shoes' },
            { label: 'حقائب', value: 'bags' },
            { label: 'إلكترونيات', value: 'electronics' },
            { label: 'ساعات', value: 'watches' },
          ].map((cat) => (
            <Link
              key={cat.value}
              href={cat.value === 'all' ? '/' : `/shop/${cat.value}`}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full font-bold leading-none transition whitespace-nowrap text-xs md:text-sm bg-transparent text-gray-600 hover:bg-gray-100 text-right"
              style={{ minHeight: 40, textDecoration: 'none' }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 