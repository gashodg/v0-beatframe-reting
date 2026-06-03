'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { rentals, rental_documents, rental_agreements } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getRentals() {
  const userId = await getUserId()
  return db
    .select()
    .from(rentals)
    .where(eq(rentals.userId, userId))
    .orderBy(rentals.createdAt)
}

export async function getRentalById(rentalId: string) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(rentals)
    .where(and(eq(rentals.id, rentalId), eq(rentals.userId, userId)))
    .limit(1)
  return result[0] || null
}

export async function getRentalDocuments(rentalId: string) {
  const userId = await getUserId()
  const rental = await getRentalById(rentalId)
  if (!rental) throw new Error('Rental not found')

  return db
    .select()
    .from(rental_documents)
    .where(eq(rental_documents.rentalId, rentalId))
}

export async function getRentalAgreement(rentalId: string) {
  const userId = await getUserId()
  const rental = await getRentalById(rentalId)
  if (!rental) throw new Error('Rental not found')

  const result = await db
    .select()
    .from(rental_agreements)
    .where(eq(rental_agreements.rentalId, rentalId))
    .limit(1)
  return result[0] || null
}

export async function addRentalDocument(rentalId: string, documentType: string, documentUrl: string) {
  const userId = await getUserId()
  const rental = await getRentalById(rentalId)
  if (!rental) throw new Error('Rental not found')

  const result = await db
    .insert(rental_documents)
    .values({
      rentalId,
      documentType,
      documentUrl,
      status: 'pending',
    })
    .returning()

  revalidatePath(`/mis-alquileres/${rentalId}`)
  return result[0]
}

export async function signAgreement(rentalId: string, signatureUrl: string) {
  const userId = await getUserId()
  const rental = await getRentalById(rentalId)
  if (!rental) throw new Error('Rental not found')

  const result = await db
    .update(rental_agreements)
    .set({
      signatureUrl,
      signedAt: new Date(),
      status: 'signed',
    })
    .where(eq(rental_agreements.rentalId, rentalId))
    .returning()

  revalidatePath(`/mis-alquileres/${rentalId}`)
  return result[0]
}

export async function updateRentalStatus(rentalId: string, status: string) {
  const userId = await getUserId()
  const rental = await getRentalById(rentalId)
  if (!rental) throw new Error('Rental not found')

  const result = await db
    .update(rentals)
    .set({ status, updatedAt: new Date() })
    .where(eq(rentals.id, rentalId))
    .returning()

  revalidatePath(`/mis-alquileres/${rentalId}`)
  return result[0]
}
