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
          
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-secondary rounded">
              <p className="font-medium text-foreground">Dashboard Admin</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ver estadísticas y gestionar alquileres
              </p>
            </div>

            <div className="p-3 bg-secondary rounded">
              <p className="font-medium text-foreground">Gestión de Productos</p>
              <p className="text-muted-foreground text-xs mt-1">
                Editar precios, stock, descripciones y fotos
              </p>
            </div>

            <div className="p-3 bg-secondary rounded">
              <p className="font-medium text-foreground">Control de Alquileres</p>
              <p className="text-muted-foreground text-xs mt-1">
                Ver estado de reservas y procesar documentos
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-4">
              El sistema de admin está en desarrollo. Las funcionalidades principales incluyen:
            </p>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>✓ Gestión de catálogo</li>
              <li>✓ Control de alquileres y estados</li>
              <li>✓ Gestión de documentos y firmas</li>
              <li>✓ Historial de emails</li>
              <li>✓ Estadísticas y reportes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
