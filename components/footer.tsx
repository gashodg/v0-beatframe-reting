import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail, MapPin, Phone } from "lucide-react"
import { categories } from "@/lib/products"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Image src="/logo-beatframe.png" alt="BeatFrame" width={160} height={56} className="h-12 w-auto object-contain" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Renting audiovisual para streaming y realización en directo en la industria musical. Con base en
              Barcelona, servimos a toda España.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                Carrer de Pallars 193, 08005 Barcelona
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                +34 931 000 000
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                hola@beatframe.studio
              </p>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Navegación</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/" className="text-foreground hover:text-accent transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-foreground hover:text-accent transition-colors">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-foreground hover:text-accent transition-colors">
                  Contacto y consultas
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-foreground hover:text-accent transition-colors">
                  Reservar
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Categorías</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/productos?cat=${cat.slug}`}
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} BeatFrame Audiovisual Studio — Barcelona
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-foreground transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="mailto:hola@beatframe.studio" aria-label="Email" className="hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
