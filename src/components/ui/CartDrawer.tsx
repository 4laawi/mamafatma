"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cartItems, removeFromCart, clearCart, addToCart, decrementCart } = useCart();
  const { lang } = useLanguage();
  const total = cartItems.reduce((sum, item) => sum + (item.product.promo_price || item.product.price) * item.quantity, 0);

  // WhatsApp owner number (replace with actual number if needed)
  const ownerNumber = '212703229471'; // Example: Morocco country code
  // Compose message for all cart items
  const waMessage = cartItems.map(item =>
    lang === 'ar'
      ? `مرحبًا، أنا مهتم بشراء المنتج التالي: *${item.product.name_ar}*\nبالمواصفة التالية: *${item.variant ? (item.variant.color || '') + (item.variant.size ? ' ' + item.variant.size : '') : 'عادي'}*\nكيف أتمم الطلب؟ شكرًا!`
      : `Bonjour, je suis intéressé(e) par l'article suivant : *${item.product.name_fr}*, de la variante : *${item.variant ? (item.variant.color || '') + (item.variant.size ? ' ' + item.variant.size : '') : 'Standard'}*. Pourriez-vous me donner plus d'informations ou comment procéder à l'achat ? Merci !`
  ).join('\n\n');
  const waUrl = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className={`fixed inset-0 z-50 transition-all ${open ? "bg-black/40" : "pointer-events-none bg-transparent"}`}
      style={{ display: open ? 'block' : 'none' }}
      onClick={onClose}
    >
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{lang === 'ar' ? 'عربة التسوق' : 'Panier'}</h2>
          <button className="text-2xl font-bold text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
        </div>
        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">{lang === 'ar' ? 'سلة التسوق فارغة.' : 'Votre panier est vide.'}</div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {cartItems.map((item, i) => (
                <div key={i} className={
                  lang === 'ar'
                    ? 'flex flex-row-reverse items-center gap-4 border-b border-gray-200 py-4'
                    : 'flex items-center gap-4 border-b border-gray-200 py-4'
                }>
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.product.image_urls?.[0] || "/vercel.svg"}
                      alt={lang === 'ar' ? item.product.name_ar : item.product.name_fr}
                      fill
                      className="object-cover rounded-xl border border-gray-200 shadow-sm"
                      sizes="64px"
                      quality={75}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-1" style={lang === 'ar' ? { textAlign: 'right', fontFamily: 'var(--font-cairo)' } : {}}>
                    <div className="font-bold text-base leading-tight">
                      {lang === 'ar' ? item.product.name_ar : item.product.name_fr}
                    </div>
                    <div className="flex gap-2 mt-1 mb-1" style={lang === 'ar' ? { justifyContent: 'flex-end' } : {}}>
                      {item.variant && (
                        <div className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-green-700 text-xs font-semibold">
                          {lang === 'ar'
                            ? `${item.variant.color_ar || item.variant.color || ''}${item.variant.size ? ' ' + item.variant.size : ''}`
                            : `${item.variant.color || ''}${item.variant.size ? ' ' + item.variant.size : ''}`}
                        </div>
                      )}
                      {item.product.brand && (
                        <div className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-green-700 text-xs font-semibold">
                          {lang === 'ar' ? item.product.brand_ar || item.product.brand : item.product.brand}
                        </div>
                      )}
                    </div>
                    <div className="text-green-700 font-extrabold text-base" style={lang === 'ar' ? { textAlign: 'right' } : {}}>
                      {item.product.promo_price || item.product.price} Dhs
                    </div>
                    <div className={lang === 'ar' ? 'flex flex-row-reverse items-center gap-3 mt-2' : 'flex items-center gap-3 mt-2'}>
                      <button
                        className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center transition-all"
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeFromCart(item.product.id, item.variant?.id);
                          } else {
                            decrementCart(item.product, item.variant);
                          }
                        }}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-lg font-bold w-8 text-center select-none">{item.quantity}</span>
                      <button
                        className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 text-xl font-bold flex items-center justify-center transition-all"
                        onClick={() => addToCart(item.product, item.variant)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Remove button: left in Arabic, right in French */}
                  {lang === 'ar' ? (
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-red-500 hover:text-red-700 text-lg ml-2 transition-all shadow-sm" onClick={() => removeFromCart(item.product.id, item.variant?.id)} aria-label="إزالة المنتج من السلة">
                      &times;
                    </button>
                  ) : (
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-red-500 hover:text-red-700 text-lg transition-all shadow-sm" onClick={() => removeFromCart(item.product.id, item.variant?.id)} aria-label="Remove item from cart">
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-bold text-lg mb-3">
                <span>{lang === 'ar' ? 'المجموع' : 'Total'}</span>
                <span>{total} Dhs</span>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg text-lg transition-all mb-2 flex items-center justify-center gap-2"
              >
                {lang === 'ar' ? null : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.13L4 29l7.13-2.36A11.93 11.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.56-1.5l-.39-.23-4.23 1.4 1.4-4.23-.23-.39A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
                  </svg>
                )}
                <span>{lang === 'ar' ? 'تأكيد الطلب' : 'Valider la commande'}</span>
                {lang === 'ar' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.637.86 5.08 2.36 7.13L4 29l7.13-2.36A11.93 11.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.89-.52-5.56-1.5l-.39-.23-4.23 1.4 1.4-4.23-.23-.39A9.94 9.94 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.98 2.67 1.12 2.85c.14.18 1.93 2.95 4.68 4.02.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
                  </svg>
                ) : null}
              </a>
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-xl text-sm" onClick={clearCart}>{lang === 'ar' ? 'إفراغ السلة' : 'Vider le panier'}</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
} 