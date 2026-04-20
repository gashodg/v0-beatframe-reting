import type { Metadata } from "next"
import { Suspense } from "react"
import { ProductsCatalog } from "@/components/products-catalog"

export const metadata: Metadata = {
  title: "Catálogo de equipos | BeatFrame",
  description:
    "Todo el catálogo de renting audiovisual de BeatFrame: cámaras, mixers, luces, transmisores inalámbricos y más.",
}

export default function ProductsPage() {
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Catálogo</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Equipo profesional listo para reservar.
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
            Explora nuestro inventario por categoría. Todos los precios son por día de alquiler, IVA no incluido. La
            fianza se calcula en función del pack reservado.
          </p>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse bg-secondary rounded-sm" />}>
          <ProductsCatalog />
        </Suspense>
      </div>
    </div>
  )
}
