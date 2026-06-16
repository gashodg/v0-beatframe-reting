import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { rentals, email_logs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AdminNav } from '@/components/admin-nav'
import { products } from '@/lib/products'
import { revalidatePath } from 'next/cache'
import { sendStatusUpdateEmail } from '@/lib/email-templates'

export const dynamic = 'force-dynamic'

const STATUS_FLOW = ['pending', 'confirmed', 'ready', 'picked', 'returned'] as const

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pendiente',  color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  confirmed: { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  ready:     { label: 'Listo',      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  picked:    { label: 'Entregado',  color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  returned:  { label: 'Devuelto',   color: 'text-foreground bg-secondary border-border' },
  cancelled: { label: 'Cancelado',  color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

async function updateRentalStatus(id: string, newStatus: string) {
  'use server'

  const rental = await db.select().from(rentals).where(eq(rentals.id, id)).limit(1)
  if (!rental[0]) return

  await db
    .update(rentals)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(rentals.id, id))

  // Send status email to client
  const r = rental[0]
  if (r.customerEmail) {
    const refCode = `BF-${(r.orderGroupId ?? r.id).slice(0, 8).toUpperCase()}`
    await sendStatusUpdateEmail({
      to: r.customerEmail,
      customerName: r.customerName ?? '',
      refCode,
      newStatus,
      pickupDate: r.startDate,
    }).catch(console.error)

    await db.insert(email_logs).values({
      id: crypto.randomUUID(),
      rentalId: id,
      emailType: `status_${newStatus}`,
      recipientEmail: r.customerEmail,
      status: 'sent',
    }).catch(console.error)
  }

  revalidatePath(`/admin/rentals/${id}`)
  revalidatePath('/admin/rentals')
  redirect(`/admin/rentals/${id}`)
}

export default async function RentalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const result = await db.select().from(rentals).where(eq(rentals.id, id)).limit(1)
  const rental = result[0]
  if (!rental) notFound()

  const product = products.find((p) => p.slug === rental.productId)
  const refCode = `BF-${(rental.orderGroupId ?? rental.id).slice(0, 8).toUpperCase()}`
  const status = STATUS_LABEL[rental.status] ?? { label: rental.status, color: 'text-foreground bg-secondary border-border' }

  const currentIdx = STATUS_FLOW.indexOf(rental.status as typeof STATUS_FLOW[number])
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : null

  const updateWithId = updateRentalStatus.bind(null, rental.id)

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link href="/admin/rentals" className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors">
              ← Alquileres
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-foreground">{refCode}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(rental.createdAt).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          <span className={`inline-flex items-center rounded-sm border px-3 py-1 font-mono text-xs uppercase tracking-widest ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Client info */}
          <div className="rounded-sm border border-border bg-card p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Cliente</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Nombre" value={rental.customerName ?? '—'} />
              <Row label="Email" value={rental.customerEmail ?? '—'} />
              <Row label="Teléfono" value={rental.customerPhone ?? '—'} />
              {rental.customerCompany && <Row label="Empresa" value={rental.customerCompany} />}
              {rental.customerCIF && <Row label="CIF/NIF" value={rental.customerCIF} />}
            </dl>
          </div>

          {/* Rental info */}
          <div className="rounded-sm border border-border bg-card p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Reserva</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Equipo" value={product?.name ?? rental.productId} />
              <Row label="Cantidad" value={`${rental.quantity}×`} />
              <Row label="Recogida" value={rental.startDate} />
              <Row label="Devolución" value={rental.endDate} />
              <Row label="Total" value={`${parseFloat(String(rental.totalPrice)).toFixed(2)}€ (IVA incl.)`} />
              <Row label="Alquiler" value={rental.paymentStatus === 'paid' ? '✓ Pagado' : '⏳ Pendiente de pago'} />
              <Row label="Fianza 100€" value={rental.depositStatus === 'paid' ? '✓ Pagada' : '⏳ Pendiente de pago'} />
            </dl>
          </div>
        </div>

        {rental.notes && (
          <div className="rounded-sm border border-border bg-card p-5 mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Notas del cliente</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">{rental.notes}</p>
          </div>
        )}

        {/* Stripe reference */}
        {rental.stripePaymentId && (
          <div className="rounded-sm border border-border bg-card p-5 mb-8">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Referencia de pago</h2>
            <p className="font-mono text-xs text-muted-foreground break-all">{rental.stripePaymentId}</p>
          </div>
        )}

        {/* Status management */}
        <div className="rounded-sm border border-border bg-card p-5 mb-6">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Gestión de estado</h2>

          {/* Progress bar */}
          <div className="flex items-center gap-0 mb-6 overflow-x-auto">
            {STATUS_FLOW.map((s, idx) => {
              const isActive = s === rental.status
              const isPast = STATUS_FLOW.indexOf(rental.status as typeof STATUS_FLOW[number]) > idx
              const cfg = STATUS_LABEL[s]
              return (
                <div key={s} className="flex items-center min-w-0">
                  <div className={`rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap border ${
                    isActive ? cfg.color : isPast ? 'text-muted-foreground bg-secondary/50 border-border opacity-60' : 'text-muted-foreground bg-transparent border-border opacity-40'
                  }`}>
                    {cfg.label}
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div className={`h-px w-4 shrink-0 ${isPast || isActive ? 'bg-accent' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {nextStatus && (
            <form action={updateWithId.bind(null, nextStatus)}>
              <button
                type="submit"
                className="h-11 rounded-sm bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                Marcar como {STATUS_LABEL[nextStatus]?.label ?? nextStatus} →
              </button>
            </form>
          )}

          {rental.status !== 'cancelled' && rental.status !== 'returned' && (
            <form action={updateWithId.bind(null, 'cancelled')} className="mt-3">
              <button
                type="submit"
                className="h-9 rounded-sm border border-red-500/30 px-4 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Cancelar alquiler
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-24 shrink-0 pt-0.5">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  )
}
