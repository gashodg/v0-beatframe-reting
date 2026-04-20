"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo } from "react"
import type { Product } from "@/lib/products"

export type CartItem = {
  product: Product
  quantity: number
  days: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, days?: number) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  updateDays: (slug: string, days: number) => void
  clear: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product: Product, quantity = 1, days = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.slug === product.slug)
      if (existing) {
        return prev.map((i) =>
          i.product.slug === product.slug ? { ...i, quantity: i.quantity + quantity, days: Math.max(i.days, days) } : i,
        )
      }
      return [...prev, { product, quantity, days }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.product.slug !== slug))
  }, [])

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.product.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0),
    )
  }, [])

  const updateDays = useCallback((slug: string, days: number) => {
    setItems((prev) => prev.map((i) => (i.product.slug === slug ? { ...i, days: Math.max(1, days) } : i)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const { total, count } = useMemo(() => {
    const total = items.reduce((sum, i) => sum + i.product.pricePerDay * i.quantity * i.days, 0)
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    return { total, count }
  }, [items])

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateDays,
    clear,
    isOpen,
    setIsOpen,
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
