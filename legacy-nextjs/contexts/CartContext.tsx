"use client";

import * as React from "react";
import type { CartItem } from "@/lib/cart-types";
import type { ProductWithPricing } from "@/lib/catalog-types";

const STORAGE_KEY = "seguridad-avanzada-cart";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: ProductWithPricing, quantity?: number) => void;
  removeItem: (sku: string) => void;
  increaseQuantity: (sku: string) => void;
  decreaseQuantity: (sku: string) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setItems(loadFromStorage());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) saveToStorage(items);
  }, [items, mounted]);

  const totalItems = React.useMemo(
    () => items.reduce((sum, i) => sum + i.cantidad, 0),
    [items]
  );

  const subtotal = React.useMemo(
    () => items.reduce((sum, i) => sum + i.precioMxn * i.cantidad, 0),
    [items]
  );

  const addItem = React.useCallback(
    (product: ProductWithPricing, quantity = 1) => {
      const precio = product.precioConMargenMxn ?? product.precio ?? 0;
      const desc = product.descripcion ?? product.titulo ?? product.sku;

      setItems((prev) => {
        const existing = prev.find((i) => i.sku === product.sku);
        if (existing) {
          return prev.map((i) =>
            i.sku === product.sku
              ? { ...i, cantidad: i.cantidad + quantity }
              : i
          );
        }
        return [
          ...prev,
          {
            sku: product.sku,
            descripcion: desc,
            imagen: product.imagen,
            precioMxn: precio,
            cantidad: quantity,
          },
        ];
      });
    },
    []
  );

  const removeItem = React.useCallback((sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const increaseQuantity = React.useCallback((sku: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.sku === sku ? { ...i, cantidad: i.cantidad + 1 } : i
      )
    );
  }, []);

  const decreaseQuantity = React.useCallback((sku: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.sku === sku);
      if (!item) return prev;
      if (item.cantidad <= 1) return prev.filter((i) => i.sku !== sku);
      return prev.map((i) =>
        i.sku === sku ? { ...i, cantidad: i.cantidad - 1 } : i
      );
    });
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
  }, []);

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
