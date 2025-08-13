import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import NavbarServer from "@/components/ui/NavbarServer";
import Footer from "@/components/ui/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import ClientOnly from "@/components/ui/ClientOnly";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import SEOHead from "@/components/ui/SEOHead";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  weight: ["400", "700"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Mamafatma - Boutique en ligne au Maroc | Parfums, sacs, chaussures, électronique",
  description: "Trouvez vos marques préférées sur Mamafatma.ma : parfums, sacs, chaussures, montres, électronique et plus. Livraison partout au Maroc.",
  keywords: "mamafatma, boutique en ligne, maroc, parfums, sacs, chaussures, montres, électronique, livraison",
  authors: [{ name: "Mamafatma" }],
  creator: "Mamafatma",
  publisher: "Mamafatma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mamafatma.ma'),
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/',
      'ar': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'ar_MA',
    url: 'https://mamafatma.ma',
    title: 'Mamafatma - Boutique en ligne au Maroc',
    description: 'Achetez des produits de grandes marques : parfums, sacs, montres, vêtements, et gadgets électroniques. Livraison rapide au Maroc.',
    siteName: 'Mamafatma',
    images: [
      {
        url: 'https://mamafatma.ma/assets/preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Mamafatma - Boutique en ligne au Maroc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mamafatma - Boutique en ligne au Maroc',
    description: 'Achetez des produits de grandes marques : parfums, sacs, montres, vêtements, et gadgets électroniques. Livraison rapide au Maroc.',
    images: ['https://mamafatma.ma/assets/preview.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon is now handled by metadata.icons */}
        <meta property="og:locale:alternate" content="ar_MA" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mamafatma",
              alternateName: "ماما فاطمة",
              url: "https://mamafatma.ma",
              logo: "https://mamafatma.ma/Mama-fatma-logo.png",
              sameAs: [
                "https://t.snapchat.com/iBCMuuxx"
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+212690764312",
                  contactType: "customer service",
                  areaServed: "MA",
                  availableLanguage: ["ar", "fr"]
                }
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Mamafatma",
              alternateName: "ماما فاطمة",
              url: "https://mamafatma.ma",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://mamafatma.ma/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased bg-white pt-44 md:pt-48`}>
        <PerformanceMonitor />
        
        <LanguageProvider>
          <CartProvider>
            {/* SEO Head component for dynamic meta tags */}
            <ClientOnly>
              <SEOHead />
            </ClientOnly>
            
            {/* Server-side navbar - shows immediately, hidden when client loads */}
            <div className="client-navbar-hidden">
              <NavbarServer />
            </div>
            
            {/* Client-side navbar - replaces server navbar once loaded */}
            <ClientOnly>
              <div className="fixed top-0 left-0 z-50 w-full">
                <Navbar />
              </div>
            </ClientOnly>
            
            {children}
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
// Updated for better social media previews
