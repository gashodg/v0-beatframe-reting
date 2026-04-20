"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CreditCard, Lock, Check, Building2, Calendar } from "lucide-react"
import { useCart } from "./cart/cart-provider"

export function CheckoutForm() {
  const { items, total, clear } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)

  const iva = total * 0.21
  const totalConIva = total + iva

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1400))
    setProcessing(false)
    setSubmitted(true)
    setTimeout(() => clear(), 1000)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-sm border border-border bg-card p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
          <Check className="h-6 w-6 text-accent" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Reserva confirmada</h2>
        <p className="mt-3 text-muted-foreground">
          Te hemos enviado un email con los detalles de tu reserva y el contrato de alquiler. Nuestro equipo te
          contactará en menos de 24h para confirmar la entrega.
        </p>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Ref. BF-{Math.random().toString(36).slice(2, 8).toUpperCase()}
        </p>
        <Link
          href="/productos"
          className="mt-8 inline-flex h-11 items-center rounded-sm border border-border px-6 text-sm font-medium hover:bg-secondary transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    )
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
      {/* Form */}
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
              Recogida en nuestro estudio de Carrer de Pallars 193, Poblenou, Barcelona. Solicita entrega en venue al
              añadir una nota.
            </p>
          </div>
        </section>

        {/* Pago */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">04 — Pago</h2>
          <div className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Tarjeta de crédito / débito</span>
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Seguro
              </span>
            </div>
            <div className="space-y-3">
              <Field label="Número de tarjeta" name="card" placeholder="0000 0000 0000 0000" required />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Caducidad" name="exp" placeholder="MM/AA" required />
                <Field label="CVC" name="cvc" placeholder="123" required />
              </div>
              <Field label="Titular" name="titular" required />
            </div>
          </div>
        </section>

        {/* Notas */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">05 — Notas</h2>
          <textarea
            name="notas"
            rows={4}
            placeholder="Cuéntanos sobre tu evento, venue, necesidades especiales…"
            className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </section>
      </div>

      {/* Summary */}
      <aside className="lg:col-span-5">
        <div className="sticky top-24 rounded-sm border border-border bg-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tu reserva</h2>
          </div>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.product.slug} className="flex gap-3 p-5">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm bg-secondary">
                  <Image
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">{item.product.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.quantity}x · {item.days} {item.days === 1 ? "día" : "días"}
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
          <div className="p-5 border-t border-border">
            <button
              type="submit"
              disabled={processing}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-accent text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                  Procesando…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Pagar {totalConIva.toFixed(2)}€
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center leading-relaxed">
              Al confirmar aceptas los términos de alquiler y política de fianzas. Pago seguro con cifrado SSL.
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
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
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
