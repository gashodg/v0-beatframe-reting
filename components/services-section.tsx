import { Radio, Truck, Headphones, ShieldCheck } from "lucide-react"

const services = [
  {
    icon: Radio,
    title: "Streaming multicámara",
    description:
      "Packs listos para realización en directo: mixer, cámaras, transmisores y monitorización. Salida directa a YouTube, Twitch o RTMP privado.",
  },
  {
    icon: Truck,
    title: "Entrega en Barcelona",
    description:
      "Recogida en nuestro estudio de Poblenou o entrega en venue. Servicio 24h y soporte in-situ con técnico bajo demanda.",
  },
  {
    icon: Headphones,
    title: "Asesoría técnica",
    description:
      "Te ayudamos a dimensionar el equipo ideal para tu concierto, videoclip o podcast musical. Sin coste previo.",
  },
  {
    icon: ShieldCheck,
    title: "Material revisado",
    description:
      "Cada equipo pasa un QC antes de salir del almacén. Sellos de garantía, baterías cargadas y firmware actualizado.",
  },
]

export function ServicesSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20">
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">03 — Servicios</p>
          <h2 className="max-w-3xl text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Operamos como una extensión de tu equipo técnico.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {services.map((service) => (
            <div key={service.title} className="flex flex-col gap-4 bg-background p-8">
              <service.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
