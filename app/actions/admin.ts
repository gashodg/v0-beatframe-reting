'use server'

import { db } from '@/lib/db'
import { products } from '@/lib/products'
import { stock_log, product_edits } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// Admin actions — no auth guard while auth is stubbed.
// Wire proper session check here when Better Auth is configured.

export async function updateProductPrice(productSlug: string, newPrice: number) {
  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldPrice = products[productIndex].pricePerDay

  await db.insert(product_edits).values({
    id: crypto.randomUUID(),
    productId: productSlug,
    editedBy: 'admin',
    changeType: 'price_update',
    changes: { oldPrice, newPrice },
  })

  products[productIndex].pricePerDay = newPrice
  revalidatePath('/admin/products')
  revalidatePath('/')
  return products[productIndex]
}

export async function updateProductStock(
  productSlug: string,
  newStock: number,
  reason = 'manual_adjustment'
) {
  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldStock = products[productIndex].stock
  products[productIndex].stock = newStock

  await db.insert(stock_log).values({
    id: crypto.randomUUID(),
    productId: productSlug,
    previousStock: oldStock,
    newStock,
    reason,
  })

  revalidatePath('/admin/products')
  return products[productIndex]
}

export async function updateProductDescription(productSlug: string, newDescription: string) {
  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldDescription = products[productIndex].description

  await db.insert(product_edits).values({
    id: crypto.randomUUID(),
    productId: productSlug,
    editedBy: 'admin',
    changeType: 'description_update',
    changes: { oldDescription, newDescription },
  })

  products[productIndex].description = newDescription
  revalidatePath('/admin/products')
  revalidatePath('/')
  return products[productIndex]
}

export async function updateProductImage(productSlug: string, newImage: string) {
  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldImage = products[productIndex].image

  await db.insert(product_edits).values({
    id: crypto.randomUUID(),
    productId: productSlug,
    editedBy: 'admin',
    changeType: 'image_update',
    changes: { oldImage, newImage },
  })

  products[productIndex].image = newImage
  revalidatePath('/admin/products')
  revalidatePath('/')
  return products[productIndex]
}

export async function getProductEditHistory(productSlug: string) {
  return db.select().from(product_edits).where(eq(product_edits.productId, productSlug))
}

export async function getStockHistory(productSlug: string) {
  return db.select().from(stock_log).where(eq(stock_log.productId, productSlug))
}
