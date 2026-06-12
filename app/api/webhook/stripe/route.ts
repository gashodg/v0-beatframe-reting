import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { rentals, email_logs } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sendOrderConfirmationEmail } from '@/lib/email-templates'
import { products } from '@/lib/products'

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

    if (!orderGroupId) {
      return NextResponse.json({ received: true })
    }

    // Idempotent update — skip if already paid
    await db
      .update(rentals)
      .set({ paymentStatus: 'paid', status: 'confirmed', updatedAt: new Date() })
      .where(
        and(
          eq(rentals.orderGroupId, orderGroupId),
          eq(rentals.paymentStatus, 'pending')
        )
      )

    // Fetch all rentals for confirmation email
    const orderRentals = await db
      .select()
      .from(rentals)
      .where(eq(rentals.orderGroupId, orderGroupId))

    const firstRental = orderRentals[0]
    const customerEmail = firstRental?.customerEmail ?? session.customer_email ?? ''
    const customerName = firstRental?.customerName ?? ''

    if (customerEmail && orderRentals.length > 0) {
      const refCode = `BF-${orderGroupId.slice(0, 8).toUpperCase()}`

      const itemLines = orderRentals.map((r) => {
        const product = products.find((p) => p.slug === r.productId)
        return {
          name: product?.name ?? r.productId,
          quantity: r.quantity,
          days: Math.ceil(
            (new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86_400_000
          ) || 1,
          total: parseFloat(String(r.totalPrice)),
        }
      })

      try {
        await sendOrderConfirmationEmail({
          to: customerEmail,
          customerName,
          refCode,
          pickupDate: firstRental?.startDate ?? '',
          returnDate: firstRental?.endDate ?? '',
          items: itemLines,
          totalWithIVA: itemLines.reduce((s, i) => s + i.total, 0),
        })

        // Log email
        if (firstRental?.id) {
          await db.insert(email_logs).values({
            id: crypto.randomUUID(),
            rentalId: firstRental.id,
            emailType: 'order_confirmation',
            recipientEmail: customerEmail,
            status: 'sent',
          })
        }
      } catch (emailErr) {
        console.error('[Stripe webhook] email send failed:', emailErr)
      }
    }
  }

  return NextResponse.json({ received: true })
}

