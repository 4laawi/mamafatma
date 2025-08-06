"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { clsx } from "clsx";
import Link from "next/link";

export default function Dashboard() {
  const { lang } = useLanguage();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get active products
      const { count: activeProductsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total categories
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        activeProducts: activeProductsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: lang === 'ar' ? 'إضافة منتج جديد' : 'Add New Product',
      href: '/dashboard/products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: lang === 'ar' ? 'إدارة متغيرات المنتجات' : 'Manage Product Variants',
      href: '/dashboard/variants',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: lang === 'ar' ? 'إدارة الفئات' : 'Manage Categories',
      href: '/dashboard/categories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

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
        <h1 className={clsx("text-2xl font-bold text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
          {lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className={clsx("ml-5 w-0 flex-1", lang === 'ar' ? 'mr-5 ml-0' : 'ml-5')}>
                <dl>
                  <dt className={clsx("text-sm font-medium text-gray-500 truncate", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {lang === 'ar' ? 'إجمالي المنتجات' : 'Total Products'}
                  </dt>
                  <dd className={clsx("text-lg font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {stats.totalProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className={clsx("ml-5 w-0 flex-1", lang === 'ar' ? 'mr-5 ml-0' : 'ml-5')}>
                <dl>
                  <dt className={clsx("text-sm font-medium text-gray-500 truncate", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {lang === 'ar' ? 'المنتجات النشطة' : 'Active Products'}
                  </dt>
                  <dd className={clsx("text-lg font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {stats.activeProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className={clsx("ml-5 w-0 flex-1", lang === 'ar' ? 'mr-5 ml-0' : 'ml-5')}>
                <dl>
                  <dt className={clsx("text-sm font-medium text-gray-500 truncate", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {lang === 'ar' ? 'إجمالي الفئات' : 'Total Categories'}
                  </dt>
                  <dd className={clsx("text-lg font-medium text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {stats.totalCategories}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className={clsx("text-lg font-medium text-gray-900 mb-4", lang === 'ar' ? 'text-right' : 'text-left')}>
          {lang === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  {action.icon}
                </span>
              </div>
              <div className="mt-8">
                <h3 className={clsx("text-lg font-medium", lang === 'ar' ? 'text-right' : 'text-left')}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
} 