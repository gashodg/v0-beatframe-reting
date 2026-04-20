import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | BeatFrame",
  description: "Finaliza tu reserva de equipo audiovisual en BeatFrame.",
}

export default function CheckoutPage() {
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Checkout</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-10">Finaliza tu reserva</h1>
        <CheckoutForm />
      </div>
    </div>
  )
}
