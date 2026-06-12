import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contacto y consultas | BeatFrame",
  description: "Consúltanos sobre equipos audiovisuales, packs a medida o soporte técnico en Barcelona.",
}

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Contacto</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-4xl">
            Hablemos de tu próximo directo.
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
            Cuéntanos qué necesitas y te propondremos el pack ideal. Respondemos en menos de 24h laborables.
          </p>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Info */}
            <div className="lg:col-span-4 space-y-8">
              <InfoBlock icon={MapPin} title="Dirección">
                Joan de Àustria 68
                <br />
                08005 Barcelona
                <br />
                <span className="text-muted-foreground">Poblenou</span>
              </InfoBlock>
              <InfoBlock icon={Phone} title="Teléfono">
                <a href="tel:+34931000000" className="hover:text-accent transition-colors">
                  +34 604 126 180
                </a>
              </InfoBlock>
              <InfoBlock icon={Mail} title="Email">
                <a href="mailto:hola@beatframe.studio" className="hover:text-accent transition-colors">
                  hola@beatframe.studio
                </a>
              </InfoBlock>
              <InfoBlock icon={Clock} title="Horario">
                Lunes a viernes
                <br />
                <span className="font-mono">09:00 — 19:00</span>
                <br />
                <span className="text-muted-foreground text-xs mt-2 block">
                  Soporte para eventos 24/7 bajo reserva
                </span>
              </InfoBlock>
            </div>

            {/* Form */}
            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="h-4 w-4 text-accent" />
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</h3>
      </div>
      <p className="text-foreground leading-relaxed">{children}</p>
    </div>
  )
}
