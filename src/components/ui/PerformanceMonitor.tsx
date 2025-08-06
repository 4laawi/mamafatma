"use client";

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === 'production') {
      // Track page load time
      const loadTime = performance.now();
      
      window.addEventListener('load', () => {
        const totalLoadTime = performance.now() - loadTime;
        console.log(`Page loaded in ${totalLoadTime.toFixed(2)}ms`);
        
        // Track Core Web Vitals if available
        if ('web-vital' in window) {
          // This would be available if you add web-vitals package
          console.log('Core Web Vitals tracking available');
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
} 