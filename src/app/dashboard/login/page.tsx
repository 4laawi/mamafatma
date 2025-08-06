"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

export default function AdminLogin() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(lang === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login error');
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className={clsx("mt-6 text-center text-3xl font-extrabold text-gray-900", lang === 'ar' ? 'text-right' : 'text-left')}>
            {lang === 'ar' ? 'تسجيل دخول المدير' : 'Admin Login'}
          </h2>
          <p className={clsx("mt-2 text-center text-sm text-gray-600", lang === 'ar' ? 'text-right' : 'text-left')}>
            {lang === 'ar' ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'Enter your credentials to access the dashboard'}
          </p>
          <p className="text-center text-sm text-red-600 mt-2">
            Debug: Language is {lang}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={clsx(
                  "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={clsx(
                  "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm",
                  lang === 'ar' ? 'text-right' : 'text-left'
                )}
                placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className={clsx("text-sm font-medium text-red-800", lang === 'ar' ? 'text-right' : 'text-left')}>
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading 
                ? (lang === 'ar' ? 'جاري تسجيل الدخول...' : 'Signing in...') 
                : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign in')
              }
            </button>
          </div>

          <div className="text-center">
            <a
              href="/"
              className={clsx(
                "font-medium text-green-600 hover:text-green-500 text-sm",
                lang === 'ar' ? 'text-right' : 'text-left'
              )}
            >
              {lang === 'ar' ? 'العودة للموقع الرئيسي' : 'Back to main site'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 