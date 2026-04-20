import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function InquiryCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-24">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">04 — Consulta</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-[1.05]">
              ¿Un proyecto concreto?{" "}
              <span className="text-muted-foreground">Preparamos un pack a medida en menos de 24h.</span>
            </h2>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link
              href="/contacto"
              className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
            >
              Iniciar consulta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
