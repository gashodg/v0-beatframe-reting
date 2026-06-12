import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Subtle backdrop image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/concert-stage-dark-moody-lights-minimal.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-24 md:py-36">
        <div className="flex items-center gap-2 mb-8">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Barcelona · En directo
          </span>
        </div>

        <h1 className="max-w-4xl font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-balance">
          El equipo audiovisual para tu <span className="text-silver">directo musical</span>.
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
          Renting de cámaras, mixers de vídeo, transmisores inalámbricos, intercom y audio profesional para streaming
          y realización en vivo. Preparado para salir al aire en cuestión de horas.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/productos"
            className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Ver catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex h-12 items-center gap-2 rounded-sm border border-border bg-background/50 backdrop-blur px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Consulta personalizada
          </Link>
        </div>

        {/* Stats row */}
        <dl className="mt-20 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4 border-t border-border pt-8">
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Equipos</dt>
            <dd className="mt-2 font-mono text-2xl font-bold text-foreground">+100</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Categorías</dt>
            <dd className="mt-2 font-mono text-2xl font-bold text-foreground">14</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Base</dt>
            <dd className="mt-2 font-mono text-2xl font-bold text-foreground">BCN</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Entrega</dt>
            <dd className="mt-2 flex items-center gap-1 font-mono text-2xl font-bold text-foreground">
              <Zap className="h-5 w-5 text-accent" aria-hidden="true" />
              24h
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
