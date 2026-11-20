"use client";
import React, { createContext, useContext, useState } from "react";

export interface Product {
  id: number;
  sku: string;
  name: string;
  brand: string;
  price: number;
  old_price?: number;
  stock: number;
  rating: number;
  reviews_count: number;
  image_url: string;
  specs: Record<string, string>;
  category_id: number;
}

interface StoreContextType {
  cart: { product: Product; qty: number }[];
  favorites: Product[];
  compare: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleFavorite: (p: Product) => void;
  toggleCompare: (p: Product) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [compare, setCompare] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.product.id !== id));
  const clearCart = () => setCart([]);

  const toggleFavorite = (p: Product) => {
    setFavorites((prev) => prev.some((i) => i.id === p.id) ? prev.filter((i) => i.id !== p.id) : [...prev, p]);
  };

  const toggleCompare = (p: Product) => {
    setCompare((prev) => prev.some((i) => i.id === p.id) ? prev.filter((i) => i.id !== p.id) : [...prev, p]);
  };

  return (
    <StoreContext.Provider value={{ cart, favorites, compare, addToCart, removeFromCart, clearCart, toggleFavorite, toggleCompare }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext)!;
