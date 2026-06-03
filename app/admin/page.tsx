export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            BeatFrame - Sistema de gestión de alquileres audiovisuales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-border bg-card rounded-lg p-6 hover:border-accent transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Alquileres
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gestiona todos los alquileres, revisa estados y documentos
            </p>
            <a
              href="/admin/rentals"
              className="inline-flex h-9 items-center rounded px-4 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Ir a Alquileres
            </a>
          </div>

          <div className="border border-border bg-card rounded-lg p-6 hover:border-accent transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Productos
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Edita precios, stock, descripciones y fotos del catálogo
            </p>
            <a
              href="/admin/products"
              className="inline-flex h-9 items-center rounded px-4 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Ir a Productos
            </a>
          </div>

          <div className="border border-border bg-card rounded-lg p-6 hover:border-accent transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Documentos
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Revisa DNI, contratos y firmas de clientes
            </p>
            <a
              href="/admin/documents"
              className="inline-flex h-9 items-center rounded px-4 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Ir a Documentos
            </a>
          </div>

          <div className="border border-border bg-card rounded-lg p-6 hover:border-accent transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Emails
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Historial de confirmaciones y notificaciones enviadas
            </p>
            <a
              href="/admin/emails"
              className="inline-flex h-9 items-center rounded px-4 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Ir a Emails
            </a>
          </div>

          <div className="border border-border bg-card rounded-lg p-6 hover:border-accent transition-colors">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Estadísticas
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ingresos, alquileres activos y métricas importantes
            </p>
            <a
              href="/admin/stats"
              className="inline-flex h-9 items-center rounded px-4 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Ir a Estadísticas
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
