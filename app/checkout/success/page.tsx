import { redirect } from "next/navigation"
import Link from "next/link"
import { Check, Package, Calendar, Mail } from "lucide-react"
import { confirmOrderBySession } from "@/app/actions/checkout"
import { sendOrderConfirmationEmail } from "@/lib/email-templates"
import { products } from "@/lib/products"

export const metadata = {
  title: "Reserva confirmada | BeatFrame",
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) redirect("/")

  const result = await confirmOrderBySession(session_id)

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground text-sm">
          No se encontró la sesión de pago. Si completaste el pago, revisa tu email en unos minutos.
        </p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-sm border border-border px-6 text-sm font-medium hover:bg-secondary transition-colors">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const { session, orderRentals } = result
  const firstRental = orderRentals[0]
  const customerEmail = firstRental?.customerEmail ?? (session.customer_email ?? "")
  const customerName = firstRental?.customerName ?? ""
  const refCode = `BF-${(firstRental?.orderGroupId ?? session.id).slice(0, 8).toUpperCase()}`

  // Send confirmation email (non-blocking, best-effort)
  if (customerEmail && orderRentals.length > 0) {
    const itemLines = orderRentals.map((r) => {
      const product = products.find((p) => p.slug === r.productId)
      return {
        name: product?.name ?? r.productId,
        quantity: r.quantity,
        days: Math.ceil(
          (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86_400_000
        ) || 1,
        total: parseFloat(String(r.totalPrice)),
      }
    })

    sendOrderConfirmationEmail({
      to: customerEmail,
      customerName,
      refCode,
      pickupDate: firstRental?.startDate ?? "",
      returnDate: firstRental?.endDate ?? "",
      items: itemLines,
      totalWithIVA: itemLines.reduce((s, i) => s + i.total, 0),
    }).catch(console.error)
  }

  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-2xl px-4 py-24">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 mb-8">
          <Check className="h-6 w-6 text-accent" />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Pago confirmado</p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Reserva completada</h1>
        <p className="text-muted-foreground mb-2">
          Hemos recibido tu pedido y te enviaremos un email de confirmación a{" "}
          <span className="text-foreground font-medium">{customerEmail}</span>.
        </p>
        <p className="font-mono text-xs text-muted-foreground mb-10">Ref. {refCode}</p>

        {/* Order summary */}
        <div className="rounded-sm border border-border bg-card mb-8">
          <div className="p-5 border-b border-border">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Detalle del pedido</h2>
          </div>
          <ul className="divide-y divide-border">
            {orderRentals.map((rental) => {
              const product = products.find((p) => p.slug === rental.productId)
              return (
                <li key={rental.id} className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-semibold">{product?.name ?? rental.productId}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {rental.quantity}× · recogida {rental.startDate} · devolución {rental.endDate}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold shrink-0">
                    {parseFloat(String(rental.totalPrice)).toFixed(2)}€
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Next steps */}
        <div className="space-y-3 mb-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Próximos pasos</h2>
          {[
            { icon: Mail, text: "Recibirás un email de confirmación con el resumen de tu reserva." },
            { icon: Package, text: "Nuestro equipo preparará el equipo y te contactará para confirmar la logística." },
            { icon: Calendar, text: "Recoge en Joan de Àustria 68, Poblenou (Barcelona). Trae tu DNI." },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/productos"
            className="inline-flex h-11 items-center justify-center rounded-sm border border-border px-6 text-sm font-medium hover:bg-secondary transition-colors"
          >
            Volver al catálogo
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-sm bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
