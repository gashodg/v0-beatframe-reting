import Link from 'next/link'

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion de Documentos</h1>
            <p className="text-muted-foreground mt-1">DNI, contratos y firmas de clientes</p>
          </div>
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al menu
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pendientes de revision</p>
            <p className="text-2xl font-bold text-amber-500">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Aprobados</p>
            <p className="text-2xl font-bold text-green-500">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Rechazados</p>
            <p className="text-2xl font-bold text-red-500">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-2">No hay documentos para revisar</p>
          <p className="text-sm text-muted-foreground">
            Cuando los clientes suban su DNI o firmen contratos, apareceran aqui para su aprobacion
          </p>
        </div>
      </div>
    </div>
  )
}
