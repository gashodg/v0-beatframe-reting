import Link from "next/link"
import { categories } from "@/lib/products"
import { ArrowRight } from "lucide-react"

export function CategoryStrip() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="flex items-end justify-between gap-8 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">01 — Categorías</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Todo lo que necesitas para salir al aire.
            </h2>
          </div>
          <Link
            href="/productos"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline underline-offset-4"
          >
            Ver todo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-border">
          {categories.map((cat, i) => (
            <li key={cat.slug} className="border-b border-r border-border">
              <Link
                href={`/productos?cat=${cat.slug}`}
                className="group flex h-full flex-col justify-between p-6 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRightIcon />
                </div>
                <div className="mt-10">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                    {cat.label}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-muted-foreground transition-all group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  )
}
