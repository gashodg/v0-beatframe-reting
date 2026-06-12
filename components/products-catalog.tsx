"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useMemo } from "react"
import { products, categories, type ProductCategory } from "@/lib/products"
import { ProductCard } from "./product-card"
import { cn } from "@/lib/utils"

export function ProductsCatalog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const activeCat = searchParams.get("cat") as ProductCategory | null

  const filtered = useMemo(() => {
    if (!activeCat) return products
    return products.filter((p) => p.category === activeCat)
  }, [activeCat])

  const setCategory = (cat: ProductCategory | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set("cat", cat)
    } else {
      params.delete("cat")
    }
    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false })
  }

  return (
    <div>
      <div className="mb-8 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pb-2">
          <FilterChip active={!activeCat} onClick={() => setCategory(null)}>
            Todo ({products.length})
          </FilterChip>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length
            return (
              <FilterChip key={cat.slug} active={activeCat === cat.slug} onClick={() => setCategory(cat.slug)}>
                {cat.label} <span className="font-mono text-[10px] opacity-60 ml-1">({count})</span>
              </FilterChip>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center h-9 rounded-sm border px-4 text-xs font-medium transition-colors whitespace-nowrap",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background text-foreground hover:bg-secondary",
      )}
    >
      {children}
    </button>
  )
}
