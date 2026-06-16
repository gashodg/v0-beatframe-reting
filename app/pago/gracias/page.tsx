import Link from 'next/link'

export default async function PagoGraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; ref?: string }>
}) {
  const { type, ref } = await searchParams
  const isDeposit = type === 'deposito'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
          Pago completado
        </p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isDeposit ? '¡Fianza pagada!' : '¡Pago completado!'}
        </h1>
        {ref && <p className="font-mono text-sm text-accent mb-6">{ref}</p>}
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {isDeposit
            ? 'Hemos registrado el pago de tu fianza de 100€. Recuerda completar también el pago del alquiler con el otro link del email.'
            : 'Hemos registrado tu pago. Nuestro equipo revisará tu reserva y te contactará para confirmar los detalles.'}
        </p>

        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-sm border border-border px-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
