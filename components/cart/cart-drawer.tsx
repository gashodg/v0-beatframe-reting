"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "./cart-provider"
import { cn } from "@/lib/utils"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, updateDays, total } = useCart()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Carrito"
        aria-hidden={!isOpen}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Tu reserva</h2>
            <p className="text-lg font-semibold text-foreground">
              {items.length} {items.length === 1 ? "equipo" : "equipos"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border hover:bg-secondary transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="h-16 w-16 rounded-full border border-border flex items-center justify-center">
              <svg className="h-7 w-7 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3h2l2.4 12.5a2 2 0 0 0 2 1.5h9.2a2 2 0 0 0 2-1.6L22 7H6" />
                <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Añade equipos desde el catálogo para iniciar tu reserva.
              </p>
            </div>
            <Link
              href="/productos"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex h-10 items-center rounded-sm bg-accent px-5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.product.slug} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{item.product.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {item.product.pricePerDay}€ / día
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.slug)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center rounded-sm border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-sm border border-border px-2 h-7">
                          <label htmlFor={`days-${item.product.slug}`} className="sr-only">
                            Días
                          </label>
                          <input
                            id={`days-${item.product.slug}`}
                            type="number"
                            min={1}
                            value={item.days}
                            onChange={(e) => updateDays(item.product.slug, Number.parseInt(e.target.value) || 1)}
                            className="w-10 bg-transparent font-mono text-xs text-center focus:outline-none"
                          />
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            días
                          </span>
                        </div>

                        <span className="ml-auto font-mono text-sm font-semibold text-foreground">
                          {(item.product.pricePerDay * item.quantity * item.days).toFixed(0)}€
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="font-mono text-2xl font-bold text-foreground">{total.toFixed(0)}€</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                IVA no incluido. La fianza y condiciones se detallan en el checkout.
              </p>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-sm bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                Continuar al pago
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-sm border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Seguir explorando
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
