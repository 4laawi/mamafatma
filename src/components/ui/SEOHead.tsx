"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function SEOHead() {
  const { lang } = useLanguage();

  useEffect(() => {
    // Update document title and meta tags based on language
    if (lang === 'ar') {
      // Arabic meta tags
      document.title = 'مامافاطما - متجر إلكتروني في المغرب';
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'مامافاطما.ما: عطور، حقائب، ملابس، إلكترونيات والمزيد من أشهر الماركات. توصيل سريع داخل المغرب.');
      
      // Update Open Graph tags
      updateOpenGraphTags({
        title: 'مامافاطما - متجر إلكتروني في المغرب',
        description: 'تسوق أفضل المنتجات والعطور والملابس من ماركات عالمية. توصيل مضمون في جميع أنحاء المغرب.',
        url: 'https://mamafatma.ma/ar',
        image: 'https://mamafatma.ma/assets/preview-ar.jpg'
      });
      
      // Update Twitter tags
      updateTwitterTags({
        title: 'مامافاطما - متجر إلكتروني في المغرب',
        description: 'تسوق أفضل المنتجات والعطور والملابس من ماركات عالمية. توصيل مضمون في جميع أنحاء المغرب.',
        image: 'https://mamafatma.ma/assets/preview-ar.jpg'
      });
      
    } else {
      // French meta tags (default)
      document.title = 'Mamafatma - Boutique en ligne au Maroc | Parfums, sacs, chaussures, électronique';
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Trouvez vos marques préférées sur Mamafatma.ma : parfums, sacs, chaussures, montres, électronique et plus. Livraison partout au Maroc.');
      
      // Update Open Graph tags
      updateOpenGraphTags({
        title: 'Mamafatma - Boutique en ligne au Maroc',
        description: 'Achetez des produits de grandes marques : parfums, sacs, montres, vêtements, et gadgets électroniques. Livraison rapide au Maroc.',
        url: 'https://mamafatma.ma',
        image: 'https://mamafatma.ma/assets/preview.jpg'
      });
      
      // Update Twitter tags
      updateTwitterTags({
        title: 'Mamafatma - Boutique en ligne au Maroc',
        description: 'Achetez des produits de grandes marques : parfums, sacs, montres, vêtements, et gadgets électroniques. Livraison rapide au Maroc.',
        image: 'https://mamafatma.ma/assets/preview.jpg'
      });
    }
  }, [lang]);

  const updateOpenGraphTags = ({ title, description, url, image }: {
    title: string;
    description: string;
    url: string;
    image: string;
  }) => {
    // Update or create Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Mamafatma' },
      { property: 'og:locale', content: lang === 'ar' ? 'ar_MA' : 'fr_FR' }
    ];

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  const updateTwitterTags = ({ title, description, image }: {
    title: string;
    description: string;
    image: string;
  }) => {
    // Update or create Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };

  return null; // This component doesn't render anything
} 