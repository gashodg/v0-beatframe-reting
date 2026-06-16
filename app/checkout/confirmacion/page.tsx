import Link from 'next/link'

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
          Solicitud enviada
        </p>
        <h1 className="text-2xl font-bold text-foreground mb-2">¡Solicitud recibida!</h1>
        {ref && (
          <p className="font-mono text-sm text-accent mb-6">{ref}</p>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Hemos recibido tu solicitud de alquiler. En breve recibirás un email con los links para completar el pago de la fianza (100€) y el importe del alquiler.
        </p>

        <div className="rounded-sm border border-border bg-card p-5 text-left mb-8 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Qué pasa ahora</p>
          {[
            'Revisa tu bandeja de entrada — el email llega en minutos.',
            'Encontrarás dos botones de pago: uno para la fianza (100€) y otro para el alquiler.',
            'Una vez confirmados los pagos, nuestro equipo preparará el equipo.',
            'Te avisaremos cuando esté listo para recoger.',
          ].map((step, i) => (
            <div key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="font-mono text-accent shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/productos"
            className="inline-flex h-11 items-center justify-center rounded-sm bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            Seguir viendo el catálogo
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-sm border border-border px-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
