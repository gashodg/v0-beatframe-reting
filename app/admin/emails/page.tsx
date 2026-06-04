import Link from 'next/link'

export default function EmailsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historial de Emails</h1>
            <p className="text-muted-foreground mt-1">Confirmaciones y notificaciones enviadas</p>
          </div>
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al menu
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Confirmaciones</p>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Recordatorios</p>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Notificaciones</p>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Enviados</p>
            <p className="text-2xl font-bold text-green-500">0</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-2">No hay emails enviados</p>
          <p className="text-sm text-muted-foreground">
            Cuando se envien confirmaciones de alquiler, recordatorios o notificaciones, apareceran aqui
          </p>
        </div>
      </div>
    </div>
  )
}
