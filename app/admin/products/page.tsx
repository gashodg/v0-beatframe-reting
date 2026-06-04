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
          <h1 className="text-3xl font-bold text-foreground">Gestion de Productos</h1>
          <p className="text-muted-foreground mt-1">Editar precios, stock, descripciones y fotos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <p className="text-2xl font-bold text-foreground">{totalProducts}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Categorias</p>
            <p className="text-2xl font-bold text-foreground">{productsByCategory.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Stock Total</p>
            <p className="text-2xl font-bold text-foreground">{totalStock} uds</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Stock Bajo</p>
            <p className="text-2xl font-bold text-amber-500">{lowStockProducts.length}</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-amber-500 mb-2">Productos con stock bajo (2 o menos)</h3>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.map(p => (
                <span key={p.slug} className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-sm">
                  {p.name} ({p.stock})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Products by Category */}
        {productsByCategory.map(category => (
          <div key={category.slug} className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">
              {category.label} ({category.products.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">Producto</th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">Marca</th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">Precio/dia</th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {category.products.map(product => (
                    <tr key={product.slug} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-contain bg-secondary rounded"
                          />
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-xs">{product.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{product.brand}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground">{product.pricePerDay}EUR</span>
                        <span className="text-muted-foreground text-xs">/dia</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${product.stock <= 2 ? 'text-amber-500' : 'text-green-500'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link 
                          href={`/admin/products/${product.slug}`}
                          className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:opacity-90"
                        >
                          Editar
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
