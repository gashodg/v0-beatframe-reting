import { products, categories } from '@/lib/products'
import Link from 'next/link'
import { AdminNav } from '@/components/admin-nav'

export default function AdminPage() {
  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const lowStockProducts = products.filter(p => p.stock <= 2)
  const featuredProducts = products.filter(p => p.featured)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Panel de administración</h1>
          <p className="text-muted-foreground mt-1 text-sm">BeatFrame · Gestión de alquileres audiovisuales</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-8">
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Productos</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{totalProducts}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stock total</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{totalStock}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Categorías</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{categories.length}</p>
          </div>
          <div className="bg-card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stock bajo</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">{lowStockProducts.length}</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockProducts.length > 0 && (
          <div className="border border-amber-500/40 bg-amber-500/8 rounded-sm p-4 mb-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-3">
              Stock bajo — {lowStockProducts.length} productos
            </h3>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.slice(0, 5).map(p => (
                <span key={p.slug} className="font-mono text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded-sm">
                  {p.name} ({p.stock})
                </span>
              ))}
              {lowStockProducts.length > 5 && (
                <span className="font-mono text-xs text-amber-500">+{lowStockProducts.length - 5} más</span>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-border mb-8">
          {[
            { href: '/admin/products', label: 'Gestión de productos', desc: `Editar precios, stock, descripciones y fotos`, meta: `${totalProducts} productos` },
            { href: '/admin/rentals', label: 'Control de alquileres', desc: 'Ver reservas, aprobar documentos, gestionar entregas', meta: 'Ver alquileres' },
            { href: '/admin/documents', label: 'Documentos', desc: 'DNI, contratos y firmas de clientes', meta: 'Ver documentos' },
            { href: '/admin/emails', label: 'Historial de emails', desc: 'Confirmaciones y notificaciones enviadas', meta: 'Ver emails' },
            { href: '/admin/stats', label: 'Estadísticas', desc: 'Ingresos, métricas y análisis', meta: 'Ver estadísticas' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-4 border-b border-border py-4 hover:text-accent transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{item.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground group-hover:text-accent transition-colors shrink-0">{item.meta} →</span>
            </Link>
          ))}
        </div>

        {/* Featured Products */}
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Productos destacados ({featuredProducts.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredProducts.slice(0, 6).map(product => (
              <Link key={product.slug} href={`/admin/products/${product.slug}`} className="group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-16 object-contain bg-secondary rounded-sm mb-2"
                />
                <p className="text-xs font-medium text-foreground truncate group-hover:text-accent transition-colors">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.pricePerDay}€/día</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
