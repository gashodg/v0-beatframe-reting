import Link from "next/link"
import { getFeaturedProducts } from "@/lib/products"
import { ProductCard } from "./product-card"
import { ArrowRight } from "lucide-react"

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">02 — Destacados</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Equipos más reservados esta temporada.
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline underline-offset-4"
          >
            Catálogo completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
