"use client";

import { useLanguage } from "@/context/LanguageContext";
import clsx from "clsx";

// List of partner logo image paths (located in /public)
const logos: string[] = [
  "/burberry%20logo.png",
  "/chanel.png",
  "/gucci.png",
  "/Hermes1.png",
  "/h&m.png",
  "/tiffanylogo.webp",
  "/valentino.png",
  "/versace.png",
  "/Zara_Logo.svg.png",
];

export default function PartnersCarousel() {
  const { lang } = useLanguage();
  const isRTL = lang === "ar";

  return (
    <section className="w-full pt-8 md:pt-12 pb-8 md:pb-12 bg-gray-50 border-t border-gray-100 overflow-hidden">
      {/* Container for better visual hierarchy */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Heading with better spacing and typography */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {lang === "ar" ? "شركاؤنا" : "Our Partners"}
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            {lang === "ar" ? "نفخر بالعمل مع أفضل العلامات التجارية" : "Proud to work with the finest brands"}
          </p>
        </div>

        {/* Scrolling logos with improved spacing and sizing */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex items-center gap-16 md:gap-20 animate-scroll-x hover:[animation-play-state:paused]"
          >
            {logos.concat(logos).map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <img
                  src={logo}
                  alt="Partner logo"
                  className="h-8 md:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300 select-none pointer-events-none max-w-[120px] md:max-w-[160px]"
                  draggable={false}
                  style={{
                    filter: 'grayscale(100%)',
                  }}
                  onLoad={(e) => {
                    // Remove grayscale on hover for better interaction
                    e.currentTarget.style.filter = 'grayscale(100%)';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 