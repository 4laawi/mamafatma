'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
          <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {lang === 'ar' ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.' : 'Sorry, the page you are looking for does not exist.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {lang === 'ar' ? 'العودة للرئيسية' : 'Go back home'}
        </Link>
      </div>
    </div>
  );
} 