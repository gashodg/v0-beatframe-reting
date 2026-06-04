import Link from 'next/link'
import { AdminNav } from '@/components/admin-nav'

export default function RentalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Control de Alquileres</h1>
          <p className="text-muted-foreground mt-1">Gestionar reservas, documentos y entregas</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-bold text-amber-500">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Confirmados</p>
            <p className="text-2xl font-bold text-blue-500">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Entregados</p>
            <p className="text-2xl font-bold text-green-500">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Devueltos</p>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">0</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground mb-2">No hay alquileres registrados</p>
          <p className="text-sm text-muted-foreground">
            Cuando los clientes realicen reservas desde la web, apareceran aqui para su gestion
          </p>
        </div>
      </div>
    </div>
  )
}
