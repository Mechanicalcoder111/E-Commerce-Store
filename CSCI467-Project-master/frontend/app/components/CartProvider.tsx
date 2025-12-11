"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Cart = Record<string, number>;

type CartContextType = {
  cart: Cart;
  addToCart: (key: string) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);

  function addToCart(key: string) {
    setCart((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  }

  function removeFromCart(key: string) {
    setCart((prev) => {
      const current = prev[key] || 0;
      if (current <= 1) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: current - 1 };
    });
  }

  function clearCart() {
    setCart({});
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
