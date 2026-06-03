'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/lib/products'
import { stock_log, product_edits } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function updateProductPrice(productSlug: string, newPrice: number) {
  const userId = await getUserId()

  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldPrice = products[productIndex].pricePerDay

  // Log the change
  await db.insert(product_edits).values({
    productId: productSlug,
    editedBy: userId,
    changeType: 'price_update',
    changes: {
      oldPrice,
      newPrice,
    },
  })

  products[productIndex].pricePerDay = newPrice
  revalidatePath('/admin/products')
  revalidatePath('/')
  return products[productIndex]
}

export async function updateProductStock(productSlug: string, newStock: number, reason: string = 'manual_adjustment') {
  const userId = await getUserId()

  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldStock = products[productIndex].stock
  products[productIndex].stock = newStock

  // Log the change
  await db.insert(stock_log).values({
    productId: productSlug,
    previousStock: oldStock,
    newStock,
    reason,
  })

  revalidatePath('/admin/products')
  return products[productIndex]
}

export async function updateProductDescription(productSlug: string, newDescription: string) {
  const userId = await getUserId()

  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldDescription = products[productIndex].description

  // Log the change
  await db.insert(product_edits).values({
    productId: productSlug,
    editedBy: userId,
    changeType: 'description_update',
    changes: {
      oldDescription,
      newDescription,
    },
  })

  products[productIndex].description = newDescription
  revalidatePath('/admin/products')
  revalidatePath('/')
  return products[productIndex]
}

export async function updateProductImage(productSlug: string, newImage: string) {
  const userId = await getUserId()

  const productIndex = products.findIndex((p) => p.slug === productSlug)
  if (productIndex === -1) throw new Error('Product not found')

  const oldImage = products[productIndex].image

  // Log the change
  await db.insert(product_edits).values({
    productId: productSlug,
    editedBy: userId,
    changeType: 'image_update',
    changes: {
      oldImage,
      newImage,
    },
  })

  products[productIndex].image = newImage
  revalidatePath('/admin/products')
  revalidatePath('/')
  return products[productIndex]
}

export async function getProductEditHistory(productSlug: string) {
  return db.select().from(product_edits).where(product_edits.productId === productSlug)
}

export async function getStockHistory(productSlug: string) {
  return db.select().from(stock_log).where(stock_log.productId === productSlug)
}
