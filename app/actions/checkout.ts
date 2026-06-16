'use server'

import Stripe from 'stripe'
import { db } from '@/lib/db'
import { rentals } from '@/lib/db/schema'
import { products } from '@/lib/products'
import { sendAdminNewOrderEmail, sendClientRequestEmail } from '@/lib/email-templates'

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

const DEPOSIT_AMOUNT = 100 // €100 fianza

export async function createGuestCheckout(
  contact: ContactPayload,
  cartItems: CartItemPayload[]
): Promise<{ refCode: string } | { error: string }> {
  if (!cartItems.length) return { error: 'El carrito está vacío.' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const orderGroupId = crypto.randomUUID()
  const customerName = `${contact.nombre} ${contact.apellidos}`.trim()
  const refCode = `BF-${orderGroupId.slice(0, 8).toUpperCase()}`

  // Total equipment amount with IVA
  const equipmentTotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerDay * item.quantity * item.days * 1.21,
    0
  )

  try {
    const stripe = getStripe()
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days

    // --- Stripe session for deposit (€100 fianza) ---
    const depositSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Fianza de alquiler · ${refCode}`,
            description: 'Se devuelve íntegramente al comprobar el equipo en buen estado',
          },
          unit_amount: DEPOSIT_AMOUNT * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: contact.email,
      expires_at: expiresAt,
      success_url: `${baseUrl}/pago/gracias?type=deposito&ref=${refCode}`,
      cancel_url: `${baseUrl}/`,
      metadata: { type: 'deposit', orderGroupId, refCode },
    })

    // --- Stripe session for equipment ---
    const equipmentLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => {
      const product = products.find((p) => p.slug === item.productSlug)
      const subtotal = item.pricePerDay * item.quantity * item.days * 1.21
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product?.name ?? item.productSlug,
            description: `${item.quantity}× · ${item.days} día${item.days !== 1 ? 's' : ''}`,
          },
          unit_amount: Math.round(subtotal * 100),
        },
        quantity: 1,
      }
    })

    const equipmentSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: equipmentLineItems,
      mode: 'payment',
      customer_email: contact.email,
      expires_at: expiresAt,
      success_url: `${baseUrl}/pago/gracias?type=alquiler&ref=${refCode}`,
      cancel_url: `${baseUrl}/`,
      metadata: { type: 'equipment', orderGroupId, refCode },
    })

    // --- Create one rental record per cart item ---
    for (const item of cartItems) {
      const subtotal = item.pricePerDay * item.quantity * item.days * 1.21
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
        totalPrice: subtotal.toFixed(2),
        stripePaymentId: equipmentSession.id,
        equipmentStripeUrl: equipmentSession.url,
        status: 'pending',
        paymentStatus: 'pending',
        depositStatus: 'pending',
        depositStripeSessionId: depositSession.id,
        depositStripeUrl: depositSession.url,
      })
    }

    // Build item list for emails
    const emailItems = cartItems.map((item) => {
      const product = products.find((p) => p.slug === item.productSlug)
      return {
        name: product?.name ?? item.productSlug,
        quantity: item.quantity,
        days: item.days,
        total: item.pricePerDay * item.quantity * item.days * 1.21,
      }
    })

    // --- Send admin notification email ---
    await sendAdminNewOrderEmail({
      refCode,
      customerName,
      customerEmail: contact.email,
      customerPhone: contact.telefono,
      customerCompany: contact.empresa,
      customerCIF: contact.cif,
      pickupDate: contact.fecha_recogida,
      returnDate: contact.fecha_devolucion,
      notes: contact.notas,
      items: emailItems,
      equipmentTotal,
    }).catch(console.error)

    // --- Send client confirmation email with payment links ---
    await sendClientRequestEmail({
      to: contact.email,
      customerName,
      refCode,
      pickupDate: contact.fecha_recogida,
      returnDate: contact.fecha_devolucion,
      items: emailItems,
      equipmentTotal,
      depositUrl: depositSession.url!,
      equipmentUrl: equipmentSession.url!,
    }).catch(console.error)

    return { refCode }
  } catch (err) {
    console.error('[createGuestCheckout]', err)
    return { error: 'Error al enviar la solicitud. Inténtalo de nuevo.' }
  }
}

// Legacy — kept for webhook success page
export async function confirmOrderBySession(sessionId: string) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') return null
  const orderGroupId = session.metadata?.orderGroupId
  if (!orderGroupId) return null

  const { eq } = await import('drizzle-orm')
  const orderRentals = await db
    .select()
    .from(rentals)
    .where(eq(rentals.orderGroupId, orderGroupId))

  return { session, orderRentals }
}
