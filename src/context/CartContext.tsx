'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  product: any;
  variant?: any;
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (product: any, variant?: any) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  decrementCart: (product: any, variant?: any) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: any, variant?: any) => {
    setCartItems(prev => {
      // Check if item already exists (by product and variant)
      const idx = prev.findIndex(item =>
        item.product.id === product.id &&
        (!variant || item.variant?.id === variant?.id)
      );
      if (idx > -1) {
        // Create a new object for the updated item (no mutation)
        return prev.map((item, i) =>
          i === idx
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCartItems(prev => prev.filter(item =>
      item.product.id !== productId || (variantId && item.variant?.id !== variantId)
    ));
  };

  const clearCart = () => setCartItems([]);

  const decrementCart = (product: any, variant?: any) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item =>
        item.product.id === product.id &&
        (!variant || item.variant?.id === variant?.id)
      );
      if (idx > -1) {
        if (prev[idx].quantity > 1) {
          // Create a new object for the updated item (no mutation)
          return prev.map((item, i) =>
            i === idx
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        } else {
          // Remove item if quantity is 1
          return prev.filter((_, i) => i !== idx);
        }
      }
      return prev;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, decrementCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}; 