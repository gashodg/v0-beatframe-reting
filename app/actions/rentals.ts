'use server'

import { db } from '@/lib/db'
import { rentals, rental_documents, rental_agreements } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// These actions operate on rentals by ID.
// Add auth guard here when Better Auth is configured.

export async function getRentals() {
  return db.select().from(rentals).orderBy(rentals.createdAt)
}

export async function getRentalById(rentalId: string) {
  const result = await db.select().from(rentals).where(eq(rentals.id, rentalId)).limit(1)
  return result[0] ?? null
}

export async function getRentalDocuments(rentalId: string) {
  return db.select().from(rental_documents).where(eq(rental_documents.rentalId, rentalId))
}

export async function getRentalAgreement(rentalId: string) {
  const result = await db
    .select()
    .from(rental_agreements)
    .where(eq(rental_agreements.rentalId, rentalId))
    .limit(1)
  return result[0] ?? null
}

export async function addRentalDocument(
  rentalId: string,
  documentType: string,
  documentUrl: string
) {
  const result = await db
    .insert(rental_documents)
    .values({
      id: crypto.randomUUID(),
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
  const result = await db
    .update(rental_agreements)
    .set({ signatureUrl, signedAt: new Date(), status: 'signed' })
    .where(eq(rental_agreements.rentalId, rentalId))
    .returning()

  revalidatePath(`/mis-alquileres/${rentalId}`)
  return result[0]
}

export async function updateRentalStatus(rentalId: string, status: string) {
  const result = await db
    .update(rentals)
    .set({ status, updatedAt: new Date() })
    .where(eq(rentals.id, rentalId))
    .returning()

  revalidatePath(`/mis-alquileres/${rentalId}`)
  return result[0]
}
