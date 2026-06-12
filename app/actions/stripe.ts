'use server'

// Legacy single-product Stripe action — superseded by app/actions/checkout.ts
// Kept for reference. New checkout flow uses createGuestCheckout.

import Stripe from 'stripe'
import { db } from '@/lib/db'
import { rentals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function getRentalBySessionId(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== 'paid') return null

  const result = await db
    .select()
    .from(rentals)
    .where(eq(rentals.stripePaymentId, sessionId))
    .limit(1)

  return result[0] ?? null
}
