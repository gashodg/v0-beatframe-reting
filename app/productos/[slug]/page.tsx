import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { getProductBySlug, products, getProductsByCategory } from "@/lib/products"
import { ProductPurchasePanel } from "@/components/product-purchase-panel"
import { ProductCard } from "@/components/product-card"

type Params = { slug: string }

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} | BeatFrame`,
    description: product.shortDescription,
  }
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4)

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b border-border">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 md:px-8 py-4">
          <ol className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Inicio
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li>
              <Link href="/productos" className="hover:text-foreground transition-colors">
                Catálogo
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li>
              <Link
                href={`/productos?cat=${product.category}`}
                className="hover:text-foreground transition-colors"
              >
                {product.categoryLabel}
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-foreground truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>
      </div>

      <article className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-card">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
              {product.gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.gallery.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-sm border border-border bg-card">
                      <Image src={img || "/placeholder.svg"} alt="" fill sizes="200px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {product.brand} — {product.categoryLabel}
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-balance">{product.name}</h1>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{product.description}</p>

              <ProductPurchasePanel product={product} />

              {/* Specs */}
              <div className="mt-10">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  Especificaciones
                </h2>
                <dl className="divide-y divide-border border-t border-b border-border">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between py-3">
                      <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                      <dd className="text-sm font-medium text-foreground font-mono">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Includes */}
              <div className="mt-8">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Incluye</h2>
                <ul className="space-y-2">
                  {product.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Otros equipos en {product.categoryLabel}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
