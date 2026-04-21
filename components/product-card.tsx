import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-accent/60"
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden",
          product.whiteBg ? "bg-[#ece8df]" : "bg-secondary",
        )}
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn(
            "transition-transform duration-500 group-hover:scale-105",
            product.whiteBg ? "object-contain p-4 mix-blend-multiply" : "object-cover",
          )}
        />
        <div className="absolute left-3 top-3 inline-flex items-center rounded-sm bg-background/80 backdrop-blur px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {product.categoryLabel}
        </div>
        <div className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-sm bg-background/80 backdrop-blur text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="text-base font-semibold leading-tight text-foreground group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
        <div className="mt-auto flex items-baseline justify-between pt-3 border-t border-border">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-lg font-bold text-foreground">{product.pricePerDay}€</span>
            <span className="font-mono text-xs text-muted-foreground">/día</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {product.stock} disp.
          </span>
        </div>
      </div>
    </Link>
  )
}
