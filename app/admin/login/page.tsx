import Link from "next/link"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Admin BeatFrame
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestión de alquileres y productos
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-foreground mb-4">
            Sistema de administración para BeatFrame - Renting Audiovisual
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/admin"
              className="block p-4 bg-secondary hover:bg-secondary/80 rounded border border-transparent hover:border-accent transition-all"
            >
              <p className="font-medium text-foreground">Dashboard Admin</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ver estadísticas y gestionar alquileres
              </p>
            </Link>

            <Link 
              href="/admin/products"
              className="block p-4 bg-secondary hover:bg-secondary/80 rounded border border-transparent hover:border-accent transition-all"
            >
              <p className="font-medium text-foreground">Gestión de Productos</p>
              <p className="text-muted-foreground text-xs mt-1">
                Editar precios, stock, descripciones y fotos
              </p>
            </Link>

            <Link 
              href="/admin/rentals"
              className="block p-4 bg-secondary hover:bg-secondary/80 rounded border border-transparent hover:border-accent transition-all"
            >
              <p className="font-medium text-foreground">Control de Alquileres</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ver estado de reservas y procesar documentos
              </p>
            </Link>

            <Link 
              href="/admin/documents"
              className="block p-4 bg-secondary hover:bg-secondary/80 rounded border border-transparent hover:border-accent transition-all"
            >
              <p className="font-medium text-foreground">Documentos</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ver DNI, contratos y firmas de clientes
              </p>
            </Link>

            <Link 
              href="/admin/emails"
              className="block p-4 bg-secondary hover:bg-secondary/80 rounded border border-transparent hover:border-accent transition-all"
            >
              <p className="font-medium text-foreground">Historial de Emails</p>
              <p className="text-muted-foreground text-xs mt-1">
                Confirmaciones y notificaciones enviadas
              </p>
            </Link>

            <Link 
              href="/admin/stats"
              className="block p-4 bg-secondary hover:bg-secondary/80 rounded border border-transparent hover:border-accent transition-all"
            >
              <p className="font-medium text-foreground">Estadísticas</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ingresos y métricas del negocio
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
