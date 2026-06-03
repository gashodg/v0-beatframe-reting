'use server'

import Stripe from 'stripe'
import { db } from '@/lib/db'
import { rentals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createRentalCheckoutSession(
  rentalData: {
    productId: string
    startDate: string
    endDate: string
    quantity: number
    totalPrice: number
  }
) {
  const userId = await getUserId()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Rental: ${rentalData.productId}`,
            description: `From ${rentalData.startDate} to ${rentalData.endDate}`,
          },
          unit_amount: Math.round(rentalData.totalPrice * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    metadata: {
      userId,
      productId: rentalData.productId,
      startDate: rentalData.startDate,
      endDate: rentalData.endDate,
      quantity: rentalData.quantity.toString(),
    },
  })

  // Create rental record
  const rental = await db
    .insert(rentals)
    .values({
      userId,
      productId: rentalData.productId,
      startDate: new Date(rentalData.startDate),
      endDate: new Date(rentalData.endDate),
      quantity: rentalData.quantity,
      totalPrice: rentalData.totalPrice,
      stripePaymentId: session.id,
      status: 'pending',
      paymentStatus: 'pending',
    })
    .returning()

  return {
    sessionId: session.id,
    clientSecret: session.client_secret,
    rentalId: rental[0].id,
  }
}

export async function getRentalBySessionId(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === 'paid') {
    const rental = await db
      .select()
      .from(rentals)
      .where(eq(rentals.stripePaymentId, sessionId))
      .limit(1)

    return rental[0] || null
  }

  return null
}
