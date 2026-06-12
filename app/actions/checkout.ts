'use server'

import Stripe from 'stripe'
import { db } from '@/lib/db'
import { rentals } from '@/lib/db/schema'
import { products } from '@/lib/products'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export type CartItemPayload = {
  productSlug: string
  quantity: number
  days: number
  pricePerDay: number
}

export type ContactPayload = {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  empresa: string
  cif: string
  direccion: string
  cp: string
  ciudad: string
  fecha_recogida: string
  fecha_devolucion: string
  notas: string
}

export async function createGuestCheckout(
  contact: ContactPayload,
  cartItems: CartItemPayload[]
): Promise<{ url: string } | { error: string }> {
  if (!cartItems.length) return { error: 'El carrito está vacío.' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const orderGroupId = crypto.randomUUID()
  const customerName = `${contact.nombre} ${contact.apellidos}`.trim()

  // Build Stripe line items (prices already include IVA 21%)
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => {
    const product = products.find((p) => p.slug === item.productSlug)
    const name = product?.name ?? item.productSlug
    const subtotalWithIVA = item.pricePerDay * item.quantity * item.days * 1.21

    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name,
          description: `${item.quantity}× · ${item.days} día${item.days !== 1 ? 's' : ''}`,
        },
        unit_amount: Math.round(subtotalWithIVA * 100),
      },
      quantity: 1,
    }
  })

  try {
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: contact.email,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        orderGroupId,
        customerName,
        customerEmail: contact.email,
      },
      payment_intent_data: {
        description: `BeatFrame — Alquiler ${orderGroupId.slice(0, 8).toUpperCase()}`,
      },
    })

    // Create one pending rental record per cart item
    for (const item of cartItems) {
      const subtotalWithIVA = item.pricePerDay * item.quantity * item.days * 1.21

      await db.insert(rentals).values({
        id: crypto.randomUUID(),
        orderGroupId,
        customerName,
        customerEmail: contact.email,
        customerPhone: contact.telefono,
        customerCompany: contact.empresa || null,
        customerCIF: contact.cif,
        notes: contact.notas || null,
        productId: item.productSlug,
        quantity: item.quantity,
        startDate: contact.fecha_recogida,
        endDate: contact.fecha_devolucion,
        totalPrice: subtotalWithIVA.toFixed(2),
        stripePaymentId: session.id,
        status: 'pending',
        paymentStatus: 'pending',
      })
    }

    return { url: session.url! }
  } catch (err) {
    console.error('[createGuestCheckout]', err)
    return { error: 'Error al conectar con el sistema de pago. Inténtalo de nuevo.' }
  }
}

export async function confirmOrderBySession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') return null

  const orderGroupId = session.metadata?.orderGroupId
  if (!orderGroupId) return null

  const { eq, and } = await import('drizzle-orm')

  // Idempotent: only update still-pending rentals
  await db
    .update(rentals)
    .set({ paymentStatus: 'paid', status: 'confirmed', updatedAt: new Date() })
    .where(
      and(
        eq(rentals.orderGroupId, orderGroupId),
        eq(rentals.paymentStatus, 'pending')
      )
    )

  const orderRentals = await db
    .select()
    .from(rentals)
    .where(eq(rentals.orderGroupId, orderGroupId))

  return { session, orderRentals }
}
