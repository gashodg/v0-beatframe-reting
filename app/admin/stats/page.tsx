import { products, categories } from '@/lib/products'
import Link from 'next/link'

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Estadisticas</h1>
            <p className="text-muted-foreground mt-1">Metricas y analisis del catalogo</p>
          </div>
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al menu
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Productos</p>
            <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Stock Total</p>
            <p className="text-2xl font-bold text-foreground">{totalStock}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Precio Medio</p>
            <p className="text-2xl font-bold text-foreground">{avgPrice}EUR</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Precio Max</p>
            <p className="text-2xl font-bold text-foreground">{maxPrice}EUR</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Precio Min</p>
            <p className="text-2xl font-bold text-foreground">{minPrice}EUR</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Valor Total/dia</p>
            <p className="text-2xl font-bold text-green-500">{totalValue}EUR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Por Categoria</h3>
            <div className="space-y-3">
              {productsByCategory.map(cat => (
                <div key={cat.slug} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{cat.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{cat.count} productos</span>
                    <span className="text-sm text-muted-foreground">{cat.stock} stock</span>
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(cat.count / totalProducts) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Marcas</h3>
            <div className="space-y-3">
              {topBrands.map(([brand, count]) => (
                <div key={brand} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{brand}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{count} productos</span>
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / totalProducts) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
