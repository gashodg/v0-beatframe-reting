"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "./cart-provider"

export function CartButton() {
  const { count, setIsOpen } = useCart()

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="relative inline-flex h-9 items-center gap-2 rounded-sm border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      aria-label={`Carrito con ${count} artículos`}
    >
      <ShoppingBag className="h-4 w-4" />
      <span className="hidden sm:inline">Carrito</span>
      {count > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[10px] font-semibold text-accent-foreground">
          {count}
        </span>
      )}
    </button>
  )
}
