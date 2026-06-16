import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rentals } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[Stripe webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderGroupId = session.metadata?.orderGroupId
    const paymentType = session.metadata?.type // 'deposit' | 'equipment'

    if (!orderGroupId || !paymentType) {
      return NextResponse.json({ received: true })
    }

    if (paymentType === 'deposit') {
      // Mark deposit as paid for all rentals in this order
      await db
        .update(rentals)
        .set({ depositStatus: 'paid', updatedAt: new Date() })
        .where(
          and(
            eq(rentals.orderGroupId, orderGroupId),
            eq(rentals.depositStatus, 'pending')
          )
        )
    } else if (paymentType === 'equipment') {
      // Mark equipment payment as paid and confirm the order
      await db
        .update(rentals)
        .set({ paymentStatus: 'paid', status: 'confirmed', updatedAt: new Date() })
        .where(
          and(
            eq(rentals.orderGroupId, orderGroupId),
            eq(rentals.paymentStatus, 'pending')
          )
        )
    }
  }

  return NextResponse.json({ received: true })
}
