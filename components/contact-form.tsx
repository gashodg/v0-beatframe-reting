"use client"

import type React from "react"

import { useState } from "react"
import { Check, Send } from "lucide-react"

const projectTypes = [
  "Streaming de concierto",
  "Videoclip",
  "Grabación de directo",
  "Podcast / Sesión",
  "Evento corporativo",
  "Otro",
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-sm border border-border bg-card p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
          <Check className="h-5 w-5 text-accent" />
        </div>
        <h2 className="mt-5 text-xl font-bold">Mensaje enviado</h2>
        <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
          Gracias por tu consulta. Un miembro del equipo te responderá por email en menos de 24h laborables.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-card p-6 md:p-8 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nombre" name="nombre" required />
        <Field label="Empresa / Artista" name="empresa" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Teléfono" name="telefono" type="tel" />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Tipo de proyecto <span className="text-accent">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <label key={type} className="cursor-pointer">
              <input type="radio" name="proyecto" value={type} required className="peer sr-only" />
              <span className="inline-flex h-9 items-center rounded-sm border border-border bg-background px-4 text-xs font-medium text-muted-foreground hover:border-accent/60 peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Fecha aproximada" name="fecha" type="date" />
        <Field label="Presupuesto estimado" name="presupuesto" placeholder="p. ej. 1.500€ - 3.000€" />
      </div>

      <div>
        <label htmlFor="mensaje" className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Cuéntanos sobre tu proyecto <span className="text-accent">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          placeholder="Número de cámaras previstas, venue, streaming en RTMP/YouTube, referencias visuales…"
          className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex items-start gap-3">
        <input type="checkbox" id="rgpd" required className="mt-1 accent-accent" />
        <label htmlFor="rgpd" className="text-xs text-muted-foreground leading-relaxed">
          He leído y acepto la política de privacidad. BeatFrame usará mis datos únicamente para contactar sobre esta
          consulta.
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="flex h-12 w-full md:w-auto items-center justify-center gap-2 rounded-sm bg-accent px-8 text-sm font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-60 transition-colors"
      >
        {sending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
            Enviando…
          </>
        ) : (
          <>
            Enviar consulta <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
      />
    </div>
  )
}
