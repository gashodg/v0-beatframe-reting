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
          <h1 className="text-3xl font-bold text-foreground">Panel de Administracion</h1>
          <p className="text-muted-foreground mt-1">BeatFrame - Sistema de gestion de alquileres audiovisuales</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Productos</p>
            <p className="text-3xl font-bold text-foreground">{totalProducts}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Stock Total</p>
            <p className="text-3xl font-bold text-foreground">{totalStock}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Categorias</p>
            <p className="text-3xl font-bold text-foreground">{categories.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Stock Bajo</p>
            <p className="text-3xl font-bold text-amber-500">{lowStockProducts.length}</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-amber-500 mb-2">Alerta: Productos con stock bajo</h3>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.slice(0, 5).map(p => (
                <span key={p.slug} className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-sm">
                  {p.name} ({p.stock})
                </span>
              ))}
              {lowStockProducts.length > 5 && (
                <span className="text-amber-500 text-sm">+{lowStockProducts.length - 5} mas</span>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products" className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">Gestion de Productos</h3>
            <p className="text-sm text-muted-foreground mb-4">Editar precios, stock, descripciones y fotos</p>
            <span className="text-primary text-sm font-medium">Ver {totalProducts} productos</span>
          </Link>

          <Link href="/admin/rentals" className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">Control de Alquileres</h3>
            <p className="text-sm text-muted-foreground mb-4">Ver reservas, aprobar documentos, gestionar entregas</p>
            <span className="text-primary text-sm font-medium">Ver alquileres</span>
          </Link>

          <Link href="/admin/documents" className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">Documentos</h3>
            <p className="text-sm text-muted-foreground mb-4">DNI, contratos y firmas de clientes</p>
            <span className="text-primary text-sm font-medium">Ver documentos</span>
          </Link>

          <Link href="/admin/emails" className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">Historial de Emails</h3>
            <p className="text-sm text-muted-foreground mb-4">Confirmaciones y notificaciones enviadas</p>
            <span className="text-primary text-sm font-medium">Ver emails</span>
          </Link>

          <Link href="/admin/stats" className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">Estadisticas</h3>
            <p className="text-sm text-muted-foreground mb-4">Ingresos, metricas y analisis</p>
            <span className="text-primary text-sm font-medium">Ver estadisticas</span>
          </Link>
        </div>

        {/* Featured Products */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Productos Destacados ({featuredProducts.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredProducts.slice(0, 6).map(product => (
              <div key={product.slug} className="text-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-20 object-contain bg-secondary rounded mb-2"
                />
                <p className="text-xs text-foreground truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.pricePerDay}EUR/dia</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
