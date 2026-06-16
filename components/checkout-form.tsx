"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building2, Calendar, ArrowRight, CheckCircle } from "lucide-react"
import { useCart } from "./cart/cart-provider"
import { createGuestCheckout } from "@/app/actions/checkout"

export function CheckoutForm() {
  const { items, total, clear } = useCart()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const iva = total * 0.21
  const totalConIva = total + iva

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setProcessing(true)

    const data = new FormData(e.currentTarget)

    const contact = {
      nombre: data.get("nombre") as string,
      apellidos: data.get("apellidos") as string,
      email: data.get("email") as string,
      telefono: data.get("telefono") as string,
      empresa: (data.get("empresa") as string) || "",
      cif: data.get("cif") as string,
      direccion: data.get("direccion") as string,
      cp: data.get("cp") as string,
      ciudad: data.get("ciudad") as string,
      fecha_recogida: data.get("fecha_recogida") as string,
      fecha_devolucion: data.get("fecha_devolucion") as string,
      notas: (data.get("notas") as string) || "",
    }

    const cartItems = items.map((i) => ({
      productSlug: i.product.slug,
      quantity: i.quantity,
      days: i.days,
      pricePerDay: i.product.pricePerDay,
    }))

    const result = await createGuestCheckout(contact, cartItems)

    if ("error" in result) {
      setError(result.error)
      setProcessing(false)
      return
    }

    clear()
    window.location.href = `/checkout/confirmacion?ref=${result.refCode}`
  }

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No tienes equipos en tu carrito.</p>
        <Link
          href="/productos"
          className="mt-6 inline-flex h-11 items-center rounded-sm bg-accent px-6 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10">
      {/* Form fields */}
      <div className="lg:col-span-7 space-y-10">
        {/* Contacto */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">01 — Contacto</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" name="nombre" required />
            <Field label="Apellidos" name="apellidos" required />
            <Field label="Email" name="email" type="email" required className="col-span-2" />
            <Field label="Teléfono" name="telefono" type="tel" required className="col-span-2" />
          </div>
        </section>

        {/* Empresa */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">02 — Empresa</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Razón social" name="empresa" className="col-span-2" />
            <Field label="CIF / NIF" name="cif" required />
            <Field label="Dirección" name="direccion" required />
            <Field label="Código postal" name="cp" required />
            <Field label="Ciudad" name="ciudad" defaultValue="Barcelona" required />
          </div>
        </section>

        {/* Fechas */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">03 — Fechas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha recogida" name="fecha_recogida" type="date" icon={Calendar} required />
            <Field label="Fecha devolución" name="fecha_devolucion" type="date" icon={Calendar} required />
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-sm border border-border bg-background p-4">
            <Building2 className="h-4 w-4 mt-0.5 text-accent" />
            <p className="text-xs text-muted-foreground">
              Recogida en nuestro estudio de Joan de Àustria 68, Poblenou, Barcelona. Solicita entrega en venue al
              añadir una nota.
            </p>
          </div>
        </section>

        {/* Notas */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">04 — Notas</h2>
          <textarea
            name="notas"
            rows={4}
            placeholder="Cuéntanos sobre tu evento, venue, necesidades especiales…"
            className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </section>

        {/* Condiciones de alquiler */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">05 — Condiciones de alquiler</h2>
          <div className="rounded-sm border border-border bg-card divide-y divide-border">
            {[
              { text: 'El equipo debe devolverse en las mismas condiciones en que fue entregado.' },
              { text: 'Se requiere una fianza de 100€ reembolsable al comprobar el buen estado del equipo.' },
              { text: 'La fianza se devuelve íntegramente si no hay daños, piezas faltantes o suciedad.' },
              { text: 'Recogida y devolución en Joan de Àustria 68, Poblenou, Barcelona. Trae tu DNI o NIE.' },
              { text: 'Al enviar esta solicitud recibirás un email con los links de pago para la fianza y el alquiler.' },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <CheckCircle className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Order summary */}
      <aside className="lg:col-span-5">
        <div className="sticky top-24 rounded-sm border border-border bg-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tu reserva</h2>
          </div>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.product.slug} className="flex gap-3 p-5">
                <div
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm ${
                    item.product.whiteBg ? "bg-[#ece8df]" : "bg-secondary"
                  }`}
                >
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className={item.product.whiteBg ? "object-contain p-1 mix-blend-multiply" : "object-cover"}
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{item.product.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.quantity}× · {item.days} {item.days === 1 ? "día" : "días"}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold">
                  {(item.product.pricePerDay * item.quantity * item.days).toFixed(0)}€
                </span>
              </li>
            ))}
          </ul>
          <div className="p-5 space-y-2 border-t border-border">
            <Row label="Subtotal" value={`${total.toFixed(2)}€`} />
            <Row label="IVA (21%)" value={`${iva.toFixed(2)}€`} />
            <div className="pt-3 border-t border-border flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-mono text-2xl font-bold text-foreground">{totalConIva.toFixed(2)}€</span>
            </div>
          </div>
          <div className="p-5 border-t border-border space-y-3">
            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={processing}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                  Enviando solicitud…
                </>
              ) : (
                <>
                  Enviar solicitud
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              Recibirás un email con los links de pago para la fianza (100€) y el alquiler ({totalConIva.toFixed(2)}€).
            </p>
          </div>
        </div>
      </aside>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  className,
  icon: Icon,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5"
      >
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none ${Icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm text-foreground">{value}</span>
    </div>
  )
}
