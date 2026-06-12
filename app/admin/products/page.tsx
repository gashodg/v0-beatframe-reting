import { products, categories } from '@/lib/products'
import Link from 'next/link'
import { AdminNav } from '@/components/admin-nav'

export default function ProductsPage() {
  const productsByCategory = categories.map(cat => ({
    ...cat,
    products: products.filter(p => p.category === cat.slug)
  })).filter(cat => cat.products.length > 0)

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock <= 2)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Gestión de productos</h1>
          <p className="text-muted-foreground mt-1 text-sm">Editar precios, stock, descripciones y fotos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-8">
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Productos</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{totalProducts}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Categorías</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{productsByCategory.length}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stock total</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{totalStock} uds</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stock bajo</p>
            <p className="mt-2 text-2xl font-bold text-amber-500">{lowStockProducts.length}</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockProducts.length > 0 && (
          <div className="border border-amber-500/40 bg-amber-500/8 rounded-sm p-4 mb-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-3">
              Stock bajo — 2 unidades o menos
            </h3>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map(p => (
                <span key={p.slug} className="font-mono text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded-sm">
                  {p.name} ({p.stock})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Products by Category */}
        {productsByCategory.map(category => (
          <div key={category.slug} className="mb-10">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 pb-3 border-b border-border">
              {category.label} <span className="text-foreground/40">({category.products.length})</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Producto</th>
                    <th className="pb-3 pr-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Marca</th>
                    <th className="pb-3 pr-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Precio/día</th>
                    <th className="pb-3 pr-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Stock</th>
                    <th className="pb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {category.products.map(product => (
                    <tr key={product.slug} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-contain bg-secondary rounded-sm shrink-0"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{product.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{product.brand}</td>
                      <td className="py-3 pr-4">
                        <span className="font-mono text-sm font-semibold text-foreground">{product.pricePerDay}€</span>
                        <span className="font-mono text-xs text-muted-foreground">/día</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`font-mono text-sm font-semibold ${product.stock <= 2 ? 'text-amber-500' : 'text-green-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors"
                        >
                          Editar →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
