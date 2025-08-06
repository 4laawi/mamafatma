"use client";
import { useLanguage } from "@/context/LanguageContext";
import { clsx } from "clsx";
import { LockClosedIcon, TruckIcon, CheckCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Translations object moved outside Footer for type safety and linter compliance
const translations = {
  about: { ar: "من نحن", fr: "À propos" },
  contact: { ar: "اتصل بنا", fr: "Contact" },
  shipping: { ar: "الشحن والتوصيل", fr: "Livraison" },
  returns: { ar: "الإرجاع والاستبدال", fr: "Retours" },
  privacy: { ar: "سياسة الخصوصية", fr: "Confidentialité" },
  terms: { ar: "الشروط والأحكام", fr: "Conditions" },
  followUs: { ar: "تابعنا", fr: "Suivez-nous" },
  newsletter: { ar: "اشترك في النشرة الإخبارية", fr: "Newsletter" },
  newsletterDesc: { ar: "احصل على آخر العروض والمنتجات الجديدة", fr: "Recevez nos dernières offres et nouveaux produits" },
  subscribe: { ar: "اشتراك", fr: "S'abonner" },
  email: { ar: "البريد الإلكتروني", fr: "Email" },
  allRights: { ar: "جميع الحقوق محفوظة © 2024 ماما فاطمة", fr: "Tous droits réservés © 2024 Mama Fatma" },
  quickLinks: { ar: "روابط سريعة", fr: "Liens rapides" },
  customerService: { ar: "خدمة العملاء", fr: "Service client" },
  paymentMethods: { ar: "طرق الدفع", fr: "Moyens de paiement" },
  securePayment: { ar: "دفع آمن", fr: "Paiement sécurisé" },
  freeShipping: { ar: "شحن مجاني", fr: "Livraison gratuite" },
  easyReturns: { ar: "إرجاع سهل", fr: "Retours faciles" },
  customerSupport: { ar: "دعم العملاء", fr: "Support client" },
  aboutTitle: { ar: "من نحن", fr: "À propos de nous" },
  aboutContent: { ar: "ماما فاطمة هي متجر إلكتروني متخصص في بيع المنتجات عالية الجودة بأسعار تنافسية. نهدف إلى توفير تجربة تسوق ممتعة وآمنة لعملائنا الكرام.", fr: "Mama Fatma est une boutique en ligne spécialisée dans la vente de produits de haute qualité à des prix compétitifs. Nous visons à offrir une expérience d'achat agréable et sécurisée à nos chers clients." },
  contactTitle: { ar: "اتصل بنا", fr: "Contactez-nous" },
  contactEmail: { ar: "البريد الإلكتروني: info@mamafatma.ma", fr: "Email: info@mamafatma.ma" },
  contactPhone: { ar: "الهاتف: +212 690-764312", fr: "Téléphone: +212 690-764312" },
  contactAddress: { ar: "العنوان: شارع مكة، العيون، المغرب", fr: "Adresse: AV Mekka, Laayoune, Maroc" },
  close: { ar: "إغلاق", fr: "Fermer" }
};

export default function Footer() {
  const { lang } = useLanguage();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showReturnsModal, setShowReturnsModal] = useState(false);

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[lang as keyof (typeof translations)[typeof key]] || key;
  };

  return (
    <>
      <footer className="bg-[#1F2933] text-white mt-0" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
          {/* Main Footer Content */}
          <div className={clsx(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8",
            lang === 'ar' ? 'lg:grid-flow-col-dense' : ''
          )}>
            {/* Company Info */}
            <div className={clsx("lg:col-span-1", lang === 'ar' ? 'text-right lg:col-start-4' : 'text-left')}>
              <h3 className="text-xl font-bold mb-4 text-green-400">
                {lang === 'ar' ? 'ماما فاطمة' : 'MAMA FATMA'}
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {lang === 'ar' 
                  ? "متجرنا يقدم أفضل المنتجات بأسعار تنافسية وجودة عالية. نضمن لكم تجربة تسوق ممتعة وآمنة."
                  : "Notre boutique propose les meilleurs produits à des prix compétitifs et une qualité élevée. Nous vous garantissons une expérience d'achat agréable et sécurisée."
                }
              </p>
              {/* Social Media */}
              <div className="flex gap-4">
                {/* WhatsApp icon hidden as requested */}
                {/*
                <a href="https://wa.me/212703229471" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center" style={{ width: 48, height: 48 }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </a>
                */}
                <a
  href="https://t.snapchat.com/iBCMuuxx"
  target="_blank"
  rel="noopener noreferrer"
  className="text-gray-300 hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
  style={{ width: 48, height: 48 }}
>
  <Image
    src="/snapchat.png"
    alt="Snapchat"
    width={40}
    height={40}
    style={{
      filter: "invert(88%) sepia(6%) saturate(0%) hue-rotate(180deg) brightness(90%) contrast(90%)",
      display: "block"
    }}
  />
</a>

              </div>
            </div>

            {/* Quick Links */}
            <div className={clsx(
              "lg:col-span-1",
              lang === 'ar' ? 'text-right lg:col-start-1 order-2' : 'text-left order-1')}
            >
              <h4 className="text-lg font-semibold mb-4 text-green-400">{t('quickLinks')}</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-green-400 transition-colors text-sm">{lang === 'ar' ? 'المتجر' : 'Boutique'}</Link></li>
                <li><button onClick={() => setShowAboutModal(true)} className={clsx("text-gray-300 hover:text-green-400 transition-colors text-sm w-full", lang === 'ar' ? 'text-right' : 'text-left')}>{t('about')}</button></li>
                <li><button onClick={() => setShowContactModal(true)} className={clsx("text-gray-300 hover:text-green-400 transition-colors text-sm w-full", lang === 'ar' ? 'text-right' : 'text-left')}>{t('contact')}</button></li>
                <li><Link href="/" className="text-gray-300 hover:text-green-400 transition-colors text-sm">{lang === 'ar' ? 'البحث' : 'Recherche'}</Link></li>
              </ul>
            </div>

            {/* Customer Service - grouped heading and links */}
            <div className={clsx(
              "lg:col-span-1 flex flex-col",
              lang === 'ar' ? 'text-right lg:col-start-2' : 'text-left')}
            >
              <h4 className="text-lg font-semibold mb-4 text-green-400">{t('customerService')}</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setShowShippingModal(true)}
                    className={clsx(
                      "text-gray-300 hover:text-green-400 transition-colors text-sm",
                      lang === 'ar' ? 'w-full text-right' : 'text-left')}
                  >
                    {t('shipping')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowReturnsModal(true)}
                    className={clsx(
                      "text-gray-300 hover:text-green-400 transition-colors text-sm",
                      lang === 'ar' ? 'w-full text-right' : 'text-left')}
                  >
                    {t('returns')}
                  </button>
                </li>
                <li>
                  <a href="/help" className={clsx(
                    "text-gray-300 hover:text-green-400 transition-colors text-sm",
                    lang === 'ar' ? 'w-full text-right' : 'text-left')}
                  >
                    {t('customerSupport')}
                  </a>
                </li>
                <li>
                  <a href="/faq" className={clsx(
                    "text-gray-300 hover:text-green-400 transition-colors text-sm",
                    lang === 'ar' ? 'w-full text-right' : 'text-left')}
                  >
                    {lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter section removed as per request */}
          </div>

          {/* Trust Badges - Improved Layout */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Secure Payment */}
              <div className={clsx("flex flex-col items-center gap-3 text-center p-4 rounded-lg bg-white/5", lang === 'ar' ? 'text-right' : 'text-left')}>
                <LockClosedIcon className="w-8 h-8 text-green-400" />
                <span className="text-gray-300 text-sm font-medium">{t('securePayment')}</span>
              </div>
              {/* Free Shipping */}
              <div className={clsx("flex flex-col items-center gap-3 text-center p-4 rounded-lg bg-white/5", lang === 'ar' ? 'text-right' : 'text-left')}>
                <TruckIcon className="w-8 h-8 text-green-400" />
                <span className="text-gray-300 text-sm font-medium">{t('freeShipping')}</span>
              </div>
              {/* Easy Returns */}
              <div className={clsx("flex flex-col items-center gap-3 text-center p-4 rounded-lg bg-white/5", lang === 'ar' ? 'text-right' : 'text-left')}>
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
                <span className="text-gray-300 text-sm font-medium">{t('easyReturns')}</span>
              </div>
              {/* Customer Support */}
              <div className={clsx("flex flex-col items-center gap-3 text-center p-4 rounded-lg bg-white/5", lang === 'ar' ? 'text-right' : 'text-left')}>
                <PhoneIcon className="w-8 h-8 text-green-400" />
                <span className="text-gray-300 text-sm font-medium">{t('customerSupport')}</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6">
            <div className={clsx("flex flex-col md:flex-row justify-between items-center gap-4", lang === 'ar' ? 'text-right' : 'text-left')}>
              <p className="text-gray-400 text-sm">{t('allRights')}</p>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">{t('privacy')}</a>
                <a href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">{t('terms')}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className={clsx("text-center", lang === 'ar' ? 'text-right' : 'text-left')}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('aboutTitle')}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{t('aboutContent')}</p>
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className={clsx("text-center", lang === 'ar' ? 'text-right' : 'text-left')}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contactTitle')}</h3>
              <div className="space-y-3 mb-6">
                <p className="text-gray-600">{t('contactEmail')}</p>
                <p className={lang === 'ar' ? 'text-gray-600 text-left' : 'text-gray-600'} dir={lang === 'ar' ? 'ltr' : undefined}>{t('contactPhone')}</p>
                <p className="text-gray-600">{t('contactAddress')}</p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/212703229471"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  WhatsApp
                </a>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Modal */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Livraison</h3>
            <p className="text-gray-700 mb-6">La livraison prend 20-30 jours et elle est disponible pour toutes les villes marocaines 🇲🇦</p>
            <button
              onClick={() => setShowShippingModal(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Returns Modal */}
      {showReturnsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {lang === 'ar' ? 'سياسة الإرجاع' : 'Politique de Retour'}
            </h3>
            <p className="text-gray-700 mb-6">
              {lang === 'ar'
                ? 'خدماتنا غير قابلة للاسترجاع أو الإرجاع. يمكنك فقط استرداد المبلغ قبل إرسال المنتج للتوصيل. 🚫'
                : "Nos services ne sont pas remboursables ou repris. Vous ne pouvez obtenir un remboursement que avant l'envoi du produit pour la livraison. 🚫"}
            </p>
            <button
              onClick={() => setShowReturnsModal(false)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
} 