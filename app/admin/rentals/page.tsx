import { db } from '@/lib/db'
import { rentals } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import { AdminNav } from '@/components/admin-nav'
import { products } from '@/lib/products'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendiente',  color: 'text-amber-400 bg-amber-400/10' },
  confirmed: { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10' },
  ready:     { label: 'Listo',      color: 'text-purple-400 bg-purple-400/10' },
  picked:    { label: 'Entregado',  color: 'text-green-400 bg-green-400/10' },
  returned:  { label: 'Devuelto',   color: 'text-foreground bg-secondary' },
  cancelled: { label: 'Cancelado',  color: 'text-red-400 bg-red-400/10' },
}

export const dynamic = 'force-dynamic'

export default async function RentalsPage() {
  const allRentals = await db
    .select()
    .from(rentals)
    .orderBy(desc(rentals.createdAt))

  const counts = allRentals.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})

  const stats = [
    { label: 'Pendientes',  value: counts['pending']   ?? 0, color: 'text-amber-400' },
    { label: 'Confirmados', value: counts['confirmed']  ?? 0, color: 'text-blue-400' },
    { label: 'Listos',      value: counts['ready']      ?? 0, color: 'text-purple-400' },
    { label: 'Entregados',  value: counts['picked']     ?? 0, color: 'text-green-400' },
    { label: 'Total',       value: allRentals.length,         color: 'text-foreground' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Control de alquileres</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gestionar reservas, documentos y entregas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className={`mt-2 text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {allRentals.length === 0 ? (
          <div className="border border-border rounded-sm p-12 text-center">
            <p className="text-sm font-medium text-foreground mb-1">Sin alquileres registrados</p>
            <p className="text-xs text-muted-foreground">
              Cuando los clientes realicen reservas aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  {['Ref.', 'Cliente', 'Equipo', 'Fechas', 'Total', 'Fianza', 'Alquiler', 'Estado', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allRentals.map((rental) => {
                  const product = products.find((p) => p.slug === rental.productId)
                  const ref = `BF-${(rental.orderGroupId ?? rental.id).slice(0, 8).toUpperCase()}`
                  const status = STATUS_LABEL[rental.status] ?? { label: rental.status, color: 'text-foreground bg-secondary' }

                  return (
                    <tr key={rental.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{ref}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground truncate max-w-[150px]">{rental.customerName ?? '—'}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{rental.customerEmail ?? '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="truncate max-w-[180px] text-foreground">{product?.name ?? rental.productId}</p>
                        <p className="text-xs text-muted-foreground">{rental.quantity}×</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {rental.startDate}<br />{rental.endDate}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm font-semibold whitespace-nowrap">
                        {parseFloat(String(rental.totalPrice)).toFixed(2)}€
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${rental.depositStatus === 'paid' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                          {rental.depositStatus === 'paid' ? 'Pagada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${rental.paymentStatus === 'paid' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                          {rental.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/rentals/${rental.id}`}
                          className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline whitespace-nowrap"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
