import { products, categories } from '@/lib/products'
import { AdminNav } from '@/components/admin-nav'

export default function StatsPage() {
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const avgPrice = Math.round(products.reduce((sum, p) => sum + p.pricePerDay, 0) / products.length)
  const maxPrice = Math.max(...products.map(p => p.pricePerDay))
  const minPrice = Math.min(...products.map(p => p.pricePerDay))
  const totalValue = products.reduce((sum, p) => sum + (p.pricePerDay * p.stock), 0)

  const productsByCategory = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category === cat.slug).length,
    stock: products.filter(p => p.category === cat.slug).reduce((sum, p) => sum + p.stock, 0)
  })).filter(cat => cat.count > 0).sort((a, b) => b.count - a.count)

  const brandStats = products.reduce((acc, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBrands = Object.entries(brandStats).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Estadísticas</h1>
          <p className="text-muted-foreground mt-1 text-sm">Métricas y análisis del catálogo</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border mb-8">
          {[
            { label: 'Productos', value: totalProducts, color: 'text-foreground' },
            { label: 'Stock total', value: totalStock, color: 'text-foreground' },
            { label: 'Precio medio', value: `${avgPrice}€`, color: 'text-foreground' },
            { label: 'Precio máx.', value: `${maxPrice}€`, color: 'text-foreground' },
            { label: 'Precio mín.', value: `${minPrice}€`, color: 'text-foreground' },
            { label: 'Valor/día', value: `${totalValue}€`, color: 'text-green-400' },
          ].map(item => (
            <div key={item.label} className="bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-border rounded-sm p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">Por categoría</h3>
            <div className="space-y-3">
              {productsByCategory.map(cat => (
                <div key={cat.slug} className="flex items-center gap-4">
                  <span className="text-sm text-foreground w-40 shrink-0 truncate">{cat.label}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(cat.count / totalProducts) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-16 text-right shrink-0">
                    {cat.count} prod.
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border rounded-sm p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">Top marcas</h3>
            <div className="space-y-3">
              {topBrands.map(([brand, count]) => (
                <div key={brand} className="flex items-center gap-4">
                  <span className="text-sm text-foreground w-40 shrink-0 truncate">{brand}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(count / totalProducts) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-16 text-right shrink-0">
                    {count} prod.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
