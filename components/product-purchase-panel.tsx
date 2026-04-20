"use client"

import { useState } from "react"
import { Minus, Plus, ShoppingBag, Check } from "lucide-react"
import type { Product } from "@/lib/products"
import { useCart } from "./cart/cart-provider"

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [days, setDays] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const subtotal = product.pricePerDay * days * quantity

  const handleAdd = () => {
    addItem(product, quantity, days)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="mt-8 rounded-sm border border-border bg-card p-5">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <span className="font-mono text-3xl font-bold text-foreground">{product.pricePerDay}€</span>
          <span className="font-mono text-sm text-muted-foreground ml-1">/día</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{product.stock} en stock</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Días
          </label>
          <div className="inline-flex w-full items-center rounded-sm border border-border">
            <button
              type="button"
              onClick={() => setDays((d) => Math.max(1, d - 1))}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reducir días"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="flex-1 bg-transparent text-center font-mono text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setDays((d) => d + 1)}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Aumentar días"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Unidades
          </label>
          <div className="inline-flex w-full items-center rounded-sm border border-border">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reducir cantidad"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number.parseInt(e.target.value) || 1)))}
              className="flex-1 bg-transparent text-center font-mono text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-t border-border mb-4">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Subtotal</span>
        <span className="font-mono text-xl font-bold text-foreground">{subtotal.toFixed(0)}€</span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Añadido al carrito
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" /> Añadir al carrito
          </>
        )}
      </button>
      <p className="mt-3 text-xs text-muted-foreground text-center">
        Recogida en Poblenou o entrega en Barcelona. Fianza aplicable al confirmar.
      </p>
    </div>
  )
}
